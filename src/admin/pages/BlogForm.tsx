import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import AudioUploader from '../components/AudioUploader';
import SectionEditor from '../components/SectionEditor';
import type { DBBlogPost, DBSection } from '../../lib/types';

const emptyPost = {
  title: '',
  excerpt: '',
  date: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
  image: '',
  image_alt: '',
  category: '',
  audio: '',
  sections: [] as DBSection[],
  seo_title: '',
  seo_description: '',
  is_published: true,
};

export default function BlogForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyPost);

  const { data: existing } = useQuery({
    queryKey: ['admin_blog_post', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', Number(id)).single();
      if (error) throw error;
      return data as DBBlogPost;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        excerpt: existing.excerpt,
        date: existing.date,
        image: existing.image,
        image_alt: existing.image_alt || '',
        category: existing.category,
        audio: existing.audio || '',
        sections: existing.sections || [],
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        is_published: existing.is_published,
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, audio: form.audio || null };
      if (isNew) {
        const { data: maxOrder } = await supabase.from('blog_posts').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { error } = await supabase.from('blog_posts').insert({ ...payload, sort_order });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_blog'] });
      qc.invalidateQueries({ queryKey: ['blog_posts'] });
      navigate('/admin/blog');
    },
  });

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Новий пост' : 'Редагувати пост'}</h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <FormField label="Заголовок" required tooltip="Головний заголовок сторінки статті (H1).">
          <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Категорія" required tooltip="До якої категорії належить стаття, наприклад: Новини, Поради, Гіди.">
            <input className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Фіджі" required />
          </FormField>
          <FormField label="Дата" required>
            <input className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="12.03.2026" required />
          </FormField>
        </div>

        <FormField label="Зображення" required tooltip="Обкладинка статті. Оптимальний розмір від 800x600 пикселів.">
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="blog" />
        </FormField>
        <FormField label="Alt текст фото" tooltip="Альтернативний текст фото. Важливо для SEO та людей з порушенням зору.">
          <input
            type="text"
            value={form.image_alt}
            onChange={(e) => set('image_alt', e.target.value)}
            placeholder="Опишіть, що на фото..."
            className={inputClass}
          />
        </FormField>

        <FormField label="Короткий опис (excerpt)" required tooltip="Цей текст буде відображатися в списку статей, як прев'ю (до 2-3 речень).">
          <textarea className={inputClass} rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} required />
        </FormField>

        <FormField label="Аудіофайл (опціонально)" tooltip="Завантажте або вкажіть посилання на аудіоверсію.">
          <AudioUploader value={form.audio} onChange={(url) => set('audio', url)} />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Секції статті</label>
          <SectionEditor sections={form.sections} onChange={(s) => set('sections', s)} />
        </div>

        {/* SEO */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            🔍 SEO для цієї сторінки
            <span className="text-xs font-normal text-gray-400">(/blog/{id || 'new'})</span>
          </h3>
          <FormField label="SEO Title" tooltip="Заголовок для пошукових систем (50-60 символів).">
            <input className={inputClass} value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} placeholder={`${form.title} — Vogel Family Travel`} />
            <p className="text-xs text-gray-400 mt-1">{form.seo_title.length}/60 — залиште порожнім для автоматичного</p>
          </FormField>
          <FormField label="SEO Description" tooltip="Короткий опис для пошукових систем (до 160 символів).">
            <textarea className={inputClass} rows={2} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} placeholder={form.excerpt || 'Опис для пошукових систем'} />
            <p className="text-xs text-gray-400 mt-1">{form.seo_description.length}/160 — залиште порожнім для автоматичного</p>
          </FormField>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            Опубліковано
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти'}
          </button>
          <button type="button" onClick={() => navigate('/admin/blog')} className={btnSecondary}>
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
