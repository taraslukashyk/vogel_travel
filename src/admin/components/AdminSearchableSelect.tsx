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
  const [searchValue, setSearchValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search value when external value changes (e.g. from form)
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const filteredOptions = options.filter(o => 
    o.label.toLowerCase().includes((searchValue || '').toLowerCase()) || 
    o.subLabel?.toLowerCase().includes((searchValue || '').toLowerCase())
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (opt: Option) => {
    onChange(opt.label);
    setSearchValue(opt.label);
    setIsOpen(false);
  };

  const selectedOption = options.find(o => o.label === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {selectedOption?.flag && <span className="text-lg">{selectedOption.flag}</span>}
          {!selectedOption?.flag && <Search size={16} />}
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-10 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 outline-none ${
            isOpen ? 'border-[#5cc8bd] ring-2 ring-[#5cc8bd]/10' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        <div 
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400 italic">
                {searchValue ? `Натисніть Enter щоб використати "${searchValue}"` : 'Нічого не знайдено'}
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt)}
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
