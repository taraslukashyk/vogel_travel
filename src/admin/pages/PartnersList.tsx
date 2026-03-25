import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { btnPrimary } from '../components/FormField';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DBPartner } from '../../lib/types';

function SortableRow({ partner, onToggle, onDelete, onClick }: {
  partner: DBPartner;
  onToggle: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: partner.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={onClick}>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 p-2 -m-2 outline-none touch-none" style={{ touchAction: 'none' }}>
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-3 py-3">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="h-8 w-16 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: partner.color || '#5cc8bd', color: '#fff' }}
          >
            {partner.tag || '—'}
          </span>
        )}
      </td>
      <td className="px-3 py-3 font-medium text-gray-800">{partner.name}</td>
      <td className="px-3 py-3 text-gray-500 text-sm">{partner.category}</td>
      <td className="px-3 py-3 text-gray-400 text-sm">{partner.location}</td>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button onClick={onToggle} className={`${partner.is_published ? 'text-green-600' : 'text-gray-400'}`}>
          {partner.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </td>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}

export default function PartnersList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['admin_partners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('partners').select('*').order('sort_order');
      if (error) throw error;
      return data as DBPartner[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: number; is_published: boolean }) => {
      const { error } = await supabase.from('partners').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_partners'] });
      qc.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_partners'] });
      qc.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: { id: number; sort_order: number }[]) => {
      for (const item of items) {
        await supabase.from('partners').update({ sort_order: item.sort_order }).eq('id', item.id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_partners'] });
      qc.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = partners.findIndex(p => p.id === active.id);
      const newIndex = partners.findIndex(p => p.id === over.id);
      const reordered = arrayMove(partners, oldIndex, newIndex);
      qc.setQueryData(['admin_partners'], reordered);
      reorderMutation.mutate(reordered.map((p, i) => ({ id: p.id, sort_order: i })));
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-400">Завантаження...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Партнери</h1>
        <Link to="/admin/partners/new" className={btnPrimary + ' flex items-center gap-2'}>
          <Plus size={16} /> Додати
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <th className="px-3 py-2 w-10"></th>
              <th className="px-3 py-2 w-20">Лого</th>
              <th className="px-3 py-2">Назва</th>
              <th className="px-3 py-2 w-36">Категорія</th>
              <th className="px-3 py-2 w-36">Локація</th>
              <th className="px-3 py-2 w-16">Статус</th>
              <th className="px-3 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={partners.map(p => p.id)} strategy={verticalListSortingStrategy}>
                {partners.map((partner) => (
                  <SortableRow
                    key={partner.id}
                    partner={partner}
                    onClick={() => navigate(`/admin/partners/${partner.id}`)}
                    onToggle={() => toggleMutation.mutate({ id: partner.id, is_published: !partner.is_published })}
                    onDelete={() => { if (confirm('Видалити цього партнера?')) deleteMutation.mutate(partner.id); }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
        {partners.length === 0 && <div className="text-center py-10 text-gray-400">Немає партнерів</div>}
      </div>
    </div>
  );
}
