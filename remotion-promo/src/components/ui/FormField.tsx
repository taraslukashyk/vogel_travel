import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { Typewriter } from "../effects/Typewriter";
import { e } from "../../lib/interp";

type FormFieldProps = {
  label: string;
  placeholder?: string;
  /** The final value that gets typed into the field. */
  value?: string;
  /** Frame at which focus highlight appears (local). */
  focusAt?: number;
  /** Frame at which typing starts. */
  typeAt?: number;
  /** Typing speed (chars/sec). */
  cps?: number;
  /** Field dimensions. */
  width?: number | string;
  /** Optional leading icon (SVG JSX). */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Form field that mirrors the main site's booking form:
 * - Uppercase Montserrat label
 * - White input with subtle border
 * - Teal focus ring
 * - Typewriter fills the value
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  focusAt = 0,
  typeAt = 0,
  cps = 28,
  width = "100%",
  icon,
  style,
}) => {
  const frame = useCurrentFrame();
  const focus = e(frame, [focusAt, focusAt + 8], [0, 1]);
  return (
    <div style={{ width, ...style }}>
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: 11,
          color: colors.whiteSoft,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "relative",
          height: 60,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid rgba(255,255,255,${0.1 + focus * 0.15})`,
          boxShadow: focus > 0.1 ? `0 0 0 2px ${colors.teal}55` : "none",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
        }}
      >
        {icon ? (
          <div
            style={{
              color: focus > 0.5 ? colors.teal : colors.whiteMuted,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 18,
            fontWeight: 500,
            color: colors.whiteSoft,
            flex: 1,
          }}
        >
          {value ? (
            <Typewriter
              text={value}
              startFrame={typeAt}
              cps={cps}
              caret={frame >= typeAt && frame < typeAt + (value.length / cps) * 30 + 10}
              caretColor={colors.teal}
            />
          ) : (
            <span style={{ color: colors.whiteMuted }}>{placeholder}</span>
          )}
        </div>
      </div>
    </div>
  );
};
