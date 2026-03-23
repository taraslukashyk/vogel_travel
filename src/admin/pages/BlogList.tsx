import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { btnPrimary } from '../components/FormField';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DBBlogPost } from '../../lib/types';

function SortableRow({ post, onToggle, onDelete, onClick }: { post: DBBlogPost; onToggle: () => void; onDelete: () => void; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={onClick}>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-3 py-3">
        <img src={post.image} alt="" className="w-16 h-10 rounded object-cover" />
      </td>
      <td className="px-3 py-3 font-medium text-gray-800">{post.title}</td>
      <td className="px-3 py-3 text-gray-600 hidden md:table-cell">{post.category}</td>
      <td className="px-3 py-3 text-gray-600">{post.date}</td>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button onClick={onToggle} className={`${post.is_published ? 'text-green-600' : 'text-gray-400'}`}>
          {post.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </td>
      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
      </td>
    </tr>
  );
}

export default function BlogList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor));

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin_blog'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('sort_order');
      if (error) throw error;
      return data as DBBlogPost[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: number; is_published: boolean }) => {
      const { error } = await supabase.from('blog_posts').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_blog'] }); qc.invalidateQueries({ queryKey: ['blog_posts'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_blog'] }); qc.invalidateQueries({ queryKey: ['blog_posts'] }); },
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: { id: number; sort_order: number }[]) => {
      for (const item of items) {
        await supabase.from('blog_posts').update({ sort_order: item.sort_order }).eq('id', item.id);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_blog'] }); qc.invalidateQueries({ queryKey: ['blog_posts'] }); },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex(p => p.id === active.id);
      const newIndex = posts.findIndex(p => p.id === over.id);
      const reordered = arrayMove(posts, oldIndex, newIndex);
      qc.setQueryData(['admin_blog'], reordered);
      reorderMutation.mutate(reordered.map((p, i) => ({ id: p.id, sort_order: i })));
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-400">Завантаження...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Блог</h1>
        <Link to="/admin/blog/new" className={btnPrimary + ' flex items-center gap-2'}>
          <Plus size={16} /> Додати
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <th className="px-3 py-2 w-10"></th>
              <th className="px-3 py-2 w-20">Фото</th>
              <th className="px-3 py-2">Заголовок</th>
              <th className="px-3 py-2 hidden md:table-cell">Категорія</th>
              <th className="px-3 py-2">Дата</th>
              <th className="px-3 py-2 w-16">Статус</th>
              <th className="px-3 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={posts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                {posts.map((post) => (
                  <SortableRow
                    key={post.id}
                    post={post}
                    onClick={() => navigate(`/admin/blog/${post.id}`)}
                    onToggle={() => toggleMutation.mutate({ id: post.id, is_published: !post.is_published })}
                    onDelete={() => { if (confirm('Видалити цей пост?')) deleteMutation.mutate(post.id); }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
        {posts.length === 0 && <div className="text-center py-10 text-gray-400">Немає постів</div>}
      </div>
    </div>
  );
}
