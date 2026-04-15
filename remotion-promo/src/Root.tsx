import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { VogelPromo30 } from "./compositions/vogel-promo-30";
import {
  VogelPromoSchema,
  defaultVogelPromoProps,
} from "./compositions/vogel-promo-30/schema";
import { TIMELINE } from "./compositions/vogel-promo-30/timeline";
import { waitForFonts } from "./theme/fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Vogel">
      <Composition
        id="vogel-promo-30"
        component={VogelPromo30}
        durationInFrames={TIMELINE.total}
        fps={TIMELINE.fps}
        width={1920}
        height={1080}
        schema={VogelPromoSchema}
        defaultProps={defaultVogelPromoProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />
    </Folder>
  );
};
