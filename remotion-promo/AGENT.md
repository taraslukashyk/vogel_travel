# AGENT.md — Remotion Content Guide for Vogel Travel

## Правила Remotion

Перед написанням будь-якого коду виконай скіл:

```
/remotion-best-practices
```

Він містить усі правила анімацій, шрифтів, відео, аудіо, переходів і типізації.

---

## Архітектура папок

```
remotion-promo/
├── public/
│   ├── image/
│   │   ├── logo.svg
│   │   ├── viktoria.jpg
│   │   ├── hero-poster.jpg
│   │   └── screenshots/        ← fullpage скриншоти сайту
│   ├── video/
│   │   └── aerial.webm
│   └── audio/
│       ├── music.mp3
│       └── sfx/
└── src/
    ├── Root.tsx                 ← реєстрація всіх Composition-ів
    ├── theme/
    │   ├── colors.ts
    │   ├── fonts.ts
    │   └── easings.ts
    ├── lib/
    │   ├── interp.ts            ← e() хелпер для interpolate
    │   └── staticPath.ts        ← typed шляхи до public/
    ├── components/
    │   ├── brand/               ← Logo, BirdParticles, BrowserChrome,
    │   │                           IsometricBrowser, PhoneMockup
    │   ├── ui/                  ← AnimatedCursor, VogelButton, FormField,
    │   │                           Counter, Dropdown, Calendar, Modal,
    │   │                           MicRecorder, PageScroll
    │   ├── effects/             ← Typewriter, BlurIn, RippleClick
    │   └── audio/               ← SoundBed
    └── compositions/
        ├── vogel-promo-30/      ← Ролик 1: 30s кінематографічне промо (16:9)
        ├── vogel-site-showcase/ ← Ролик 2: 30s UX-демо сайту (16:9)
        ├── vogel-bento-916/     ← Ролик 3: вертикальний бенто (9:16)
        └── <нова-назва>/        ← кожен новий ролик — окрема папка
```

---

## Структура кожної composition-папки

```
compositions/<назва>/
├── index.tsx       ← top-level компонент з усіма <Sequence>
├── schema.ts       ← Zod schema + defaultProps
├── timeline.ts     ← тривалість сцен + START офсети
└── scenes/
    ├── 01-SceneName.tsx
    ├── 02-SceneName.tsx
    └── ...
```

**timeline.ts** — єдине джерело тайм-кодів. Всі сцени отримують frame-офсет через `START.<sceneName>`.

**schema.ts** — всі параметри ролика (текст, телефон, URL, прапори) описуються через Zod. Ніяких хардкодів у сценах.

**index.tsx** — тільки `<Sequence>` блоки + `<SoundBed>`. Жодної логіки анімацій.

---

## Реєстрація нового ролика у Root.tsx

Додати в існуючий `<Folder name="Vogel">`:

```tsx
import { MyVideo } from "./compositions/my-video";
import { MyVideoSchema, defaultMyVideoProps } from "./compositions/my-video/schema";
import { TIMELINE as MY_TIMELINE } from "./compositions/my-video/timeline";

<Composition
  id="my-video"
  component={MyVideo}
  durationInFrames={MY_TIMELINE.total}
  fps={MY_TIMELINE.fps}
  width={1920}   // або 1080 для 9:16
  height={1080}  // або 1920 для 9:16
  schema={MyVideoSchema}
  defaultProps={defaultMyVideoProps}
  calculateMetadata={async ({ props }) => {
    await waitForFonts();
    return { props };
  }}
/>
```

---

## Додавання нового asset

1. Покласти файл у `public/image/`, `public/video/` або `public/audio/`
2. Додати шлях у `src/lib/staticPath.ts` через `staticFile()`
3. Використовувати тільки через `assets.X.Y` — ніяких рядкових URL у компонентах
