import { z } from "zod";
export const VogelYoutubeAidaSchema = z.object({ title: z.string().optional() });
export const defaultVogelYoutubeAidaProps = { title: "vogel-youtube-aida-169" };
