import { z } from "zod";

export const VogelTiktokPasSchema = z.object({
  website: z.string(),
  phone: z.string(),
  managerName: z.string(),
  withAudio: z.boolean(),
  problemHours: z.number(),
  ctaPrimary: z.string(),
});

export type VogelTiktokPasProps = z.infer<typeof VogelTiktokPasSchema>;

export const defaultVogelTiktokPasProps: VogelTiktokPasProps = {
  website: "www.vogel.travel",
  phone: "+38 050 469 2882",
  managerName: "Вікторія",
  withAudio: false,
  problemHours: 47,
  ctaPrimary: "Пиши Вікторії",
};
