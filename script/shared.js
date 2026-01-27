/**
 * Shared utilities for Prewind CSS CLI
 */

import enquirer from "enquirer";
const { Select, NumberPrompt } = enquirer;

// -----------------------------------------------------------------------------
// Clamp Calculation
// -----------------------------------------------------------------------------

/**
 * Calculate a CSS clamp() value for a given step in the modular scale.
 *
 * @param {Object} config - Scale configuration
 * @param {number} config.minViewport - Min viewport width in px
 * @param {number} config.maxViewport - Max viewport width in px
 * @param {number} config.minBase - Base size at min viewport in px
 * @param {number} config.maxBase - Base size at max viewport in px
 * @param {number} config.minRatio - Scale ratio at min viewport
 * @param {number} config.maxRatio - Scale ratio at max viewport
 * @param {number} step - The step in the modular scale (0 = base)
 * @returns {string} CSS clamp() value
 */
export function calculateClamp(config, step) {
  const { minViewport, maxViewport, minBase, maxBase, minRatio, maxRatio } =
    config;

  // Calculate size at min and max viewports using modular scale
  const minSize = minBase * Math.pow(minRatio, step);
  const maxSize = maxBase * Math.pow(maxRatio, step);

  // Utopia formula: calculate slope and intercept in pixels, then convert
  // slope = (maxSize - minSize) / (maxWidth - minWidth)
  // intercept = minSize - (slope * minWidth)
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intercept = minSize - slope * minViewport;

  // Convert to CSS units: rem (÷16) and vw (×100)
  const minRem = minSize / 16;
  const maxRem = maxSize / 16;
  const interceptRem = intercept / 16;
  const slopeVw = slope * 100;

  // Format values
  const minStr = formatNumber(minRem) + "rem";
  const maxStr = formatNumber(maxRem) + "rem";
  const preferred =
    interceptRem >= 0
      ? `${formatNumber(interceptRem)}rem + ${formatNumber(slopeVw)}vw`
      : `${formatNumber(Math.abs(interceptRem))}rem - ${formatNumber(Math.abs(slopeVw))}vw`;

  return `clamp(${minStr}, ${preferred}, ${maxStr})`;
}

/**
 * Format a number to 4 significant digits, removing trailing zeros.
 */
function formatNumber(num) {
  return parseFloat(num.toPrecision(4)).toString();
}

// -----------------------------------------------------------------------------
// Musical Interval Ratios
// -----------------------------------------------------------------------------

// Modular scale ratios based on musical intervals
const RATIOS = [
  { value: 1.067, name: "Minor Second" },
  { value: 1.125, name: "Major Second" },
  { value: 1.2, name: "Minor Third" },
  { value: 1.25, name: "Major Third" },
  { value: 1.333, name: "Perfect Fourth" },
  { value: 1.414, name: "Augmented Fourth" },
  { value: 1.5, name: "Perfect Fifth" },
  { value: 1.618, name: "Golden Ratio" },
  { value: 1.667, name: "Major Sixth" },
  { value: 1.778, name: "Minor Seventh" },
  { value: 1.875, name: "Major Seventh" },
  { value: 2.0, name: "Octave" },
];

/**
 * Get the musical interval name for a ratio value.
 * Returns the value as string if no matching interval found.
 */
function getRatioName(value) {
  const ratio = RATIOS.find((r) => r.value === value);
  return ratio ? `${ratio.value} - ${ratio.name}` : String(value);
}

// -----------------------------------------------------------------------------
// TUI Helpers
// -----------------------------------------------------------------------------

/**
 * Run an interactive configuration editor.
 * Shows settings as selectable list items with inline value editing.
 *
 * @param {Object} options
 * @param {string} options.title - Display title (e.g., "Text Scale")
 * @param {string} options.command - Command name for comment (e.g., "text")
 * @param {Object} options.defaults - Default configuration values
 * @param {Object} options.scale - Scale mapping { name: step } (e.g., { sm: -1, base: 0 })
 * @param {string} options.varPrefix - CSS variable prefix (e.g., "--text" or "--space")
 * @param {Array} options.fields - Field definitions for the editor
 */
export async function runEditor({
  title,
  command,
  defaults,
  scale,
  varPrefix,
  fields,
}) {
  const config = { ...defaults };

  // Main interaction loop
  while (true) {
    console.clear();
    console.log(`${title} Configuration\n`);

    // Build choices: fields show current values, then separator, then actions
    const choices = [
      // Editable fields with current values displayed
      ...fields.map((f) => {
        // Show musical interval name for ratio fields
        const displayValue =
          f.type === "ratio"
            ? getRatioName(config[f.key])
            : `${config[f.key]}${f.suffix || ""}`;
        return {
          name: f.key,
          message: `${f.label}: ${displayValue}`,
        };
      }),
      // Visual separator (disabled choice)
      { role: "separator", message: "" },
      // Actions
      { name: "generate", message: "Generate CSS" },
      { name: "cancel", message: "Cancel" },
    ];

    const select = new Select({
      name: "action",
      message: "Select a setting to edit",
      choices,
    });

    let action;
    try {
      action = await select.run();
    } catch {
      // Escape pressed on main menu - cancel
      console.log("\nCancelled.");
      return;
    }

    if (action === "cancel") {
      console.log("\nCancelled.");
      return;
    }

    if (action === "generate") {
      await outputCSS({ title, command, config, scale, varPrefix, fields });
      return;
    }

    // Edit a field
    const field = fields.find((f) => f.key === action);
    if (field) {
      try {
        if (field.type === "ratio") {
          // Ratio fields use a select menu with musical intervals
          const ratioSelect = new Select({
            name: "ratio",
            message: field.label,
            choices: RATIOS.map((r) => ({
              name: r.value,
              message: `${r.value} - ${r.name}`,
            })),
            initial: RATIOS.findIndex((r) => r.value === config[field.key]),
          });
          config[field.key] = await ratioSelect.run();
        } else {
          // Number fields use a number prompt
          const prompt = new NumberPrompt({
            name: "value",
            message: `${field.label}${field.suffix || ""}`,
            initial: config[field.key],
          });
          config[field.key] = await prompt.run();
        }
      } catch {
        // Escape pressed while editing - return to main menu (continue loop)
      }
    }
  }
}

/**
 * Output the generated CSS variables with settings comment.
 * Also copies the output to the clipboard.
 */
async function outputCSS({ title, command, config, scale, varPrefix, fields }) {
  console.clear();

  // Build comment header
  const outputLines = [
    `/* Fluid ${title} – Generated with: \`npx prewindcss ${command}\``,
  ];
  for (const field of fields) {
    // Show musical interval name for ratio fields in comments
    const displayValue =
      field.type === "ratio"
        ? getRatioName(config[field.key])
        : `${config[field.key]}${field.suffix || ""}`;
    outputLines.push(`   ${field.label}: ${displayValue}`);
  }
  outputLines.push("*/");

  // Generate CSS variables for each scale step
  for (const [name, step] of Object.entries(scale)) {
    const clamp = calculateClamp(config, step);
    outputLines.push(`${varPrefix}-${name}: ${clamp};`);
  }

  const output = outputLines.join("\n");

  // Print the output
  console.log(output);
  console.log("");

  // Copy to clipboard
  await copyToClipboard(output);
  console.log("✓ Copied to clipboard!");
}

/**
 * Copy text to the system clipboard.
 * Uses pbcopy on macOS, xclip on Linux, clip on Windows.
 */
async function copyToClipboard(text) {
  const { spawn } = await import("child_process");
  const platform = process.platform;

  let cmd, args;
  if (platform === "darwin") {
    cmd = "pbcopy";
    args = [];
  } else if (platform === "win32") {
    cmd = "clip";
    args = [];
  } else {
    // Linux - try xclip
    cmd = "xclip";
    args = ["-selection", "clipboard"];
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    proc.stdin.write(text);
    proc.stdin.end();
    proc.on("close", resolve);
    proc.on("error", reject);
  });
}
