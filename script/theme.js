/**
 * Theme Generator
 *
 * Fetches the default theme CSS from GitHub and copies it to clipboard.
 */

const THEME_URL =
  "https://raw.githubusercontent.com/codepilotsf/prewind/refs/heads/main/theme.css";

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

export async function run() {
  try {
    const response = await fetch(THEME_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch theme: ${response.status}`);
    }
    const css = await response.text();

    console.log(css);
    console.log("");

    await copyToClipboard(css);
    console.log("Copied to clipboard!");
  } catch (error) {
    console.error("Error fetching theme:", error.message);
    process.exit(1);
  }
}
