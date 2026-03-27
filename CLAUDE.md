# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# CLAUDE.md

Цей файл надає керівництво для Claude Code при роботі з кодом у цьому репозиторії.

## Огляд проекту

**Vogel Travel** — це преміальна туристична веб-платформа для консьєрж-сервісу. Платформа включає:

- **Публічну веб-сторінку** (www.vogel.travel) з інформацією про тури, сервіси, блог, партнерства
- **Адміністративну CMS панель** для управління контентом (тури, статті, сервіси, партнери, SEO)
- **Багатомовну підтримку** (українська + англійська з URL-based маршрутизацією)
- **Оптимізовану продуктивність** (код-розбиття, ленивого завантаження, offline підтримка)

## Технічний стек

| Компонент | Технологія | Версія |
|-----------|-----------|--------|
| Frontend | React + TypeScript | 19 |
| Build | Vite | 7.3 |
| Стилізація | Tailwind CSS | 3.4 |
| Маршрутизація | React Router | 7.13 |
| Стан | TanStack Query | 5.90 |
| База даних | Supabase (PostgreSQL) | - |
| Редактор | TipTap | 3.20 |
| Карти | MapLibre GL | 5.20 |
| Тестування | Vitest, Playwright | 4.1, 1.58 |

---

## Команди розробки

### Основні операції
```bash
npm run dev           # Запуск dev сервера (http://localhost:5173)
npm run build         # Типів перевірка (tsc -b) + збірка (dist/)
npm run lint          # ESLint перевірка
npm run preview       # Попередній перегляд production збірки
```

### Тестування
```bash
npm run test          # Vitest unit тести (режим спостереження)
npm run test:ui       # Vitest з UI панеллю
npm run test:e2e      # Playwright E2E тести
```

### Розгортання
```bash
npm run deploy        # Deploy на GitHub Pages (build + push dist/)
```

---

## Архітектура проекту

### Структура директорій

```
src/
├── admin/                    # CMS адміністратор (ленивого завантажена)
│   ├── components/           # UI компоненти (ProtectedRoute, RichTextEditor, ImageUploader, LanguageTabs)
│   ├── hooks/                # useAuth, useImageUpload, useAudioUpload, useFormTranslation
│   ├── pages/                # AdminLogin, AdminLayout, OffersList/Form, BlogList/Form, ServicesList/Form, PartnersList/Form, SeoList/Form, Settings, AdminHelp
│   └── utils/                # sectionSync.ts, translate.ts
│
├── components/               # Публічні UI компоненти
│   ├── Header.tsx            # Навігація + переключатель мови
│   ├── Footer.tsx
│   ├── Hero.tsx              # Героїчна секція
│   ├── OptimizedImage.tsx    # Адаптивні зображення з lazy loading
│   ├── PartnershipMap.tsx    # MapLibre GL карта
│   ├── BlogCarousel.tsx      # Карусель блог статей
│   ├── FeaturedTours.tsx     # Популярні тури
│   ├── ContactModal.tsx      # Контактна форма (ленивого)
│   ├── SearchPortal.tsx      # Пошук (ленивого)
│   └── ... (10+ інших компонентів)
│
├── pages/                    # Публічні сторінки (все ленивого завантажено)
│   ├── Home.tsx              # Домашня сторінка
│   ├── AboutPage.tsx         # Про нас
│   ├── ServicesPage.tsx      # Список сервісів
│   ├── ServiceDetailPage.tsx # Детальна сторінка сервісу
│   ├── OffersPage.tsx        # Список турів
│   ├── OfferDetailPage.tsx   # Детальна сторінка тура
│   ├── BlogPage.tsx          # Список статей
│   ├── ArticlePage.tsx       # Детальна сторінка статті
│   ├── PartnershipPage.tsx   # Партнерства
│   ├── PartnerDetailPage.tsx # Детальна сторінка партнера
│   └── ContactsPage.tsx      # Контакти
│
├── lib/
│   ├── supabase.ts           # Supabase клієнт + CRUD методи
│   ├── types.ts              # TypeScript інтерфейси (DB моделі)
│   ├── queries/              # TanStack Query hooks
│   │   ├── offers.ts         # useOffers, useOfferDetail
│   │   ├── blog.ts           # useBlogPosts, useBlogDetail
│   │   ├── services.ts       # useServices
│   │   ├── partners.ts       # usePartners
│   │   ├── seo.ts            # useSeoData
│   │   └── settings.ts       # useSettings
│   └── utils/
│       └── slugify.ts        # URL-safe slug генератор
│
├── hooks/                    # Спільні користувацькі hooks
│   ├── useLanguage.ts        # Переключення мови + URL маршрутизація
│   ├── useLanguageContent.ts # Завантаження контенту з мовою
│   └── useSettings.ts        # Налаштування додатку
│
├── locales/                  # i18n переводи
│   ├── ua.json               # Українські переводи
│   └── en.json               # Англійські переводи
│
├── data/                     # Статичні резервні дані (offline підтримка)
│   ├── blog.ts
│   ├── offers.ts
│   ├── partners.ts
│   └── services.ts
│
├── assets/                   # Зображення, SVG
├── test/                     # Unit тести
│   ├── setup.ts              # Vitest налаштування (@testing-library/jest-dom)
│   └── *.test.tsx            # Тести компонентів
├── App.tsx                   # Основний router з ленивим завантаженням
├── i18n.ts                   # i18next конфіг
└── main.tsx                  # Точка входу з React Query налаштуванням
```

### Маршрутизація

**Публічні маршрути** (з Header/Footer):
```
/ → Редирект на /ua (за замовчуванням)
/:lang/                     → Home
/:lang/about                → AboutPage
/:lang/services             → ServicesPage
/:lang/services/:slug       → ServiceDetailPage
/:lang/offers               → OffersPage
/:lang/offers/:slug         → OfferDetailPage
/:lang/blog                 → BlogPage
/:lang/blog/:slug           → ArticlePage
/:lang/partners             → PartnershipPage
/:lang/partners/:slug       → PartnerDetailPage
/:lang/contacts             → ContactsPage
```

**Маршрути адміністратора** (без Header/Footer, потребує логіну):
```
/admin/login                → AdminLogin (публічно)
/admin/offers               → OffersList
/admin/offers/new           → OfferForm (новий)
/admin/offers/:id           → OfferForm (редагування)
/admin/blog, /admin/blog/new, /admin/blog/:id
/admin/services, /admin/services/new, /admin/services/:id
/admin/partners, /admin/partners/new, /admin/partners/:id
/admin/seo, /admin/seo/:id
/admin/settings
/admin/help
```

---

## Ключові архітектурні шаблони

### 1. Управління станом (TanStack Query v5)

Весь серверний стан управляється через TanStack Query з цими налаштуваннями:

```typescript
// lib/queries/offers.ts
export function useOffers() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data?.map(mapOfferDBToUI) ?? [];
    },
    placeholderData: staticOffers,    // Статичні дані як резерв
    staleTime: 5 * 60 * 1000,         // 5 хв (дані свіжі)
    gcTime: 30 * 60 * 1000,           // 30 хв (offline підтримка)
    retry: 1,
    refetchOnWindowFocus: false,      // Без надокучливих перезавантажень
  });
}
```

**Переваги**:
- Автоматичне кешування (якщо двоє компонентів запитують одне, буде 1 запит)
- Offline підтримка (дані лишаються 30 хв)
- Простий рефактор (змінити джерело в одному місці)

### 2. Відображення DB → UI (snake_case → camelCase)

Усі DB запити використовують двокроковий маппінг:

```typescript
// DB інтерфейс (точна копія Supabase таблиці)
interface DBOffer {
  id: string;
  title: string;
  seo_title?: string;
  location_en?: string;
  created_at: string;
}

// UI інтерфейс (для компонентів)
interface Offer {
  id: string;
  title: string;
  seoTitle?: string;
  locationEn?: string;
  createdAt: string;
}

// Функція відображення
function mapOfferDBToUI(db: DBOffer): Offer {
  return {
    id: db.id,
    title: db.title,
    seoTitle: db.seo_title,        // snake_case → camelCase
    locationEn: db.location_en,
    createdAt: db.created_at,
  };
}

// Використання в query
queryFn: async () => {
  const { data } = await supabase.from('offers').select('*');
  return data?.map(mapOfferDBToUI) ?? [];
}
```

**Чому**:
- Розділення турботи (DB схема окремо від UI)
- IDE автодоповнення для camelCase
- Легко оновлювати DB без впливу на компоненти

### 3. Багатомовність (URL-based)

Мова визначається **префіксом URL**, не localStorage:

```typescript
// App.tsx маршрутизація
<Route path="/:lang" element={<LanguageHandler />}>
  <Route index element={<Home />} />
  <Route path="about" element={<AboutPage />} />
</Route>

// LanguageHandler синхронізує URL з i18n
function LanguageHandler() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && (lang === 'ua' || lang === 'en')) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <PublicLayout />;
}

// Hook для переключення мови
const { changeLanguage, l } = useLanguage();
changeLanguage('en');  // Редирект на /en/...
l('/offers');          // Поточна мова + посилання → /ua/offers
```

**Переваги**:
- Посилання поділяються зі своєю мовою
- SEO-friendly (обидві версії індексуються окремо)
- Чистий URL (без query параметрів)

### 4. Оптимізація продуктивності

#### Розбиття коду (Manual Chunks)

```typescript
// vite.config.ts
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],      // Завжди
  'vendor-map': ['maplibre-gl'],                                    // Тільки на /partners
  'vendor-icons': ['lucide-react'],                                 // Завжди
  'vendor-animation': ['gsap'],                                     // Завжди
  'vendor-admin-editor': ['@tiptap/react', '@tiptap/starter-kit'],  // Тільки /admin
  'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable'],             // Тільки /admin
}
```

#### Ленивого завантаження сторінок

```typescript
// App.tsx - всі сторінки ленивого завантажені
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
// ... залишок сторінок

<Suspense fallback={<PageLoader />}>
  <Routes>
    {/* маршрути */}
  </Routes>
</Suspense>
```

#### Оптимізація зображень

```typescript
<OptimizedImage
  src="https://images.unsplash.com/..."
  alt="описання"
  width={800}
  height={600}
/>
```

Компонент автоматично:
- `loading="lazy"` для браузера ленивого завантаження
- Генерує srcSet (400w, 800w, 1200w, 1600w)
- Рекомендує WebP формат
- `decoding="async"` для неблокуючого декодування

---

## Адміністративна панель

### Доступ

```
Локально: http://localhost:5173/admin/login
Продакшн: https://www.vogel.travel/admin/login
```

Вхід через Supabase (email + пароль для авторизованих користувачів).

### Функції

| Секція | Функціональність |
|--------|-----------------|
| `/admin/offers` | Управління турами (назва, ціна, опис ua/en, зображення) |
| `/admin/blog` | Редагування статей з **Rich Text Editor** (TipTap) для форматування |
| `/admin/services` | Управління сервісами |
| `/admin/partners` | Управління партнерствами + координати для карти |
| `/admin/seo` | Редагування meta title/description для SEO |
| `/admin/settings` | Глобальні налаштування (контакти, соціальні мережи) |
| `/admin/help` | Довідка для адміністраторів |

### Мультимовне редагування

Кожна форма має закладки **UA/EN**:
1. Заповніть укр. версію на закладці "UA"
2. Переключитьсь на закладку "EN", заповніть англійськую
3. Опублікуйте — контент з'явиться на обох мовах сайту

### Rich Text Editor (TipTap)

Для блог статей та контенту:
- **Bold/Italic/Underline**: виділіть текст → натисніть кнопку
- **Заголовки**: `# H1`, `## H2`, etc.
- **Списки**: `- item` (ul) або `1. item` (ol)
- **Посилання**: `[текст](URL)`
- **Зображення**: кнопка Image у редакторі
- **Цитати**: `> quote`

---

## Типові завдання

### Додавання нової публічної сторінки

1. Створіть `/src/pages/NewPage.tsx`
2. Додайте маршрут в `App.tsx`:
   ```typescript
   const NewPage = lazy(() => import('./pages/NewPage'));
   // У <Route path="/:lang">
   <Route path="new-page" element={<NewPage />} />
   ```
3. Додайте посилання в Header.tsx (з `useLanguage()`)
4. Додайте переводи до `/src/locales/{ua,en}.json`

### Додавання нового поля до форми адміністратора

1. Оновіть DB тип в `/src/lib/types.ts`
2. Оновіть форму в `/src/admin/pages/SomeForm.tsx`
3. Оновіть маппер в `/src/lib/queries/some.ts`
4. Додайте колону до Supabase таблиці

### Налагодження TanStack Query

```bash
npm run dev
```

**React Query DevTools** з'явитись в нижньому куті:
- Показує активні запити
- Статус: fresh/stale/inactive
- Дозволяє вручну інвалідувати кеш

### Запуск тестів

```bash
npm run test          # Unit тести з автоперезапуском
npm run test:ui       # Візуальна панель
npm run test:e2e      # E2E тести (запускає dev server)
```

---

## Конфігурація

| Файл | Призначення |
|------|-----------|
| `vite.config.ts` | Build оптимізація, chunk розділення, тесто налаштування |
| `tsconfig.json` | TypeScript суворий режим, ES2022 мета |
| `tailwind.config.js` | Кольори, шрифти (Inter, Montserrat, Marck Script) |
| `eslint.config.js` | Linting правила |
| `playwright.config.ts` | E2E налаштування (пристрої, auto-start dev server) |
| `i18n.ts` | i18next конфіг (ua, en) |
| `.env.local` | Supabase URL, API ключ (локально) |
| `.claude/launch.json` | Claude Code dev server налаштування |

---

## Зовнішні сервіси

- **Supabase**: PostgreSQL + Auth + Storage
  - `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`
  - Таблиці: offers, blog_posts, services, partners, seo, settings
  - Бакети: images, audio (публічний доступ)

- **Google Fonts**: Inter, Montserrat, Marck Script (preconnect в HTML)
- **Google Analytics**: Deferred скрипт
- **Unsplash**: Динамічні URLs з автоматичним srcSet

---

## Важливі рішення

1. **URL-based мова** — поділяння посилань + SEO
2. **Fallback дані** — offline підтримка через локальний кеш
3. **Ручне розбиття chunk'ів** — контроль розміру bundle
4. **Supabase Auth** — простий вхід для адміністраторів
5. **TipTap** — повна керованість вихідним форматом

---

## Розгортання

```bash
npm run deploy        # Build + push на GitHub Pages
```

Перевірте `package.json` → `"homepage": "https://www.vogel.travel"`

---

## Потенційні проблеми

| Проблема | Рішення |
|----------|--------|
| Порожня сторінка | DevTools Console, перевірте мережу |
| Форма не надсилається | Перевірте `.env.local` (SUPABASE_URL, KEY) |
| Зображення не завантажуються | Supabase Storage → public політики |
| i18n текст відсутній | Перевірте `/src/locales/{ua,en}.json` |
| E2E timeout | `npm run test:e2e` автоматично запускає dev server |
| Bundle > 1000KB | `npm run build`, перевірте який chunk'ік |

---

## Мета-інформація

- **Homepage**: https://www.vogel.travel
- **Admin**: https://www.vogel.travel/admin/login (защищено)
- **Мови**: Українська (ua), Англійська (en)
- **Підтримувач**: Таблиця по структурі та типам у `/src/lib/types.ts`
