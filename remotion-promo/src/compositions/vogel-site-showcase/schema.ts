import { z } from "zod";

export const ShowcaseSchema = z.object({
  /** Website displayed in browser URL bar. */
  website: z.string(),
  /** Phone shown in the booking form. */
  phone: z.string(),
  /** Enable audio tracks — off until files land in public/audio/. */
  withAudio: z.boolean(),
});

export type ShowcaseProps = z.infer<typeof ShowcaseSchema>;

export const defaultShowcaseProps: ShowcaseProps = {
  website: "www.vogel.travel",
  phone: "+38 050 469 2882",
  withAudio: false,
};
