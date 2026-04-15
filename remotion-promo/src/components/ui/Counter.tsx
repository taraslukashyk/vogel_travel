import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { e } from "../../lib/interp";

type CounterProps = {
  label: string;
  /** Frame at which a click happens → value increments. */
  increments?: readonly number[];
  /** Starting value. */
  initial?: number;
  /** Optional cap. */
  max?: number;
  /** Width of the row. */
  width?: number | string;
};

/**
 * -/+ counter with animated tick on each increment (scale-up pulse on digit).
 * `increments` is a list of frames at which the value grows by 1.
 */
export const Counter: React.FC<CounterProps> = ({
  label,
  increments = [],
  initial = 0,
  max,
  width = "100%",
}) => {
  const frame = useCurrentFrame();
  const passed = increments.filter((f) => frame >= f).length;
  const current = max != null ? Math.min(initial + passed, max) : initial + passed;

  // Pulse shortly after the most recent increment
  const lastTick = increments.filter((f) => f <= frame).pop();
  const pulse = lastTick != null ? e(frame, [lastTick, lastTick + 6, lastTick + 12], [1, 1.25, 1]) : 1;

  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderRadius: 4,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${colors.whiteFaint}`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: 12,
          color: colors.whiteSoft,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Circle char="−" />
        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            minWidth: 40,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${pulse})`,
            transformOrigin: "center",
          }}
        >
          {current}
        </div>
        <Circle char="+" accent />
      </div>
    </div>
  );
};

const Circle: React.FC<{ char: string; accent?: boolean }> = ({ char, accent }) => (
  <div
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: `1.5px solid ${accent ? colors.teal : colors.whiteFaint}`,
      color: accent ? colors.teal : colors.whiteSoft,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      fontWeight: 500,
      fontFamily: "system-ui",
    }}
  >
    {char}
  </div>
);
