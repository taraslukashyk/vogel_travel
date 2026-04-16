import React from "react";
import { Img } from "remotion";
import { assets } from "../../lib/staticPath";

type LogoProps = {
  /** Width in px. Height scales proportionally. */
  width?: number;
  /** Size in px (alias for width). */
  size?: number;
  /** Optional opacity override. */
  opacity?: number;
  /** Optional filter (e.g. drop-shadow). */
  filter?: string;
  style?: React.CSSProperties;
};

/**
 * Vogel Travel logo as a raster-safe <Img>.
 */
export const Logo: React.FC<LogoProps> = ({
  width,
  size,
  opacity = 1,
  filter,
  style,
}) => {
  const finalWidth = size || width || 420;
  return (
    <Img
      src={assets.image.logo}
      style={{
        width: finalWidth,
        height: "auto",
        opacity,
        filter,
        display: "block",
        ...style,
      }}
    />
  );
};
