import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

type MicRecorderProps = {
  /** Local frame when recording begins (after cursor click). */
  startFrame: number;
  /** How many frames the recording lasts. */
  duration: number;
  /** Local frame when the stop/send animation triggers. */
  sendAtFrame: number;
};

/**
 * Visual microphone-recording UI component for the VoiceRecord scene.
 * Three states driven by useCurrentFrame():
 *  - idle (before startFrame): mic icon hint
 *  - recording (startFrame → sendAtFrame): red pulse + timer + waveform
 *  - sending (sendAtFrame+): bar slides right + fade
 */
export const MicRecorder: React.FC<MicRecorderProps> = ({
  startFrame,
  duration,
  sendAtFrame,
}) => {
  const frame = useCurrentFrame();

  const isRecording = frame >= startFrame && frame < sendAtFrame;
  const isSending = frame >= sendAtFrame;

  // Idle hint opacity (before recording)
  const idleOpacity = e(frame, [0, 12], [0, 1]);

  // Container entrance
  const containerScale = e(frame, [startFrame, startFrame + 14], [0.85, 1], "pop");
  const containerOpacity = e(frame, [startFrame, startFrame + 12], [0, 1]);

  // Timer: 0:00 → 0:0X
  const elapsed = Math.max(0, Math.floor((frame - startFrame) / 30));
  const timerStr = `0:0${Math.min(elapsed, 9)}`;

  // Waveform bars (5 bars, each with different phase)
  const wavePhase = (frame - startFrame) / 6;
  const barHeights = [0.4, 0.8, 1.0, 0.7, 0.5].map(
    (base, i) => base * (0.5 + 0.5 * Math.abs(Math.sin(wavePhase + i * 0.9))),
  );

  // Pulse ring (expands outward)
  const pulseScale = 1 + 0.3 * Math.abs(Math.sin(frame * 0.18));

  // Send animation
  const sendX = isSending ? e(frame, [sendAtFrame, sendAtFrame + 20], [0, 60]) : 0;
  const sendOpacity = isSending ? e(frame, [sendAtFrame + 14, sendAtFrame + 24], [1, 0]) : 1;

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}
    >
      {/* Caption above */}
      <div
        style={{
          fontFamily: fonts.heading,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: colors.whiteMuted,
          opacity: e(frame, [0, 16], [0, 1]),
        }}
      >
        Голосове повідомлення до броні
      </div>

      {/* Idle mic hint (before recording) */}
      {!isRecording && !isSending && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `1.5px solid ${colors.whiteFaint}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: idleOpacity,
            color: colors.whiteMuted,
          }}
        >
          <MicIcon size={32} />
        </div>
      )}

      {/* Recording pill */}
      {(isRecording || isSending) && (
        <div
          style={{
            transform: `scale(${containerScale}) translateX(${sendX}px)`,
            opacity: containerOpacity * sendOpacity,
            position: "relative",
          }}
        >
          {/* Pulse ring */}
          <div
            style={{
              position: "absolute",
              inset: -18,
              borderRadius: "50%",
              border: `1.5px solid ${colors.teal}`,
              transform: `scale(${pulseScale})`,
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 22px 12px 16px",
              borderRadius: 999,
              background: `rgba(92,200,189,0.12)`,
              border: `1px solid ${colors.teal}`,
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Red recording dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 10px rgba(239,68,68,0.7)",
              }}
            />

            {/* Timer */}
            <span
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: 16,
                color: "#fff",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.05em",
                minWidth: 32,
              }}
            >
              {timerStr}
            </span>

            {/* Waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: Math.round(h * 28),
                    borderRadius: 2,
                    background: colors.teal,
                    alignSelf: "center",
                  }}
                />
              ))}
            </div>

            {/* Stop square */}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                background: colors.teal,
                marginLeft: 4,
              }}
            />
          </div>
        </div>
      )}

      {/* Send label after stop */}
      {isSending && (
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.teal,
            opacity: e(frame, [sendAtFrame, sendAtFrame + 12], [0, 1]),
            letterSpacing: "0.1em",
          }}
        >
          Надіслано ✓
        </div>
      )}
    </AbsoluteFill>
  );
};

const MicIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="9" y1="22" x2="15" y2="22" />
  </svg>
);
