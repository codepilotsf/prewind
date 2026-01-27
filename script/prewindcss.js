#!/usr/bin/env node

/**
 * Prewind CSS CLI
 *
 * Usage:
 *   npx prewindcss text   - Generate fluid typography scale
 *   npx prewindcss space  - Generate fluid spacing scale
 */

const command = process.argv[2];

if (command === 'text') {
  const { run } = await import('./text.js');
  run();
} else if (command === 'space') {
  const { run } = await import('./space.js');
  run();
} else {
  console.log('Did you mean to run npx prewindcss text or npx prewindcss space?');
}
