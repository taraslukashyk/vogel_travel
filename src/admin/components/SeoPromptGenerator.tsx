import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Copy, Wand2, Loader2, Check, Download, Upload } from 'lucide-react';
import type { DBOffer, DBBlogPost, DBSeoMeta } from '../../lib/types';

export default function SeoPromptGenerator() {
  const [loading, setLoading] = useState(false);
  const [promptContent, setPromptContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generatePrompt = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const [
        { data: offers },
        { data: blogPosts },
        { data: seoMeta },
      ] = await Promise.all([
        supabase.from('offers').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('seo_meta').select('*'),
      ]);

      const dataToFill = {
        pages: (seoMeta as DBSeoMeta[])?.map(p => ({
          page_path: p.page_path,
          current_seo_title: p.title || '',
          current_seo_description: p.description || '',
          current_og_title: p.og_title || '',
          current_og_description: p.og_description || '',
          keywords: p.keywords || '',
          action: "FILL_MISSING_SEO_AND_OG"
        })),
        offers: (offers as DBOffer[])?.map(o => ({
          id: o.id,
          hotel: o.hotel,
          location: o.location,
          content_preview: o.description?.slice(0, 200) || '',
          current_seo_title: o.seo_title || '',
          current_seo_description: o.seo_description || '',
          image_alt: o.image_alt || '',
          action: "FILL_MISSING_SEO_AND_ALT"
        })),
        blog_posts: (blogPosts as DBBlogPost[])?.map(b => ({
          id: b.id,
          title: b.title,
          content_preview: b.excerpt?.slice(0, 200) || '',
          current_seo_title: b.seo_title || '',
          current_seo_description: b.seo_description || '',
          image_alt: b.image_alt || '',
          action: "FILL_MISSING_SEO_AND_ALT"
        }))
      };

      const systemPrompt = `Ти досвідчений SEO-спеціаліст. Твоє завдання – заповнити відсутні SEO-дані (title, description, keywords) та alt-тексти для зображень для туристичного сайту на основі переданого JSON. 

КРОК 1. Проаналізуй поточні тренди в туристичній сфері та SEO-практиках на дату твого запиту, згідно із загальноприйнятими правилами. Коротко напиши мені свій аналіз і стратегію (що варто вказувати, якої довжини мають бути title/description, які заклики до дії (CTA) краще працюють).
КРОК 2. Поясни, що і в яких місцях (у яких полях) ти будеш заповнювати, щоб я розумів твою логіку. 
КРОК 3. Згенеруй та поверни ОДИН валідний JSON файл, який повторює структуру мого запиту, але з повністю заповненими порожніми полями. 
 - Для seo_title та og_title дотримуйся довжини 50-60 символів, для seo_description та og_description - до 160 символів.
 - Open Graph (og_title, og_description) заповнюються переважно для загальних сторінок (pages).
 - Для зображень придумай релевантний 'image_alt' на основі назви готелю, локації або заголовку. Якщо контексту недостатньо або придумати неможливо, просто залиш поле порожнім (не пиши заглушок).
 - У виведеному JSON видали поле "action", залиш тільки id (або page_path) та заповнені поля (наприклад, seo_title, seo_description, og_title, og_description, image_alt), щоб формат був максимально компактним.

Ось поточні дані сайту у форматі JSON:
\`\`\`json
${JSON.stringify(dataToFill, null, 2)}
\`\`\`
`;

      setPromptContent(systemPrompt);
    } catch (error) {
      console.error('Error generating SEO prompt:', error);
      alert('Помилка при генерації промпту. Перевірте консоль.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (promptContent) {
      navigator.clipboard.writeText(promptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveJson = async () => {
    try {
      if (!jsonInput.trim()) return;
      setIsSaving(true);
      setSaveSuccess(false);

      const parsed = JSON.parse(jsonInput);
      
      const updates = [];

      // Оновлюємо pages (seo_meta)
      if (Array.isArray(parsed.pages)) {
        for (const page of parsed.pages) {
          if (!page.page_path) continue;
          const updateData: any = {};
          if (page.current_seo_title !== undefined) updateData.title = page.current_seo_title;
          if (page.seo_title !== undefined) updateData.title = page.seo_title; // враховуємо якщо АІ змінив назву поля
          if (page.current_seo_description !== undefined) updateData.description = page.current_seo_description;
          if (page.seo_description !== undefined) updateData.description = page.seo_description;
          if (page.current_og_title !== undefined) updateData.og_title = page.current_og_title;
          if (page.og_title !== undefined) updateData.og_title = page.og_title;
          if (page.current_og_description !== undefined) updateData.og_description = page.current_og_description;
          if (page.og_description !== undefined) updateData.og_description = page.og_description;
          if (page.keywords !== undefined) updateData.keywords = page.keywords;
          
          if (Object.keys(updateData).length > 0) {
            updates.push(supabase.from('seo_meta').update(updateData).eq('page_path', page.page_path));
          }
        }
      }

      // Оновлюємо offers
      if (Array.isArray(parsed.offers)) {
        for (const offer of parsed.offers) {
          if (!offer.id) continue;
          const updateData: any = {};
          if (offer.current_seo_title !== undefined) updateData.seo_title = offer.current_seo_title;
          if (offer.seo_title !== undefined) updateData.seo_title = offer.seo_title;
          if (offer.current_seo_description !== undefined) updateData.seo_description = offer.current_seo_description;
          if (offer.seo_description !== undefined) updateData.seo_description = offer.seo_description;
          if (offer.image_alt !== undefined) updateData.image_alt = offer.image_alt;

          if (Object.keys(updateData).length > 0) {
            updates.push(supabase.from('offers').update(updateData).eq('id', offer.id));
          }
        }
      }

      // Оновлюємо blog_posts
      if (Array.isArray(parsed.blog_posts)) {
        for (const post of parsed.blog_posts) {
          if (!post.id) continue;
          const updateData: any = {};
          if (post.current_seo_title !== undefined) updateData.seo_title = post.current_seo_title;
          if (post.seo_title !== undefined) updateData.seo_title = post.seo_title;
          if (post.current_seo_description !== undefined) updateData.seo_description = post.current_seo_description;
          if (post.seo_description !== undefined) updateData.seo_description = post.seo_description;
          if (post.image_alt !== undefined) updateData.image_alt = post.image_alt;

          if (Object.keys(updateData).length > 0) {
            updates.push(supabase.from('blog_posts').update(updateData).eq('id', post.id));
          }
        }
      }

      await Promise.all(updates);
      setSaveSuccess(true);
      setJsonInput('');
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err: any) {
      console.error('Save SEO error:', err);
      alert('Помилка імпорту! Переконайтеся, що ви вставили валідний JSON. ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Wand2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Асистент штучного інтелекту для SEO</h2>
          <p className="text-sm text-gray-600 mt-1">
            Цей інструмент автоматично збирає всі порожні або заповнені SEO-поля з усього сайту (сторінки, пропозиції, статті блогу). Штучний інтелект (ChatGPT, Claude) проаналізує актуальні туристичні тренди, складе привабливі заголовки, підбере правильні ключові слова та згенерує `alt`-тексти для зображень. Після імпорту даних усі поля автоматично оновляться на сайті. За потреби, ви зможете пробігтися по кожній пропозиції чи сторінці та підкоригувати згенеровані дані власноруч.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {!promptContent ? (
          <button
            onClick={generatePrompt}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
            {loading ? 'Збираємо дані сайту...' : 'Згенерувати промпт для AI'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <pre className="w-full h-64 p-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg overflow-auto whitespace-pre-wrap">
                {promptContent}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Скопійовано!' : 'Скопіювати промпт'}
              </button>
              <button
                onClick={() => setPromptContent('')}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Скинути
              </button>
            </div>
            <div className="p-4 bg-white/60 border border-indigo-100 rounded-lg text-sm text-indigo-800">
              <strong>Як використовувати:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Натисніть «Скопіювати промпт».</li>
                <li>Відкрийте <a href="https://chatgpt.com" target="_blank" rel="noreferrer" className="underline font-medium hover:text-indigo-600">ChatGPT</a> або <a href="https://claude.ai" target="_blank" rel="noreferrer" className="underline font-medium hover:text-indigo-600">Claude</a>.</li>
                <li>Вставте скопійований текст і відправте.</li>
                <li>Штучний інтелект проаналізує тренди, розкаже свою логіку, а потім видасть готовий JSON із заповненими SEO-даними та <b>alt</b>-текстами для картинок.</li>
                <li>Використайте згенеровані дані для оновлення відповідних сторінок у нашій адмін-панелі.</li>
              </ol>
            </div>
            
            <div className="mt-8 pt-6 border-t border-indigo-100">
              <div className="flex items-center gap-2 mb-4">
                <Upload size={20} className="text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-800">2. Імпорт згенерованих даних</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Вставте сюди JSON, який повернув АІ, та натисніть «Застосувати». Усі поля будуть автоматично оновлені на сайті.</p>
              
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"pages": [...], "offers": [...], "blog_posts": [...] }'
                className="w-full h-48 p-4 mb-4 text-sm font-mono text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              <button
                onClick={handleSaveJson}
                disabled={isSaving || !jsonInput.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : (saveSuccess ? <Check size={18} /> : <Download size={18} />)}
                {isSaving ? 'Оновлення даних...' : (saveSuccess ? 'Дані успішно оновлено!' : 'Застосувати SEO-дані')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
