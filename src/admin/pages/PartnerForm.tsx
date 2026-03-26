import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils/slugify';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import { syncSections } from '../utils/sectionSync';
import LanguageTabs from '../components/LanguageTabs';
import { useFormTranslation } from '../hooks/useFormTranslation';
import type { DBPartner, DBSection } from '../../lib/types';

const emptyPartner = {
  // UA
  name: '',
  category: '',
  location: '',
  description: '',
  sections: [] as DBSection[],
  slug: '',
  seo_title: '',
  seo_description: '',

  // EN
  name_en: '',
  category_en: '',
  location_en: '',
  description_en: '',
  sections_en: [] as DBSection[],
  slug_en: '',
  seo_title_en: '',
  seo_description_en: '',

  // Common
  logo: '',
  image: '',
  image_alt: '',
  image_alt_en: '',
  website: '',
  tag: '',
  color: '#5cc8bd',
  lng: '',
  lat: '',
  is_published: true,
};

export default function PartnerForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyPartner);
  const [activeTab, setActiveTab] = useState<'ua' | 'en'>('ua');
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
        description: existing.description || '',
        sections: existing.sections || [],
        slug: existing.slug || '',
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',

        name_en: existing.name_en || '',
        category_en: existing.category_en || '',
        location_en: existing.location_en || '',
        description_en: existing.description_en || '',
        sections_en: syncSections(existing.sections || [], existing.sections_en || []),
        slug_en: existing.slug_en || '',
        seo_title_en: existing.seo_title_en || '',
        seo_description_en: existing.seo_description_en || '',

        logo: existing.logo,
        image: existing.image,
        image_alt: existing.image_alt || '',
        image_alt_en: existing.image_alt_en || '',
        website: existing.website || '',
        tag: existing.tag || '',
        color: existing.color || '#5cc8bd',
        lng: existing.lng != null ? String(existing.lng) : '',
        lat: existing.lat != null ? String(existing.lat) : '',
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
        ...form,
        image_alt: form.image_alt || null,
        description: form.description || null,
        description_en: form.description_en || null,
        website: form.website || null,
        tag: form.tag || null,
        color: form.color || null,
        lng: form.lng !== '' ? Number(form.lng) : null,
        lat: form.lat !== '' ? Number(form.lat) : null,
      };
      
      if (isNew) {
        const { data: maxOrder } = await supabase.from('partners').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { data, error } = await supabase.from('partners').insert({ 
          ...payload, 
          slug_en: form.slug, // Sync English slug with Ukrainian
          sort_order 
        }).select().single();
        if (error) throw error;
        return data;
      } else {
        const { error } = await supabase.from('partners').update({ 
          ...payload, 
          slug_en: form.slug, // Sync English slug with Ukrainian
          updated_at: new Date().toISOString() 
        }).eq('id', Number(id));
      if (error) throw error;
      }
    },
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['admin_partners'] });
      qc.invalidateQueries({ queryKey: ['partners'] });
      if (isNew && data?.id) {
        navigate(`/admin/partners/${data.id}`);
      } else {
        alert('Збережено успішно!');
      }
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
  const isUA = activeTab === 'ua';
  const { handleTranslate, handleTranslateAll, isTranslating } = useFormTranslation(form, setForm, isUA);

  const translatableFields = [
    'name',
    'category',
    'location',
    'description',
    'image_alt',
    'seo_title',
    'seo_description'
  ];

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="sticky top-[64px] lg:top-0 z-[25] bg-gray-50/95 backdrop-blur-sm -mx-4 lg:-mx-6 px-4 lg:px-6 pt-4 pb-1 mb-6 border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{isNew ? 'Новий партнер' : 'Редагувати партнера'}</h1>
        <LanguageTabs 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          onTranslateAll={() => handleTranslateAll(translatableFields)}
          isTranslating={isTranslating}
        />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">

        {/* Basic Info */}
        <FormField label={isUA ? "Назва партнера" : "Partner Name"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'name' : 'name_en')}>
          <input 
            className={inputClass} 
            value={isUA ? form.name : form.name_en} 
            onChange={(e) => {
              const val = e.target.value;
              if (isUA) {
                set('name', val);
                if (isNew) set('slug', slugify(val));
              } else {
                set('name_en', val);
              }
            }} 
            required={isUA} 
            placeholder={isUA ? form.name_en : form.name}
          />
        </FormField>

        <FormField label="URL-адреса (спільна для обох мов)">
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => set('slug', slugify(e.target.value))}
          />
          <p className="text-xs text-gray-400 mt-1">vogel.travel/ua/partners/<strong>{form.slug || 'slug'}</strong></p>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isUA ? "Категорія" : "Category"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'category' : 'category_en')}>
            <input 
              className={inputClass} 
              value={isUA ? form.category : form.category_en} 
              onChange={(e) => set(isUA ? 'category' : 'category_en', e.target.value)} 
              required={isUA} 
              placeholder={isUA ? form.category_en : form.category}
            />
          </FormField>
          <FormField label={isUA ? "Локація" : "Location"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'location' : 'location_en')}>
            <input 
              className={inputClass} 
              value={isUA ? form.location : form.location_en} 
              onChange={(e) => set(isUA ? 'location' : 'location_en', e.target.value)} 
              required={isUA} 
              placeholder={isUA ? form.location_en : form.location}
            />
          </FormField>
        </div>

        {/* Logo and Image (Common) */}
        <FormField label="Логотип партнера (PNG або SVG)" required>
          <ImageUploader
            value={form.logo}
            onChange={(url) => set('logo', url)}
            folder="partners/logos"
            accept="image/png,image/svg+xml"
          />
        </FormField>
        <FormField label="Фото обкладинки (hero image)" required>
          <ImageUploader
            value={form.image}
            onChange={(url) => set('image', url)}
            folder="partners/images"
          />
        </FormField>
        <FormField label={isUA ? "Alt-текст для фото" : "Image Alt Text"} onTranslate={() => handleTranslate(isUA ? 'image_alt' : 'image_alt_en')}>
          <input 
            className={inputClass} 
            value={isUA ? form.image_alt : form.image_alt_en} 
            onChange={(e) => set(isUA ? 'image_alt' : 'image_alt_en', e.target.value)} 
            placeholder={isUA ? form.image_alt_en : form.image_alt}
          />
        </FormField>

        <FormField label={isUA ? "Опис (вступний текст)" : "Intro Description"} onTranslate={() => handleTranslate(isUA ? 'description' : 'description_en')}>
          <textarea 
            className={inputClass} 
            rows={4} 
            value={isUA ? form.description : form.description_en} 
            onChange={(e) => set(isUA ? 'description' : 'description_en', e.target.value)} 
            placeholder={isUA ? form.description_en : form.description}
          />
        </FormField>


        <FormField label="Офіційний сайт">
              <input className={inputClass} type="url" value={form.website} onChange={(e) => set('website', e.target.value)} />
            </FormField>

            {/* Map Settings */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Маркер на мапі</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Скорочення (tag)">
                  <input className={inputClass} value={form.tag} onChange={(e) => set('tag', e.target.value)} maxLength={4} />
                </FormField>
                <FormField label="Колір маркера">
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
                    />
                  </div>
                </FormField>
              </div>
              <FormField label="Координати (широта, довгота)">
                <input
                  className={inputClass}
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
            Розділи сторінки деталізації ({isUA ? 'UA' : 'EN'})
          </label>
          <SectionEditor
            sections={isUA ? form.sections : form.sections_en}
            placeholderSections={isUA ? form.sections_en : form.sections}
            isUA={isUA}
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

        {/* SEO */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">SEO ({isUA ? 'UA' : 'EN'})</h2>
          <FormField label="SEO Title" onTranslate={() => handleTranslate(isUA ? 'seo_title' : 'seo_title_en')}>
            <input
              className={inputClass}
              value={isUA ? form.seo_title : form.seo_title_en}
              onChange={(e) => set(isUA ? 'seo_title' : 'seo_title_en', e.target.value)}
              placeholder={isUA ? form.seo_title_en : form.seo_title}
            />
          </FormField>
          <FormField label="SEO Description" onTranslate={() => handleTranslate(isUA ? 'seo_description' : 'seo_description_en')}>
            <textarea
              className={inputClass}
              rows={3}
              value={isUA ? form.seo_description : form.seo_description_en}
              onChange={(e) => set(isUA ? 'seo_description' : 'seo_description_en', e.target.value)}
              placeholder={isUA ? form.seo_description_en : form.seo_description}
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
            {mutation.isPending ? 'Збереження...' : 'Зберегти (Обидві мови)'}
          </button>
          <button type="button" onClick={() => navigate('/admin/partners')} className={btnSecondary}>
            Скасувати
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={() => { if (confirm('Видалити цього партнера?')) deleteMutation.mutate(); }}
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
