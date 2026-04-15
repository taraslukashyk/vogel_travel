import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";

type EndCardProps = {
  website: string;
  phone: string;
};

/**
 * Scene 8 — 0..60 (2s) — End Card.
 * Logo + URL + CTA, birds drift across, final fade to black.
 */
export const EndCard: React.FC<EndCardProps> = ({ website, phone }) => {
  const frame = useCurrentFrame();

  const logoOpacity = e(frame, [0, 16], [0, 1]);
  const logoY = e(frame, [0, 20], [20, 0], "enter");
  const taglineOpacity = e(frame, [12, 26], [0, 1]);
  const contactsOpacity = e(frame, [20, 34], [0, 1]);
  const finalFade = e(frame, [48, 60], [0, 1], "exit");

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0b2521 0%, #020505 75%, #000 100%)",
      }}
    >
      <BirdParticles count={18} spreadX={1800} driftY={500} opacity={0.55} seed={77} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.6))",
          }}
        >
          <Logo width={460} />
        </div>

        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.teal,
            opacity: taglineOpacity,
            marginTop: 6,
          }}
        >
          {website}
        </div>

        <div
          style={{
            fontFamily: fonts.script,
            fontSize: 44,
            color: "#fff",
            opacity: taglineOpacity,
            marginTop: 20,
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          Плануй подорож за 30 секунд
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 38,
            opacity: contactsOpacity,
            fontFamily: fonts.body,
            fontSize: 14,
            color: colors.whiteMuted,
          }}
        >
          <Contact label="TEL" value={phone} />
          <div style={{ width: 1, background: colors.whiteFaint }} />
          <Contact label="EMAIL" value="booking@vogel.travel" />
          <div style={{ width: 1, background: colors.whiteFaint }} />
          <Contact label="INSTAGRAM" value="@vogel.family.travel" />
        </div>
      </AbsoluteFill>

      {/* Final fade to black */}
      <AbsoluteFill style={{ background: "#000", opacity: finalFade }} />
    </AbsoluteFill>
  );
};

const Contact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: "0.35em",
        color: colors.teal,
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div style={{ color: "#fff", fontWeight: 500 }}>{value}</div>
  </div>
);
