# Гіпердеталізовані сценарії Remotion: Vogel Travel (V2)

Цей документ містить 5 високодеталізованих покрокових сценаріїв, збудованих за логікою `remotion-video-marketing`. Кожен кадр базується на стилістиці платформи (шрифт Geist, TailwindCSS палітри, MapLibre картографія, GSAP/React-анімації). Особливу увагу приділено траєкторіям рухів миші, плавним анімаціям (Bézier easings) та покроковій верстці.

---

## 📱 Сценарій 1: TikTok / Shorts "Бронювання однією лівою"
**Фреймворк:** AIDA (Attention, Interest, Desire, Action)
**Метадані композиції:** Фреймрейт: 60fps | Тривалість: 15s (900 кадрів) | 1080x1920
**Дизайн-токени:** Шрифт Geist, Primary Accent (колір `tw-cyan-400` / `Vogel Gold`).

### Посценний розбір:

*   **Scene 1 (0:00 - 0:02) - Attention (Хук: Паттерн-інтеррапшен)**
    *   **Visual Action:** Ракурс 'з-за плеча' (або мокап телефону). Максимальне наближення до секції деталей вілли. Курсор (`AnimatedCursor`, рендерений через SVG) різко, через `Easing.bezier(0.16, 1, 0.3, 1)`, 'стрибає' від лівого нижнього кута прямо в центр іконки "Шезлонг" (`lucide-react`).
    *   **Text / Kinetic Typography:** Різкий `scale(0.8 -> 1)`, `opacity(0 -> 1)` заголовку `<h1 className="font-geist font-bold text-5xl">` на склі (Glassmorphism, `backdrop-filter: blur(20px)`): **"1 КЛІК ДО МРІЇ"**.
    *   **Audio & VO:** Звук різкого 'Swoosh' при русі миші + акцентований 'Click' (механічна клавіатура) на 0:01. VO: "Зустрічай бронювання майбутнього."
    *   **Marketing Rationale:** Захоплює увагу чіткою фізикою курсора та зрозумілим твердженням "1 клік".

*   **Scene 2 (0:02 - 0:07) - Interest (UX Демо)**
    *   **Visual Action:** Курсор миші плавно пливе вздовж компоненту календаря (`react-day-picker`). Ми бачимо ефект `:hover` (через зміну кольору фону на `bg-gray-100/10`). Курсор робить клік на дату "12", а потім "20". Відмальовується плавний прямокутник виділення `tw-bg-blue-500/20`. Кліки супроводжуються `RippleClick` (ефект хвилі на екрані: `<circle r="..." opacity="..."/>` масштабується від 0 до 50px за 15 кадрів).
    *   **Text / Kinetic Typography:** Знизу зліва спливає текст `translate-y-[20px] -> 0` з затримкою: "Вибирай дати. Без зависань."
    *   **Audio & VO:** Легкі звуки 'Pop' при виборі дат. VO: "Твій ідеальний календар уже налаштований."
    *   **Marketing Rationale:** Показуємо плавність взаємодії замість нудних обіцянок. Звуковий супровід 'Pop' дає фізіологічне задоволення (ASMR UX).

*   **Scene 3 (0:07 - 0:12) - Desire (Бажання)**
    *   **Visual Action:** Форма ідеально автозаповнюється (typewriter ефект за 30 кадрів у полях `<Input>`). Курсор наводиться на епічну кнопку "Забронювати" (кнопка пульсує, змінюючи `box-shadow: 0 0 15px currentColor`). Мишка здійснює клік. Екран миттєво обволікається `BlurIn` ефектом, і з'являється `Sonner` (успішне зелене сповіщення).
    *   **Text / Kinetic Typography:** Великий банер "ПІДТВЕРДЖЕНО".
    *   **Audio & VO:** Мелодійний 'Bing' успішної операції. VO: "Ваш тур підтверджено миттєво."
    *   **Marketing Rationale:** Активація дофаміну через спостереження за ідеально виконаним потоком (Flow).

*   **Scene 4 (0:12 - 0:15) - Action (Розв'язка)**
    *   **Visual Action:** Темний фон. Логотип `vogel3.svg` плавно вимальовується по контурах (`stroke-dashoffset` анімація).
    *   **Text / Kinetic Typography:** "Переходь на vogel.travel"
    *   **Audio & VO:** Удар барабану. VO: "Посилання у профілі."

---

## 💻 Сценарій 2: YouTube "Світ на долоні (MapLibre Demo)"
**Фреймворк:** PAS (Problem, Agitation, Solution)
**Метадані композиції:** Фреймрейт: 30fps | Тривалість: 25s (750 кадрів) | 1920x1080
**Дизайн-токени:** Інвертована темна тема, мапа MapLibre в стилі 'Dark Matter', неонові поінтери.

### Посценний розбір:

*   **Scene 1 (0:00 - 0:05) - Problem**
    *   **Visual Action:** Анімація хакеро-подібного хаосу з 5-7 різних візуально старих мап (растрових). Стрілка миші сіпається від вкладки до вкладки, іконки завантаження крутяться безкінечно.
    *   **Text / Kinetic Typography:** Червоний текст посередині екрану: "Плутаєшся в маршрутах?"
    *   **Audio & VO:** Переривчастий цифровий шум, гудки телефону. VO: "Досі плануєш відпустки по 10 різних мапах?"
    *   **Marketing Rationale:** Біль візуалізований через відчуття інтерфейсного перевантаження (Mental load).

*   **Scene 2 (0:05 - 0:09) - Agitation**
    *   **Visual Action:** Старі мапи згортаються у крихітну кульку і зникають. Екран набуває кольору `#0a0a0a`.
    *   **Text / Kinetic Typography:** Текст `opacity(0)->1`, `scale(1.2->1.0)`: "Час - найдорожча валюта."
    *   **Audio & VO:** Повна тиша (1 секунда).
    *   **Marketing Rationale:** Пауза в аудіо приковує увагу до суті проблеми.

*   **Scene 3 (0:09 - 0:18) - Solution (MapLibre Glory)**
    *   **Visual Action:** Кадр плавно розширюється, відкриваючи екран Vogel Travel. Камера віртуально 'залітає' в 3D мапу MapLibre. `Pitch` камери змінюється з 0 до 60 градусів `interpolate(frame, [0, 90], [0, 60], Easing.bezier(0.22, 1, 0.36, 1))`. Показуємо неонові маркери готелів із кастомними React-попапами. Курсор ідеально рівною лінією (Catmull-Rom сплайн) переміщується до найближчого маркера і 'ховерить' його. З'являється преміум-картка готелю у скляному стилі.
    *   **Text / Kinetic Typography:** "Інтерактивний рай."
    *   **Audio & VO:** Deep tech-house біт, плавний бас. VO: "Один інтерфейс. Світові локації у справжньому 3D."
    *   **Marketing Rationale:** Демонстрація передової технології (WebGL/MapLibre) позиціонує бренд як лідера індустрії.

*   **Scene 4 (0:18 - 0:25) - Action**
    *   **Visual Action:** На екрані "розсипаються" частинки (Particle effect у вигляді лелек/векторів). Вони збираються в центрі і формують логотип Vogel Travel.
    *   **Text / Kinetic Typography:** "Забронюй маршрут."
    *   **Audio & VO:** Легке відлуння. VO: "vogel.travel. Відкрий карту по-новому."

---

## 📱 Сценарій 3: TikTok "Кінетичне Скло (Dashboard Sneak-Peek)"
**Фреймворк:** FAB (Feature, Advantage, Benefit)
**Метадані композиції:** Фреймрейт: 60fps | Тривалість: 12s (720 кадрів) | 1080x1920
**Дизайн-токени:** Ефекти Glassmorphism (`bg-white/10 border-white/20 blur-md`), градієнти заднього фону.

### Посценний розбір:

*   **Scene 1 (0:00 - 0:04) - Feature (Адмін-панель/Дашборд)**
    *   **Visual Action:** Задній фон - повільно обертовий градієнт-меш `#4F46E5` та `#EC4899`. З-під низу в кадр вистрибують (`spring` анімація, `stiffness: 120, damping: 14`) 3 Bento-картки з Vogel-дашборду (бронювання, баланс, консьєрж-чат). Їх нахил `rotateY` і `rotateX` змінюється паралаксом в залежності від координат віртуальної умовної мишки.
    *   **Text / Kinetic Typography:** Шрифт Geist: "ТВІЙ ПЕРСОНАЛЬНИЙ ДАШБОРД" (Word highlight - кожне слово підкреслюється неоном по черзі).
    *   **Audio & VO:** Басовий 'Whoosh' на кожну bento-картку. VO: "Контролюй всі поїздки в одному місці."

*   **Scene 2 (0:04 - 0:08) - Advantage (Перевага чату)**
    *   **Visual Action:** Камера зумується на 3-тю картку ("Чат з консьєржем"). Іконка-аватар агента пульсує. В чаті плавно 'друкується' відповідь від консьєржа: "Так, яхта на 19:00 заброньована". Блок повідомлення виїздить знизу вверх з `opacity(0)`.
    *   **Text / Kinetic Typography:** Напівпрозорий текст позаду картки: "Живий супровід 24/7."
    *   **Audio & VO:** Звук вхідного iMessage. VO: "Наш консьєрж на зв'язку завжди. Долі секунди."

*   **Scene 3 (0:08 - 0:12) - Benefit & Action (Вигода)**
    *   **Visual Action:** Ефект "Camera Flash" (біла заливка `opacity(1 -> 0)` за 10 кадрів). Картинка змінюється на засмаглу людину з коктейлем. Золота кнопка CTA злітає в центрі екрану, курсор плавно (через `Easing.inOut(Easing.sin)`) натискає на неї.
    *   **Text / Kinetic Typography:** "Відпочивай."
    *   **Audio & VO:** Звук келихів (дзенькіт), прибій океану. VO: "Vogel. Залиши заявку сьогодні."

---

## 📱 Сценарій 4: REELS "Трансформація Логотипу"
**Фреймворк:** Storytelling / Brand Awareness
**Метадані композиції:** Фреймрейт: 60fps | Тривалість: 10s (600 кадрів) | 1080x1920
**Дизайн-токени:** Мінімалізм, монохром (Чорний/Білий), точкова анімація вектора.

### Посценний розбір:

*   **Scene 1 (0:00 - 0:03) - Attention (Початок форми)**
    *   **Visual Action:** На чорному фоні (`#000`) пульсує самотня золота крапка. Від неї в різні боки, використовуючи математичні рівняння спіралі або інтерполяцію через Bézier, починають вимальовуватись SVG-контури стилізованого птаха (крила `vogel3.svg`).
    *   **Text / Kinetic Typography:** Тексту немає, лише візуал.
    *   **Audio & VO:** Тихий, глибокий звук "Inception-style drone".

*   **Scene 2 (0:03 - 0:07) - Interest (Морфінг і Типографіка)**
    *   **Visual Action:** Контури пташки заповнюються золотим градієнтом. Крила роблять "помах" (через зміну `scaleY` або `d` атрибуту SVG). Одночасно знизу, наче з-під невидимої маски (Clipping Path), виїжджає текст "VOGEL".
    *   **Text / Kinetic Typography:** Текст VOGEL з'являється по одній літері (Letter tracking `letter-spacing: 0px -> 12px` інтерполюється з `Easing.out(Easing.exp)`).
    *   **Audio & VO:** Епічний "Riser", який спадає до м'якого кліку. VO: "Мистецтво подорожей."

*   **Scene 3 (0:07 - 0:10) - Action (Авторитет бренду)**
    *   **Visual Action:** Логотип стабілізується по центру. Під ним проявляється кнопка з ефектом легкого світіння: "Concierge Service".
    *   **Text / Kinetic Typography:** "Відкрийте світ преміуму."
    *   **Audio & VO:** VO: "Твій персональний гід чекає."

---

## 💻 Сценарій 5: YouTube Pre-Roll "Крізь екран до реальності"
**Фреймворк:** AIDA (Кінематографічний гіперреалізм)
**Метадані композиції:** Фреймрейт: 30fps | Тривалість: 20s (600 кадрів) | 1920x1080
**Дизайн-токени:** Змішування відео та вебу, паралакс-скрол сайта.

### Посценний розбір:

*   **Scene 1 (0:00 - 0:06) - Attention (Гіперреалізм)**
    *   **Visual Action:** Починаємо з відео реального сноубордиста у 4K (з бібліотеки `public/video/`). На 0:03 відео різко стає частиною сайту (рамка браузера "наїжджає" поверх відео через Scale(3) до Scale(1)). Миусвідомлюємо, що це лише відео на Hero-секції платформи Vogel.
    *   **Text / Kinetic Typography:** Поверх сайту живий текст від Tailwind/React: `text-6xl font-black text-white mix-blend-difference`: "БЕЗМЕЖНІСТЬ."
    *   **Audio & VO:** Гучний шум вітру (відео), який різко приглушується ефектом `Low-Pass Filter` під час появи браузера. VO: "Від гірських вершин..."

*   **Scene 2 (0:06 - 0:12) - Interest (Плавний 스크롤 사이트)**
    *   **Visual Action:** Програмний скрол сайту вниз (`window.scrollY` інтерполюється). Бачимо секцію з Bento-плитками вілл та розкішних яхт. Усі картинки мають `hover:scale-105` і `transition-transform`. Курсор плавно летить по картинках (всі вони зумуються при наведенні миші, відтворюючи ідеальний код).
    *   **Text / Kinetic Typography:** Заголовок секції "Ексклюзивні напрямки" м'яко виїжджає збоку (спрацьовує віртуальний Intersection Observer).
    *   **Audio & VO:** Звуки розкішного відпочинку (плескіт води). VO: "...до приватного океану. Все у твоєму браузері."

*   **Scene 3 (0:12 - 0:16) - Desire**
    *   **Visual Action:** Фокус на формі зв'язку. Курсор безжально-чітко клікає на `<Input type="text" />`, з'являється каретка вводу. Друкується текст "Хочу на Мальдіви" з швидкістю 1 клавіша на 2 кадри.
    *   **Text / Kinetic Typography:** Текст у інпуті.
    *   **Audio & VO:** Швидкий 'Typing' звук клавіатури Macbook. VO: "Одне повідомлення — і ми збираємо твої валізи."

*   **Scene 4 (0:16 - 0:20) - Action**
    *   **Visual Action:** Кнопка "Відправити" стискається (Scale: 0.95 на 2 кадри, потім 1.0) під дією кліку. Екран покривається темним градієнтом, із тіні виблискує пташка Vogel.
    *   **Text / Kinetic Typography:** "Vogel Travel"
    *   **Audio & VO:** Мелодійний аутро-бім. VO: "Vogel Travel. Почни сьогодні."

---

# V3 (2026-04-16): 4 продакшн-сценарії для Remotion-промо

Цей додаток жорстко синхронізований з композиціями, зареєстрованими у `remotion-promo/src/Root.tsx`. Метадані (id, розміри, fps, тривалість) взяті саме з `Root.tsx` і є джерелом правди для рендера. Усі сцени використовують брендові примітиви (`theme/colors`, `theme/fonts`, `lib/interp::e()`, бренд-компоненти з `components/brand|ui|effects|audio`) та скріншоти з `public/image/screenshots/*`. Усі VO — українською.

## Зміст

| # | Композиція (id) | Фреймворк | Платформа | Розмір | FPS | Кадри | Час |
|---|-----------------|-----------|-----------|--------|-----|-------|-----|
| V3·1 | `vogel-tiktok-aida-916` | AIDA | TikTok/Reels | 1080×1920 | 60 | 720 | 12s |
| V3·2 | `vogel-tiktok-pas-916` | PAS | TikTok/Reels | 1080×1920 | 60 | 900 | 15s |
| V3·3 | `vogel-youtube-aida-169` | AIDA | YouTube Pre-roll | 1920×1080 | 30 | 1350 | 45s |
| V3·4 | `vogel-youtube-fab-169` | FAB (B2B) | YouTube | 1920×1080 | 30 | 750 | 25s |

---

## 📱 Сценарій V3·1 · TikTok AIDA · `vogel-tiktok-aida-916`

**Фреймворк:** AIDA (Attention → Interest → Desire → Action).
**Ціль:** імпульсні покупці, які гортають стрічку → показати, що замовити тур на Vogel — це буквально 3 тапи.
**Хук (0–2s):** тамбнейл-телефон з `homeFull` у режимі портрета, різкий spring-ін з `BirdParticles` у фоні та спалах `BlurIn` — паттерн-інтеррапшен серед нудних TikTok-шотів.
**Метадані:** 1080×1920, 60fps, 720f (12s).
**Schema props:** `website`, `phone`, `managerName`, `withAudio`, `ctaPrimary`, `ctaSecondary`.
**Timeline scenes:** `attention: 120f | interest: 240f | desire: 240f | action: 120f`.

### Scene 01 — Attention (0–2s · f 0–120)
- **Visual Action:** `PhoneMockup` тримає `assets.image.screenshots.homeFull` (портретний crop) із легким нахилом `tilt: -6`. На фоні `colors.darker` + `BirdParticles` (seed=11, count=14). На f=10 — `BlurIn` спалах 24→0 px за 36f. Текст-капсула «glassmorphism» з'являється pop-easing scale `0.85→1`.
- **Text / Kinetic Typography:** «1 КЛІК ДО МРІЇ» (Montserrat 900, 96 px, tracking 0.04em) pop-scale + translate-y 30→0 px.
- **Audio & VO:** `whoosh` @ f=0 (SoundBed cue `whoosh1`). VO: «Зустрічай бронювання майбутнього.»
- **Marketing Rationale:** pattern interrupt за перші 0.5s + чітка обіцянка «1 клік» закріплює вигоду у свідомості.

### Scene 02 — Interest (2–6s · f 120–360)
- **Visual Action:** Той самий `PhoneMockup`, екран всередині — скрол через `PageScroll` з `homeFull` у `offersFull` (crossfade на f=180). `AnimatedCursor` летить з низу до карти тура (keyframes у координатах мокапа), натискає → `RippleClick` teal з radius 90. Слабка GSAP-пульсація бордерів карточки.
- **Text / Kinetic Typography:** під телефоном великий напис «50+ ТУРІВ. БЕЗ ВКЛАДОК.» (translate-y 60→0 px, easing `enter`, split-words із stagger 4f).
- **Audio & VO:** click SFX (SoundBed cue `click1` = `START.interest + 80`). VO: «Обирай тур, не гортаючи Booking.»
- **Marketing Rationale:** демо плавних UX-мікровзаємодій викликає ASMR-ефект, глядач «уявляє» себе в flow.

### Scene 03 — Desire (6–10s · f 360–600)
- **Visual Action:** Свайп-cut на `offerDetailFull`. `Counter` знизу показує ціну, що «рахується» вгору. `VogelButton` (variant=`teal`) пульсує hoverAt=430, потім `AnimatedCursor` клікає clickAt=500. На f=520 — `BlurIn` 0→16→0 px переходом на `assets.image.screenshots.success`. На успіху — банер «ПІДТВЕРДЖЕНО» у glassmorphism.
- **Text / Kinetic Typography:** «ПІДТВЕРДЖЕНО» (Montserrat 900, 120 px, teal glow `box-shadow`), поява scale 0.8→1 pop + opacity 0→1 за 14f.
- **Audio & VO:** chime (SoundBed cue `chime` = `START.desire + 200`). VO: «Твій тур підтверджено миттєво.»
- **Marketing Rationale:** дофаміновий peak — глядач переживає емоцію «успіху», як власну.

### Scene 04 — Action (10–12s · f 600–720)
- **Visual Action:** Темний фон `colors.darker`, `Logo` width=600 з легким fade + `BirdParticles` seed=7, count=18. Під лого — `{website}` (Montserrat 800, 72 px) і під ним `{ctaSecondary}` script italic 36 px.
- **Text / Kinetic Typography:** `{website}` stroke-fade-in; `{ctaSecondary}` fade-in + translate-y 20→0 px.
- **Audio & VO:** drum/whoosh (SoundBed cue `chimeOut` → використовуємо `chime`). VO: «Vogel Travel. Перейди за посиланням.»
- **Marketing Rationale:** чіткий CTA + глянцева brand payoff пам'ятається після скролу далі.

**Компоненти:** `PhoneMockup`, `PageScroll`, `AnimatedCursor`, `RippleClick`, `BlurIn`, `Counter`, `VogelButton`, `Logo`, `BirdParticles`, `SoundBed`.
**Assets:** `assets.image.screenshots.homeFull`, `.offersFull`, `.offerDetailFull`, `.success`, `assets.image.logo`, `assets.audio.sfx.whoosh|click|smsChime`.

---

## 📱 Сценарій V3·2 · TikTok PAS · `vogel-tiktok-pas-916`

**Фреймворк:** PAS (Problem → Agitation → Solution → Action).
**Ціль:** мандрівники, втомлені від Booking/Aviasales/Excel; агітують біль + продають Vogel як "єдиний сайт, жива людина".
**Хук (0–3s):** 6-мозаїка браузерних вкладок з jitter-тряскою — інтерфейсний хаос.
**Метадані:** 1080×1920, 60fps, 900f (15s).
**Schema props:** `website`, `phone`, `managerName`, `withAudio`, `problemHours` (default 47), `ctaPrimary`.
**Timeline scenes:** `problem: 180f | agitation: 300f | solution: 300f | cta: 120f`.

### Scene 01 — Problem (0–3s · f 0–180)
- **Visual Action:** `colors.darker` фон, 3×2 грід з 6 маленьких `BrowserChrome` width=420, height=280. Кожен містить кропнутий `offersFull/homeFull/admin.*` зі зміщенням `objectPosition`. Jitter на `rotateZ ±0.6deg` з частотою sin(frame·0.25). На f=90 додаються «error toasts» (червоні пілки) на деяких тайлах.
- **Text / Kinetic Typography:** «6 ВКЛАДОК. 0 ПЛАНУ.» червоний (`#ef4444`) по центру, shake-easing (sin-based translateX ±4 px).
- **Audio & VO:** glitch whoosh (SoundBed cue `whoosh1 = START.problem`). VO: «Досі плануєш відпустку у шести вкладках?»
- **Marketing Rationale:** візуалізує "mental load" — біль глядача.

### Scene 02 — Agitation (3–8s · f 180–480)
- **Visual Action:** Тайли «з'їжджають» до центру і деформуються у червоно-тонований CSS-grid «spreadsheet»: 12 колонок × 18 рядків, деякі клітинки миготять. Центром — великий `Counter` з `increments` на кожні 6f (до `{problemHours}` = 47).
- **Text / Kinetic Typography:** «ГОДИН. ВПУСТУ.» (Montserrat 900, 120 px, tracking 0.03em) під лічильником. Фрейм 300 — «ЗНОВУ?», fade-in-out.
- **Audio & VO:** приглушений heartbeat bass (не використовуємо SFX, працює musicVolume duck @ `duckAt = START.agitation + 60`). VO: «Години порівнянь, дзвінків, сумнівів — і жодної впевненості.»
- **Marketing Rationale:** agitation — конкретна цифра ілюзорного часу, що дратує глядача.

### Scene 03 — Solution (8–13s · f 480–780)
- **Visual Action:** Smooth cut (швидкий fade 10f через `colors.dark → teal gradient`). `IsometricBrowser` з `homeFull` виїжджає з правого краю, flatAtFrame=110. На верхній частині екрану — `MicRecorder` (startFrame=40, sendAtFrame=150). `Typewriter` у hero-інпуті сайту друкує «Мальдіви на двох». На f=200 `AnimatedCursor` клікає перший результат і з'являється картка оффера з teal шиммер-бордером.
- **Text / Kinetic Typography:** «ОДНА ПЛАТФОРМА. УСЕ.» (Montserrat 900, 100 px) — split-letters з easing `pop`, translate-y 40→0 px.
- **Audio & VO:** whoosh (SoundBed cue `whoosh2 = START.solution`) + chime (SoundBed cue `chime = START.solution + 20`). VO: «Vogel — один сайт, свій менеджер, твоя подорож.»
- **Marketing Rationale:** показує продукт як одне рішення проти хаосу.

### Scene 04 — CTA (13–15s · f 780–900)
- **Visual Action:** Лого + картка менеджера: `assets.image.viktoria` у circular mask (border 3px teal), напис «{managerName}, твій консьєрж». Нижче `{website}` та `{phone}` (Montserrat 700). `BirdParticles` seed=21 у тлі.
- **Text / Kinetic Typography:** картка з `scale(0.9→1)` easing `pop`, текстові рядки translate-y 20→0 px.
- **Audio & VO:** chime (SoundBed cue `click1 = START.cta` — використовуємо click для "Сlick here"). VO: «Пиши Вікторії зараз.»
- **Marketing Rationale:** персоніфікація — клієнт бачить, до кого пише, і тригериться довірою.

**Компоненти:** `BrowserChrome`, `Counter`, `IsometricBrowser`, `MicRecorder`, `Typewriter`, `AnimatedCursor`, `Logo`, `BirdParticles`, `SoundBed`.
**Assets:** `assets.image.screenshots.offersFull|homeFull|admin.*`, `assets.image.viktoria`, `assets.image.logo`, `assets.audio.*`.

---

## 💻 Сценарій V3·3 · YouTube AIDA · `vogel-youtube-aida-169`

**Фреймворк:** AIDA (лінійний наратив 45s).
**Ціль:** YouTube Pre-roll — показати повний шлях клієнта: пошук → тур → бронь → менеджер, з емоційним hookом aerial-відео.
**Хук (0–6s):** full-bleed aerial drone `aerial.webm` з повільним zoom-in та `BlurIn` титром.
**Метадані:** 1920×1080, 30fps, 1350f (45s).
**Schema props:** `website`, `phone`, `managerName`, `withAudio`, `voiceQuery` (default «Мальдіви на двох»), `stats: { clients, countries, rating }`.
**Timeline scenes:** `attention: 180f | interest: 360f | desire: 360f | proof: 300f | action: 150f`.

### Scene 01 — Attention (0–6s · f 0–180)
- **Visual Action:** `<Video src={assets.video.aerial} />` на AbsoluteFill, `transform: scale(1.05→1.18)` повільним easing `editorial`. Темна vignette `radial-gradient(rgba(0,0,0,0)→rgba(0,0,0,0.55))`. На f=40 — `BlurIn` з durationFrames=50 з заголовком «Мрія без зайвих вкладок». Нижня subtitle «Vogel Travel · Concierge».
- **Text / Kinetic Typography:** заголовок Montserrat 900, 110 px + hairline «concierge» (Inter 500, letter-spacing 0.4em).
- **Audio & VO:** cinematic whoosh (SoundBed cue `whoosh1 = START.attention`). VO: «Ти заслуговуєш на відпустку без стресу.»
- **Marketing Rationale:** кінематографія тягне увагу, емоційна обіцянка закріплює інтерес.

### Scene 02 — Interest (6–18s · f 180–540)
- **Visual Action:** Crossfade на `colors.darker` + `IsometricBrowser` flatAtFrame=90 із `PageScroll` всередині (`homeFull`, imageHeight=3200, startFrame=110, durationFrames=160). На f=280 праворуч виїжджає `MicRecorder` (startFrame=280, sendAtFrame=380) + `Typewriter` пише `{voiceQuery}` у hero-інпут. Після f=420 — crossfade на `offersFull` усередині `BrowserChrome` width=1480.
- **Text / Kinetic Typography:** над браузером «ПОШУК ГОЛОСОМ · 50+ ТУРІВ» (Montserrat 800, 42 px, tracking 0.22em).
- **Audio & VO:** key SFX (SoundBed cue `key = START.interest`). VO: «Скажи — і Vogel знайде твій тур.»
- **Marketing Rationale:** демо унікальної фічі (голосовий пошук) — wow-ефект для ChatGPT-ery.

### Scene 03 — Desire (18–30s · f 540–900)
- **Visual Action:** `BrowserChrome` зумується на `offerDetailFull` (scale 1→1.05 editorial). Праворуч відкривається booking panel: 2× `FormField` (ім'я typing → {managerName guesstimate/clients?}, email типу «@mail»), `Calendar` (month «Липень», fromDay=12, toDay=20, selectFromAt=180, selectToAt=220), `VogelButton` (hoverAt=260, clickAt=290). На f=320 — `RippleClick` у центрі кнопки, потім `Modal` (enterAt=330) з `assets.image.screenshots.success` як дочірнім контентом і banner «Бронювання підтверджено».
- **Text / Kinetic Typography:** заголовок секції «БРОНЮВАННЯ ЗА 30 СЕКУНД» (Montserrat 800, 36 px).
- **Audio & VO:** chime (SoundBed cue `chime = START.desire + 220`). VO: «Ідеальний тур — у три кліки.»
- **Marketing Rationale:** інформаційна «пруф» частина — обіцянка 30 секунд на бронь «показана», а не просто обіцяна.

### Scene 04 — Proof (30–40s · f 900–1200)
- **Visual Action:** Split 50/50. Ліво — `Img src=assets.image.viktoria` у 620×820 glass-card з `BlurIn` fromBlur=18→0 (startFrame=10, durationFrames=30) + підпис `{managerName}, твій персональний менеджер`. Право — 3× `Counter` з `increments`:
  - «Клієнтів» → `stats.clients` (increments 30..110 кожні 3f).
  - «Країн» → `stats.countries` (increments 30..100).
  - «Рейтинг» → `stats.rating` (increments 30..60, mapping на 4.9 через показ текстом).
  Під counter-ами — іконки-зірочки `★★★★★` з fade-in.
- **Text / Kinetic Typography:** hero title «ЖИВА ЛЮДИНА. ЖИВА ДОВІРА.» (Montserrat 900, 84 px) з translate-y 40→0 px easing `editorial`.
- **Audio & VO:** music swell (без додаткового SFX). VO: «З тобою — жива людина. Вікторія.»
- **Marketing Rationale:** social proof + персоналізація — наріжний камінь преміум сегменту.

### Scene 05 — Action (40–45s · f 1200–1350)
- **Visual Action:** `colors.darker`, `Logo` width=640 із stroke-fade (opacity 0→1 за 20f), під ним `{website}` (Montserrat 800, 96 px) та `{phone}` (Inter 600, 42 px). `BirdParticles` seed=99, count=22 з `spreadX=1600`, `driftY=400`.
- **Text / Kinetic Typography:** website з letter-spacing 0→0.05em, phone fade-in 0→1 зі stagger 30f після website.
- **Audio & VO:** final chime (SoundBed cue `chime = START.action`). VO: «Vogel Travel — пиши зараз.»
- **Marketing Rationale:** фінальна відсічка бренду + подвійний CTA (сайт + телефон).

**Компоненти:** Remotion `Video`, `BlurIn`, `IsometricBrowser`, `PageScroll`, `MicRecorder`, `Typewriter`, `BrowserChrome`, `FormField`, `Calendar`, `VogelButton`, `RippleClick`, `Modal`, `Counter`, `Logo`, `BirdParticles`, `SoundBed`.
**Assets:** `assets.video.aerial`, усі `assets.image.screenshots.*`, `assets.image.viktoria`, `assets.image.logo`, `assets.audio.*`.

---

## 💻 Сценарій V3·4 · YouTube FAB · `vogel-youtube-fab-169`

**Фреймворк:** FAB (Features → Advantages → Benefits).
**Ціль:** B2B — власники турагенцій / партнери дивляться на Admin CMS (TipTap, SEO AI, мультимова, аналітика) як рішення «без програмістів».
**Хук (0–6s):** швидкий монтаж адмін-скрінів з feature-chips.
**Метадані:** 1920×1080, 30fps, 750f (25s).
**Schema props:** `website`, `phone`, `managerName`, `withAudio`, `kpi: { conversion, speedX, timeSaved }`, `ctaLabel` (default «Запит демо»).
**Timeline scenes:** `features: 180f | advantages: 240f | benefits: 240f | cta: 90f`.

### Scene 01 — Features (0–6s · f 0–180)
- **Visual Action:** `IsometricBrowser` (flatAtFrame=80) проходить через 4 скріни adm-panel: `admin.login → admin.sidebar → admin.offersList → admin.contentEditor` — crossfade per 36f. Паралельно зверху ліворуч вилазять 4 feature-chips (pill, glassmorphism + icon): «TipTap», «SEO AI», «Мультимова», «Аналітика» — по одному на кожен crossfade.
- **Text / Kinetic Typography:** над браузером заголовок «АДМІНКА, ЩО ПРАЦЮЄ ЗА ТЕБЕ» (Montserrat 900, 64 px, tracking 0.04em) з `BlurIn` fromBlur=18→0.
- **Audio & VO:** key SFX per chip (SoundBed cue `key = START.features + 30`). VO: «Потужна адмінка для твоєї агенції.»
- **Marketing Rationale:** максимальна кількість фіч за 6 секунд — B2B-покупець сканує «що це вміє».

### Scene 02 — Advantages (6–14s · f 180–420)
- **Visual Action:** Ліво 55% — `BrowserChrome` width=1020, height=660 з `admin.contentEditor`. `AnimatedCursor` keyframes:
  ```
  [10, 200, 380, click=false] → [60, 640, 520, click=true] → [120, 480, 420, click=false]
  ```
  Після f=90 `RippleClick` на title-інпуті. Право 45% — 3 advantage-cards з `BlurIn` stagger 40f: «БЕЗ РОЗРОБНИКІВ», «ЗА 5 ХВИЛИН», «ДВІ МОВИ ОДРАЗУ». Кожна картка — glass + icon.
- **Text / Kinetic Typography:** нижче браузера фраза «РЕДАГУЙ ЯК В DOCX» (Inter 600, 24 px, italic), fade-in з f=140.
- **Audio & VO:** click SFX (SoundBed cue `click1 = START.advantages + 60`). VO: «Публікуй контент за п'ять хвилин, без розробників.»
- **Marketing Rationale:** advantage vs alternative (WordPress + plugins + dev).

### Scene 03 — Benefits (14–22s · f 420–660)
- **Visual Action:** Crossfade на новий `BrowserChrome` з `admin.analytics`, scale 1→1.04 editorial. Поверх — 3× `Counter` у row (gap=40 px):
  - `{kpi.conversion}` (`+40`) з суфіксом «% конверсії».
  - `{kpi.speedX}` (`3`) з суфіксом «× швидше».
  - `{kpi.timeSaved}` (`60`) з суфіксом «% часу збережено».
  Кожен `Counter` має increments кожні 2f (accelerated тик). На f=140 — маленький side-card з `admin.partners` скрином.
- **Text / Kinetic Typography:** над counters «РЕЗУЛЬТАТИ, ЩО ВИДНО» (Montserrat 800, 40 px), split-words stagger 6f.
- **Audio & VO:** music swell / chime (SoundBed cue `chime = START.benefits + 100`). VO: «Більше бронювань. Менше рутини.»
- **Marketing Rationale:** benefits — переклад фіч у бізнес-метрики.

### Scene 04 — CTA (22–25s · f 660–750)
- **Visual Action:** `colors.darker`, `Logo` width=520 + `{website}` (Montserrat 800, 72 px) + «{phone}» + `VogelButton` label=`{ctaLabel}` variant=`teal` у glass-card. `BirdParticles` seed=33 count=14.
- **Text / Kinetic Typography:** CTA button has hoverAt=45, clickAt=70 (симулюється фінальний клік).
- **Audio & VO:** chime (SoundBed cue `click2 = START.cta + 70`). VO: «Vogel Admin — запит демо на vogel.travel.»
- **Marketing Rationale:** B2B CTA → «запит демо», найнижча бар'єр-дія для агенції.

**Компоненти:** `IsometricBrowser`, `BlurIn`, `BrowserChrome`, `AnimatedCursor`, `RippleClick`, `Counter`, `Logo`, `VogelButton`, `BirdParticles`, `SoundBed`.
**Assets:** `assets.image.screenshots.admin.login|sidebar|offersList|contentEditor|seoAi|analytics|partners`, `assets.image.logo`, `assets.audio.*`.

---

## Appendix — Mapping: Scenarios ↔ Composition id ↔ Schema props

| Сценарій | Composition id | Schema props (keys) | Default values |
|----------|----------------|---------------------|----------------|
| V3·1 | `vogel-tiktok-aida-916` | `website, phone, managerName, withAudio, ctaPrimary, ctaSecondary` | `www.vogel.travel · +38 050 469 2882 · Вікторія · false · «vogel.travel» · «Посилання у профілі»` |
| V3·2 | `vogel-tiktok-pas-916` | `website, phone, managerName, withAudio, problemHours, ctaPrimary` | `… · 47 · «Пиши Вікторії»` |
| V3·3 | `vogel-youtube-aida-169` | `website, phone, managerName, withAudio, voiceQuery, stats {clients, countries, rating}` | `… · «Мальдіви на двох» · { 1200, 48, 49 }` (rating рендериться як 4.9) |
| V3·4 | `vogel-youtube-fab-169` | `website, phone, managerName, withAudio, kpi {conversion, speedX, timeSaved}, ctaLabel` | `… · { 40, 3, 60 } · «Запит демо»` |

## Appendix — SoundBed cue mapping

| Composition | cues |
|-------------|------|
| `vogel-tiktok-aida-916` | `whoosh1: START.attention`, `click1: START.interest + 80`, `chime: START.desire + 200`, `whoosh2: START.action` |
| `vogel-tiktok-pas-916` | `whoosh1: START.problem`, `whoosh2: START.solution`, `chime: START.solution + 20`, `click1: START.cta` |
| `vogel-youtube-aida-169` | `whoosh1: START.attention`, `key: START.interest`, `chime: START.desire + 220`, `click1: START.action` |
| `vogel-youtube-fab-169` | `key: START.features + 30`, `click1: START.advantages + 60`, `chime: START.benefits + 100`, `click2: START.cta + 70` |

---

## Нотатки для рендера (Remotion Studio)

1. Шрифти `Montserrat`, `Inter`, `MarckScript` завантажуються у `theme/fonts.ts` і чекають через `waitForFonts()` у `calculateMetadata`. Жодних шрифтів-літералів у сценах.
2. Усі assets — через `assets.*` із `lib/staticPath.ts`. Ніяких `staticFile("...")` у сценах.
3. Анімації — лише через `e()` із `lib/interp.ts` + `easings` з `theme/easings.ts`. Не використовуємо raw `interpolate` без clamp.
4. `SoundBed` приймає `enabled={withAudio}` — для тихого перегляду у Studio можна лишити `false`, для фінального рендеру — `true`.
5. TikTok-ролики (9:16) повинні мати safe-zone 112 px знизу (UI TikTok/Reels) — уникати ключових елементів нижче y=1800 із 1920.
