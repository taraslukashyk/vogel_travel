import React from "react";
import { useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";

type ModalProps = {
  children: React.ReactNode;
  /** Frame the modal starts to enter (local). */
  enterAt: number;
  /** Enter duration in frames. */
  enterDuration?: number;
  width?: number | string;
  style?: React.CSSProperties;
};

/**
 * Centered modal with backdrop-blur, scale-up entrance.
 * Matches the ContactModal behaviour from the main Vogel site.
 */
export const Modal: React.FC<ModalProps> = ({
  children,
  enterAt,
  enterDuration = 18,
  width = 560,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = e(frame, [enterAt, enterAt + enterDuration], [0, 1], "modal");
  const backdropAlpha = p * 0.6;
  const blurPx = p * 6;
  const scaleY = 0.1 + 0.9 * p;
  const scaleX = 0.9 + 0.1 * p;
  const translateY = (1 - p) * -16;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${backdropAlpha})`,
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
        }}
      />
      {/* Dialog */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width,
          transformOrigin: "top center",
          transform: `translate(-50%, -50%) translateY(${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`,
          opacity: p,
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
};
