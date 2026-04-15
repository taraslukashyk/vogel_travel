import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, START } from "./timeline";
import type { VogelPromoProps } from "./schema";

import { HookAerial } from "./scenes/01-HookAerial";
import { BrandReveal } from "./scenes/02-BrandReveal";
import { HeroShowcase } from "./scenes/03-HeroShowcase";
import { FormTyping } from "./scenes/04-FormTyping";
import { InvoiceModal } from "./scenes/05-InvoiceModal";
import { Stopwatch } from "./scenes/06-Stopwatch";
import { PhoneSms } from "./scenes/07-PhoneSms";
import { EndCard } from "./scenes/08-EndCard";

import { SoundBed } from "../../components/audio/SoundBed";

/**
 * Top-level composition for the 30-second Vogel Travel promo.
 *
 * Scenes are placed with absolute `<Sequence>` offsets from the `START`
 * table (derived from `TIMELINE`). Each scene fades its own content in/out
 * internally, so we do not use `<TransitionSeries>` — this keeps the global
 * frame math simple and lets audio cues align with exact scene boundaries.
 */
export const VogelPromo30: React.FC<VogelPromoProps> = ({
  website,
  phone,
  managerName,
  withAudio,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={START.hook} durationInFrames={TIMELINE.scenes.hook} layout="none">
        <HookAerial />
      </Sequence>

      <Sequence from={START.brand} durationInFrames={TIMELINE.scenes.brand} layout="none">
        <BrandReveal />
      </Sequence>

      <Sequence from={START.hero} durationInFrames={TIMELINE.scenes.hero} layout="none">
        <HeroShowcase website={website} />
      </Sequence>

      <Sequence from={START.form} durationInFrames={TIMELINE.scenes.form} layout="none">
        <FormTyping />
      </Sequence>

      <Sequence
        from={START.invoice}
        durationInFrames={TIMELINE.scenes.invoice}
        layout="none"
      >
        <InvoiceModal phone={phone} />
      </Sequence>

      <Sequence
        from={START.stopwatch}
        durationInFrames={TIMELINE.scenes.stopwatch}
        layout="none"
      >
        <Stopwatch />
      </Sequence>

      <Sequence from={START.phone} durationInFrames={TIMELINE.scenes.phone} layout="none">
        <PhoneSms managerName={managerName} />
      </Sequence>

      <Sequence from={START.end} durationInFrames={TIMELINE.scenes.end} layout="none">
        <EndCard website={website} phone={phone} />
      </Sequence>

      {/* Audio layer — optional until files are dropped in public/audio/ */}
      <SoundBed
        enabled={withAudio}
        musicVolume={0.5}
        duckAt={START.phone}
        cues={{
          whoosh1: START.brand,
          whoosh2: START.stopwatch,
          key: START.form + 20,
          click1: START.hero + 70,
          click2: START.invoice + 72,
          chime: START.phone + 28,
        }}
      />
    </AbsoluteFill>
  );
};
