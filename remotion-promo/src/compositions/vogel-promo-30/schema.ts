import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const VogelPromoSchema = z.object({
  /** Display locale; some copy is conditional on this. */
  locale: z.enum(["ua", "en"]),
  /** Brand accent color — defaults to Vogel teal `#5cc8bd`. */
  accent: zColor(),
  /** Website URL shown in browser chrome and end card. */
  website: z.string(),
  /** Phone number shown in end card and invoice modal. */
  phone: z.string(),
  /** Manager name used in the SMS scene. */
  managerName: z.string(),
  /** Enable audio tracks — default off until files are in `public/audio/`. */
  withAudio: z.boolean(),
});

export type VogelPromoProps = z.infer<typeof VogelPromoSchema>;

export const defaultVogelPromoProps: VogelPromoProps = {
  locale: "ua",
  accent: "#5cc8bd",
  website: "www.vogel.travel",
  phone: "+38 050 469 2882",
  managerName: "Vogel Travel",
  withAudio: false,
};
