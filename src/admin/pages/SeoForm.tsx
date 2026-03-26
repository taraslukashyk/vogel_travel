import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import LanguageTabs from '../components/LanguageTabs';
import type { DBSeoMeta } from '../../lib/types';

const emptySeo = {
  // UA
  title: '',
  description: '',
  og_title: '',
  og_description: '',
  keywords: '',
  
  // EN
  title_en: '',
  description_en: '',
  og_title_en: '',
  og_description_en: '',
  keywords_en: '',

  // Common
  page_path: '',
  og_image: '',
  canonical_url: '',
};

export default function SeoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptySeo);
  const [activeTab, setActiveTab] = useState<'ua' | 'en'>('ua');

  const { data: existing } = useQuery({
    queryKey: ['admin_seo_entry', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('seo_meta').select('*').eq('id', Number(id)).single();
      if (error) throw error;
      return data as DBSeoMeta;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        page_path: existing.page_path,
        title: existing.title || '',
        description: existing.description || '',
        og_title: existing.og_title || '',
        og_description: existing.og_description || '',
        keywords: existing.keywords || '',
        
        title_en: existing.title_en || '',
        description_en: existing.description_en || '',
        og_title_en: existing.og_title_en || '',
        og_description_en: existing.og_description_en || '',
        keywords_en: existing.keywords_en || '',

        og_image: existing.og_image || '',
        canonical_url: existing.canonical_url || '',
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        og_title: form.og_title || null,
        og_description: form.og_description || null,
        og_title_en: form.og_title_en || null,
        og_description_en: form.og_description_en || null,
        og_image: form.og_image || null,
        keywords: form.keywords || null,
        keywords_en: form.keywords_en || null,
        canonical_url: form.canonical_url || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('seo_meta').update(payload).eq('id', Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_seo'] });
      qc.invalidateQueries({ queryKey: ['seo_meta'] });
      navigate('/admin/seo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('seo_meta').delete().eq('id', Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_seo'] });
      qc.invalidateQueries({ queryKey: ['seo_meta'] });
      navigate('/admin/seo');
    },
  });

  const handleDelete = () => {
    if (confirm('Видалити ці SEO налаштування?')) {
      deleteMutation.mutate();
    }
  };

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const isUA = activeTab === 'ua';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">SEO: {form.page_path}</h1>

      <LanguageTabs activeTab={activeTab} onChange={setActiveTab} />

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Title</strong> — заголовок у вкладці браузера ({isUA ? 'UA' : 'EN'}).<br />
            <strong>Description</strong> — опис у Google ({isUA ? 'UA' : 'EN'}).<br />
            <strong>OG</strong> — мета-теги для соцмереж ({isUA ? 'UA' : 'EN'}).
          </p>
        </div>

        <FormField label={isUA ? "Title" : "Title EN"}>
          <input 
            className={inputClass} 
            value={isUA ? form.title : form.title_en} 
            onChange={(e) => set(isUA ? 'title' : 'title_en', e.target.value)} 
            placeholder={isUA ? form.title_en : form.title}
          />
          <p className="text-xs text-gray-400 mt-1">{(isUA ? form.title : form.title_en).length}/60 символів</p>
        </FormField>

        <FormField label={isUA ? "Meta Description" : "Meta Description EN"}>
          <textarea 
            className={inputClass} 
            rows={3} 
            value={isUA ? form.description : form.description_en} 
            onChange={(e) => set(isUA ? 'description' : 'description_en', e.target.value)} 
            placeholder={isUA ? form.description_en : form.description}
          />
          <p className="text-xs text-gray-400 mt-1">{(isUA ? form.description : form.description_en).length}/160 символів</p>
        </FormField>

        <FormField label={isUA ? "Keywords" : "Keywords EN"}>
          <input 
            className={inputClass} 
            value={isUA ? form.keywords : form.keywords_en} 
            onChange={(e) => set(isUA ? 'keywords' : 'keywords_en', e.target.value)} 
            placeholder={isUA ? form.keywords_en : form.keywords || "keyword1, keyword2"} 
          />
        </FormField>

        <FormField label="Canonical URL">
          <input className={inputClass} value={form.canonical_url} onChange={(e) => set('canonical_url', e.target.value)} placeholder="https://..." />
        </FormField>

        <hr className="border-gray-200" />
        <h2 className="text-lg font-semibold text-gray-700">Open Graph ({isUA ? 'UA' : 'EN'})</h2>

        <FormField label={isUA ? "OG Title" : "OG Title EN"}>
          <input 
            className={inputClass} 
            value={isUA ? form.og_title : form.og_title_en} 
            onChange={(e) => set(isUA ? 'og_title' : 'og_title_en', e.target.value)} 
            placeholder={isUA ? form.og_title_en : form.og_title}
          />
        </FormField>

        <FormField label={isUA ? "OG Description" : "OG Description EN"}>
          <textarea 
            className={inputClass} 
            rows={2} 
            value={isUA ? form.og_description : form.og_description_en} 
            onChange={(e) => set(isUA ? 'og_description' : 'og_description_en', e.target.value)} 
            placeholder={isUA ? form.og_description_en : form.og_description}
          />
        </FormField>

        <FormField label="OG Image">
          <ImageUploader value={form.og_image} onChange={(url) => set('og_image', url)} folder="seo" />
        </FormField>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти (Обидві мови)'}
          </button>
          <button type="button" onClick={() => navigate('/admin/seo')} className={btnSecondary}>
            Скасувати
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="ml-auto text-red-500 hover:text-red-600 p-2 font-medium"
          >
            Видалити
          </button>
        </div>
      </form>
    </div>
  );
}
