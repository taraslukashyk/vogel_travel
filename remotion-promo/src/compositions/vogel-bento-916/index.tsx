import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { VogelBentoProps } from "./schema";

import { IntroScene } from "./scenes/01-Intro";
import { VoiceSearchScene } from "./scenes/02-VoiceSearch";
import { MobileShowcaseScene } from "./scenes/03-MobileShowcase";
import { TrustGridScene } from "./scenes/04-TrustGrid";
import { OutroScene } from "./scenes/05-Outro";

import { SoundBed } from "../../components/audio/SoundBed";

export const VogelBento916: React.FC<VogelBentoProps> = ({
  website,
  withAudio,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={START.intro} durationInFrames={TIMELINE.scenes.intro} layout="none">
        <IntroScene />
      </Sequence>

      <Sequence from={START.voiceSearch} durationInFrames={TIMELINE.scenes.voiceSearch} layout="none">
        <VoiceSearchScene />
      </Sequence>

      <Sequence from={START.mobileShowcase} durationInFrames={TIMELINE.scenes.mobileShowcase} layout="none">
        <MobileShowcaseScene />
      </Sequence>

      <Sequence from={START.trustGrid} durationInFrames={TIMELINE.scenes.trustGrid} layout="none">
        <TrustGridScene />
      </Sequence>

      <Sequence from={START.outro} durationInFrames={TIMELINE.scenes.outro} layout="none">
        <OutroScene website={website} />
      </Sequence>

      {/* Audio Layer */}
      <SoundBed
        enabled={withAudio}
        musicVolume={0.5}
        cues={{
          whoosh1: START.voiceSearch,
          click1: START.mobileShowcase + 80,
          chime: START.outro,
        }}
      />
    </AbsoluteFill>
  );
};
