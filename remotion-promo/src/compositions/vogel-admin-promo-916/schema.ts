import { z } from "zod";

export const VogelAdminPromoSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  sections: z.array(z.string()),
  url: z.string(),
  withAudio: z.boolean(),
});

export type VogelAdminPromoProps = z.infer<typeof VogelAdminPromoSchema>;

export const defaultVogelAdminPromoProps: VogelAdminPromoProps = {
  title: "Vogel Travel",
  subtitle: "Адмін-панель",
  sections: ["Пропозиції", "Блог", "Сервіси", "Партнери", "SEO", "Аналітика", "Налаштування"],
  url: "vogel-travel.com/admin",
  withAudio: false,
};
