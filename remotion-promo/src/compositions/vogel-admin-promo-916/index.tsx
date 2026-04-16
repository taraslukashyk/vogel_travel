import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { VogelAdminPromoProps } from "./schema";

import { IntroScene } from "./scenes/01-Intro";
import { LoginScene } from "./scenes/Login";
import { NavScene } from "./scenes/02-Navigation";
import { ListScene } from "./scenes/List";
import { EditorScene } from "./scenes/03-Offers";
import { SectionsScene } from "./scenes/Sections";
import { SEOScene } from "./scenes/04-Features";
import { ServicesScene } from "./scenes/Services";
import { PartnersScene } from "./scenes/Partners";
import { AnalyticsScene } from "./scenes/Analytics";
import { SettingsScene } from "./scenes/Settings";
import { OutroScene } from "./scenes/05-Outro";

import { DynamicBackground } from "./scenes/Background";

import { SoundBed } from "../../components/audio/SoundBed";

export const VogelAdminPromo: React.FC<VogelAdminPromoProps> = ({
  withAudio,
  ...props
}) => {
  return (
    <AbsoluteFill>
      <DynamicBackground />
      <Sequence from={START.intro} durationInFrames={TIMELINE.scenes.intro.duration} layout="none">
        <IntroScene title={props.title} subtitle={props.subtitle} />
      </Sequence>

      <Sequence from={START.login} durationInFrames={TIMELINE.scenes.login.duration} layout="none">
        <LoginScene />
      </Sequence>

      <Sequence from={START.navigation} durationInFrames={TIMELINE.scenes.navigation.duration} layout="none">
        <NavScene sections={props.sections} />
      </Sequence>

      <Sequence from={START.list} durationInFrames={TIMELINE.scenes.list.duration} layout="none">
        <ListScene />
      </Sequence>

      <Sequence from={START.editor} durationInFrames={TIMELINE.scenes.editor.duration} layout="none">
        <EditorScene />
      </Sequence>

      <Sequence from={START.sections} durationInFrames={TIMELINE.scenes.sections.duration} layout="none">
        <SectionsScene />
      </Sequence>

      <Sequence from={START.seo} durationInFrames={TIMELINE.scenes.seo.duration} layout="none">
        <SEOScene />
      </Sequence>

      <Sequence from={START.services} durationInFrames={TIMELINE.scenes.services.duration} layout="none">
        <ServicesScene />
      </Sequence>

      <Sequence from={START.partners} durationInFrames={TIMELINE.scenes.partners.duration} layout="none">
        <PartnersScene />
      </Sequence>

      <Sequence from={START.analytics} durationInFrames={TIMELINE.scenes.analytics.duration} layout="none">
        <AnalyticsScene />
      </Sequence>

      <Sequence from={START.settings} durationInFrames={TIMELINE.scenes.settings.duration} layout="none">
        <SettingsScene />
      </Sequence>

      <Sequence from={START.outro} durationInFrames={TIMELINE.scenes.outro.duration} layout="none">
        <OutroScene url={props.url} />
      </Sequence>

      <SoundBed
        enabled={withAudio}
        musicVolume={0.6}
        cues={{
          whoosh: START.navigation,
          pop: START.list,
          shimmer: START.seo,
          logo_reveal: START.outro + 15,
        }}
      />
    </AbsoluteFill>
  );
};
