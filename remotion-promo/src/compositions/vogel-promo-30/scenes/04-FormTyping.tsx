import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { FormField } from "../../../components/ui/FormField";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Counter } from "../../../components/ui/Counter";
import { Calendar } from "../../../components/ui/Calendar";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { RippleClick } from "../../../components/effects/RippleClick";

/**
 * Scene 4 — 0..300 (10s) — Form Typing.
 * Core of the promo: demonstrates the full booking flow with a cursor that
 * clicks each field while values type in. Mirrors `OfferBookingForm.tsx`.
 */
export const FormTyping: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Choreography timeline (frames) ──
  const DATES_OPEN = 18;
  const DATES_FROM = 30;
  const DATES_TO = 42;
  const DATES_CLOSE = 55;

  const COUNTRY_CLICK = 72;
  const COUNTRY_OPEN = COUNTRY_CLICK + 2;
  const COUNTRY_SELECT = 90;

  const CITY_CLICK = 102;
  const CITY_OPEN = CITY_CLICK + 2;
  const CITY_SELECT = 118;

  const NIGHTS_INCS = [132, 140, 148, 156, 164, 172, 180] as const;

  const ADULTS_INC = 196;
  const CHILDREN_INCS = [210, 220] as const;

  const CHILD1_CLICK = 234;
  const CHILD1_OPEN = CHILD1_CLICK + 2;
  const CHILD1_SELECT = 248;

  const CHILD2_CLICK = 260;
  const CHILD2_OPEN = CHILD2_CLICK + 2;
  const CHILD2_SELECT = 274;

  const panelOpacity = e(frame, [0, 14], [0, 1]);
  const panelY = e(frame, [0, 18], [24, 0]);

  // Highlight focus frame for the dates field (the only one that uses FormField)
  const datesFocus = DATES_OPEN - 4;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #091513 0%, #030707 100%)",
      }}
    >
      {/* Offer thumbnail header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: `translateX(-50%) translateY(${panelY * 0.5}px)`,
          width: 1320,
          height: 180,
          borderRadius: 12,
          overflow: "hidden",
          opacity: panelOpacity,
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        }}
      >
        <Img
          src={assets.image.heroPoster}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.45) 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: colors.teal,
                marginBottom: 8,
              }}
            >
              Преміум-тур
            </div>
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: 44,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "0.02em",
              }}
            >
              Мальдіви · Мале
            </div>
          </div>
        </div>
      </div>

      {/* Booking card */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: "50%",
          transform: `translateX(-50%) translateY(${panelY}px)`,
          opacity: panelOpacity,
          width: 1320,
          padding: 40,
          borderRadius: 14,
          background: "rgba(8, 18, 16, 0.92)",
          border: `1px solid ${colors.whiteFaint}`,
          boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {/* Row 1: Dates */}
        <div style={{ position: "relative" }}>
          <FormField
            label="Відправлення"
            placeholder="Оберіть дати"
            value={
              frame >= DATES_CLOSE
                ? "14 травня 2026 — 21 травня 2026"
                : undefined
            }
            focusAt={datesFocus}
            typeAt={DATES_CLOSE}
            cps={40}
            icon={
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />
          {/* Floating calendar overlay */}
          {frame >= DATES_OPEN - 2 && frame <= DATES_CLOSE + 8 ? (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 10,
                opacity: e(frame, [DATES_OPEN - 2, DATES_OPEN + 10, DATES_CLOSE, DATES_CLOSE + 8], [0, 1, 1, 0]),
                transform: `translateY(${e(frame, [DATES_OPEN - 2, DATES_OPEN + 10], [-8, 0])}px)`,
                zIndex: 20,
              }}
            >
              <Calendar
                month="Травень 2026"
                fromDay={14}
                toDay={21}
                selectFromAt={DATES_FROM}
                selectToAt={DATES_TO}
                startDow={4}
                daysInMonth={31}
                width={420}
              />
            </div>
          ) : null}
        </div>

        {/* Row 2: Country | City */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Dropdown
            label="Країна"
            value="Мальдіви"
            options={["Греція", "Італія", "Маврикій", "Мальдіви", "Сейшели"]}
            openAt={COUNTRY_OPEN}
            selectAt={COUNTRY_SELECT}
          />
          <Dropdown
            label="Місто / курорт"
            value="Мале"
            options={["Мале", "Адду", "Баа Атол", "Раа Атол"]}
            openAt={CITY_OPEN}
            selectAt={CITY_SELECT}
          />
        </div>

        {/* Row 3: Nights | Adults | Children */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
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
            max={9}
          />
          <Counter
            label="Дітей"
            increments={CHILDREN_INCS}
            initial={0}
            max={6}
          />
        </div>

        {/* Row 4: Child ages (conditionally visible once children > 0) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            opacity: e(frame, [CHILDREN_INCS[0]!, CHILDREN_INCS[0]! + 20], [0, 1]),
            transform: `translateY(${e(frame, [CHILDREN_INCS[0]!, CHILDREN_INCS[0]! + 20], [10, 0])}px)`,
          }}
        >
          <Dropdown
            label="Вік дитини 1"
            value="8 років"
            options={["3 роки", "5 років", "6 років", "8 років", "10 років"]}
            openAt={CHILD1_OPEN}
            selectAt={CHILD1_SELECT}
          />
          <Dropdown
            label="Вік дитини 2"
            value="5 років"
            options={["3 роки", "5 років", "6 років", "8 років", "10 років"]}
            openAt={CHILD2_OPEN}
            selectAt={CHILD2_SELECT}
          />
        </div>

        {/* Helper text */}
        <div
          style={{
            marginTop: 6,
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.whiteMuted,
            textAlign: "center",
            opacity: e(frame, [260, 285], [0, 1]),
          }}
        >
          Ще один крок — і ми готуємо інвойс саме для вас
        </div>
      </div>

      {/* Cursor traversing the form */}
      <AnimatedCursor
        keyframes={[
          { frame: 6, x: 1600, y: 120 },
          { frame: DATES_OPEN, x: 820, y: 330, click: true },
          { frame: DATES_FROM, x: 1050, y: 430, click: true },
          { frame: DATES_TO, x: 1140, y: 430, click: true },
          { frame: COUNTRY_CLICK, x: 560, y: 470, click: true },
          { frame: COUNTRY_SELECT, x: 560, y: 540, click: true },
          { frame: CITY_CLICK, x: 1250, y: 470, click: true },
          { frame: CITY_SELECT, x: 1250, y: 540, click: true },
          ...NIGHTS_INCS.map((f, i) => ({
            frame: f,
            x: 600,
            y: 630,
            click: i === 0 || i === NIGHTS_INCS.length - 1,
          })),
          { frame: ADULTS_INC, x: 1010, y: 630, click: true },
          { frame: CHILDREN_INCS[0], x: 1420, y: 630, click: true },
          { frame: CHILDREN_INCS[1], x: 1420, y: 630, click: true },
          { frame: CHILD1_CLICK, x: 560, y: 770, click: true },
          { frame: CHILD1_SELECT, x: 560, y: 820, click: true },
          { frame: CHILD2_CLICK, x: 1250, y: 770, click: true },
          { frame: CHILD2_SELECT, x: 1250, y: 820, click: true },
          { frame: 295, x: 960, y: 900 },
        ]}
      />

      {/* Ripples at key clicks */}
      <RippleClick atFrame={DATES_FROM} x={1050} y={430} radius={60} durationFrames={14} />
      <RippleClick atFrame={DATES_TO} x={1140} y={430} radius={60} durationFrames={14} />
      <RippleClick atFrame={COUNTRY_SELECT} x={560} y={540} radius={80} durationFrames={16} />
      <RippleClick atFrame={CITY_SELECT} x={1250} y={540} radius={80} durationFrames={16} />
    </AbsoluteFill>
  );
};
