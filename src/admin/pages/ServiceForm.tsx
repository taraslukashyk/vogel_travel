import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Languages, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils/slugify';
import { translateText } from '../utils/translate';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import { syncSections } from '../utils/sectionSync';
import LanguageTabs from '../components/LanguageTabs';
import { useFormTranslation } from '../hooks/useFormTranslation';
import type { DBService, DBServiceItem, DBSection } from '../../lib/types';

const syncItems = (source: DBServiceItem[] | null | undefined, target: DBServiceItem[] | null | undefined): DBServiceItem[] => {
  const src = Array.isArray(source) ? source : [];
  const tgt = Array.isArray(target) ? target : [];
  return src.map((_, index) => tgt[index] || { label: '', text: '' });
};

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
  price: undefined as number | undefined,
  is_for_payment: false,
  is_published: true,
};

export default function ServiceForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyService);
  const [activeTab, setActiveTab] = useState<'ua' | 'en'>('ua');
  const [translatingItemIndex, setTranslatingItemIndex] = useState<number | null>(null);

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
        items_en: syncItems(existing.items, existing.items_en),
        sections_en: syncSections(existing.sections || [], existing.sections_en || []),
        slug_en: existing.slug_en || '',
        seo_title_en: existing.seo_title_en || '',
        seo_description_en: existing.seo_description_en || '',

        is_published: existing.is_published,
        price: existing.price ?? undefined,
        is_for_payment: existing.is_for_payment || false,
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
        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        return data;
      } else {
        const { error } = await supabase.from('services').update({ 
          ...payload, 
          slug_en: form.slug, // Sync English slug with Ukrainian
          updated_at: new Date().toISOString() 
        }).eq('id', Number(id));
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
      }
    },
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['admin_services'] });
      qc.invalidateQueries({ queryKey: ['services'] });
      if (isNew && data?.id) {
        navigate(`/admin/services/${data.id}`);
      } else {
        qc.invalidateQueries({ queryKey: ['admin_service', id] });
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
    if (activeTab === 'ua') {
      const items = [...form.items];
      items[index] = { ...items[index], [field]: value };
      setForm(prev => ({ ...prev, items, items_en: syncItems(items, prev.items_en) }));
    } else {
      const items_en = [...form.items_en];
      items_en[index] = { ...items_en[index], [field]: value };
      setForm(prev => ({ ...prev, items_en, items: syncItems(items_en, prev.items) }));
    }
  };

  const handleRemoveItem = (index: number) => {
    setForm(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const newItemsEn = prev.items_en.filter((_, i) => i !== index);
      return { ...prev, items: newItems, items_en: newItemsEn };
    });
  };

  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { label: '', text: '' }],
      items_en: [...prev.items_en, { label: '', text: '' }],
    }));
  };

  const handleTranslateItem = async (index: number) => {
    if (translatingItemIndex !== null) return;
    const from = activeTab === 'ua' ? 'en' : 'uk';
    const to = activeTab === 'ua' ? 'uk' : 'en';
    const sourceItems = activeTab === 'ua' ? form.items_en : form.items;
    const sourceItem = sourceItems[index];

    if (!sourceItem) return;

    setTranslatingItemIndex(index);
    try {
      const translatedLabel = sourceItem.label ? await translateText(sourceItem.label, from, to) : '';
      const translatedText = sourceItem.text ? await translateText(sourceItem.text, from, to) : '';

      if (activeTab === 'ua') {
        const items = [...form.items];
        items[index] = { label: translatedLabel, text: translatedText };
        setForm(prev => ({ ...prev, items, items_en: syncItems(items, prev.items_en) }));
      } else {
        const items_en = [...form.items_en];
        items_en[index] = { label: translatedLabel, text: translatedText };
        setForm(prev => ({ ...prev, items_en, items: syncItems(items_en, prev.items) }));
      }
    } catch (error) {
      console.error('Item translation error:', error);
    } finally {
      setTranslatingItemIndex(null);
    }
  };

  const isUA = activeTab === 'ua';
  const { handleTranslate, handleTranslateAll, isTranslating } = useFormTranslation(form, setForm, isUA);

  const translatableFields = [
    'title',
    'description',
    'image_alt',
    'type',
    'seo_title',
    'seo_description'
  ];

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="sticky top-[64px] lg:top-0 z-[40] bg-gray-50/95 backdrop-blur-sm -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 px-4 lg:px-6 pt-4 pb-3 mb-8 border-b border-gray-300 shadow-sm transition-all duration-300">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-teal-50/50 rounded-lg border border-teal-100">
          <FormField label="Вартість (UAH)" tooltip="Фіксована ціна для оплати на сайті.">
            <input 
              type="number"
              className={inputClass} 
              value={form.price ?? ''} 
              onChange={(e) => set('price', e.target.value ? Number(e.target.value) : undefined)} 
              placeholder="5000" 
            />
          </FormField>
          <div className="flex items-center gap-3 h-full pt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.is_for_payment} 
                onChange={(e) => set('is_for_payment', e.target.checked)} 
                className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all cursor-pointer" 
              />
              Виводити на оплату (Кнопка "Оплатити")
            </label>
          </div>
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
                  placeholder={isUA ? "Назва" : (form.items[i]?.label || "Label")}
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(i, 'text', e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder={isUA ? "Опис" : (form.items[i]?.text || "Text")}
                />
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTranslateItem(i)}
                    disabled={translatingItemIndex === i}
                    className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-teal-600 hover:bg-teal-50 rounded border border-teal-200 transition-colors disabled:opacity-50"
                  >
                    {translatingItemIndex === i ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Languages size={12} />
                    )}
                    {translatingItemIndex === i ? '...' : 'Перекласти'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(i)}
                    className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 rounded self-end"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
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
