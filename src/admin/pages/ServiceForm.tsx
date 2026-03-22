import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import { Plus, Trash2 } from 'lucide-react';
import type { DBService, DBServiceItem } from '../../lib/types';

const emptyService = {
  num: '',
  title: '',
  description: '',
  image: '',
  type: 'Сервіс',
  items: [] as DBServiceItem[],
  is_published: true,
};

export default function ServiceForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyService);

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
        type: existing.type,
        items: existing.items || [],
        is_published: existing.is_published,
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isNew) {
        const { data: maxOrder } = await supabase.from('services').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { error } = await supabase.from('services').insert({ ...form, sort_order });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').update({ ...form, updated_at: new Date().toISOString() }).eq('id', Number(id));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_services'] });
      qc.invalidateQueries({ queryKey: ['services'] });
      navigate('/admin/services');
    },
  });

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const updateItem = (index: number, field: keyof DBServiceItem, value: string) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    set('items', items);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Новий сервіс' : 'Редагувати сервіс'}</h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Номер" required>
            <input className={inputClass} value={form.num} onChange={(e) => set('num', e.target.value)} placeholder="01" required />
          </FormField>
          <FormField label="Тип">
            <input className={inputClass} value={form.type} onChange={(e) => set('type', e.target.value)} placeholder="Сервіс" />
          </FormField>
        </div>

        <FormField label="Назва" required>
          <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </FormField>

        <FormField label="Зображення" required>
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="services" />
        </FormField>

        <FormField label="Опис" required>
          <textarea className={inputClass} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} required />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Деталі (підпункти)</label>
          <div className="space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(i, 'label', e.target.value)}
                  className={inputClass}
                  placeholder="Назва"
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(i, 'text', e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Опис"
                />
                <button
                  type="button"
                  onClick={() => set('items', form.items.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set('items', [...form.items, { label: '', text: '' }])}
              className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              <Plus size={14} /> Додати підпункт
            </button>
          </div>
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
          <button type="button" onClick={() => navigate('/admin/services')} className={btnSecondary}>
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
