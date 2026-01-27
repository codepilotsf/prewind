/**
 * Text (Typography) Scale Generator
 *
 * Generates fluid typography CSS variables using modular scale.
 */

import { runEditor } from "./shared.js";

// Scale mapping: name -> step (base = 0)
const SCALE = {
  sm: -1,
  base: 0,
  lg: 1,
  xl: 2,
  "2xl": 3,
  "3xl": 4,
  "4xl": 5,
};

// Default configuration
const DEFAULTS = {
  minViewport: 320,
  maxViewport: 1600,
  minBase: 14,
  maxBase: 18,
  minRatio: 1.25,
  maxRatio: 1.414,
};

// Field definitions for the editor
const FIELDS = [
  { key: "minViewport", label: "Min viewport", suffix: "px" },
  { key: "maxViewport", label: "Max viewport", suffix: "px" },
  { key: "minBase", label: "Min base size", suffix: "px" },
  { key: "maxBase", label: "Max base size", suffix: "px" },
  { key: "minRatio", label: "Min ratio", type: "ratio" },
  { key: "maxRatio", label: "Max ratio", type: "ratio" },
];

export function run() {
  runEditor({
    title: "Text Scale",
    command: "text",
    defaults: DEFAULTS,
    scale: SCALE,
    varPrefix: "--text",
    fields: FIELDS,
  });
}
