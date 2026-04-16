import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { SceneHeader } from "./Header";

interface NavProps {
  sections: string[];
}

export const NavScene: React.FC<NavProps> = ({ sections }) => {
  const frame = useCurrentFrame();

  // Breathing motion
  const rotY = -15 + Math.cos(frame * 0.04) * 2;
  const floatY = Math.sin(frame * 0.03) * 10;

  return (
    <AbsoluteFill
      style={{
        padding: "80px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: "550px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <SceneHeader prefix="НАВІГАЦІЯ" title="Бокове меню" align="left" />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "-30px" }}>
            {sections.slice(0, 7).map((section, i) => (
                <div key={section} style={{ color: colors.tealDeep, fontSize: "42px", fontWeight: 900, opacity: e(frame, [20 + i*3, 40 + i*3], [0, 1]) }}>
                    {section}
                </div>
            ))}
        </div>
      </div>

      <div
        style={{
          width: "400px",
          height: "90%",
          background: colors.white,
          borderRadius: "40px",
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.1)",
          opacity: e(frame, [10, 25], [0, 1]),
          transform: `perspective(1000px) rotateY(${rotY}deg) translateY(${floatY}px) scale(${e(frame, [10, 25], [0.9, 1])})`,
        }}
      >
        <Img
            src={assets.image.screenshots.admin.sidebar}
            style={{
                width: "100%",
                height: "auto",
            }}
        />
      </div>
    </AbsoluteFill>
  );
};
