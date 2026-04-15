import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { PhoneMockup } from "../../../components/brand/PhoneMockup";
import { Typewriter } from "../../../components/effects/Typewriter";
import { BirdParticles } from "../../../components/brand/BirdParticles";

type PhoneSmsProps = {
  managerName: string;
};

/**
 * Scene 7 — 0..120 (4s) — SMS on iPhone lock screen.
 * Phone tilts in, notification pops with haptic shake, message types out.
 */
export const PhoneSms: React.FC<PhoneSmsProps> = ({ managerName }) => {
  const frame = useCurrentFrame();

  // Phone entrance
  const phoneOpacity = e(frame, [0, 18], [0, 1]);
  const phoneY = e(frame, [0, 22], [80, 0], "enter");
  const phoneScale = e(frame, [0, 24], [0.92, 1], "enter");
  const phoneTilt = e(frame, [0, 30], [-8, 0], "enter");

  // SMS banner arrival
  const SMS_AT = 28;
  const smsOpacity = e(frame, [SMS_AT, SMS_AT + 12], [0, 1]);
  const smsScale = e(frame, [SMS_AT, SMS_AT + 14], [0.8, 1], "pop");
  // Haptic shake — small x offset that decays
  const shake = frame > SMS_AT && frame < SMS_AT + 18
    ? Math.sin((frame - SMS_AT) * 3) * (1 - (frame - SMS_AT) / 18) * 6
    : 0;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 60%, #0a1f1b 0%, #020604 100%)",
      }}
    >
      {/* Ambient bokeh */}
      <BirdParticles count={8} spreadX={1400} driftY={400} opacity={0.35} seed={33} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `translateY(${phoneY}px) scale(${phoneScale})`,
            opacity: phoneOpacity,
          }}
        >
          <PhoneMockup width={440} tilt={phoneTilt}>
            {/* Lock-screen wallpaper — teal gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, #0a1a17 0%, #0c2520 50%, #0a1a17 100%)",
              }}
            />

            {/* Time */}
            <div
              style={{
                position: "absolute",
                top: 60,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#fff",
                fontFamily: fonts.heading,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.8, marginBottom: 4 }}>
                Сьогодні, зараз
              </div>
              <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
                10:24
              </div>
            </div>

            {/* SMS banner */}
            {frame >= SMS_AT ? (
              <div
                style={{
                  position: "absolute",
                  top: 240,
                  left: 14,
                  right: 14,
                  borderRadius: 20,
                  background: "rgba(28, 30, 32, 0.92)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "12px 14px",
                  opacity: smsOpacity,
                  transform: `translateX(${shake}px) scale(${smsScale})`,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Img
                    src={assets.image.viktoria}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `1.5px solid ${colors.teal}`,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: fonts.heading,
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: 13,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {managerName}
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 10, color: "rgba(255,255,255,0.55)" }}>
                      SMS · зараз
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.95)",
                    lineHeight: 1.4,
                    minHeight: 62,
                  }}
                >
                  <Typewriter
                    text="Ми підібрали вам ідеальну подорож 🌴 Деталі — в інвойсі на email."
                    startFrame={SMS_AT + 18}
                    cps={32}
                  />
                </div>
              </div>
            ) : null}
          </PhoneMockup>
        </div>

        {/* Halo behind phone */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 55%)`,
            opacity: e(frame, [12, 60, 120], [0, 0.45, 0.3]),
            filter: "blur(30px)",
            zIndex: -1,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
