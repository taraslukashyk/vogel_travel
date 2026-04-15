import React from "react";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

type BrowserChromeProps = {
  url: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

/**
 * Stylised browser window chrome for demo shots.
 * Traffic-lights, URL bar, content area. Looks realistic on macOS Safari.
 */
export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  url,
  children,
  width = 1400,
  height = 820,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        overflow: "hidden",
        background: colors.dark,
        boxShadow: "0 60px 120px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          background: "rgba(15, 25, 22, 0.95)",
          borderBottom: `1px solid ${colors.whiteFaint}`,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <Dot color="#ff5f57" />
          <Dot color="#febc2e" />
          <Dot color="#28c840" />
        </div>
        <div
          style={{
            flex: 1,
            height: 28,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.whiteMuted,
            fontFamily: fonts.body,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: 8, opacity: 0.8 }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {url}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", background: colors.black }}>
        {children}
      </div>
    </div>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 12,
      height: 12,
      borderRadius: 999,
      background: color,
    }}
  />
);
