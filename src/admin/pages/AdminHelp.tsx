import { 
  FileQuestion, 
  Image as ImageIcon, 
  Search, 
  LayoutTemplate, 
  HelpCircle,
  Hotel,
  PenSquare,
  Wrench,
  Handshake,
  Sparkles,
  Move,
  ListOrdered,
  Lock,
  AlertCircle,
  Settings,
  AudioLines,
  Type,
  MousePointer2,
  Globe,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function AdminHelp() {
  return (
    <div className="max-w-5xl pb-16">
      {/* Header */}
      <div className="mb-10 bg-gradient-to-r from-teal-500 to-emerald-600 p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <HelpCircle size={32} />
          Повна інструкція користувача Vogel Travel
        </h1>
        <p className="opacity-90 mt-3 text-lg max-w-2xl">
          Цей посібник допоможе вам освоїти всі інструменти для керування сайтом: від додавання турів до AI-оптимізації контенту.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 0: Вхід та Загальні правила */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-800">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Lock size={20} className="text-slate-600" />
              </div>
              <h2 className="text-xl font-bold">Вхід та Навігація</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-teal-600">1.</span>
                <span>Панель доступна за адресою <code className="bg-gray-50 px-1 rounded text-teal-700">/admin</code> вашого домену.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-teal-600">2.</span>
                <span>Зліва розташоване <span className="font-semibold">Головне меню</span> для швидкого перемикання між Пропозиціями, Блогом, Сервісами та SEO.</span>
              </li>
              <li className="flex gap-2 text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 mt-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Будь-які зміни з'являються на сайті <span className="font-bold uppercase text-[10px]">миттєво</span> після збереження.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4 text-gray-800">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold">Обов'язкові поля</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Поля з червоною зірочкою (<span className="text-red-500 font-bold">*</span>) є критичними для системи.
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Без назви готелю чи послуги URL-посилання не зможе згенеруватися коректно.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Фото обкладинки — це обличчя картки на сайті. Його відсутність зламає вигляд сторінки.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Керування Пропозиціями */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-50 p-6 flex items-center justify-between bg-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Hotel size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Керування Пропозиціями (Турами)</h2>
                <p className="text-sm text-blue-600">Наповнення готелів та спеціальних пропозицій</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings size={18} className="text-gray-400" /> Основна картка (прев'ю)
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><span className="font-semibold text-gray-700">Готель (*):</span> Назва, що стане заголовком картки.</li>
                <li><span className="font-semibold text-gray-700">Локація (*):</span> Наприклад: "Мальдіви, атол Арі".</li>
                <li><span className="font-semibold text-gray-700">Період перебування:</span> Дати, наприклад: "10-17 червня".</li>
                <li><span className="font-semibold text-gray-700">Бронювання до:</span> Дедлайн акції, що створює ефект терміновості.</li>
                <li className="bg-emerald-50 text-emerald-700 p-2 rounded text-xs border border-emerald-100">
                  <span className="font-bold">Порада:</span> Поле "Знижка" використовуйте для яскравих бейджів: "-30%", "HOT", або "Все включено".
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon size={18} className="text-gray-400" /> Фото та Галерея
              </h3>
              <p className="text-sm text-gray-500">Ви можете змінювати порядок фото у галереї простим перетягуванням. Головне фото завжди йде першим на картці.</p>
              <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-xs text-gray-400 text-center">
                ⠿ Перетягніть для зміни порядку
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Блог */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-50 p-6 flex items-center justify-between bg-orange-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
                <PenSquare size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Ведення Блогу</h2>
                <p className="text-sm text-orange-600">Статті, новини та корисні поради</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-3 text-sm text-gray-600">
              <div className="bg-orange-50 p-2 rounded text-orange-600 h-fit"><Search size={16}/></div>
              <div>
                <span className="font-semibold text-gray-700 block">Категорія Статті</span>
                Відображається як кольоровий тег над заголовком. Допомагає клієнтам фільтрувати контент (Поради, Новини, Курорти).
              </div>
            </div>
            
            <div className="flex gap-3 text-sm text-gray-600">
              <div className="bg-orange-50 p-2 rounded text-orange-600 h-fit"><AudioLines size={16}/></div>
              <div>
                <span className="font-semibold text-gray-700 block">Аудіоверсія (Подкаст)</span>
                Можливість завантажити аудіофайл. Це підвищує лояльність користувачів. Озвучку можна генерувати через AI сервіси.
              </div>
            </div>
          </div>
        </div>

        {/* Section: Сервіси (Detailed from Guide) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-50 p-6 bg-teal-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                <Wrench size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Керування Сервісами</h2>
                <p className="text-sm text-teal-600">Налаштування послуг (Авіаквитки, Страхування тощо)</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <ListOrdered size={18} className="text-teal-500" /> Основні поля
                </h4>
                <div className="text-xs text-gray-600 space-y-2">
                  <p><strong>Номер (*):</strong> Визначає порядок сервісів у сітці на головній сторінці (01, 02...).</p>
                  <p><strong>Опис:</strong> Короткий анонс (2-3 речення), що пояснює суть послуги.</p>
                  <p><strong>Зображення:</strong> Якісне тематичне фото (рекомендовано 800x600 px).</p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Layers size={18} className="text-teal-500" /> Деталі (підпункти)
                </h4>
                <p className="text-xs text-gray-600">
                  Список особливостей або переваг. Наприклад: <span className="italic text-teal-700">"Доставка 24/7"</span> або <span className="italic text-teal-700">"Без комісії"</span>.
                  Кожен пункт має власну Назву та короткий Текст.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <LayoutTemplate size={18} className="text-teal-500" /> Внутрішня сторінка
                </h4>
                <p className="text-xs text-gray-600">
                  Через блоковий конструктор ви можете створити повноцінну сторінку для сервісу з текстом, фото та списками.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Партнери (Detailed from Guide) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-50 p-6 bg-indigo-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Handshake size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Партнери та Інтерактивна Мапа</h2>
                <p className="text-sm text-indigo-600">База брендів та їх розташування у світі</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <ImageIcon size={18} className="text-indigo-500" /> Візуальні дані
                </h4>
                <ul className="text-xs text-gray-600 space-y-2 list-disc ml-4">
                  <li><strong>Логотип (*):</strong> Обов'язково у форматі <span className="font-bold">PNG або SVG з прозорим фоном</span>.</li>
                  <li><strong>Обкладинка:</strong> Головне фото сторінки партнера (рекомендовано 1920x1080 px).</li>
                  <li><strong>Опис:</strong> Вступне слово, яке на сайті виділяється курсивом.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Globe size={18} className="text-indigo-500" /> Налаштування мапи
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-[10px]">
                    <span className="font-bold block text-indigo-700 mb-1">Tag (Скорочення)</span>
                    2-3 великі літери (напр. FS, EK) для кружечка на мапі.
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-[10px]">
                    <span className="font-bold block text-indigo-700 mb-1">Колір</span>
                    Фірмовий колір бренду для маркера на мапі світу.
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-[10px]">
                    <span className="font-bold block text-indigo-700 mb-1">Координати</span>
                    Широта та довгота (напр. 50.45, 30.52) з Google Maps.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Робота з редактором (Контент-секції) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <LayoutTemplate size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Блоковий Конструктор Контенту</h2>
              <p className="text-gray-500">Гнучке наповнення внутрішніх сторінок</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center gap-2 text-indigo-600 mb-3">
                <Type size={20} />
                <span className="font-bold">Текстовий Блок</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Заголовки, абзаци та посилання. Всі стилі вже зашиті у сайт — вам достатньо просто вводити текст.
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center gap-2 text-teal-600 mb-3">
                <ImageIcon size={20} />
                <span className="font-bold">Блок Зображення</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Додавайте фото між текстом. Обов'язково завантажуйте фото з Alt-текстом для пошукових систем.
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <ListOrdered size={20} />
                <span className="font-bold">Блок Списку</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ідеально для перерахування послуг, складів туру чи корисних порад клієнтам.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Move size={24} className="text-amber-700" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-1 leading-none uppercase text-xs tracking-wider">Важлива механіка</h4>
              <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                Ви можете повністю змінити логіку сторінки після написання. Просто затисніть іконку <span className="font-bold">⠿</span> зліва від назви будь-якої секції та перетягніть її вище або нижче.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: SEO та Асистент */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-teal-500 rounded-xl">
                  <Search size={28} />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-tight">SEO Просування</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-teal-400 font-bold text-sm mb-1">SEO Title</h4>
                  <p className="text-sm opacity-70">Заголовок для Google (50-60 символів). Має бути привабливим для клієнта.</p>
                </div>
                <div>
                  <h4 className="text-teal-400 font-bold text-sm mb-1">SEO Description</h4>
                  <p className="text-sm opacity-70">Короткий опис у пошуку. Що цікавіше він написаний — то більше людей зайде на сайт.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="text-teal-400 font-bold text-xs mb-2">Alt-текст для зображень</h4>
                  <p className="text-xs opacity-80 leading-relaxed italic">
                    "Вид з вікна на гори" — пошуковик не бачить фото, він читає цей текст. Опишіть словами те, що бачите на малюнку.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex flex-col">
              <div className="flex items-center gap-2 font-bold mb-4">
                <Sparkles size={24} className="text-teal-400 animate-pulse" />
                <span className="text-xl">AI Асистент Масштабування</span>
              </div>
              <p className="text-sm opacity-80 mb-6 flex-1">
                Це найшвидший спосіб заповнити SEO дані для сотень сторінок за допомогою ChatGPT чи Claude.
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 text-xs bg-black/20 p-2 rounded-lg items-center text-teal-300 font-bold border border-teal-500/30">
                  <CheckCircle2 size={16} /> Професійні кроки описані в ADMIN_GUIDE.md
                </div>
                <div className="space-y-2 opacity-80 pl-2 border-l border-teal-500/30">
                  <p className="text-[10px]">1. Згенеруйте промпт в розділі SEO.</p>
                  <p className="text-[10px]">2. Вставте його в AI та отримайте JSON код.</p>
                  <p className="text-[10px]">3. Скопіюйте код в поле "Імпорт" в адмінці.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Робота з зображеннями */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <ImageIcon size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Оптимізація та Дизайн</h2>
              <p className="text-gray-500">Автоматичні стандарти Vogel Travel</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-gray-600">
            <div className="space-y-3">
              <h4 className="font-bold text-teal-800">Авто-WebP та Адаптивність</h4>
              <p>Система автоматично конвертує фото у надлегкий формат та адаптує весь контент під мобильні телефони iPhone/Android.</p>
              <p className="text-xs text-slate-400">Вам не потрібно окремо верстати сторінки для смартфонів — все відбувається автоматично.</p>
            </div>
            <div className="space-y-3 p-4 bg-teal-50/30 rounded-xl border border-teal-100 text-xs">
              <h4 className="font-bold text-teal-800">Рекомендована вага:</h4>
              <p>Хоча система стискає фото, намагайтеся завантажувати файли <span className="font-bold text-emerald-700">до 2 МБ</span> для стабільної роботи адмін-панелі.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <FileQuestion className="text-gray-400" size={28} /> Часті Питання та Відповіді
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="group">
              <h4 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors uppercase text-[11px] tracking-widest">Видалення даних</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Якщо ви видаляєте статтю, послугу чи готель — вони видаляються <span className="font-bold text-red-500">остаточно</span>. Кошика не передбачено.
              </p>
            </div>
            <div className="group">
              <h4 className="font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors uppercase text-[11px] tracking-widest">Помилка збереження</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Якщо кнопка "Зберегти" не активна — перевірте, чи всі поля з червоною зірочкою (*) заповнені.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
