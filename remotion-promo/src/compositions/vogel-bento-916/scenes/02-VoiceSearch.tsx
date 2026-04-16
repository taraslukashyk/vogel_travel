import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { MicRecorder } from "../../../components/ui/MicRecorder";
import { Typewriter } from "../../../components/effects/Typewriter";
import { fonts } from "../../../theme/fonts";

export const VoiceSearchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = e(frame, [0, 15], [0, 1]);
  const exitOpacity = e(frame, [105, 120], [1, 0], "exit");

  // Camera dynamics: slow zoom in
  const scale = e(frame, [0, 120], [1, 1.1], "enter");

  return (
    <AbsoluteFill
      style={{
        background: colors.dark,
        opacity: Math.min(opacity, exitOpacity),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
      }}
    >
      {/* Bento-like card decoration */}
      <div
        style={{
          width: 800,
          height: 1000,
          background: "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${colors.whiteFaint}`,
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 60,
          boxShadow: `0 40px 100px rgba(0,0,0,0.5)`,
        }}
      >
        <div 
          style={{ 
            fontFamily: fonts.heading, 
            color: colors.whiteSoft, 
            fontSize: 48, 
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 80,
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          }}
        >
          Голосовий пошук
        </div>

        <MicRecorder startFrame={20} duration={60} sendAtFrame={90} />

        <div 
          style={{ 
            marginTop: 100,
            fontFamily: fonts.heading,
            fontSize: 42,
            color: colors.teal,
            fontWeight: 600,
            textAlign: "center"
          }}
        >
          <Typewriter text="Мальдіви на двох" startFrame={40} cps={15} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
