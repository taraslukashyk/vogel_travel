import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";

type Props = { website: string };

/**
 * Scene 7 — 0..120 (4s) — Success + End Card.
 * "ВАШ ЗАПИТ ПРИЙНЯТИЙ" success state cross-fades into the Vogel logo
 * end card with bird particles and URL tagline.
 */
export const SuccessEnd: React.FC<Props> = ({ website }) => {
  const frame = useCurrentFrame();

  // ── Success state (0–55) ──────────────────────────────────────────────────
  const successOpacity = e(frame, [0, 14, 46, 62], [0, 1, 1, 0]);
  const checkScale = e(frame, [0, 16], [0, 1], "pop");
  const checkRotate = e(frame, [0, 20], [-150, 0]);
  const textOpacity = e(frame, [10, 24], [0, 1]);

  // ── End card (50–120) ─────────────────────────────────────────────────────
  const logoOpacity = e(frame, [52, 70], [0, 1]);
  const logoY = e(frame, [52, 72], [20, 0], "enter");
  const taglineOpacity = e(frame, [62, 80], [0, 1]);
  const urlOpacity = e(frame, [70, 88], [0, 1]);
  const finalFade = e(frame, [106, 120], [0, 1], "exit");

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0b2521 0%, #020606 72%, #000 100%)",
      }}
    >
      <BirdParticles count={20} spreadX={1900} driftY={550} opacity={0.5} seed={99} />

      {/* Success state */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 22,
          opacity: successOpacity,
        }}
      >
        <svg
          width={100}
          height={100}
          viewBox="0 0 24 24"
          style={{
            color: colors.teal,
            filter: `drop-shadow(0 10px 30px ${colors.glow})`,
            transform: `scale(${checkScale}) rotate(${checkRotate}deg)`,
            transformOrigin: "center",
          }}
        >
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth={2} />
          <path
            d="M8 12.5 L11 15.5 L16 9.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: 28,
            fontWeight: 900,
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            opacity: textOpacity,
          }}
        >
          Ваш запит прийнятий
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 16,
            color: colors.whiteMuted,
            textAlign: "center",
            maxWidth: 460,
            lineHeight: 1.6,
            opacity: textOpacity,
          }}
        >
          Менеджер підготує інвойс та зв'яжеться з вами найближчим часом
        </div>
      </AbsoluteFill>

      {/* End card */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
            filter: "drop-shadow(0 14px 36px rgba(0,0,0,0.65))",
          }}
        >
          <Logo width={420} />
        </div>

        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: colors.teal,
            opacity: urlOpacity,
          }}
        >
          {website}
        </div>

        <div
          style={{
            fontFamily: fonts.script,
            fontSize: 40,
            color: "#fff",
            opacity: taglineOpacity,
            marginTop: 10,
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          Плануй подорож за 30 секунд
        </div>
      </AbsoluteFill>

      {/* Final black fade */}
      <AbsoluteFill style={{ background: "#000", opacity: finalFade }} />
    </AbsoluteFill>
  );
};
