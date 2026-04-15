import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { FormField } from "../../../components/ui/FormField";
import { VogelButton } from "../../../components/ui/VogelButton";
import { Modal } from "../../../components/ui/Modal";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { RippleClick } from "../../../components/effects/RippleClick";

type InvoiceModalProps = {
  phone: string;
};

/**
 * Scene 5 — 0..90 (3s) — Invoice Modal.
 * Modal scales in, name/email/phone type into fields, button clicks,
 * success state shows with CheckCircle zoom.
 */
export const InvoiceModal: React.FC<InvoiceModalProps> = ({ phone }) => {
  const frame = useCurrentFrame();

  const NAME_TYPE = 10;
  const EMAIL_TYPE = 28;
  const PHONE_TYPE = 50;
  const CLICK_FRAME = 72;
  const SUCCESS = 78;

  const beforeSuccess = frame < SUCCESS;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0a1510 0%, #020405 100%)",
      }}
    >
      {/* Dimmed background hint of the form — thin brand gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,18,16,0.95) 0%, rgba(3,7,7,0.95) 100%)",
          opacity: 0.6,
        }}
      />
      <AbsoluteFill style={{ opacity: 0.25 }}>
        <Img
          src={assets.image.heroPoster}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(12px)" }}
        />
      </AbsoluteFill>

      <Modal enterAt={0} enterDuration={18} width={720}>
        <div
          style={{
            padding: "40px 44px",
            borderRadius: 14,
            background: colors.darker,
            border: `1px solid ${colors.whiteFaint}`,
            boxShadow: "0 50px 140px rgba(0,0,0,0.75)",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: colors.teal,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Персональна пропозиція
          </div>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: 28,
              color: "#fff",
              textAlign: "center",
              marginBottom: 28,
              letterSpacing: "0.02em",
            }}
          >
            Отримати інвойс
          </div>

          {beforeSuccess ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <FormField
                label="Ім'я"
                placeholder="Ваше ім'я"
                value="Тарас Лукашик"
                focusAt={NAME_TYPE - 4}
                typeAt={NAME_TYPE}
                cps={42}
                icon={userIcon}
              />
              <FormField
                label="Email"
                placeholder="you@example.com"
                value="taras@vogel.travel"
                focusAt={EMAIL_TYPE - 4}
                typeAt={EMAIL_TYPE}
                cps={40}
                icon={mailIcon}
              />
              <FormField
                label="Телефон"
                placeholder="+38 0XX XXX XX XX"
                value={phone}
                focusAt={PHONE_TYPE - 4}
                typeAt={PHONE_TYPE}
                cps={36}
                icon={phoneIcon}
              />

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <VogelButton
                  label="Отримати інвойс"
                  hoverAt={62}
                  clickAt={CLICK_FRAME}
                  variant="white"
                  width={320}
                  height={60}
                />
              </div>
              <RippleClick
                atFrame={CLICK_FRAME}
                x={360}
                y={440}
                radius={200}
                durationFrames={20}
                color={colors.teal}
              />
            </div>
          ) : (
            <SuccessState entryFrame={SUCCESS} frame={frame} />
          )}
        </div>
      </Modal>

      {beforeSuccess ? (
        <AnimatedCursor
          keyframes={[
            { frame: 0, x: 1400, y: 120 },
            { frame: NAME_TYPE, x: 1020, y: 460, click: true },
            { frame: EMAIL_TYPE, x: 1020, y: 540, click: true },
            { frame: PHONE_TYPE, x: 1020, y: 620, click: true },
            { frame: CLICK_FRAME - 4, x: 960, y: 730 },
            { frame: CLICK_FRAME, x: 960, y: 730, click: true },
          ]}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// Success state with animated check circle
const SuccessState: React.FC<{ entryFrame: number; frame: number }> = ({ entryFrame, frame }) => {
  const t = frame - entryFrame;
  const scale = e(t, [0, 14], [0, 1], "pop");
  const rotate = e(t, [0, 18], [-180, 0]);
  const textOpacity = e(t, [6, 18], [0, 1]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "30px 0",
      }}
    >
      <svg
        width={120}
        height={120}
        viewBox="0 0 24 24"
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: "center",
          color: colors.teal,
          filter: `drop-shadow(0 12px 30px ${colors.glow})`,
        }}
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth={2} />
        <path d="M8 12.5 L11 15.5 L16 9.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div
        style={{
          fontFamily: fonts.heading,
          fontSize: 22,
          fontWeight: 800,
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          opacity: textOpacity,
        }}
      >
        Ваш запит прийнятий
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 15,
          color: colors.whiteMuted,
          textAlign: "center",
          maxWidth: 420,
          opacity: textOpacity,
        }}
      >
        Менеджер готує інвойс та зв'яжеться з вами найближчим часом
      </div>
    </div>
  );
};

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor" as const,
  strokeWidth: "2" as const,
};

const userIcon = (
  <svg {...iconProps}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const mailIcon = (
  <svg {...iconProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const phoneIcon = (
  <svg {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
