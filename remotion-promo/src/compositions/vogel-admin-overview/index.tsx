import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { AdminOverviewProps } from "./schema";

import { LoginReveal } from "./scenes/01-LoginReveal";
import { DashboardOverview } from "./scenes/02-DashboardOverview";
import { EditingScene } from "./scenes/03-EditingScene";
import { SuccessOutro } from "./scenes/04-SuccessOutro";

import { SoundBed } from "../../components/audio/SoundBed";

export const VogelAdminOverview: React.FC<AdminOverviewProps> = ({
  withAudio,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={START.login} durationInFrames={TIMELINE.scenes.login} layout="none">
        <LoginReveal />
      </Sequence>

      <Sequence from={START.dashboard} durationInFrames={TIMELINE.scenes.dashboard} layout="none">
        <DashboardOverview />
      </Sequence>

      <Sequence from={START.editing} durationInFrames={TIMELINE.scenes.editing} layout="none">
        <EditingScene />
      </Sequence>

      <Sequence from={START.outro} durationInFrames={TIMELINE.scenes.outro} layout="none">
        <SuccessOutro />
      </Sequence>

      <SoundBed
        enabled={withAudio}
        musicVolume={0.5}
        cues={{
          whoosh1: START.dashboard,
          whoosh2: START.editing,
          chime: START.outro + 10,
        }}
      />
    </AbsoluteFill>
  );
};
