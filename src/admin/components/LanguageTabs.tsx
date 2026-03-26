import { Globe, Languages, Loader2 } from 'lucide-react';

interface LanguageTabsProps {
  activeTab: 'ua' | 'en';
  onChange: (tab: 'ua' | 'en') => void;
  onTranslateAll?: () => void;
  isTranslating?: boolean;
}

export default function LanguageTabs({ activeTab, onChange, onTranslateAll, isTranslating }: LanguageTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit border border-gray-200 shadow-sm">
        <button
          type="button"
          onClick={() => onChange('ua')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 tracking-wider ${
            activeTab === 'ua'
              ? 'bg-white text-teal-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-50 text-[10px] boarder border-blue-100 text-blue-600 font-black">UA</span>
          УКРАЇНСЬКА
        </button>
        <button
          type="button"
          onClick={() => onChange('en')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 tracking-wider ${
            activeTab === 'en'
              ? 'bg-white text-teal-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-[10px] boarder border-red-100 text-red-600 font-black">EN</span>
          ENGLISH
          <Globe size={14} className={activeTab === 'en' ? 'text-teal-500' : 'text-gray-400'} />
        </button>
      </div>

      {onTranslateAll && (
        <button
          type="button"
          onClick={onTranslateAll}
          disabled={isTranslating}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#5cc8bd] hover:bg-[#5cc8bd]/5 rounded-lg transition-all disabled:opacity-50"
        >
          {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
          {isTranslating ? 'Перекладаємо...' : 'Перекласти всі поля'}
        </button>
      )}
    </div>
  );
}
