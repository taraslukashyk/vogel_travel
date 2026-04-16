import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { Logo } from "../../../components/brand/Logo";
import { fonts } from "../../../theme/fonts";

export const OutroScene: React.FC<{ website: string }> = ({ website }) => {
  const frame = useCurrentFrame();
  const opacity = e(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      <Logo width={500} />
      
      <div 
        style={{ 
          fontFamily: fonts.heading, 
          fontSize: 48, 
          color: colors.white, 
          fontWeight: 700,
          letterSpacing: "0.1em"
        }}
      >
        {website}
      </div>
    </AbsoluteFill>
  );
};
