import React from "react";
import { useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";

type BlurInProps = {
  children: React.ReactNode;
  durationFrames: number;
  fromBlur?: number;
  toBlur?: number;
  startFrame?: number;
  style?: React.CSSProperties;
};

/**
 * Blur-to-clear wrapper. Animates CSS filter: blur() on its subtree.
 * Useful for aerial hero reveal in Scene 1.
 */
export const BlurIn: React.FC<BlurInProps> = ({
  children,
  durationFrames,
  fromBlur = 40,
  toBlur = 0,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const blur = e(
    frame,
    [startFrame, startFrame + durationFrames],
    [fromBlur, toBlur],
    "editorial",
  );
  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
