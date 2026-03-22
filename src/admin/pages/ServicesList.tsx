import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { btnPrimary } from '../components/FormField';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DBService } from '../../lib/types';

function SortableRow({ service, onToggle, onDelete }: { service: DBService; onToggle: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-3">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-3 py-3 font-medium text-gray-500">{service.num}</td>
      <td className="px-3 py-3 font-medium text-gray-800">{service.title}</td>
      <td className="px-3 py-3">
        <button onClick={onToggle} className={`${service.is_published ? 'text-green-600' : 'text-gray-400'}`}>
          {service.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <Link to={`/admin/services/${service.id}`} className="text-teal-600 hover:text-teal-800"><Edit size={16} /></Link>
          <button onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function ServicesList() {
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor));

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin_services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort_order');
      if (error) throw error;
      return data as DBService[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: number; is_published: boolean }) => {
      const { error } = await supabase.from('services').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_services'] }); qc.invalidateQueries({ queryKey: ['services'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_services'] }); qc.invalidateQueries({ queryKey: ['services'] }); },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: { id: number; sort_order: number }[]) => {
      for (const item of items) {
        await supabase.from('services').update({ sort_order: item.sort_order }).eq('id', item.id);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_services'] }); qc.invalidateQueries({ queryKey: ['services'] }); },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex(s => s.id === active.id);
      const newIndex = services.findIndex(s => s.id === over.id);
      const reordered = arrayMove(services, oldIndex, newIndex);
      qc.setQueryData(['admin_services'], reordered);
      reorderMutation.mutate(reordered.map((s, i) => ({ id: s.id, sort_order: i })));
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-400">Завантаження...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Сервіси</h1>
        <Link to="/admin/services/new" className={btnPrimary + ' flex items-center gap-2'}>
          <Plus size={16} /> Додати
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <th className="px-3 py-2 w-10"></th>
              <th className="px-3 py-2 w-16">№</th>
              <th className="px-3 py-2">Назва</th>
              <th className="px-3 py-2 w-16">Статус</th>
              <th className="px-3 py-2 w-20">Дії</th>
            </tr>
          </thead>
          <tbody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {services.map((service) => (
                  <SortableRow
                    key={service.id}
                    service={service}
                    onToggle={() => toggleMutation.mutate({ id: service.id, is_published: !service.is_published })}
                    onDelete={() => { if (confirm('Видалити цей сервіс?')) deleteMutation.mutate(service.id); }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
        {services.length === 0 && <div className="text-center py-10 text-gray-400">Немає сервісів</div>}
      </div>
    </div>
  );
}
