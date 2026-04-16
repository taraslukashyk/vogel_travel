import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, staticFile } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { PhoneMockup } from "../../../components/brand/PhoneMockup";
import { fonts } from "../../../theme/fonts";
import { assets } from "../../../lib/staticPath";

const WebButton: React.FC<{ label: string; scale: number }> = ({ label, scale }) => (
  <div
    style={{
      background: colors.white,
      color: colors.black,
      fontFamily: fonts.heading,
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      fontWeight: "bold",
      padding: "20px 40px",
      borderRadius: 2,
      fontSize: 24,
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      transform: `scale(${scale})`,
      textAlign: "center",
      width: "80%",
    }}
  >
    {label}
  </div>
);

export const MobileShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = e(frame, [0, 15], [0, 1]);
  const exitOpacity = e(frame, [105, 120], [1, 0], "exit");

  // Phone 3D Dynamic movement
  const tilt = e(frame, [0, 120], [15, -15], "editorial");
  const phoneScale = e(frame, [0, 20], [0.8, 1], "pop");
  
  // Click animation for button
  const buttonScale = e(frame, [80, 85], [1, 0.95], "pop");
  const buttonScaleReturn = e(frame, [85, 95], [0.95, 1], "pop");
  const finalButtonScale = frame > 85 ? buttonScaleReturn : buttonScale;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${colors.tealDeep} 0%, ${colors.darker} 100%)`,
        opacity: Math.min(opacity, exitOpacity),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneMockup width={500} tilt={tilt}>
          <div style={{ background: colors.dark, height: "100%", padding: 40, display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
            <div style={{ width: "100%", height: 300, background: "#1a2a24", borderRadius: 10, overflow: "hidden" }}>
               {/* Placeholder for city image */}
               <div style={{ width: "100%", height: "100%", background: colors.tealDeep, opacity: 0.3 }} />
            </div>
            <div style={{ color: colors.whiteSoft, fontFamily: fonts.heading, fontSize: 32, fontWeight: 700, width: "100%" }}>
              Ісландія: Край льоду та полум'я
            </div>
            <div style={{ color: colors.whiteMuted, fontFamily: fonts.body, fontSize: 20, width: "100%", lineHeight: 1.5 }}>
              Відкрийте для себе магію північного сяйва та величних гейзерів.
            </div>
            
            <div style={{ marginTop: "auto", marginBottom: 60, width: "100%", display: "flex", justifyContent: "center" }}>
              <WebButton label="Бронювати" scale={finalButtonScale} />
            </div>
          </div>
        </PhoneMockup>
      </div>
    </AbsoluteFill>
  );
};
