import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { VogelTiktokAidaProps } from "./schema";

import { AttentionScene } from "./scenes/01-Attention";
import { InterestScene } from "./scenes/02-Interest";
import { DesireScene } from "./scenes/03-Desire";
import { ActionScene } from "./scenes/04-Action";

import { SoundBed } from "../../components/audio/SoundBed";

export const VogelTiktokAida: React.FC<VogelTiktokAidaProps> = ({
  website,
  ctaSecondary,
  withAudio,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence
        from={START.attention}
        durationInFrames={TIMELINE.scenes.attention}
        layout="none"
      >
        <AttentionScene />
      </Sequence>

      <Sequence
        from={START.interest}
        durationInFrames={TIMELINE.scenes.interest}
        layout="none"
      >
        <InterestScene />
      </Sequence>

      <Sequence
        from={START.desire}
        durationInFrames={TIMELINE.scenes.desire}
        layout="none"
      >
        <DesireScene />
      </Sequence>

      <Sequence
        from={START.action}
        durationInFrames={TIMELINE.scenes.action}
        layout="none"
      >
        <ActionScene website={website} ctaSecondary={ctaSecondary} />
      </Sequence>

      <SoundBed
        enabled={withAudio}
        musicVolume={0.45}
        cues={{
          whoosh1: START.attention,
          click1: START.interest + 80,
          chime: START.desire + 200,
          whoosh2: START.action,
        }}
      />
    </AbsoluteFill>
  );
};
