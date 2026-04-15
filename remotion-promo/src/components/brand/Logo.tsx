import React from "react";
import { Img } from "remotion";
import { assets } from "../../lib/staticPath";

type LogoProps = {
  /** Width in px. Height scales proportionally. */
  width?: number;
  /** Optional opacity override. */
  opacity?: number;
  /** Optional filter (e.g. drop-shadow). */
  filter?: string;
  style?: React.CSSProperties;
};

/**
 * Vogel Travel logo as a raster-safe <Img>. The SVG is an Inkscape export
 * with embedded raster paths, so a per-path draw-on is unstable — we animate
 * scale/opacity at the wrapper level instead.
 */
export const Logo: React.FC<LogoProps> = ({
  width = 420,
  opacity = 1,
  filter,
  style,
}) => {
  return (
    <Img
      src={assets.image.logo}
      style={{
        width,
        height: "auto",
        opacity,
        filter,
        display: "block",
        ...style,
      }}
    />
  );
};
