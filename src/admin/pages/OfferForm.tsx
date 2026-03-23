import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DBOffer, DBSection } from '../../lib/types';

interface GalleryImage {
  image: string;
  caption: string;
  alt: string;
  _id: string;
}

function SortableGalleryItem({ item, index, onUpdate, onRemove }: {
  item: GalleryImage;
  index: number;
  onUpdate: (index: number, updates: Partial<{ image: string; caption: string; alt: string }>) => void;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row gap-3 items-start bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3">
        <button type="button" {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 shrink-0">
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
        <FormField label="Підпис до фото" tooltip="Текст, який відображатиметься під фото у галереї.">
          <input
            type="text"
            value={item.caption}
            onChange={(e) => onUpdate(index, { caption: e.target.value })}
            placeholder="Наприклад: Вид з вікна"
            className={inputClass}
          />
        </FormField>
        <FormField label="Alt текст" tooltip="Опис зображення для SEO (допомагає пошуковим системам зрозуміти що на фото).">
          <input
            type="text"
            value={item.alt}
            onChange={(e) => onUpdate(index, { alt: e.target.value })}
            placeholder="Опис зображення для SEO"
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
  location: '',
  hotel: '',
  image: '',
  image_alt: '',
  book_by: '',
  stay_from: '',
  stay_to: '',
  discount: '',
  description: '',
  sections: [] as DBSection[],
  seo_title: '',
  seo_description: '',
  is_published: true,
};

export default function OfferForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyOffer);
  const [gallery, setGallery] = useState<{ image: string; caption: string; alt: string }[]>([]);
  const gallerySensors = useSensors(useSensor(PointerSensor));

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
      const allSections = existing.sections || [];
      const textSections = allSections.filter(s => s.type !== 'image');
      const imageSections = allSections.filter(s => s.type === 'image');

      setForm({
        location: existing.location,
        hotel: existing.hotel,
        image: existing.image,
        image_alt: existing.image_alt || '',
        book_by: existing.book_by,
        stay_from: existing.stay_from,
        stay_to: existing.stay_to,
        discount: existing.discount,
        description: existing.description || '',
        sections: textSections,
        seo_title: existing.seo_title || '',
        seo_description: existing.seo_description || '',
        is_published: existing.is_published,
      });

      setGallery(imageSections.map(s => ({
        image: s.image || '',
        caption: typeof s.content === 'string' ? s.content : '',
        alt: s.alt || '',
      })));
    }
  }, [existing]);

  // Combine text sections + gallery into final sections array for saving
  const buildSections = (): DBSection[] => {
    const textSections = form.sections;
    const imageSections: DBSection[] = gallery
      .filter(g => g.image)
      .map(g => ({ type: 'image' as const, content: g.caption, image: g.image, alt: g.alt || undefined }));
    return [...textSections, ...imageSections];
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, sections: buildSections() };
      if (isNew) {
        const { data: maxOrder } = await supabase.from('offers').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { error } = await supabase.from('offers').insert({ ...payload, sort_order });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('offers').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_offers'] });
      qc.invalidateQueries({ queryKey: ['offers'] });
      navigate('/admin/offers');
    },
  });

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  // Gallery helpers
  const addGalleryImage = () => setGallery(prev => [...prev, { image: '', caption: '', alt: '' }]);
  const updateGalleryImage = (index: number, updates: Partial<{ image: string; caption: string; alt: string }>) => {
    setGallery(prev => prev.map((g, i) => i === index ? { ...g, ...updates } : g));
  };
  const removeGalleryImage = (index: number) => setGallery(prev => prev.filter((_, i) => i !== index));
  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const items = gallery.map((g, i) => ({ ...g, _id: `gal-${i}` }));
      const oldIndex = items.findIndex(g => g._id === active.id);
      const newIndex = items.findIndex(g => g._id === over.id);
      setGallery(arrayMove(gallery, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Нова пропозиція' : 'Редагувати пропозицію'}</h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Готель" required tooltip="Назва готелю. Це буде головним заголовком на картці пропозиції.">
            <input className={inputClass} value={form.hotel} onChange={(e) => set('hotel', e.target.value)} required />
          </FormField>
          <FormField label="Локація" required tooltip="Місто, курорт або країна.">
            <input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} required />
          </FormField>
          <FormField label="Бронювання до" required tooltip="Остання дата, до якої клієнт може забронювати цю пропозицію.">
            <input className={inputClass} value={form.book_by} onChange={(e) => set('book_by', e.target.value)} placeholder="12/04" required />
          </FormField>
          <FormField label="Знижка" tooltip="Вкажіть розмір знижки (наприклад: 20%, 500$, До 30%). Цей текст відображатиметься як зелений бейдж на картинці.">
            <input className={inputClass} value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="-60%" />
          </FormField>
          <FormField label="Перебування з" required tooltip="Початкова дата періоду, в який діє ця пропозиція на проживання.">
            <input className={inputClass} value={form.stay_from} onChange={(e) => set('stay_from', e.target.value)} placeholder="05/05" required />
          </FormField>
          <FormField label="Перебування до" required tooltip="Кінцева дата періоду, в який діє ця пропозиція на проживання.">
            <input className={inputClass} value={form.stay_to} onChange={(e) => set('stay_to', e.target.value)} placeholder="30/09" required />
          </FormField>
        </div>

        <FormField label="Зображення" required tooltip="Головне фото пропозиції, яке виводиться на картці. Рекомендований розмір 800x600 px.">
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="offers" />
        </FormField>
        <FormField label="Alt текст фото" tooltip="Опишіть, що зображено на головному фото. Це допомагає пошуковим системам та людям з порушенням зору.">
          <input
            type="text"
            value={form.image_alt}
            onChange={(e) => set('image_alt', e.target.value)}
            placeholder="Наприклад: Вигляд на сучасний готельний комплекс біля моря"
            className={inputClass}
          />
        </FormField>

        <FormField label="Короткий опис" tooltip="Текст-анонс, який описує головні переваги. До 150 символів.">
          <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Контент-секції (текст, списки)</label>
          <SectionEditor sections={form.sections} onChange={(s) => set('sections', s)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Галерея фото ({gallery.length} {gallery.length === 1 ? 'фото' : 'фото'})
          </label>
          <p className="text-xs text-gray-400 mb-3">Ці фото відображатимуться в каруселі на сторінці пропозиції</p>
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
                  />
                ))}
              </SortableContext>
            </DndContext>
            <button
              type="button"
              onClick={addGalleryImage}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-teal-500 hover:text-teal-600 w-full justify-center transition-colors"
            >
              <Plus size={16} />
              Додати фото до галереї
            </button>
          </div>
        </div>

        {/* SEO */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            🔍 SEO для цієї сторінки
            <span className="text-xs font-normal text-gray-400">(/offers/{id || 'new'})</span>
          </h3>
          <FormField label="SEO Title" tooltip="Заголовок для пошукових систем (50-60 символів).">
            <input className={inputClass} value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} placeholder={`${form.hotel} — ${form.location} | Vogel Travel`} />
            <p className="text-xs text-gray-400 mt-1">{form.seo_title.length}/60 — залиште порожнім для автоматичного</p>
          </FormField>
          <FormField label="SEO Description" tooltip="Короткий опис сторінки пропозиції для пошукових систем (до 160 символів).">
            <textarea className={inputClass} rows={2} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} placeholder={form.description || 'Опис для пошукових систем'} />
            <p className="text-xs text-gray-400 mt-1">{form.seo_description.length}/160 — залиште порожнім для автоматичного</p>
          </FormField>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            Опублікована
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending} className={btnPrimary}>
            {mutation.isPending ? 'Збереження...' : 'Зберегти'}
          </button>
          <button type="button" onClick={() => navigate('/admin/offers')} className={btnSecondary}>
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
