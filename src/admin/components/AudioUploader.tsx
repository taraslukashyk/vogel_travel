import { useCallback, useState } from 'react';
import { Upload, X, Music } from 'lucide-react';
import { useAudioUpload } from '../hooks/useAudioUpload';

interface AudioUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function AudioUploader({ value, onChange, folder = 'audio' }: AudioUploaderProps) {
  const { upload, uploading } = useAudioUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Будь ласка, завантажте аудіофайл (наприклад, .mp3)');
      return;
    }
    try {
      const url = await upload(file, folder);
      onChange(url);
    } catch (e) {
      alert('Помилка при завантаженні аудіо (можливо, не підтримується тип файлу у цьому сховищі)');
    }
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
        <div className="relative inline-flex items-center gap-3 p-3 border border-teal-200 bg-teal-50 rounded-lg pr-10 max-w-full">
          <div className="p-2 bg-teal-100 rounded-full text-teal-600 shrink-0">
            <Music size={20} />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-teal-800 truncate" title={value}>
              Аудіофайл завантажено
            </p>
            <p className="text-xs text-teal-600 truncate opacity-70">
              {value.split('/').pop()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-red-500 hover:bg-red-100 p-1.5 rounded-full"
            title="Видалити"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {!value && (
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
              {uploading ? 'Завантаження...' : 'Перетягніть або натисніть (MP3, WAV)'}
            </span>
            <input type="file" accept="audio/*" onChange={handleChange} className="hidden" disabled={uploading} />
          </label>
        </div>
      )}

      {/* Manual URL Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Або вставте повний URL аудіо (.mp3)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none mt-2"
        disabled={uploading}
      />
    </div>
  );
}
