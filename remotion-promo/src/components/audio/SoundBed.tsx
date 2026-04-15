import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, useVideoConfig, interpolate } from "remotion";
import { assets } from "../../lib/staticPath";

type SoundBedProps = {
  /** When false, SoundBed renders nothing — useful before audio files are dropped in. */
  enabled?: boolean;
  /** Background music volume 0-1. */
  musicVolume?: number;
  /** Frame (global) at which music starts its soft duck. */
  duckAt?: number;
  /** Per-SFX cue frames. Omit any to disable that cue. */
  cues?: Partial<{
    whoosh1: number;
    whoosh2: number;
    key: number;
    click1: number;
    click2: number;
    chime: number;
  }>;
};

/**
 * Composer of music + SFX tracks. Safe to render with `enabled={false}` before
 * audio files are provided in `public/audio/`.
 */
export const SoundBed: React.FC<SoundBedProps> = ({
  enabled = false,
  musicVolume = 0.5,
  duckAt,
  cues = {},
}) => {
  const { fps } = useVideoConfig();
  if (!enabled) return null;

  return (
    <>
      <Audio
        src={assets.audio.music}
        volume={(f) => {
          if (duckAt == null) return musicVolume;
          const duckLocal = duckAt; // music starts at 0, so global=local
          return interpolate(
            f,
            [duckLocal, duckLocal + fps * 0.8],
            [musicVolume, musicVolume * 0.45],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
        }}
      />
      {cues.whoosh1 != null ? (
        <Sequence from={cues.whoosh1} layout="none">
          <Audio src={assets.audio.sfx.whoosh} volume={0.7} />
        </Sequence>
      ) : null}
      {cues.whoosh2 != null ? (
        <Sequence from={cues.whoosh2} layout="none">
          <Audio src={assets.audio.sfx.whoosh} volume={0.7} />
        </Sequence>
      ) : null}
      {cues.key != null ? (
        <Sequence from={cues.key} layout="none">
          <Audio src={assets.audio.sfx.key} volume={0.5} />
        </Sequence>
      ) : null}
      {cues.click1 != null ? (
        <Sequence from={cues.click1} layout="none">
          <Audio src={assets.audio.sfx.click} volume={0.65} />
        </Sequence>
      ) : null}
      {cues.click2 != null ? (
        <Sequence from={cues.click2} layout="none">
          <Audio src={assets.audio.sfx.click} volume={0.65} />
        </Sequence>
      ) : null}
      {cues.chime != null ? (
        <Sequence from={cues.chime} layout="none">
          <Audio src={assets.audio.sfx.smsChime} volume={0.8} />
        </Sequence>
      ) : null}
    </>
  );
};
