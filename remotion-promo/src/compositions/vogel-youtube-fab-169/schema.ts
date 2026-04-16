import { z } from "zod";

export const VogelYoutubeFabSchema = z.object({
  website: z.string(),
  phone: z.string(),
  managerName: z.string(),
  withAudio: z.boolean(),
  kpi: z.object({
    conversion: z.number(),
    speedX: z.number(),
    timeSaved: z.number(),
  }),
  ctaLabel: z.string(),
});

export type VogelYoutubeFabProps = z.infer<typeof VogelYoutubeFabSchema>;

export const defaultVogelYoutubeFabProps: VogelYoutubeFabProps = {
  website: "vogel.travel",
  phone: "+38 050 469 2882",
  managerName: "Вікторія",
  withAudio: false,
  kpi: {
    conversion: 40,
    speedX: 3,
    timeSaved: 12,
  },
  ctaLabel: "Запит демо",
};
