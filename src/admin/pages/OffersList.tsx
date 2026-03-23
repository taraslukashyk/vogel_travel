import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { btnPrimary } from '../components/FormField';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DBOffer } from '../../lib/types';

function SortableRow({ offer, onToggle, onDelete, onClick }: { offer: DBOffer; onToggle: () => void; onDelete: () => void; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: offer.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={onClick}>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-3 py-3">
        <img src={offer.image} alt="" className="w-16 h-10 rounded object-cover" />
      </td>
      <td className="px-3 py-3 font-medium text-gray-800">{offer.hotel}</td>
      <td className="px-3 py-3 text-gray-600 hidden md:table-cell">{offer.location}</td>
      <td className="px-3 py-3 text-gray-600 truncate max-w-[80px] sm:max-w-none">{offer.discount}</td>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button onClick={onToggle} className={`${offer.is_published ? 'text-green-600' : 'text-gray-400'}`}>
          {offer.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </td>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
      </td>
    </tr>
  );
}

export default function OffersList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor));

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['admin_offers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('offers').select('*').order('sort_order');
      if (error) throw error;
      return data as DBOffer[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: number; is_published: boolean }) => {
      const { error } = await supabase.from('offers').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_offers'] }); qc.invalidateQueries({ queryKey: ['offers'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_offers'] }); qc.invalidateQueries({ queryKey: ['offers'] }); },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: { id: number; sort_order: number }[]) => {
      for (const item of items) {
        await supabase.from('offers').update({ sort_order: item.sort_order }).eq('id', item.id);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_offers'] }); qc.invalidateQueries({ queryKey: ['offers'] }); },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = offers.findIndex(o => o.id === active.id);
      const newIndex = offers.findIndex(o => o.id === over.id);
      const reordered = arrayMove(offers, oldIndex, newIndex);
      qc.setQueryData(['admin_offers'], reordered);
      reorderMutation.mutate(reordered.map((o, i) => ({ id: o.id, sort_order: i })));
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-400">Завантаження...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Пропозиції</h1>
        <Link to="/admin/offers/new" className={btnPrimary + ' flex items-center gap-2'}>
          <Plus size={16} /> Додати
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <th className="px-3 py-2 w-10"></th>
              <th className="px-3 py-2 w-20">Фото</th>
              <th className="px-3 py-2">Готель</th>
              <th className="px-3 py-2 hidden md:table-cell">Локація</th>
              <th className="px-3 py-2">Знижка</th>
              <th className="px-3 py-2 w-16">Статус</th>
              <th className="px-3 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={offers.map(o => o.id)} strategy={verticalListSortingStrategy}>
                {offers.map((offer) => (
                  <SortableRow
                    key={offer.id}
                    offer={offer}
                    onClick={() => navigate(`/admin/offers/${offer.id}`)}
                    onToggle={() => toggleMutation.mutate({ id: offer.id, is_published: !offer.is_published })}
                    onDelete={() => { if (confirm('Видалити цю пропозицію?')) deleteMutation.mutate(offer.id); }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
        {offers.length === 0 && <div className="text-center py-10 text-gray-400">Немає пропозицій</div>}
      </div>
    </div>
  );
}
