import { z } from "zod";

export const VogelBentoSchema = z.object({
  website: z.string(),
  phone: z.string(),
  managerName: z.string(),
  withAudio: z.boolean(),
});

export type VogelBentoProps = z.infer<typeof VogelBentoSchema>;

export const defaultVogelBentoProps: VogelBentoProps = {
  website: "www.vogel.travel",
  phone: "+38 050 469 2882",
  managerName: "Вікторія",
  withAudio: false,
};
