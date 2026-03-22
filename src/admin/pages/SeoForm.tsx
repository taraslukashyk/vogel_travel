import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import type { DBSeoMeta } from '../../lib/types';

export default function SeoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    page_path: '',
    title: '',
    description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    keywords: '',
    canonical_url: '',
  });

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
        og_image: existing.og_image || '',
        keywords: existing.keywords || '',
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
        og_image: form.og_image || null,
        keywords: form.keywords || null,
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

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">SEO: {form.page_path}</h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Title</strong> — заголовок у вкладці браузера та пошуковій видачі (50-60 символів).<br />
            <strong>Description</strong> — опис під заголовком у Google (150-160 символів).<br />
            <strong>OG</strong> — мета-теги для соціальних мереж (Facebook, Twitter, Telegram).
          </p>
        </div>

        <FormField label="Title">
          <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} />
          <p className="text-xs text-gray-400 mt-1">{form.title.length}/60 символів</p>
        </FormField>

        <FormField label="Meta Description">
          <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          <p className="text-xs text-gray-400 mt-1">{form.description.length}/160 символів</p>
        </FormField>

        <FormField label="Keywords">
          <input className={inputClass} value={form.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="подорожі, тури, мальдіви" />
        </FormField>

        <FormField label="Canonical URL">
          <input className={inputClass} value={form.canonical_url} onChange={(e) => set('canonical_url', e.target.value)} placeholder="https://..." />
        </FormField>

        <hr className="border-gray-200" />
        <h2 className="text-lg font-semibold text-gray-700">Open Graph (соцмережі)</h2>

        <FormField label="OG Title">
          <input className={inputClass} value={form.og_title} onChange={(e) => set('og_title', e.target.value)} />
        </FormField>

        <FormField label="OG Description">
          <textarea className={inputClass} rows={2} value={form.og_description} onChange={(e) => set('og_description', e.target.value)} />
        </FormField>

        <FormField label="OG Image">
          <ImageUploader value={form.og_image} onChange={(url) => set('og_image', url)} folder="seo" />
        </FormField>

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти'}
          </button>
          <button type="button" onClick={() => navigate('/admin/seo')} className={btnSecondary}>
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
