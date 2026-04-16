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

import { VogelAdminPromo } from "./compositions/vogel-admin-promo-916";
import {
  VogelAdminPromoSchema,
  defaultVogelAdminPromoProps,
} from "./compositions/vogel-admin-promo-916/schema";
import { TIMELINE as ADMIN_916_TIMELINE } from "./compositions/vogel-admin-promo-916/timeline";

import { VogelTiktokPas } from "./compositions/vogel-tiktok-pas-916";
import { VogelTiktokPasSchema, defaultVogelTiktokPasProps } from "./compositions/vogel-tiktok-pas-916/schema";

import { VogelTiktokAida } from "./compositions/vogel-tiktok-aida-916";
import { VogelTiktokAidaSchema, defaultVogelTiktokAidaProps } from "./compositions/vogel-tiktok-aida-916/schema";

import { VogelYoutubeFab } from "./compositions/vogel-youtube-fab-169";
import { VogelYoutubeFabSchema, defaultVogelYoutubeFabProps } from "./compositions/vogel-youtube-fab-169/schema";

import { VogelYoutubeAida } from "./compositions/vogel-youtube-aida-169";
import { VogelYoutubeAidaSchema, defaultVogelYoutubeAidaProps } from "./compositions/vogel-youtube-aida-169/schema";

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

      {/* ── Ролик 5: Admin Panel Promo Vertical (9:16) ─────────────────── */}
      <Composition
        id="vogel-admin-promo-916"
        component={VogelAdminPromo}
        durationInFrames={ADMIN_916_TIMELINE.total}
        fps={ADMIN_916_TIMELINE.fps}
        width={1080}
        height={1920}
        schema={VogelAdminPromoSchema}
        defaultProps={defaultVogelAdminPromoProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />

      {/* ── Нові Ролики: Маркетингові сценарії ─────────────────── */}
      <Composition
        id="vogel-tiktok-pas-916"
        component={VogelTiktokPas}
        durationInFrames={900}
        fps={60}
        width={1080}
        height={1920}
        schema={VogelTiktokPasSchema}
        defaultProps={defaultVogelTiktokPasProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />
      <Composition
        id="vogel-tiktok-aida-916"
        component={VogelTiktokAida}
        durationInFrames={720}
        fps={60}
        width={1080}
        height={1920}
        schema={VogelTiktokAidaSchema}
        defaultProps={defaultVogelTiktokAidaProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />
      <Composition
        id="vogel-youtube-fab-169"
        component={VogelYoutubeFab}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
        schema={VogelYoutubeFabSchema}
        defaultProps={defaultVogelYoutubeFabProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />
      <Composition
        id="vogel-youtube-aida-169"
        component={VogelYoutubeAida}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
        schema={VogelYoutubeAidaSchema}
        defaultProps={defaultVogelYoutubeAidaProps}
        calculateMetadata={async ({ props }) => {
          await waitForFonts();
          return { props };
        }}
      />
    </Folder>
  );
};
