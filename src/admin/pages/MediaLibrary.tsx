import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Trash2, Copy, Check, Upload } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata: { size: number; mimetype: string };
}

export default function MediaLibrary() {
  const qc = useQueryClient();
  const { upload, uploading } = useImageUpload();
  const [copied, setCopied] = useState<string | null>(null);
  const [folder, setFolder] = useState('');

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['media_files', folder],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('images').list(folder || undefined, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      return (data || []).filter(f => f.id) as StorageFile[];
    },
  });

  const { data: folders = [] } = useQuery({
    queryKey: ['media_folders'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('images').list('', { limit: 100 });
      if (error) throw error;
      return (data || []).filter(f => !f.id).map(f => f.name);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage.from('images').remove([path]);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media_files'] }),
  });

  const getPublicUrl = (name: string) => {
    const path = folder ? `${folder}/${name}` : name;
    return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
  };

  const copyUrl = (name: string) => {
    const url = getPublicUrl(name);
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await upload(file, folder || 'general');
      qc.invalidateQueries({ queryKey: ['media_files'] });
    }
    e.target.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Медіа-бібліотека</h1>
        <label className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer flex items-center gap-2">
          <Upload size={16} />
          {uploading ? 'Завантаження...' : 'Завантажити'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {folders.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFolder('')}
            className={`px-3 py-1 rounded text-sm ${!folder ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Всі
          </button>
          {folders.map(f => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-3 py-1 rounded text-sm ${folder === f ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Завантаження...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Немає файлів</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={getPublicUrl(file.name)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(file.name)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
                    title="Копіювати URL"
                  >
                    {copied === file.name ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => { if (confirm('Видалити файл?')) deleteMutation.mutate(folder ? `${folder}/${file.name}` : file.name); }}
                    className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-50"
                    title="Видалити"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.metadata?.size || 0)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
