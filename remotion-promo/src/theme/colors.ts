/**
 * Vogel Travel brand color tokens.
 * Mirrors `tailwind.config.js` in the main Vogel_V5 project.
 */
export const colors = {
  teal: "#5cc8bd",
  tealDark: "#48a79d",
  tealDeep: "#2c6b65",
  dark: "#0b1a15",
  darker: "#081210",
  black: "#000000",
  white: "#ffffff",
  whiteSoft: "rgba(255,255,255,0.92)",
  whiteMuted: "rgba(255,255,255,0.55)",
  whiteFaint: "rgba(255,255,255,0.16)",
  shadow: "rgba(0,0,0,0.45)",
  glow: "rgba(92,200,189,0.45)",
} as const;

export type ColorToken = keyof typeof colors;
