import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { e } from "../../lib/interp";

type CalendarProps = {
  month: string;
  /** First highlighted day number (1-31). */
  fromDay?: number;
  /** Last highlighted day number (1-31). */
  toDay?: number;
  /** Frame at which `fromDay` highlights. */
  selectFromAt?: number;
  /** Frame at which `toDay` highlights, revealing the range. */
  selectToAt?: number;
  /** Starting day-of-week of day 1 (0=Mon). */
  startDow?: number;
  /** Total days in month. */
  daysInMonth?: number;
  width?: number;
};

const DOW = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

/**
 * Mini calendar grid with teal highlight on the selected date range.
 * Matches the DayPicker aesthetic from `OfferBookingForm.tsx`.
 */
export const Calendar: React.FC<CalendarProps> = ({
  month,
  fromDay = 14,
  toDay = 28,
  selectFromAt = 0,
  selectToAt = 0,
  startDow = 2,
  daysInMonth = 31,
  width = 420,
}) => {
  const frame = useCurrentFrame();
  const fromShown = frame >= selectFromAt;
  const toShown = frame >= selectToAt;
  const rangeP = e(frame, [selectToAt, selectToAt + 10], [0, 1]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      style={{
        width,
        background: colors.darker,
        borderRadius: 10,
        padding: 20,
        border: `1px solid ${colors.whiteFaint}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          textAlign: "center",
          color: colors.whiteSoft,
          fontSize: 16,
          marginBottom: 14,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {month}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              color: colors.whiteMuted,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />;
          const isFrom = d === fromDay && fromShown;
          const isTo = d === toDay && toShown;
          const isBetween = d > fromDay && d < toDay && toShown;
          const endpointBg = isFrom || isTo ? colors.teal : "transparent";
          const midBg = isBetween
            ? `rgba(92,200,189,${0.25 * rangeP})`
            : "transparent";
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 4,
                background: endpointBg !== "transparent" ? endpointBg : midBg,
                color: isFrom || isTo ? "#000" : colors.whiteSoft,
                fontWeight: isFrom || isTo ? 700 : 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};
