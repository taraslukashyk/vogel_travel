import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils/slugify';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import LanguageTabs from '../components/LanguageTabs';
import { syncSections } from '../utils/sectionSync';
import { Plus, FileText, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormTranslation } from '../hooks/useFormTranslation';
import { translateText } from '../utils/translate';
import type { DBOffer, DBSection } from '../../lib/types';

interface GalleryImage {
  image: string;
  caption: string;
  caption_en: string;
  alt: string;
  alt_en: string;
  _id: string;
}

function SortableGalleryItem({ item, index, onUpdate, onRemove, isUA }: {
  item: GalleryImage;
  index: number;
  onUpdate: (index: number, updates: Partial<GalleryImage>) => void;
  onRemove: (index: number) => void;
  isUA: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleTranslate = async (field: 'caption' | 'alt') => {
    const from = isUA ? 'en' : 'uk';
    const to = isUA ? 'uk' : 'en';
    const sourceField = isUA ? (field === 'caption' ? 'caption_en' : 'alt_en') : field;
    const sourceValue = item[sourceField as keyof GalleryImage] as string;
    
    if (!sourceValue) return;
    
    const translated = await translateText(sourceValue, from, to);
    onUpdate(index, { [isUA ? field : `${field}_en`]: translated });
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row gap-3 items-start bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3">
        <button type="button" {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 shrink-0 p-2 -m-2 outline-none touch-none" style={{ touchAction: 'none' }}>
          <GripVertical size={16} />
        </button>
        <div className="shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.alt} className="w-20 h-20 rounded-lg object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs font-medium">Фото</div>
          )}
        </div>
        <button type="button" onClick={() => onRemove(index)} className="sm:hidden text-red-400 hover:text-red-600 p-2">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 w-full space-y-2">
        <ImageUploader value={item.image} onChange={(url) => onUpdate(index, { image: url })} folder="offers" />
        <FormField 
          label="Підпис до фото" 
          tooltip="Текст, який відображатиметься під фото у галереї."
          onTranslate={() => handleTranslate('caption')}
        >
          <input
            type="text"
            value={isUA ? item.caption : item.caption_en}
            onChange={(e) => onUpdate(index, { [isUA ? 'caption' : 'caption_en']: e.target.value })}
            placeholder={isUA ? item.caption_en : item.caption}
            className={inputClass}
          />
        </FormField>
        <FormField 
          label="Alt текст" 
          tooltip="Опис зображення для SEO (допомагає пошуковим системам зрозуміти що на фото)."
          onTranslate={() => handleTranslate('alt')}
        >
          <input
            type="text"
            value={isUA ? item.alt : item.alt_en}
            onChange={(e) => onUpdate(index, { [isUA ? 'alt' : 'alt_en']: e.target.value })}
            placeholder={isUA ? item.alt_en : item.alt}
            className={inputClass + ' text-xs'}
          />
        </FormField>
      </div>

      <button type="button" onClick={() => onRemove(index)} className="hidden sm:block text-red-400 hover:text-red-600 shrink-0 mt-2 p-1 hover:bg-red-50 rounded">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

const emptyOffer = {
  // UA
  location: '',
  hotel: '',
  book_by: '',
  stay_from: '',
  stay_to: '',
  discount: '',
  description: '',
  sections: [] as DBSection[],
  seo_title: '',
  seo_description: '',
  
  // EN
  location_en: '',
  hotel_en: '',
  book_by_en: '',
  stay_from_en: '',
  stay_to_en: '',
  discount_en: '',
  description_en: '',
  sections_en: [] as DBSection[],
  seo_title_en: '',
  seo_description_en: '',
  
  // Common
  image: '',
  image_alt: '',
  image_alt_en: '',
  slug: '',
  slug_en: '',
  is_published: true,
};

export default function OfferForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyOffer);
  const [activeTab, setActiveTab] = useState<'ua' | 'en'>('ua');
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  
  const gallerySensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { data: existing } = useQuery({
    queryKey: ['admin_offer', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('offers').select('*').eq('id', Number(id)).single();
      if (error) throw error;
      return data as DBOffer;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      // Separate image sections (gallery) from text/list sections
      // For now, gallery is common but sections can be language-specific
      const allSections = existing.sections || [];
      const textSections = allSections.filter(s => s.type !== 'image');
      const imageSections = allSections.filter(s => s.type === 'image');

      setForm({
        location: existing.location,
        hotel: existing.hotel,
        book_by: existing.book_by,
        stay_from: existing.stay_from,
        stay_to: existing.stay_to,
        discount: existing.discount,
        description: existing.description || '',
        sections: textSections,
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        
        location_en: existing.location_en || '',
        hotel_en: existing.hotel_en || '',
        book_by_en: existing.book_by_en || '',
        stay_from_en: existing.stay_from_en || '',
        stay_to_en: existing.stay_to_en || '',
        discount_en: existing.discount_en || '',
        description_en: existing.description_en || '',
        sections_en: syncSections(textSections, existing.sections_en || []),
        seo_title_en: existing.seo_title_en || '',
        seo_description_en: existing.seo_description_en || '',

        image: existing.image,
        image_alt: existing.image_alt || '',
        image_alt_en: existing.image_alt_en || '',
        slug: existing.slug || '',
        slug_en: existing.slug_en || '',
        is_published: existing.is_published,
      });

      setGallery(imageSections.map((s, idx) => {
        const enSection = (existing.sections_en || []).filter(sec => sec.type === 'image')[idx];
        return {
          image: s.image || '',
          caption: typeof s.content === 'string' ? s.content : '',
          caption_en: typeof enSection?.content === 'string' ? enSection.content : '',
          alt: s.alt || '',
          alt_en: enSection?.alt || '',
          _id: `gal-${idx}`
        };
      }));
    }
  }, [existing]);

  const buildSections = (target: 'ua' | 'en'): DBSection[] => {
    const textSections = target === 'ua' ? form.sections : form.sections_en;
    const imageSections: DBSection[] = gallery
      .filter(g => g.image)
      .map(g => ({ 
        type: 'image' as const, 
        content: target === 'ua' ? g.caption : g.caption_en, 
        image: g.image, 
        alt: (target === 'ua' ? g.alt : g.alt_en) || undefined 
      }));
    return [...textSections, ...imageSections];
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { 
        ...form, 
        book_by_en: form.book_by,
        stay_from_en: form.stay_from,
        stay_to_en: form.stay_to,
        discount_en: form.discount,
        slug_en: form.slug, // Sync English slug with Ukrainian
        sections: buildSections('ua'),
        sections_en: buildSections('en')
      };
      
      if (isNew) {
        const { data: maxOrder } = await supabase.from('offers').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { data, error } = await supabase.from('offers').insert({ ...payload, sort_order }).select().single();
        if (error) throw error;
        return data;
      } else {
        const { error } = await supabase.from('offers').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin_offers'] });
      qc.invalidateQueries({ queryKey: ['offers'] });
      if (isNew && data?.id) {
        navigate(`/admin/offers/${data.id}`);
      } else {
        qc.invalidateQueries({ queryKey: ['admin_offer', id] });
        alert('Збережено успішно!');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('offers').delete().eq('id', Number(id));
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_offers'] });
      qc.invalidateQueries({ queryKey: ['offers'] });
      navigate('/admin/offers');
    },
  });

  const handleDelete = () => {
    if (confirm('Видалити цю пропозицію?')) {
      deleteMutation.mutate();
    }
  };

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));
  const isUA = activeTab === 'ua';
  const { handleTranslate, handleTranslateAll, isTranslating } = useFormTranslation(form, setForm, isUA);

  const translatableFields = [
    'hotel',
    'location',
    'description',
    'image_alt',
    'seo_title',
    'seo_description'
  ];
  // Gallery helpers
  const addGalleryImage = () => setGallery(prev => [...prev, { image: '', caption: '', caption_en: '', alt: '', alt_en: '', _id: `gal-${prev.length}` }]);
  const updateGalleryImage = (index: number, updates: Partial<GalleryImage>) => {
    setGallery(prev => prev.map((g, i) => i === index ? { ...g, ...updates } : g));
  };
  const removeGalleryImage = (index: number) => setGallery(prev => prev.filter((_, i) => i !== index));
  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const items = gallery;
      const oldIndex = items.findIndex(g => g._id === active.id);
      const newIndex = items.findIndex(g => g._id === over.id);
      setGallery(arrayMove(gallery, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="sticky top-[64px] lg:top-0 z-[25] bg-gray-50/95 backdrop-blur-sm -mx-4 lg:-mx-6 px-4 lg:px-6 pt-4 pb-1 mb-6 border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{isNew ? 'Нова пропозиція' : 'Редагувати пропозицію'}</h1>
        <LanguageTabs 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          onTranslateAll={() => handleTranslateAll(translatableFields)}
          isTranslating={isTranslating}
        />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        {/* Секція 1: Картка (Прев'ю) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <Plus className="text-teal-600" size={18} />
            <h2 className="font-semibold text-gray-800 text-base">Інформація для картки ({isUA ? 'UA' : 'EN'})</h2>
          </div>
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label={isUA ? "Готель" : "Hotel Name"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'hotel' : 'hotel_en')}>
                <input
                  className={inputClass}
                  value={isUA ? form.hotel : form.hotel_en}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isUA) {
                      set('hotel', val);
                      if (isNew) set('slug', slugify(`${val} ${form.location}`));
                    } else {
                      set('hotel_en', val);
                    }
                  }}
                  required={isUA}
                  placeholder={isUA ? form.hotel_en : form.hotel || (isUA ? "Dusit Thani Maldives" : "Hotel name in English")}
                />
              </FormField>

              <FormField label="URL-адреса (спільна для обох мов)">
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                />
                <p className="text-xs text-gray-400 mt-1">vogel.travel/ua/offers/<strong>{form.slug || 'slug'}</strong></p>
              </FormField>

               <FormField label={isUA ? "Локація" : "Location"} required={isUA} onTranslate={() => handleTranslate(isUA ? 'location' : 'location_en')}>
                <input
                  className={inputClass}
                  value={isUA ? form.location : form.location_en}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isUA) {
                      set('location', val);
                      if (isNew) set('slug', slugify(`${form.hotel} ${val}`));
                    } else {
                      set('location_en', val);
                    }
                  }}
                  required={isUA}
                  placeholder={isUA ? form.location_en : form.location}
                />
              </FormField>
              <FormField label={isUA ? "Бронювання до" : "Book by"} required>
                <input className={inputClass} value={form.book_by} onChange={(e) => set('book_by', e.target.value)} placeholder="12/04" required />
              </FormField>
              <FormField label={isUA ? "Знижка" : "Discount"}>
                <input className={inputClass} value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="-60%" />
              </FormField>
              <FormField label={isUA ? "Перебування з" : "Stay from"} required>
                <input className={inputClass} value={form.stay_from} onChange={(e) => set('stay_from', e.target.value)} placeholder="05/05" required />
              </FormField>
              <FormField label={isUA ? "Перебування до" : "Stay to"} required>
                <input className={inputClass} value={form.stay_to} onChange={(e) => set('stay_to', e.target.value)} placeholder="30/09" required />
              </FormField>
            </div>

            {/* Main Image (Common) */}
            <FormField label="Зображення" required tooltip="Головне фото пропозиції.">
              <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="offers" />
            </FormField>
            <FormField label={isUA ? "Alt текст головного фото" : "Main Image Alt Text"} onTranslate={() => handleTranslate(isUA ? 'image_alt' : 'image_alt_en')}>
              <input
                type="text"
                className={inputClass}
                value={isUA ? form.image_alt : form.image_alt_en}
                onChange={(e) => set(isUA ? 'image_alt' : 'image_alt_en', e.target.value)}
                placeholder={isUA ? form.image_alt_en : form.image_alt}
              />
            </FormField>

            <FormField label={isUA ? "Короткий опис" : "Short Description"} onTranslate={() => handleTranslate(isUA ? 'description' : 'description_en')}>
              <textarea 
                className={inputClass} 
                rows={2} 
                value={isUA ? form.description : form.description_en} 
                onChange={(e) => set(isUA ? 'description' : 'description_en', e.target.value)} 
                placeholder={isUA ? form.description_en : form.description}
              />
            </FormField>
          </div>
        </div>

        {/* Секція 2: Внутрішня сторінка */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <FileText className="text-blue-600" size={18} />
            <h2 className="font-semibold text-gray-800 text-base">Наповнення сторінки ({isUA ? 'UA' : 'EN'})</h2>
          </div>
          <div className="p-5 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Контент-секції</label>
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

            <div className="pt-6 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Галерея фото (спільна)</label>
              <div className="space-y-3">
                <DndContext sensors={gallerySensors} collisionDetection={closestCenter} onDragEnd={handleGalleryDragEnd}>
                  <SortableContext items={gallery.map((_, i) => `gal-${i}`)} strategy={verticalListSortingStrategy}>
                    {gallery.map((item, index) => (
                      <SortableGalleryItem
                        key={`gal-${index}`}
                        item={{ ...item, _id: `gal-${index}` }}
                        index={index}
                        onUpdate={updateGalleryImage}
                        onRemove={removeGalleryImage}
                        isUA={isUA}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-teal-500 hover:text-teal-600 w-full justify-center"
                >
                  <Plus size={16} />
                  Додати фото до галереї
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            🔍 SEO ({isUA ? 'UA' : 'EN'})
          </h3>
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
            Опублікована
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти (Обидві мови)'}
          </button>
          <button type="button" onClick={() => navigate('/admin/offers')} className={btnSecondary}>
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
