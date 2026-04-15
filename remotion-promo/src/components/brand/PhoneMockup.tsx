import React from "react";
import { colors } from "../../theme/colors";

type PhoneMockupProps = {
  children: React.ReactNode;
  width?: number;
  tilt?: number;
  style?: React.CSSProperties;
};

/**
 * Minimal iPhone-style frame — title-bar notch, rounded bezel, side buttons.
 * Aspect ratio 9:19.5 (like iPhone 15 Pro). Children fill the screen area.
 */
export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  width = 420,
  tilt = 0,
  style,
}) => {
  const height = Math.round(width * (19.5 / 9));
  const bezel = Math.max(10, Math.round(width * 0.04));
  const notchW = Math.round(width * 0.36);
  const notchH = Math.round(width * 0.08);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: bezel * 3,
        background: "linear-gradient(180deg, #0a0a0c 0%, #1a1a1d 50%, #0a0a0c 100%)",
        padding: bezel * 0.6,
        boxShadow: `
          0 50px 140px rgba(0,0,0,0.65),
          0 8px 30px rgba(0,0,0,0.4),
          inset 0 0 0 1px rgba(255,255,255,0.08)
        `,
        transform: `rotate(${tilt}deg)`,
        position: "relative",
        ...style,
      }}
    >
      {/* Side buttons */}
      <div style={{
        position: "absolute",
        left: -3, top: "22%", width: 3, height: "6%",
        borderRadius: 2, background: "#141416",
      }} />
      <div style={{
        position: "absolute",
        left: -3, top: "32%", width: 3, height: "9%",
        borderRadius: 2, background: "#141416",
      }} />
      <div style={{
        position: "absolute",
        right: -3, top: "27%", width: 3, height: "11%",
        borderRadius: 2, background: "#141416",
      }} />

      {/* Screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: bezel * 2.5,
          background: colors.black,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}

        {/* Dynamic-island notch */}
        <div
          style={{
            position: "absolute",
            top: bezel * 0.6,
            left: "50%",
            transform: "translateX(-50%)",
            width: notchW,
            height: notchH,
            borderRadius: notchH,
            background: "#000",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};
