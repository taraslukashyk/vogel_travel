import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMarckScript } from "@remotion/google-fonts/MarckScript";

/**
 * Load brand fonts at module scope so Remotion blocks render until they're ready.
 * Matches the font stack used in the main Vogel_V5 site (index.html preconnect).
 */

const montserrat = loadMontserrat("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "cyrillic"],
});

const inter = loadInter("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin", "cyrillic"],
});

const marckScript = loadMarckScript("normal", {
  weights: ["400"],
  subsets: ["latin", "cyrillic"],
});

export const fonts = {
  heading: montserrat.fontFamily,
  body: inter.fontFamily,
  script: marckScript.fontFamily,
} as const;

export const waitForFonts = async () => {
  await Promise.all([
    montserrat.waitUntilDone(),
    inter.waitUntilDone(),
    marckScript.waitUntilDone(),
  ]);
};
