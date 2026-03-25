import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import type { DBPartner, DBSection } from '../../lib/types';

const emptyPartner = {
  name: '',
  category: '',
  location: '',
  logo: '',
  image: '',
  image_alt: '',
  description: '',
  website: '',
  tag: '',
  color: '#5cc8bd',
  lng: '',
  lat: '',
  sections: [] as DBSection[],
  seo_title: '',
  seo_description: '',
  is_published: true,
};

export default function PartnerForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyPartner);
  const [coordsInput, setCoordsInput] = useState('');

  const { data: existing } = useQuery({
    queryKey: ['admin_partner', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('partners').select('*').eq('id', Number(id)).single();
      if (error) throw error;
      return data as DBPartner;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        category: existing.category,
        location: existing.location,
        logo: existing.logo,
        image: existing.image,
        image_alt: existing.image_alt || '',
        description: existing.description || '',
        website: existing.website || '',
        tag: existing.tag || '',
        color: existing.color || '#5cc8bd',
        lng: existing.lng != null ? String(existing.lng) : '',
        lat: existing.lat != null ? String(existing.lat) : '',
        sections: existing.sections || [],
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        is_published: existing.is_published,
      });
      if (existing.lat != null && existing.lng != null) {
        setCoordsInput(`${existing.lat}, ${existing.lng}`);
      }
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        category: form.category,
        location: form.location,
        logo: form.logo,
        image: form.image,
        image_alt: form.image_alt || null,
        description: form.description || null,
        website: form.website || null,
        tag: form.tag || null,
        color: form.color || null,
        lng: form.lng !== '' ? Number(form.lng) : null,
        lat: form.lat !== '' ? Number(form.lat) : null,
        sections: form.sections,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        is_published: form.is_published,
      };
      if (isNew) {
        const { data: maxOrder } = await supabase.from('partners').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { error } = await supabase.from('partners').insert({ ...payload, sort_order });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('partners').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_partners'] });
      qc.invalidateQueries({ queryKey: ['partners'] });
      navigate('/admin/partners');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('partners').delete().eq('id', Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_partners'] });
      qc.invalidateQueries({ queryKey: ['partners'] });
      navigate('/admin/partners');
    },
  });

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isNew ? 'Новий партнер' : 'Редагувати партнера'}
      </h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">

        {/* Basic Info */}
        <FormField label="Назва партнера" required>
          <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Four Seasons Hotels & Resorts" />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Категорія" required tooltip="Наприклад: Готелі, Авіакомпанія, Круїзи, Wellness-курорти">
            <input className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)} required placeholder="Готелі" />
          </FormField>
          <FormField label="Локація" required>
            <input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} required placeholder="Мальдіви" />
          </FormField>
        </div>

        {/* Logo Upload — PNG/SVG */}
        <FormField
          label="Логотип партнера (PNG або SVG)"
          required
          tooltip="Завантажте логотип у форматі PNG або SVG. Рекомендовано: прозорий фон, ширина від 300px."
        >
          <ImageUploader
            value={form.logo}
            onChange={(url) => set('logo', url)}
            folder="partners/logos"
            accept="image/png,image/svg+xml"
            hint="Підтримується PNG та SVG"
          />
        </FormField>

        {/* Hero Image */}
        <FormField
          label="Фото обкладинки (hero image)"
          required
          tooltip="Головне фото для сторінки партнера. Рекомендований розмір 1920x1080 px."
        >
          <ImageUploader
            value={form.image}
            onChange={(url) => set('image', url)}
            folder="partners/images"
          />
        </FormField>

        <FormField label="Alt-текст для фото">
          <input className={inputClass} value={form.image_alt} onChange={(e) => set('image_alt', e.target.value)} placeholder="Опис зображення для SEO" />
        </FormField>

        <FormField label="Опис (вступний текст)" tooltip="Короткий вступний текст, показується курсивом вгорі сторінки.">
          <textarea className={inputClass} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Короткий опис партнера..." />
        </FormField>

        <FormField label="Офіційний сайт">
          <input className={inputClass} type="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://www.example.com" />
        </FormField>

        {/* Map Settings */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Маркер на мапі</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Скорочення (tag)" tooltip="2–3 символи для маркера на мапі (наприклад: FS, EK, AM)">
              <input className={inputClass} value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="FS" maxLength={4} />
            </FormField>
            <FormField label="Колір маркера" tooltip="HEX-колір фону маркера на мапі">
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer p-1"
                />
                <input
                  className={inputClass}
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  placeholder="#5cc8bd"
                />
              </div>
            </FormField>
          </div>
          <FormField label="Координати (з Google Maps)" tooltip="Вставте координати у форматі «широта, довгота» — наприклад: 50.429281, 30.542412">
            <input
              className={inputClass}
              placeholder="50.429281, 30.542412"
              value={coordsInput}
              onChange={(e) => {
                const val = e.target.value;
                setCoordsInput(val);
                const match = val.match(/^\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/);
                if (match) {
                  set('lat', match[1]);
                  set('lng', match[2]);
                } else if (!val.trim()) {
                  set('lat', '');
                  set('lng', '');
                }
              }}
            />
          </FormField>
        </div>

        {/* Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Розділи сторінки деталей
            <span className="ml-2 text-xs text-gray-400">(текст, список або зображення для /partners/:id)</span>
          </label>
          <SectionEditor
            sections={form.sections}
            onChange={(sections) => set('sections', sections)}
          />
        </div>

        {/* SEO */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">SEO</h2>
          <FormField label="SEO Заголовок" tooltip="Заголовок для пошукових систем (рекомендовано до 60 символів).">
            <input
              className={inputClass}
              value={form.seo_title}
              onChange={(e) => set('seo_title', e.target.value)}
              placeholder="Назва партнера — Vogel Family Travel"
            />
          </FormField>
          <FormField label="SEO Опис" tooltip="Мета-опис для пошукових систем (рекомендовано до 160 символів).">
            <textarea
              className={inputClass}
              rows={3}
              value={form.seo_description}
              onChange={(e) => set('seo_description', e.target.value)}
              placeholder="Короткий опис партнерства для Google..."
            />
          </FormField>
        </div>

        {/* Publish */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set('is_published', e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            Опубліковано
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти'}
          </button>
          <button type="button" onClick={() => navigate('/admin/partners')} className={btnSecondary}>
            Скасувати
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={() => { if (confirm('Видалити цього партнера?')) deleteMutation.mutate(); }}
              disabled={deleteMutation.isPending}
              className="ml-auto text-red-500 hover:text-red-600 p-2 font-medium transition-colors"
            >
              {deleteMutation.isPending ? 'Видалення...' : 'Видалити'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
