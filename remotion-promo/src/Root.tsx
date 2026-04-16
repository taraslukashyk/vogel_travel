import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";

import { VogelPromo30 } from "./compositions/vogel-promo-30";
import {
  VogelPromoSchema,
  defaultVogelPromoProps,
} from "./compositions/vogel-promo-30/schema";
import { TIMELINE } from "./compositions/vogel-promo-30/timeline";

import { VogelSiteShowcase } from "./compositions/vogel-site-showcase";
import {
  ShowcaseSchema,
  defaultShowcaseProps,
} from "./compositions/vogel-site-showcase/schema";
import { TIMELINE as SHOWCASE_TIMELINE } from "./compositions/vogel-site-showcase/timeline";

import { VogelBento916 } from "./compositions/vogel-bento-916";
import {
  VogelBentoSchema,
  defaultVogelBentoProps,
} from "./compositions/vogel-bento-916/schema";
import { TIMELINE as BENTO_TIMELINE } from "./compositions/vogel-bento-916/timeline";

import { VogelAdminOverview } from "./compositions/vogel-admin-overview";
import {
  AdminOverviewSchema,
  defaultAdminOverviewProps,
} from "./compositions/vogel-admin-overview/schema";
import { TIMELINE as ADMIN_TIMELINE } from "./compositions/vogel-admin-overview/timeline";

import { waitForFonts } from "./theme/fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Vogel">
      {/* ── Ролик 1: 30-секундне кінематографічне промо ─────────────────── */}
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

      {/* ── Ролик 2: UX-демо реального сайту ────────────────────────────── */}
      <Composition
        id="vogel-site-showcase"
        component={VogelSiteShowcase}
        durationInFrames={SHOWCASE_TIMELINE.total}
        fps={SHOWCASE_TIMELINE.fps}
        width={1920}
        height={1080}
        schema={ShowcaseSchema}
        defaultProps={defaultShowcaseProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />

      {/* ── Ролик 3: Vertical Bento Promo (9:16) ────────────────────────── */}
      <Composition
        id="vogel-bento-916"
        component={VogelBento916}
        durationInFrames={BENTO_TIMELINE.total}
        fps={BENTO_TIMELINE.fps}
        width={1080}
        height={1920}
        schema={VogelBentoSchema}
        defaultProps={defaultVogelBentoProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />

      {/* ── Ролик 4: Admin Panel Overview ──────────────────────────────── */}
      <Composition
        id="vogel-admin-overview"
        component={VogelAdminOverview}
        durationInFrames={ADMIN_TIMELINE.total}
        fps={ADMIN_TIMELINE.fps}
        width={1920}
        height={1080}
        schema={AdminOverviewSchema}
        defaultProps={defaultAdminOverviewProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />
    </Folder>
  );
};
