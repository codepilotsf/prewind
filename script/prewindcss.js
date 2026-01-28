#!/usr/bin/env node

/**
 * Prewind CSS CLI
 *
 * Usage:
 *   npx prewindcss text   - Generate fluid typography scale
 *   npx prewindcss space  - Generate fluid spacing scale
 *   npx prewindcss theme  - Get default theme CSS variables
 */

const command = process.argv[2];

if (command === "text") {
  const { run } = await import("./text.js");
  run();
} else if (command === "space") {
  const { run } = await import("./space.js");
  run();
} else if (command === "theme") {
  const { run } = await import("./theme.js");
  run();
} else {
  console.log(
    "Did you mean to run npx prewindcss text, npx prewindcss space, or npx prewindcss theme?",
  );
}
