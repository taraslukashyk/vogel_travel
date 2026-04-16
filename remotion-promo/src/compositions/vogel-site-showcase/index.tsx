import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { ShowcaseProps } from "./schema";

import { IsometricReveal } from "./scenes/01-IsometricReveal";
import { HomeScroll } from "./scenes/02-HomeScroll";
import { OffersPage } from "./scenes/03-OffersPage";
import { OfferDetail } from "./scenes/04-OfferDetail";
import { FormFilling } from "./scenes/05-FormFilling";
import { VoiceRecord } from "./scenes/06-VoiceRecord";
import { SuccessEnd } from "./scenes/07-SuccessEnd";

import { SoundBed } from "../../components/audio/SoundBed";

/**
 * vogel-site-showcase — 30-second real-site UX demo.
 * Shows the actual Vogel Travel website via fullpage screenshots:
 * isometric reveal → homepage scroll → /offers → offer detail →
 * booking form fill → voice record → success + logo.
 */
export const VogelSiteShowcase: React.FC<ShowcaseProps> = ({
  website,
  phone,
  withAudio,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={START.intro} durationInFrames={TIMELINE.scenes.intro} layout="none">
        <IsometricReveal website={website} />
      </Sequence>

      <Sequence from={START.home} durationInFrames={TIMELINE.scenes.home} layout="none">
        <HomeScroll website={website} />
      </Sequence>

      <Sequence from={START.offers} durationInFrames={TIMELINE.scenes.offers} layout="none">
        <OffersPage website={website} />
      </Sequence>

      <Sequence from={START.detail} durationInFrames={TIMELINE.scenes.detail} layout="none">
        <OfferDetail website={website} />
      </Sequence>

      <Sequence from={START.form} durationInFrames={TIMELINE.scenes.form} layout="none">
        <FormFilling website={website} phone={phone} />
      </Sequence>

      <Sequence from={START.voice} durationInFrames={TIMELINE.scenes.voice} layout="none">
        <VoiceRecord website={website} />
      </Sequence>

      <Sequence from={START.success} durationInFrames={TIMELINE.scenes.success} layout="none">
        <SuccessEnd website={website} />
      </Sequence>

      <SoundBed
        enabled={withAudio}
        musicVolume={0.45}
        duckAt={START.voice}
        cues={{
          whoosh1: START.home,
          whoosh2: START.offers,
          click1: START.detail + 98,
          click2: START.form + 170,
          chime: START.voice + 16,
        }}
      />
    </AbsoluteFill>
  );
};
