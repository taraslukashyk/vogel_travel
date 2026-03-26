import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils/slugify';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import AudioUploader from '../components/AudioUploader';
import SectionEditor from '../components/SectionEditor';
import { syncSections } from '../utils/sectionSync';
import LanguageTabs from '../components/LanguageTabs';
import type { DBBlogPost, DBSection } from '../../lib/types';

const emptyPost = {
  // UA
  title: '',
  excerpt: '',
  category: '',
  audio: '',
  sections: [] as DBSection[],
  seo_title: '',
  seo_description: '',
  slug: '',

  // EN
  title_en: '',
  excerpt_en: '',
  category_en: '',
  audio_en: '',
  sections_en: [] as DBSection[],
  seo_title_en: '',
  seo_description_en: '',
  slug_en: '',

  // Common
  date: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
  image: '',
  image_alt: '',
  image_alt_en: '',
  is_published: true,
};

export default function BlogForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyPost);
  const [activeTab, setActiveTab] = useState<'ua' | 'en'>('ua');

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
        category: existing.category,
        audio: existing.audio || '',
        sections: existing.sections || [],
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        slug: existing.slug || '',

        title_en: existing.title_en || '',
        excerpt_en: existing.excerpt_en || '',
        category_en: existing.category_en || '',
        audio_en: existing.audio_en || '',
        sections_en: syncSections(existing.sections || [], existing.sections_en || []),
        seo_title_en: existing.seo_title_en || '',
        seo_description_en: existing.seo_description_en || '',
        slug_en: existing.slug_en || '',

        date: existing.date,
        image: existing.image,
        image_alt: existing.image_alt || '',
        image_alt_en: existing.image_alt_en || '',
        is_published: existing.is_published,
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { 
        ...form, 
        audio: form.audio || null,
        audio_en: form.audio_en || null
      };
      
      if (isNew) {
        const { data: maxOrder } = await supabase.from('blog_posts').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { error } = await supabase.from('blog_posts').insert({ 
          ...payload, 
          slug_en: form.slug, // Sync English slug with Ukrainian
          sort_order 
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').update({ 
          ...payload, 
          slug_en: form.slug, // Sync English slug with Ukrainian
          updated_at: new Date().toISOString() 
        }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_blog'] });
      qc.invalidateQueries({ queryKey: ['blog_posts'] });
      navigate('/admin/blog');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_blog'] });
      qc.invalidateQueries({ queryKey: ['blog_posts'] });
      navigate('/admin/blog');
    },
  });

  const handleDelete = () => {
    if (confirm('Видалити цей пост?')) {
      deleteMutation.mutate();
    }
  };

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const isUA = activeTab === 'ua';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Новий пост' : 'Редагувати пост'}</h1>

      <LanguageTabs activeTab={activeTab} onChange={setActiveTab} />

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        {/* Секція 1: Картка (Прев'ю) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <Plus className="text-teal-600" size={18} />
            <h2 className="font-semibold text-gray-800 text-base">Інформація для картки ({isUA ? 'UA' : 'EN'})</h2>
          </div>
          <div className="p-5 space-y-6">
            <FormField label={isUA ? "Заголовок" : "Title"} required={isUA}>
              <input 
                className={inputClass} 
                value={isUA ? form.title : form.title_en} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (isUA) {
                    set('title', val);
                    if (isNew) set('slug', slugify(val));
                  } else {
                    set('title_en', val);
                  }
                }} 
                required={isUA} 
                placeholder={isUA ? form.title_en : form.title}
              />
            </FormField>

            <FormField label="URL-адреса (спільна для обох мов)">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
              />
              <p className="text-xs text-gray-400 mt-1">vogel.travel/ua/blog/<strong>{form.slug || 'slug'}</strong></p>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label={isUA ? "Категорія" : "Category"} required={isUA}>
                <input 
                  className={inputClass} 
                  value={isUA ? form.category : form.category_en} 
                  onChange={(e) => set(isUA ? 'category' : 'category_en', e.target.value)} 
                  required={isUA} 
                  placeholder={isUA ? form.category_en : form.category}
                />
              </FormField>
              
                <FormField label="Дата" required>
                  <input className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} required />
                </FormField>
            </div>

              <FormField label="Зображення" required>
                <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="blog" />
              </FormField>
              <FormField label={isUA ? "Alt текст фото" : "Image Alt Text"}>
                <input
                  type="text"
                  value={isUA ? form.image_alt : form.image_alt_en}
                  onChange={(e) => set(isUA ? 'image_alt' : 'image_alt_en', e.target.value)}
                  className={inputClass}
                  placeholder={isUA ? form.image_alt_en : form.image_alt}
                />
              </FormField>

            <FormField label={isUA ? "Короткий опис (excerpt)" : "Short Excerpt"} required={isUA}>
              <textarea 
                className={inputClass} 
                rows={2} 
                value={isUA ? form.excerpt : form.excerpt_en} 
                onChange={(e) => set(isUA ? 'excerpt' : 'excerpt_en', e.target.value)} 
                required={isUA} 
                placeholder={isUA ? form.excerpt_en : form.excerpt}
              />
            </FormField>
          </div>
        </div>

        {/* Секція 2: Внутрішня сторінка */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <FileText className="text-blue-600" size={18} />
            <h2 className="font-semibold text-gray-800 text-base">Наповнення статті ({isUA ? 'UA' : 'EN'})</h2>
          </div>
          <div className="p-5 space-y-8">
            <FormField label={isUA ? "Аудіофайл (UA)" : "Audio File (EN)"}>
              <AudioUploader value={isUA ? form.audio : form.audio_en} onChange={(url) => set(isUA ? 'audio' : 'audio_en', url)} />
            </FormField>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Секції статті ({isUA ? 'UA' : 'EN'})</label>
              <SectionEditor 
                sections={isUA ? form.sections : form.sections_en} 
                placeholderSections={isUA ? form.sections_en : form.sections}
                onChange={(s) => {
                  if (isUA) {
                    setForm(prev => ({ 
                      ...prev, 
                      sections: s, 
                      sections_en: syncSections(s, prev.sections_en) 
                    }));
                  } else {
                    setForm(prev => ({ 
                      ...prev, 
                      sections_en: s, 
                      sections: syncSections(s, prev.sections) 
                    }));
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            🔍 SEO ({isUA ? 'UA' : 'EN'})
          </h3>
          <FormField label="SEO Title">
            <input 
              className={inputClass} 
              value={isUA ? form.seo_title : form.seo_title_en} 
              onChange={(e) => set(isUA ? 'seo_title' : 'seo_title_en', e.target.value)} 
              placeholder={isUA ? form.seo_title_en : form.seo_title}
            />
          </FormField>
          <FormField label="SEO Description">
            <textarea 
              className={inputClass} 
              rows={2} 
              value={isUA ? form.seo_description : form.seo_description_en} 
              onChange={(e) => set(isUA ? 'seo_description' : 'seo_description_en', e.target.value)} 
              placeholder={isUA ? form.seo_description_en : form.seo_description}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            Опубліковано
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти (Обидві мови)'}
          </button>
          <button type="button" onClick={() => navigate('/admin/blog')} className={btnSecondary}>
            Скасувати
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="ml-auto text-red-500 hover:text-red-600 p-2 font-medium"
            >
              Видалити
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
