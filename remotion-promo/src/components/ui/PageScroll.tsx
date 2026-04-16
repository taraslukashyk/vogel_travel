import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";

type PageScrollProps = {
  /** Path from staticFile(), e.g. assets.image.screenshots.homeFull */
  src: string;
  /** Total pixel height of the full-page screenshot image. */
  imageHeight: number;
  /** Visible viewport height (matches BrowserChrome inner area). Default 820. */
  viewHeight?: number;
  /** Viewport width. Default 1480. */
  viewWidth?: number;
  /** Frame (local) at which scrolling starts. */
  startFrame: number;
  /** How many frames the scroll takes. */
  durationFrames: number;
  /** Easing preset or omit for linear. */
  easing?: "editorial" | "enter" | "pop" | "exit";
};

/**
 * Simulates a page scroll by translating a full-page screenshot vertically
 * inside a clipped container. Drop directly inside BrowserChrome children.
 */
export const PageScroll: React.FC<PageScrollProps> = ({
  src,
  imageHeight,
  viewHeight = 820,
  viewWidth = 1480,
  startFrame,
  durationFrames,
  easing = "editorial",
}) => {
  const frame = useCurrentFrame();
  const maxScroll = imageHeight - viewHeight;
  const endFrame = startFrame + durationFrames;

  const scrollY = e(
    frame,
    [startFrame, endFrame],
    [0, -Math.max(0, maxScroll)],
    easing,
  );

  return (
    <div
      style={{
        width: viewWidth,
        height: viewHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Img
        src={src}
        style={{
          width: viewWidth,
          height: imageHeight,
          objectFit: "cover",
          objectPosition: "top left",
          display: "block",
          transform: `translateY(${scrollY}px)`,
        }}
      />
    </div>
  );
};
