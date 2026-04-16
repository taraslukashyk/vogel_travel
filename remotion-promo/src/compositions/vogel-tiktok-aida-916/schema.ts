import { z } from "zod";

export const VogelTiktokAidaSchema = z.object({
  website: z.string(),
  phone: z.string(),
  managerName: z.string(),
  withAudio: z.boolean(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});

export type VogelTiktokAidaProps = z.infer<typeof VogelTiktokAidaSchema>;

export const defaultVogelTiktokAidaProps: VogelTiktokAidaProps = {
  website: "www.vogel.travel",
  phone: "+38 050 469 2882",
  managerName: "Вікторія",
  withAudio: false,
  ctaPrimary: "vogel.travel",
  ctaSecondary: "Посилання у профілі",
};
