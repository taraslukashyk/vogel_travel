import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { e } from "../../lib/interp";

type DropdownProps = {
  label: string;
  /** Selected value that appears in the closed field. */
  value: string;
  /** Dropdown options shown when opened. */
  options?: readonly string[];
  /** Frame at which the dropdown opens. */
  openAt?: number;
  /** Frame at which the selection animates & dropdown closes. */
  selectAt?: number;
  /** Width. */
  width?: number | string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options = [],
  openAt = Infinity,
  selectAt = Infinity,
  width = "100%",
}) => {
  const frame = useCurrentFrame();
  const openP = e(frame, [openAt, openAt + 8], [0, 1]);
  const closeP = e(frame, [selectAt, selectAt + 6], [0, 1]);
  const visible = Math.max(0, openP - closeP);
  const opened = frame >= openAt && frame < selectAt + 6;
  const selected = frame >= selectAt;

  return (
    <div style={{ width, position: "relative" }}>
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
          height: 60,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${opened ? colors.teal : colors.whiteFaint}`,
          boxShadow: opened ? `0 0 0 2px ${colors.teal}55` : "none",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: fonts.body,
          fontSize: 18,
          color: selected ? colors.whiteSoft : colors.whiteMuted,
        }}
      >
        <span>{selected ? value : ""}</span>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: `rotate(${opened ? 180 : 0}deg)`,
            transition: "none",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {visible > 0.01 ? (
        <div
          style={{
            position: "absolute",
            top: "100%",
            marginTop: 6,
            left: 0,
            right: 0,
            borderRadius: 6,
            background: colors.darker,
            border: `1px solid ${colors.whiteFaint}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            overflow: "hidden",
            opacity: visible,
            transform: `translateY(${(1 - visible) * -6}px)`,
            zIndex: 10,
          }}
        >
          {options.map((opt) => {
            const isTarget = opt === value;
            const highlight = isTarget && selected ? colors.teal : "transparent";
            return (
              <div
                key={opt}
                style={{
                  padding: "14px 20px",
                  fontFamily: fonts.body,
                  fontSize: 16,
                  color: isTarget && selected ? "#000" : colors.whiteSoft,
                  background: highlight,
                  borderBottom: `1px solid rgba(255,255,255,0.04)`,
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
