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
    <div className="space-y-4">
      {/* Current File Preview */}
      {value && (
        <div className="relative flex items-center gap-4 p-4 border border-teal-200 bg-teal-50/50 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-3 bg-teal-100/80 rounded-xl text-teal-600 shadow-sm shrink-0">
            <Music size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-teal-900 truncate" title={value}>
              Аудіофайл завантажено
            </p>
            <p className="text-xs text-teal-600/70 truncate font-mono mt-0.5">
              {value.split('/').pop()}
            </p>
            <div className="mt-2 text-xs">
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-800 underline underline-offset-2">
                Слухати файл
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Видалити"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`group relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-teal-500 bg-teal-50 scale-[1.01]' 
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/30 hover:bg-gray-50/80'
        }`}
      >
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full transition-colors ${dragActive ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'}`}>
            <Upload size={24} />
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-semibold text-gray-700">
              {uploading ? 'Завантаження...' : 'Завантажити з ПК'}
            </span>
            <span className="block text-xs text-gray-400">
              Перетягніть файл або натисніть сюди (MP3, WAV)
            </span>
          </div>
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            disabled={uploading} 
          />
        </label>
      </div>

      {/* Manual URL Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
          <Music size={16} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Або вставте пряме посилання на .mp3"
          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
          disabled={uploading}
        />
      </div>
    </div>
  );
}
