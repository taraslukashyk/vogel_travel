import { FileQuestion, Image as ImageIcon, Search, LayoutTemplate, HelpCircle } from 'lucide-react';

export default function AdminHelp() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle className="text-teal-500" />
          Інструкція користувача
        </h1>
        <p className="text-gray-600 mt-2">
          Тут зібрані основні правила та поради щодо заповнення інформації в адмін-панелі сайту Vogel Travel.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <LayoutTemplate size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Основні принципи</h2>
          </div>
          <ul className="space-y-3 text-gray-600 ml-4 list-disc marker:text-blue-500">
            <li><strong>Оновлення в реальному часі:</strong> Будь-які зміни (додавання, редагування, видалення) застосовуються на сайті одразу після натискання кнопки «Зберегти».</li>
            <li><strong>Обов'язкові поля:</strong> Поля, позначені червоною зірочкою (<span className="text-red-500">*</span>), є обов'язковими. Без їх заповнення форма не збережеться.</li>
            <li><strong>Підказки (i):</strong> Біля багатьох неочевидних полів є іконка <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold mx-1 border cursor-help">i</span>. Наведіть на неї курсор, щоб прочитати детальну інструкцію для конкретного поля.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <ImageIcon size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Робота з зображеннями</h2>
          </div>
          <ul className="space-y-3 text-gray-600 ml-4 list-disc marker:text-teal-500">
            <li><strong>Завантаження:</strong> Ви можете завантажити фото з комп'ютера або обрати з існуючих у Медіабібліотеці.</li>
            <li><strong>Розмір:</strong> Рекомендується використовувати зображення горизонтальної орієнтації (наприклад, 800x600 px або 1200x800 px). Занадто великі фото (понад 2-5 МБ) можуть сповільнювати сайт.</li>
            <li><strong>Формат та Автоконвертація:</strong> Ви можете завантажувати фото у будь-яких популярних форматах (<code>.jpg</code>, <code>.png</code>, <code>.jpeg</code> тощо). Всі зображення <strong>автоматично конвертуються у сучасний формат <code>.webp</code></strong> при завантаженні на сервер. Це суттєво пришвидшує завантаження сайту у клієнтів.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Search size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">SEO налаштування (Пошукова оптимізація)</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Більшість сутностей (статті блогу, пропозиції) мають окремий SEO-блок внизу форми. Це важливо для просування сайту в Google.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">SEO Title</h3>
              <p className="text-sm text-gray-600">Головний заголовок, що відображається у пошуку. Повинен бути привабливим та містити ключове слово. (50-60 символів)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">SEO Description</h3>
              <p className="text-sm text-gray-600">Текст-анонс у пошуковій видачі. Має спонукати клієнта перейти на сайт. (до 160 символів)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <h3 className="font-medium text-gray-800 mb-2">Open Graph (OG)</h3>
              <p className="text-sm text-gray-600">
                Загальносистемні SEO-налаштування сторінок (сторінка "Про нас", "Контакти" тощо) керуються у розділі <strong>SEO</strong> у боковому меню. Там також налаштовується <strong>OG (Open Graph)</strong> — спеціальні теги, щоб при поширенні посилання у Facebook або Telegram відображалася красива картинка та заголовок.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <FileQuestion size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Часті питання</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">Що робити, якщо я випадково щось видалив?</h4>
              <p className="text-sm text-gray-600 mt-1">Видалення записів в базі даних є остаточним. Обов'язково перевіряйте інформацію перед підтвердженням видалення.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Чому не зберігається форма?</h4>
              <p className="text-sm text-gray-600 mt-1">Перевірте, чи заповнені всі поля з червоною зірочкою. Якщо все заповнено, але проблема залишається, спробуйте оновити сторінку.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Скільки пропозицій можна додавати?</h4>
              <p className="text-sm text-gray-600 mt-1">Кількість не обмежена, але намагайтеся тримати актуальні пропозиції, а старі — видаляти або переводити в архівний стан (якщо такий функціонал передбачено).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
