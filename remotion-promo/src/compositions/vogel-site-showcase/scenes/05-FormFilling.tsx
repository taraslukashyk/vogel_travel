import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { FormField } from "../../../components/ui/FormField";
import { Counter } from "../../../components/ui/Counter";
import { VogelButton } from "../../../components/ui/VogelButton";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { RippleClick } from "../../../components/effects/RippleClick";
import { Typewriter } from "../../../components/effects/Typewriter";

type Props = { website: string; phone: string };

/**
 * Scene 5 — 0..180 (6s) — Booking Form Filling.
 * Booking form fills in live: dates → nights → adults → name → email → phone → submit.
 * screenshot faded as dark backdrop; bright Remotion UI overlaid on top.
 */
export const FormFilling: React.FC<Props> = ({ website, phone }) => {
  const frame = useCurrentFrame();

  // Choreography (local frames)
  const FORM_IN = 0;
  const DATE_TYPE = 18;
  const NIGHTS_INCS = [40, 48, 56, 64, 72, 80, 88] as const; // 7 clicks → 7 nights
  const ADULTS_INC = 102;
  const NAME_TYPE = 118;
  const EMAIL_TYPE = 135;
  const PHONE_TYPE = 152;
  const HOVER_BTN = 162;
  const CLICK_BTN = 170;
  const SUCCESS = 176;

  const beforeSuccess = frame < SUCCESS;

  const formOpacity = e(frame, [FORM_IN, FORM_IN + 16], [0, 1]);
  const formY = e(frame, [FORM_IN, FORM_IN + 20], [30, 0], "enter");
  const sceneFade = e(frame, [168, 180], [1, 0], "exit");

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade,
      }}
    >
      <BrowserChrome
        url={`${website}/ua/offers/four-seasons-seychelles`}
        width={1480}
        height={820}
      >
        {/* Dimmed screenshot backdrop */}
        <AbsoluteFill>
          <Img
            src={assets.image.screenshots.formEmpty}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              opacity: 0.18,
            }}
          />
        </AbsoluteFill>

        {/* Live Remotion booking form */}
        {beforeSuccess ? (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: formOpacity,
              transform: `translateY(${formY}px)`,
            }}
          >
            <div
              style={{
                width: 900,
                padding: "36px 44px",
                borderRadius: 16,
                background: "rgba(8,18,16,0.95)",
                border: `1px solid ${colors.whiteFaint}`,
                boxShadow: "0 50px 140px rgba(0,0,0,0.8)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <div
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: colors.teal,
                    marginBottom: 8,
                  }}
                >
                  Оформлення замовлення
                </div>
                <div
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  Four Seasons Seychelles
                </div>
              </div>

              {/* Row 1: Departure date */}
              <FormField
                label="Відправлення"
                placeholder="Оберіть дати"
                value="14–21 травня 2026"
                focusAt={DATE_TYPE - 4}
                typeAt={DATE_TYPE}
                cps={38}
                icon={<CalIcon />}
              />

              {/* Row 2: Nights | Adults */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <Counter
                  label="Ночей"
                  increments={NIGHTS_INCS}
                  initial={0}
                  max={14}
                />
                <Counter
                  label="Дорослих"
                  increments={[ADULTS_INC]}
                  initial={1}
                  max={6}
                />
              </div>

              {/* Row 3: Personal info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <FormField
                  label="Ім'я"
                  placeholder="Ваше ім'я"
                  value="Тарас"
                  focusAt={NAME_TYPE - 4}
                  typeAt={NAME_TYPE}
                  cps={40}
                  icon={<UserIcon />}
                />
                <FormField
                  label="Email"
                  placeholder="you@example.com"
                  value="taras@vogel.travel"
                  focusAt={EMAIL_TYPE - 4}
                  typeAt={EMAIL_TYPE}
                  cps={38}
                  icon={<MailIcon />}
                />
              </div>

              <FormField
                label="Телефон"
                placeholder="+38 0XX XXX XX XX"
                value={phone}
                focusAt={PHONE_TYPE - 4}
                typeAt={PHONE_TYPE}
                cps={36}
                icon={<PhoneIcon />}
              />

              {/* Submit button */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <VogelButton
                  label="Отримати інвойс"
                  hoverAt={HOVER_BTN}
                  clickAt={CLICK_BTN}
                  variant="white"
                  width={340}
                  height={58}
                />
              </div>

              {/* Voice hint */}
              <div
                style={{
                  textAlign: "center",
                  fontFamily: fonts.body,
                  fontSize: 12,
                  color: colors.whiteMuted,
                  letterSpacing: "0.05em",
                  opacity: e(frame, [NAME_TYPE, NAME_TYPE + 16], [0, 1]),
                }}
              >
                <Typewriter
                  text="🎙 Якщо є запитання — записуй голосове повідомлення"
                  startFrame={NAME_TYPE + 8}
                  cps={30}
                />
              </div>
            </div>
          </AbsoluteFill>
        ) : (
          /* Success flash at the very end */
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: e(frame, [SUCCESS, SUCCESS + 8], [0, 1]),
            }}
          >
            <div style={{ textAlign: "center", color: "#fff" }}>
              <svg
                width={80}
                height={80}
                viewBox="0 0 24 24"
                style={{ color: colors.teal, marginBottom: 16 }}
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
              <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, letterSpacing: "0.15em" }}>
                Ваш запит прийнятий
              </div>
            </div>
          </AbsoluteFill>
        )}
      </BrowserChrome>

      <AnimatedCursor
        keyframes={[
          { frame: 0, x: 960, y: 200 },
          { frame: DATE_TYPE, x: 800, y: 370, click: true },
          { frame: NIGHTS_INCS[0], x: 620, y: 468, click: true },
          { frame: NIGHTS_INCS[2], x: 620, y: 468, click: true },
          { frame: NIGHTS_INCS[4], x: 620, y: 468, click: true },
          { frame: NIGHTS_INCS[6], x: 620, y: 468, click: true },
          { frame: ADULTS_INC, x: 1040, y: 468, click: true },
          { frame: NAME_TYPE, x: 700, y: 566, click: true },
          { frame: EMAIL_TYPE, x: 1040, y: 566, click: true },
          { frame: PHONE_TYPE, x: 800, y: 638, click: true },
          { frame: HOVER_BTN, x: 960, y: 726 },
          { frame: CLICK_BTN, x: 960, y: 726, click: true },
        ]}
      />

      <RippleClick atFrame={CLICK_BTN} x={960} y={726} radius={160} durationFrames={22} color={colors.teal} />
    </AbsoluteFill>
  );
};

// Icon SVGs
const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" as const, strokeWidth: "2" as const };
const CalIcon = () => (
  <svg {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);
const UserIcon = () => (
  <svg {...iconProps}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const MailIcon = () => (
  <svg {...iconProps}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
);
const PhoneIcon = () => (
  <svg {...iconProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
