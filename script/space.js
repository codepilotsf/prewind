/**
 * Space (Spacing) Scale Generator
 *
 * Generates fluid spacing CSS variables using modular scale.
 */

import { runEditor } from "./shared.js";

// Scale mapping: name -> step (sm = 0)
const SCALE = {
  "3xs": -3,
  "2xs": -2,
  xs: -1,
  sm: 0,
  md: 1,
  lg: 2,
  xl: 3,
  "2xl": 4,
  "3xl": 5,
  "4xl": 6,
};

// Default configuration
const DEFAULTS = {
  minViewport: 320,
  maxViewport: 1600,
  minBase: 12,
  maxBase: 18,
  minRatio: 1.5,
  maxRatio: 1.667,
};

// Field definitions for the editor
const FIELDS = [
  { key: "minViewport", label: "Min viewport", suffix: "px" },
  { key: "maxViewport", label: "Max viewport", suffix: "px" },
  { key: "minBase", label: "Min sm size", suffix: "px" },
  { key: "maxBase", label: "Max sm size", suffix: "px" },
  { key: "minRatio", label: "Min ratio", type: "ratio" },
  { key: "maxRatio", label: "Max ratio", type: "ratio" },
];

export function run() {
  runEditor({
    title: "Space Scale",
    command: "space",
    defaults: DEFAULTS,
    scale: SCALE,
    varPrefix: "--space",
    fields: FIELDS,
  });
}
