import React from "react";
import { useCurrentFrame } from "remotion";

type TypewriterProps = {
  text: string;
  /** Frame at which the first character appears (local to parent Sequence). */
  startFrame?: number;
  /** Characters per second. */
  cps?: number;
  /** Show a blinking caret at the end. */
  caret?: boolean;
  /** Caret color (CSS). Defaults to currentColor. */
  caretColor?: string;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * String-slicing typewriter — per the `text-animations` rule, never use
 * per-character opacity. A character is either fully visible or not shown.
 */
export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  startFrame = 0,
  cps = 30,
  caret = false,
  caretColor,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const fps = 30; // compositions use 30 fps (kept as literal so component works outside useVideoConfig)
  const charsShown = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - startFrame) * (cps / fps))),
  );
  const visible = text.slice(0, charsShown);
  const blink = caret && Math.floor(frame / 15) % 2 === 0;

  return (
    <span style={style} className={className}>
      {visible}
      {caret ? (
        <span
          style={{
            display: "inline-block",
            width: "0.1em",
            height: "1em",
            marginLeft: "0.08em",
            verticalAlign: "-0.12em",
            background: caretColor ?? "currentColor",
            opacity: blink ? 1 : 0,
          }}
        />
      ) : null}
    </span>
  );
};
