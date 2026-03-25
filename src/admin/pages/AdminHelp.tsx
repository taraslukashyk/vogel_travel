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
  CheckCircle2,
  Eye,
  Trash2,
  Save,
  Rocket
} from 'lucide-react';

export default function AdminHelp() {
  return (
    <div className="max-w-6xl pb-20">
      {/* Hero Welcome Section */}
      <div className="mb-12 bg-gradient-to-br from-indigo-600 via-teal-500 to-emerald-500 p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold flex items-center gap-4 mb-4">
            <Rocket size={40} className="animate-bounce" />
            Ваш путівник по адмін-панелі Vogel Travel
          </h1>
          <p className="opacity-90 text-xl max-w-3xl leading-relaxed">
            На цій сторінці зібрана повна інструкція: де що означає, як правильно заповнювати поля, як створювати контент за допомогою блоків та як працює SEO-оптимізація.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Section 1: Основи роботи та Навігація */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6 text-indigo-700">
              <Lock size={24} />
              <h2 className="text-2xl font-bold">1. Основи роботи та Навігація</h2>
            </div>
            <div className="space-y-6 text-gray-600">
              <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Menu size={20} className="shrink-0 text-slate-400 mt-1" />
                <p className="text-sm">
                  <span className="font-bold text-gray-800">Бокове меню:</span> Використовуйте його для швидкого переходу між розділами <strong>Пропозиції</strong>, <strong>Блог</strong>, <strong>Сервіси</strong>, <strong>Партнери</strong> та <strong>SEO</strong>.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Save size={18} className="text-emerald-600" />
                    <span className="font-bold text-emerald-800 text-sm">Збереження</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">Всі зміни публікуються на сайті <strong>миттєво</strong> після натискання кнопки "Зберегти" у формі.</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={18} className="text-amber-600" />
                    <span className="font-bold text-amber-800 text-sm">Перевірка</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">Після збереження відкрийте сайт у новій вкладці, щоб побачити фінальний вигляд сторінки.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Видалення даних</h3>
            <p className="text-sm text-red-700 leading-relaxed mb-4">
              Будьте гранично уважні! На сайті <span className="font-bold underline">відсутній кошик</span>. Якщо ви підтвердили видалення статті чи готелю — вони видаляються з бази даних назавжди.
            </p>
            <div className="mt-auto px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-200">
              Поворот неможливий
            </div>
          </div>
        </div>

        {/* Section 2: Правила заповнення полів (Common Patterns) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">2. Правила заповнення та редагування</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase italic">
                <AlertCircle size={14} /> Обов'язкові поля (*)
              </div>
              <p className="text-xs text-gray-500 italic">Позначені червоною зірочкою. Без них система не дозволить зберегти форму (кнопка буде неактивна або з'явиться помилка).</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase italic">
                <ImageIcon size={14} /> Тільки якісні фото
              </div>
              <p className="text-xs text-gray-500 italic">Система автоматично стисне будь-яке фото, але для кращого результату використовуйте горизонтальні знімки об'ємом до 2 МБ.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase italic">
                <Save size={14} /> Коригування
              </div>
              <p className="text-xs text-gray-500 italic">Ви можете зайти в будь-який існуючий запис, змінити текст чи фото та натиснути "Зберегти" — зміни оновлять сторінку.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase italic">
                <Search size={14} /> SEO на кожній сторінці
              </div>
              <p className="text-xs text-gray-500 italic">Не ігноруйте блок SEO внизу форми — саме ці дані роблять ваш сайт видимим для Google.</p>
            </div>
          </div>
        </div>

        {/* Sections for Specific Modules (Offer, Blog, Services, Partners) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Offers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-indigo-100/50">
            <div className="p-6 bg-indigo-50 flex items-center justify-between border-b border-indigo-100">
               <div className="flex items-center gap-3">
                 <Hotel className="text-indigo-600" />
                 <h3 className="font-bold text-indigo-900">Пропозиції та Готелі</h3>
               </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Кожна пропозиція складається з <strong>Картки (прев'ю)</strong> для головної та <strong>Внутрішньої сторінки</strong>.</p>
              <ul className="space-y-2 text-xs text-gray-500 ml-4 list-disc">
                <li><span className="font-bold text-gray-800">Бейдж знижки:</span> Текст на зеленому фоні (напр. -40% або HOT).</li>
                <li><span className="font-bold text-gray-800">Бронювання до:</span> Створює таймер актуальності на картці.</li>
                <li><span className="font-bold text-gray-800">Галерея:</span> Слайдер фотографій всередині сторінки готелю.</li>
              </ul>
            </div>
          </div>

          {/* Blog */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-orange-100/50">
            <div className="p-6 bg-orange-50 flex items-center justify-between border-b border-orange-100">
               <div className="flex items-center gap-3">
                 <PenSquare className="text-orange-600" />
                 <h3 className="font-bold text-orange-900">Блог та Статті</h3>
               </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Для написання корисних матеріалів та залучення SEO-трафіку.</p>
              <ul className="space-y-2 text-xs text-gray-500 ml-4 list-disc">
                <li><span className="font-bold text-gray-800">Категорія:</span> Відображається над заголовком для сортування контенту.</li>
                <li><span className="font-bold text-gray-800">Подкаст:</span> Аудіофайл, що дозволяє користувачам "слухати" статтю.</li>
                <li><span className="font-bold text-gray-800">Обкладинка:</span> Має бути максимально яскравою, щоб клієнт хотів клікнути.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Services & Partners (Detailed grid) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           {/* Services */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-teal-100/50">
            <div className="p-6 bg-teal-50 flex items-center justify-between border-b border-teal-100">
               <div className="flex items-center gap-3">
                 <Wrench className="text-teal-600" />
                 <h3 className="font-bold text-teal-900">Послуги (Сервіси)</h3>
               </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm text-gray-600">
                <p>Опис послуг прямо на головній сторінці (Авіа, Страхування тощо).</p>
                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <ListOrdered size={16} className="text-teal-500 mt-1" />
                    <p className="text-xs"><strong>Номер (напр. 01):</strong> Визначає позицію сервісу в сітці. Змінюйте цей номер, щоб поміняти сервіси місцями.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers size={16} className="text-teal-500 mt-1" />
                    <p className="text-xs"><strong>Деталі:</strong> Короткі тези про послугу. Формат: Назва ("Підтримка") - Текст ("В режимі 24/7").</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-indigo-100/50 text-indigo-900/40">
            <div className="p-6 bg-indigo-50 flex items-center justify-between border-b border-indigo-100">
               <div className="flex items-center gap-3">
                 <Handshake className="text-indigo-600" />
                 <h3 className="font-bold text-indigo-900">Партнери та Мапа</h3>
               </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm text-gray-600">
                <p>Керування базою готелів та брендів, які відображаються на інтерактивній мапі.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                   <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Логотип</span>
                      <p className="text-[10px]">Формат PNG/SVG на прозорому фоні.</p>
                   </div>
                   <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Tag (Маркер)</span>
                      <p className="text-[10px]">2-3 літери всередині кола на мапі.</p>
                   </div>
                   <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Мапа</span>
                      <p className="text-[10px]">Вставте координати прямо з Google Maps.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Блоковий конструктор (How to build content) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/3">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6">
                <LayoutTemplate size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Як створювати контент блок за блоком</h2>
              <p className="text-gray-500 leading-relaxed">
                Замість одного великого вікна для тексту ми використовуємо "Секції". Це дозволяє створювати красиві статті, де текст чергується з великими фото та списками.
              </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-100 rounded-2xl bg-slate-50 relative group">
                <div className="absolute -top-1 right-2 text-xs font-black text-indigo-100 group-hover:text-indigo-200 transition-colors uppercase">Section Type</div>
                <h4 className="font-bold text-indigo-700 flex items-center gap-2 mb-3"><Type size={18}/> Текст</h4>
                <p className="text-xs text-gray-500">Використовуйте для абзаців, підзаголовків (через меню редактору) та жирного шрифту. Всі відступи налаштовані автоматично.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl bg-slate-50 relative group">
                <div className="absolute -top-1 right-2 text-xs font-black text-indigo-100 group-hover:text-indigo-200 transition-colors uppercase">Section Type</div>
                <h4 className="font-bold text-teal-700 flex items-center gap-2 mb-3"><ImageIcon size={18}/> Фото</h4>
                <p className="text-xs text-gray-500">Вставляє широкоформатне зображення між текстом. Має окреме поле для підпису та SEO опису (Alt).</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl bg-slate-50 relative group">
                <div className="absolute -top-1 right-2 text-xs font-black text-indigo-100 group-hover:text-indigo-200 transition-colors uppercase">Section Type</div>
                <h4 className="font-bold text-blue-700 flex items-center gap-2 mb-3"><ListOrdered size={18}/> Список</h4>
                <p className="text-xs text-gray-500">Маркований список. Кожен пункт — це окреме поле. Ідеально для переваг чи програми поїздки.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl bg-indigo-600 text-white relative flex flex-col justify-center items-center text-center">
                 <Move size={32} className="mb-2" />
                 <h4 className="font-bold leading-tight">Зміна порядку</h4>
                 <p className="text-[10px] opacity-80 mt-2 italic px-4">Затисніть іконку ⠿ зліва від секції та перетягніть її вгору або вниз!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: SEO та Асистент (Global settings) */}
        <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-teal-500 rounded-2xl shadow-xl shadow-teal-500/30">
                <Globe size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Глобальне SEO</h2>
                <p className="text-teal-400 font-medium">Керування видимістю всього сайту</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h4 className="text-teal-400 font-bold mb-2 flex items-center gap-2">
                     <Settings size={16} /> Розділ SEO в меню
                   </h4>
                   <p className="text-sm opacity-70 leading-relaxed mb-4">
                     Тут ви налаштовуєте "Мета-дані" для сторінок, які не мають власних форм редагування (Головна, Контакти, Про нас).
                   </p>
                   <ul className="space-y-3">
                      <li className="flex gap-3 text-xs opacity-90"><span className="text-teal-400 font-bold">OG Image:</span> Фото, яке підтягнеться в Viber/Telegram/Facebook при надсиланні посилання.</li>
                      <li className="flex gap-3 text-xs opacity-90"><span className="text-teal-400 font-bold">Keywords:</span> Ключові слова — підказки для пошукових роботів Google.</li>
                   </ul>
                </div>
              </div>

              <div className="bg-teal-500/10 p-8 rounded-3xl border border-teal-500/20 flex flex-col">
                <div className="flex items-center gap-3 font-extrabold text-2xl mb-6">
                  <Sparkles size={32} className="text-teal-400" /> AI Асистент
                </div>
                <div className="space-y-4">
                  <p className="text-sm opacity-80 leading-relaxed">
                    Якщо у вас сотні готелів і ви не хочете заповнювати SEO вручну — використовуйте інструмент імпорту.
                  </p>
                  <div className="p-4 bg-teal-500/20 rounded-xl space-y-3">
                    <div className="flex gap-3 items-center text-xs font-bold text-teal-300">
                      <div className="w-5 h-5 rounded bg-teal-500 text-white flex items-center justify-center shrink-0">1</div>
                      Згенеруйте промпт (завдання для ШІ)
                    </div>
                    <div className="flex gap-3 items-center text-xs font-bold text-teal-300">
                      <div className="w-5 h-5 rounded bg-teal-500 text-white flex items-center justify-center shrink-0">2</div>
                      Вставте в ChatGPT отриманий текст
                    </div>
                    <div className="flex gap-3 items-center text-xs font-bold text-teal-300">
                      <div className="w-5 h-5 rounded bg-teal-500 text-white flex items-center justify-center shrink-0">3</div>
                      Код з відповіді вставте в поле "Імпорт"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Швидкі поради та Редагування */}
        <div className="bg-emerald-600 rounded-3xl p-10 text-white">
           <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
             <Rocket size={28} /> Поради по заповненню та коригуванню
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-90 leading-relaxed">
              <div className="space-y-3">
                 <h4 className="font-bold underline decoration-white/30 underline-offset-4 mb-2 uppercase text-xs tracking-widest">Як коригувати?</h4>
                 <p>Ви можете редагувати будь-яку статтю чи тур нескінченну кількість разів. Просто змініть потрібне поле та натисніть "Зберегти". Зміни одразу замінять старий контент.</p>
              </div>
              <div className="space-y-3">
                 <h4 className="font-bold underline decoration-white/30 underline-offset-4 mb-2 uppercase text-xs tracking-widest">Про мобільні версії</h4>
                 <p>Весь ваш контент (тексти, таблиці, списки) автоматично адаптується під екрани мобільних телефонів. Вам не потрібно про це турбуватися.</p>
              </div>
              <div className="space-y-3">
                 <h4 className="font-bold underline decoration-white/30 underline-offset-4 mb-2 uppercase text-xs tracking-widest">Чому не зберігається?</h4>
                 <p>Якщо форма не зберігається — прокрутіть її до самого верху. Там з'явиться червоне сповіщення про те, яке саме поле заповнене некоректно.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function Menu(props: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  );
}
