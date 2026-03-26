import { Globe } from 'lucide-react';

interface LanguageTabsProps {
  activeTab: 'ua' | 'en';
  onChange: (tab: 'ua' | 'en') => void;
}

export default function LanguageTabs({ activeTab, onChange }: LanguageTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 border border-gray-200 shadow-sm">
      <button
        type="button"
        onClick={() => onChange('ua')}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 tracking-wider ${
          activeTab === 'ua'
            ? 'bg-white text-teal-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-50 text-[10px] boarder border-blue-100">UA</span>
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
        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-[10px] boarder border-red-100">EN</span>
        ENGLISH
        <Globe size={14} className={activeTab === 'en' ? 'text-teal-500' : 'text-gray-400'} />
      </button>
    </div>
  );
}
