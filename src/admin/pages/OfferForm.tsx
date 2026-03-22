import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import FormField, { inputClass, btnPrimary, btnSecondary } from '../components/FormField';
import ImageUploader from '../components/ImageUploader';
import SectionEditor from '../components/SectionEditor';
import type { DBOffer, DBSection } from '../../lib/types';

const emptyOffer = {
  location: '',
  hotel: '',
  image: '',
  book_by: '',
  stay_from: '',
  stay_to: '',
  discount: '',
  description: '',
  sections: [] as DBSection[],
  is_published: true,
};

export default function OfferForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyOffer);

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
      setForm({
        location: existing.location,
        hotel: existing.hotel,
        image: existing.image,
        book_by: existing.book_by,
        stay_from: existing.stay_from,
        stay_to: existing.stay_to,
        discount: existing.discount,
        description: existing.description || '',
        sections: existing.sections || [],
        is_published: existing.is_published,
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isNew) {
        const { data: maxOrder } = await supabase.from('offers').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const sort_order = (maxOrder?.[0]?.sort_order ?? -1) + 1;
        const { error } = await supabase.from('offers').insert({ ...form, sort_order });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('offers').update({ ...form, updated_at: new Date().toISOString() }).eq('id', Number(id));
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Нова пропозиція' : 'Редагувати пропозицію'}</h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Готель" required>
            <input className={inputClass} value={form.hotel} onChange={(e) => set('hotel', e.target.value)} required />
          </FormField>
          <FormField label="Локація" required>
            <input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} required />
          </FormField>
          <FormField label="Бронювання до" required>
            <input className={inputClass} value={form.book_by} onChange={(e) => set('book_by', e.target.value)} placeholder="12/04" required />
          </FormField>
          <FormField label="Знижка">
            <input className={inputClass} value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="-60%" />
          </FormField>
          <FormField label="Перебування з" required>
            <input className={inputClass} value={form.stay_from} onChange={(e) => set('stay_from', e.target.value)} placeholder="05/05" required />
          </FormField>
          <FormField label="Перебування до" required>
            <input className={inputClass} value={form.stay_to} onChange={(e) => set('stay_to', e.target.value)} placeholder="30/09" required />
          </FormField>
        </div>

        <FormField label="Зображення" required>
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} folder="offers" />
        </FormField>

        <FormField label="Короткий опис">
          <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Секції детальної сторінки</label>
          <SectionEditor sections={form.sections} onChange={(s) => set('sections', s)} />
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
