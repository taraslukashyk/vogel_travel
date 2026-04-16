import React from "react";
import { useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";
import { BrowserChrome } from "./BrowserChrome";

type IsometricBrowserProps = {
  url: string;
  children: React.ReactNode;
  /** Initial tilt around X axis (deg). Default 22. */
  tiltX?: number;
  /** Initial tilt around Y axis (deg). Default -28. */
  tiltY?: number;
  /** Initial scale. Default 0.78. */
  initialScale?: number;
  /** Frame at which the browser is fully flat (0 tilt, scale 1). Default 80. */
  flatAtFrame?: number;
  width?: number;
  height?: number;
};

/**
 * BrowserChrome wrapped in a CSS 3D perspective transform.
 * Starts in isometric view and eases to flat by `flatAtFrame`.
 *
 * Uses useCurrentFrame() internally, so just place it inside a Sequence.
 */
export const IsometricBrowser: React.FC<IsometricBrowserProps> = ({
  url,
  children,
  tiltX = 22,
  tiltY = -28,
  initialScale = 0.78,
  flatAtFrame = 80,
  width = 1480,
  height = 820,
}) => {
  const frame = useCurrentFrame();

  const curTiltX = e(frame, [0, flatAtFrame], [tiltX, 0], "enter");
  const curTiltY = e(frame, [0, flatAtFrame], [tiltY, 0], "enter");
  const curScale = e(frame, [0, flatAtFrame], [initialScale, 1], "enter");
  const opacity = e(frame, [0, 16], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `perspective(2200px) rotateX(${curTiltX}deg) rotateY(${curTiltY}deg) scale(${curScale})`,
        transformOrigin: "center center",
        // Subtle shadow that fades as perspective straightens
        filter: `drop-shadow(0 ${40 + curTiltX * 2}px ${80 + curTiltX * 3}px rgba(0,0,0,${0.3 + curTiltX / 100}))`,
      }}
    >
      <BrowserChrome url={url} width={width} height={height}>
        {children}
      </BrowserChrome>
    </div>
  );
};
