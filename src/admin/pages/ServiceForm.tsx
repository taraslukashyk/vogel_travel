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
import { Plus, Trash2 } from 'lucide-react';
import type { DBService, DBServiceItem, DBSection } from '../../lib/types';

const emptyService = {
  // UA
  title: '',
  description: '',
  type: 'Сервіс',
  items: [] as DBServiceItem[],
  sections: [] as DBSection[],
  slug: '',
  seo_title: '',
  seo_description: '',

  // EN
  title_en: '',
  description_en: '',
  type_en: 'Service',
  items_en: [] as DBServiceItem[],
  sections_en: [] as DBSection[],
  slug_en: '',
  seo_title_en: '',
  seo_description_en: '',

  // Common
  num: '',
  image: '',
  image_alt: '',
  image_alt_en: '',
  is_published: true,
};

export default function ServiceForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyService);
  const [activeTab, setActiveTab] = useState<'ua' | 'en'>('ua');

  const { data: existing } = useQuery({
    queryKey: ['admin_service', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').eq('id', Number(id)).single();
      if (error) throw error;
      return data as DBService;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        num: existing.num,
        title: existing.title,
        description: existing.description,
        image: existing.image,
        image_alt: existing.image_alt || '',
        image_alt_en: existing.image_alt_en || '',
        type: existing.type,
        items: existing.items || [],
        sections: existing.sections || [],
        slug: existing.slug || '',
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        
        title_en: existing.title_en || '',
        description_en: existing.description_en || '',
        type_en: existing.type_en || 'Service',
        items_en: existing.items_en || [],
        sections_en: syncSections(existing.sections || [], existing.sections_en || []),
        slug_en: existing.slug_en || '',
        seo_title_en: existing.seo_title_en || '',
        seo_description_en: existing.seo_description_en || '',

        is_published: existing.is_published,
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      if (isNew) {
        const { data: maxOrder } = await supabase.from('services').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { data, error } = await supabase.from('services').insert({ ...payload, sort_order }).select().single();
        if (error) throw error;
        return data;
      } else {
        const { error } = await supabase.from('services').update({ 
          ...payload, 
          slug_en: form.slug, // Sync English slug with Ukrainian
          updated_at: new Date().toISOString() 
        }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['admin_services'] });
      qc.invalidateQueries({ queryKey: ['services'] });
      if (isNew && data?.id) {
        navigate(`/admin/services/${data.id}`);
      } else {
        alert('Збережено успішно!');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('services').delete().eq('id', Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_services'] });
      qc.invalidateQueries({ queryKey: ['services'] });
      navigate('/admin/services');
    },
  });

  const handleDelete = () => {
    if (confirm('Видалити цей сервіс?')) {
      deleteMutation.mutate();
    }
  };

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const updateItem = (index: number, field: keyof DBServiceItem, value: string) => {
    const key = activeTab === 'ua' ? 'items' : 'items_en';
    const items = [...(form[key] as DBServiceItem[])];
    items[index] = { ...items[index], [field]: value };
    set(key, items);
  };

  const isUA = activeTab === 'ua';
  const { handleTranslate, handleTranslateAll, isTranslating } = useFormTranslation(form, setForm, isUA);

  const translatableFields = [
    'title',
    'description',
    'type',
    'seo_title',
    'seo_description'
  ];

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="sticky top-[64px] lg:top-0 z-[25] bg-gray-50/95 backdrop-blur-sm -mx-4 lg:-mx-6 px-4 lg:px-6 pt-4 pb-1 mb-6 border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{isNew ? 'Новий сервіс' : 'Редагувати сервіс'}</h1>
        <LanguageTabs 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          onTranslateAll={() => handleTranslateAll(translatableFields)}
          isTranslating={isTranslating}
        />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Номер" required tooltip="Порядковий номер для сортування.">
            <input className={inputClass} value={form.num} onChange={(e) => set('num', e.target.value)} placeholder="01" required />
          </FormField>
          <FormField label={isUA ? "Тип" : "Type"} onTranslate={() => handleTranslate(isUA ? 'type' : 'type_en')}>
            <input 
              className={inputClass} 
              value={isUA ? form.type : form.type_en} 
              onChange={(e) => set(isUA ? 'type' : 'type_en', e.target.value)} 
              placeholder={isUA ? form.type_en : form.type}
            />
          </FormField>
        </div>

        <FormField label={isUA ? "Назва" : "Title"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'title' : 'title_en')}>
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
          <p className="text-xs text-gray-400 mt-1">vogel.travel/ua/services/<strong>{form.slug || 'slug'}</strong></p>
        </FormField>

        <FormField label="Зображення" required>
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="services" />
        </FormField>
        <FormField label={isUA ? "Alt текст фото" : "Image Alt Text"} onTranslate={() => handleTranslate(isUA ? 'image_alt' : 'image_alt_en')}>
          <input
            type="text"
            className={inputClass}
            value={isUA ? form.image_alt : form.image_alt_en}
            onChange={(e) => set(isUA ? 'image_alt' : 'image_alt_en', e.target.value)}
            placeholder={isUA ? form.image_alt_en : form.image_alt}
          />
        </FormField>

        <FormField label={isUA ? "Опис" : "Description"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'description' : 'description_en')}>
          <textarea 
            className={inputClass} 
            rows={4} 
            value={isUA ? form.description : form.description_en} 
            onChange={(e) => set(isUA ? 'description' : 'description_en', e.target.value)} 
            required={isUA} 
            placeholder={isUA ? form.description_en : form.description}
          />
        </FormField>

        {/* Service Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Деталі (підпункти) - {isUA ? 'UA' : 'EN'}</label>
          <div className="space-y-2">
            {(isUA ? form.items : form.items_en).map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(i, 'label', e.target.value)}
                  className={inputClass}
                  placeholder={isUA ? "Назва" : "Label"}
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(i, 'text', e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder={isUA ? "Опис" : "Text"}
                />
                <button
                  type="button"
                  onClick={() => {
                    const key = isUA ? 'items' : 'items_en';
                    set(key, (form[key] as DBServiceItem[]).filter((_, j) => j !== i));
                  }}
                  className="text-red-400 hover:text-red-600 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const key = isUA ? 'items' : 'items_en';
                set(key, [...(form[key] as DBServiceItem[]), { label: '', text: '' }]);
              }}
              className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              <Plus size={14} /> Додати підпункт
            </button>
          </div>
        </div>

        {/* Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Розділи сторінки деталей ({isUA ? 'UA' : 'EN'})
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
          <button type="button" onClick={() => navigate('/admin/services')} className={btnSecondary}>
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
