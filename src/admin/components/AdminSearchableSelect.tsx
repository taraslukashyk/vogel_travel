import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  subLabel?: string;
  flag?: string;
}

interface AdminSearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function AdminSearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Оберіть варіант...',
  label,
  required
}: AdminSearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.label === value || o.id === value);

  const filteredOptions = options.filter(o => 
    o.label.toLowerCase().includes(search.toLowerCase()) || 
    o.subLabel?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 bg-white border rounded-xl cursor-default transition-all duration-200 ${
          isOpen ? 'border-[#5cc8bd] ring-2 ring-[#5cc8bd]/10' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`truncate text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.flag && <span>{selectedOption.flag}</span>}
              {selectedOption.label}
            </span>
          ) : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-gray-50 flex items-center gap-2">
            <Search size={14} className="text-gray-400 ml-2" />
            <input 
              autoFocus
              className="w-full py-2 text-sm bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400 italic">Нічого не знайдено</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.label); // Returning label for direct form binding
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-left ${
                    value === opt.label ? 'bg-[#5cc8bd]/10 text-[#5cc8bd] font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg w-6 flex justify-center">{opt.flag}</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium truncate">{opt.label}</div>
                    {opt.subLabel && <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{opt.subLabel}</div>}
                  </div>
                  {value === opt.label && <Check size={14} className="text-[#5cc8bd]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
