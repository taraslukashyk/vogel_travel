import { z } from "zod";

export const AdminOverviewSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  withAudio: z.boolean(),
});

export type AdminOverviewProps = z.infer<typeof AdminOverviewSchema>;

export const defaultAdminOverviewProps: AdminOverviewProps = {
  title: "Vogel Travel Admin",
  subtitle: "Повний контроль вашого бізнесу",
  withAudio: true,
};
