import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { VogelTiktokPasProps } from "./schema";

import { ProblemScene } from "./scenes/01-Problem";
import { AgitationScene } from "./scenes/02-Agitation";
import { SolutionScene } from "./scenes/03-Solution";
import { CTAScene } from "./scenes/04-CTA";

import { SoundBed } from "../../components/audio/SoundBed";

export const VogelTiktokPas: React.FC<VogelTiktokPasProps> = ({
  website,
  phone,
  managerName,
  withAudio,
  problemHours,
  ctaPrimary,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence
        from={START.problem}
        durationInFrames={TIMELINE.scenes.problem}
        layout="none"
      >
        <ProblemScene />
      </Sequence>

      <Sequence
        from={START.agitation}
        durationInFrames={TIMELINE.scenes.agitation}
        layout="none"
      >
        <AgitationScene problemHours={problemHours} />
      </Sequence>

      <Sequence
        from={START.solution}
        durationInFrames={TIMELINE.scenes.solution}
        layout="none"
      >
        <SolutionScene />
      </Sequence>

      <Sequence
        from={START.cta}
        durationInFrames={TIMELINE.scenes.cta}
        layout="none"
      >
        <CTAScene
          website={website}
          phone={phone}
          managerName={managerName}
          ctaPrimary={ctaPrimary}
        />
      </Sequence>

      <SoundBed
        enabled={withAudio}
        musicVolume={0.4}
        duckAt={START.agitation + 60}
        cues={{
          whoosh1: START.problem,
          whoosh2: START.solution,
          chime: START.solution + 20,
          click1: START.cta,
        }}
      />
    </AbsoluteFill>
  );
};
