import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { VogelYoutubeFabProps } from "./schema";

import { FeaturesScene } from "./scenes/01-Features";
import { AdvantagesScene } from "./scenes/02-Advantages";
import { BenefitsScene } from "./scenes/03-Benefits";
import { CTAScene } from "./scenes/04-CTA";

import { SoundBed } from "../../components/audio/SoundBed";

export const VogelYoutubeFab: React.FC<VogelYoutubeFabProps> = ({
  website,
  phone,
  withAudio,
  kpi,
  ctaLabel,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence
        from={START.features}
        durationInFrames={TIMELINE.scenes.features}
        layout="none"
      >
        <FeaturesScene />
      </Sequence>

      <Sequence
        from={START.advantages}
        durationInFrames={TIMELINE.scenes.advantages}
        layout="none"
      >
        <AdvantagesScene />
      </Sequence>

      <Sequence
        from={START.benefits}
        durationInFrames={TIMELINE.scenes.benefits}
        layout="none"
      >
        <BenefitsScene kpi={kpi} />
      </Sequence>

      <Sequence
        from={START.cta}
        durationInFrames={TIMELINE.scenes.cta}
        layout="none"
      >
        <CTAScene website={website} phone={phone} ctaLabel={ctaLabel} />
      </Sequence>

      <SoundBed
        enabled={withAudio}
        musicVolume={0.45}
        cues={{
          whoosh1: START.features,
          click1: START.advantages + 60,
          chime: START.benefits + 100,
          whoosh2: START.cta,
        }}
      />
    </AbsoluteFill>
  );
};
