import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, X, Globe, FileText } from 'lucide-react';
import type { DBSeoMeta } from '../../lib/types';
import SeoPromptGenerator from '../components/SeoPromptGenerator';

const defaultPages = [
  { path: '/', label: 'Головна' },
  { path: '/about', label: 'Про нас' },
  { path: '/offers', label: 'Пропозиції' },
  { path: '/services', label: 'Сервіси' },
  { path: '/blog', label: 'Блог' },
  { path: '/contacts', label: 'Контакти' },
  { path: '/partners', label: 'Партнерство' },
];

export default function SeoList() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: seoEntries = [], isLoading } = useQuery({
    queryKey: ['admin_seo'],
    queryFn: async () => {
      const { data, error } = await supabase.from('seo_meta').select('*').order('page_path');
      if (error) throw error;
      return data as DBSeoMeta[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (page_path: string) => {
      const label = defaultPages.find(p => p.path === page_path)?.label || page_path;
      const { error } = await supabase.from('seo_meta').insert({
        page_path,
        title: `${label} | Vogel Travel`,
        description: '',
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin_seo'] }),
  });

  const existingPaths = new Set(seoEntries.map(e => e.page_path));
  const missingPages = defaultPages.filter(p => !existingPaths.has(p.path));

  if (isLoading) return <div className="text-center py-10 text-gray-400">Завантаження...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Налаштування пошукової оптимізації (SEO)</h1>
        <p className="text-sm text-gray-600 max-w-4xl">
          SEO (Search Engine Optimization) — це налаштування, які допомагають пошуковим системам (Google) краще розуміти вміст вашого сайту. Правильно заповнені <strong>Title</strong>, <strong>Description</strong> та ключові слова піднімають ваші пропозиції та статті у пошуковій видачі, приводячи безкоштовних клієнтів. А налаштування <strong>Open Graph (OG)</strong> роблять ваші посилання красивими при поширенні у соцмережах та месенджерах (Telegram, Viber).
        </p>
      </div>

      {/* Info block */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 space-y-1">
        <p><Globe size={14} className="inline mr-1" /><strong>Статичні сторінки</strong> (/, /offers, /blog...) — SEO налаштовується тут</p>
        <p><FileText size={14} className="inline mr-1" /><strong>Підсторінки</strong> (/offers/1, /blog/3...) — SEO вводиться в формі редагування кожної пропозиції/статті</p>
      </div>

      {missingPages.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">Є сторінки без SEO налаштувань:</p>
          <div className="flex flex-wrap gap-2">
            {missingPages.map(p => (
              <button
                key={p.path}
                onClick={() => createMutation.mutate(p.path)}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-yellow-300 rounded text-sm text-yellow-700 hover:bg-yellow-100"
              >
                <Plus size={14} /> {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
              <th className="px-3 py-2">Сторінка</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2 w-16">OG</th>
            </tr>
          </thead>
          <tbody>
            {seoEntries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/admin/seo/${entry.id}`)}
              >
                <td className="px-3 py-3 font-medium text-gray-800">{entry.page_path}</td>
                <td className="px-3 py-3 text-gray-600 max-w-[200px] truncate">{entry.title || '—'}</td>
                <td className="px-3 py-3 text-gray-600 max-w-[200px] truncate">{entry.description || '—'}</td>
                <td className="px-3 py-3">
                  {entry.og_title ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-gray-300" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {seoEntries.length === 0 && <div className="text-center py-10 text-gray-400">Немає SEO записів</div>}
      </div>

      <SeoPromptGenerator />
    </div>
  );
}
