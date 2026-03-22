import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({ value, onChange, folder = 'general' }: ImageUploaderProps) {
  const { upload, uploading } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = await upload(file, folder);
    onChange(url);
  }, [upload, folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <Upload size={20} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            {uploading ? 'Завантаження...' : 'Перетягніть або натисніть'}
          </span>
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={uploading} />
        </label>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Або вставте URL зображення"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
      />
    </div>
  );
}
