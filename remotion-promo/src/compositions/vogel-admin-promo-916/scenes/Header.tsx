import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";

interface SceneHeaderProps {
  prefix?: string;
  title: string;
  align?: "center" | "left";
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({ prefix, title, align = "center" }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        textAlign: align,
        marginBottom: "60px",
        opacity: e(frame, [0, 15], [0, 1]),
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {prefix && (
        <div 
          style={{ 
            color: colors.tealDeep, 
            fontSize: "32px", 
            fontWeight: 900, 
            letterSpacing: "6px", 
            marginBottom: "10px",
            textTransform: "uppercase"
          }}
        >
          {prefix}
        </div>
      )}
      <div 
        style={{ 
          color: "#000000", 
          fontSize: "72px", 
          fontWeight: 900, 
          lineHeight: 1.1,
          maxWidth: "900px"
        }}
      >
        {title}
      </div>
    </div>
  );
};
