import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import type { DBBlogPost, DBSection } from '../../lib/types';

const emptyPost = {
  title: '',
  excerpt: '',
  date: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
  image: '',
  category: '',
  audio: '',
  sections: [] as DBSection[],
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
        category: existing.category,
        audio: existing.audio || '',
        sections: existing.sections || [],
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
        <FormField label="Заголовок" required>
          <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Категорія" required>
            <input className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Фіджі" required />
          </FormField>
          <FormField label="Дата" required>
            <input className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="12.03.2026" required />
          </FormField>
        </div>

        <FormField label="Зображення" required>
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="blog" />
        </FormField>

        <FormField label="Короткий опис (excerpt)" required>
          <textarea className={inputClass} rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} required />
        </FormField>

        <FormField label="Аудіо URL">
          <input className={inputClass} value={form.audio} onChange={(e) => set('audio', e.target.value)} placeholder="/audio/file.wav" />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Секції статті</label>
          <SectionEditor sections={form.sections} onChange={(s) => set('sections', s)} />
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
