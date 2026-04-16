import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const DynamicBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow oscillating values for gradient movement
  const shiftX = Math.sin(frame * 0.02) * 20;
  const shiftY = Math.cos(frame * 0.015) * 20;
  
  const color1 = "#E8F5E9"; // Light Green
  const color2 = "#FFF3E0"; // Light Orange
  const color3 = "#F1F8E9"; // Pale Lime
  
  // High-end animated mesh-like gradient
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${45 + shiftX}deg, ${color1} 0%, ${color2} 100%)`,
        overflow: "hidden",
      }}
    >
        {/* Subtle decorative shapes that also move */}
        <div style={{
            position: "absolute",
            width: "1400px",
            height: "1400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45, 185, 171, 0.12) 0%, rgba(255,255,255,0) 70%)",
            top: "-500px",
            left: "-500px",
            transform: `translate(${shiftX * 3}px, ${shiftY * 3}px)`,
        }} />
        
        <div style={{
            position: "absolute",
            width: "1200px",
            height: "1200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(242, 153, 74, 0.1) 0%, rgba(255,255,255,0) 70%)",
            bottom: "-400px",
            right: "-400px",
            transform: `translate(${-shiftX * 2}px, ${-shiftY * 2}px)`,
        }} />

        <div style={{
            position: "absolute",
            width: "1600px",
            height: "1600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255,255,255,0) 60%)",
            top: "10%",
            left: "10%",
            transform: `translate(${shiftY}px, ${shiftX}px)`,
            mixBlendMode: "overlay"
        }} />
    </AbsoluteFill>
  );
};
