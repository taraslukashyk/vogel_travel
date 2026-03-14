# 🕊️ Vogel Travel — Premium Travel Concierge

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Vogel Travel — це сучасна веб-платформа для преміального туристичного консьєрж-сервісу. Проєкт поєднує вишуканий дизайн, високу продуктивність та інтерактивні елементи для створення найкращого клієнтського досвіду.

## 🚀 Основні особливості

- **High Performance**: Lazy loading секцій через `React.lazy` + `Suspense`.
- **Image Optimization**: Використання WebP, `loading="lazy"` та адаптивних розмірів (`srcset`).
- **Code Splitting**: Оптимізована збірка через `manualChunks` у Rollup.
- **Smart Caching**: Інтеграція `TanStack Query` (React Query) для ефективного управління станом та кешування.
- **Modern E2E Testing**: Повна міграція з Python на Playwright (TypeScript) для надійного тестування.
- **Unit Testing**: Компонентне тестування через `Vitest` та `Testing Library`.

## 🛠️ Технологічний стек

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Animations**: GSAP, Framer Motion
- **Maps**: MapLibre GL
- **State/API**: TanStack Query
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Build Tool**: Vite

## 📦 Встановлення та запуск

1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/taraslukashyk/vogel_travel.git
   ```

2. Встановіть залежності:
   ```bash
   npm install
   ```

3. Запустіть сервер для розробки:
   ```bash
   npm run dev
   ```

4. Збірка проєкту:
   ```bash
   npm run build
   ```

## 🧪 Тестування

- **Unit тести**: `npm run test`
- **E2E тести**: `npm run test:e2e`
- **UI режим тестів**: `npm run test:ui`

## 📈 Оптимізація

Ми використовуємо автоматичне розбиття коду на чанки:
- `vendor-react`: Ядро React
- `vendor-map`: Картографічні сервіси
- `vendor-icons`: Набір іконок Lucide
- `vendor-animation`: GSAP та інші анімації

## 📱 Скріншоти

*(Тут можна додати скріншоти вашого проєкту)*

![Hero Section](https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200)

## 📄 Ліцензія

Proprietary © 2026 Vogel Family Travel.
