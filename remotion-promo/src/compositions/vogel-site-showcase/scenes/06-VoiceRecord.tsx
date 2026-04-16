import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { colors } from "../../../theme/colors";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { MicRecorder } from "../../../components/ui/MicRecorder";
import { RippleClick } from "../../../components/effects/RippleClick";

type Props = { website: string };

/**
 * Scene 6 — 0..90 (3s) — Voice Recording.
 * Dimmed form page. Cursor finds the mic icon, clicks it.
 * MicRecorder shows recording state: pulse + timer + waveform.
 * Stop → send animation with teal confirmation.
 */
export const VoiceRecord: React.FC<Props> = ({ website }) => {
  const frame = useCurrentFrame();

  const MIC_CLICK = 16;
  const SEND_AT = 70;

  const sceneOpacity = e(frame, [0, 12], [0, 1]);
  const sceneFade = e(frame, [78, 90], [1, 0], "exit");

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(sceneOpacity, sceneFade),
      }}
    >
      <BrowserChrome
        url={`${website}/ua/offers/four-seasons-seychelles`}
        width={1480}
        height={820}
      >
        {/* Very dark form screenshot as context */}
        <AbsoluteFill>
          <Img
            src={assets.image.screenshots.formEmpty}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              opacity: 0.08,
            }}
          />
        </AbsoluteFill>

        {/* Dark overlay */}
        <AbsoluteFill
          style={{ background: "rgba(2,8,7,0.88)" }}
        />

        {/* Mic recorder centred in the content area */}
        <AbsoluteFill>
          <MicRecorder
            startFrame={MIC_CLICK + 2}
            duration={SEND_AT - MIC_CLICK - 2}
            sendAtFrame={SEND_AT}
          />
        </AbsoluteFill>

        {/* Teal glow behind recorder */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${colors.glow} 0%, transparent 65%)`,
            filter: "blur(40px)",
            opacity: e(frame, [MIC_CLICK, MIC_CLICK + 20, SEND_AT + 10], [0, 0.5, 0]),
            pointerEvents: "none",
          }}
        />
      </BrowserChrome>

      {/* Cursor: drift in → click mic */}
      <AnimatedCursor
        keyframes={[
          { frame: 0, x: 1400, y: 750 },
          { frame: MIC_CLICK - 4, x: 960, y: 690 },
          { frame: MIC_CLICK, x: 960, y: 690, click: true },
          { frame: SEND_AT - 4, x: 1080, y: 690 },
          { frame: SEND_AT, x: 1080, y: 690, click: true },
        ]}
      />

      <RippleClick
        atFrame={MIC_CLICK}
        x={960}
        y={690}
        radius={60}
        durationFrames={14}
        color={colors.teal}
      />
    </AbsoluteFill>
  );
};
