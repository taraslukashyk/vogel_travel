import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parseISO, isValid } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  value: string | undefined;
  onChange: (date: string) => void;
  label?: string;
  isUA?: boolean;
  required?: boolean;
}

export default function DatePicker({ value, onChange, label, isUA = true, required }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = value && isValid(parseISO(value)) ? parseISO(value) : undefined;
  const [selected, setSelected] = useState<Date | undefined>(initialDate);

  useEffect(() => {
    setSelected(value && isValid(parseISO(value)) ? parseISO(value) : undefined);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    } else {
      onChange('');
    }
  };

  const displayText = selected 
    ? format(selected, 'dd/MM/yyyy') 
    : isUA ? 'Оберіть дату' : 'Select date';

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-left hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-gray-400" />
          <span className={selected ? 'text-gray-800' : 'text-gray-400'}>{displayText}</span>
        </div>
        {selected && !required && (
          <X 
            size={14} 
            className="text-gray-400 hover:text-red-500 cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(undefined);
            }} 
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200 origin-top-left">
          <style>{`
            .rdp {
               --rdp-cell-size: 44px;
               --rdp-accent-color: #5cc8bd !important;
               margin: 0;
            }
            .rdp-day_button[aria-selected='true'],
            .rdp-selected .rdp-day_button,
            [class*='rdp-selected'] .rdp-day_button {
              background-color: #5cc8bd !important;
              color: white !important;
              border-radius: 50% !important;
            }
            .rdp-button_previous, .rdp-button_next {
              color: #5cc8bd !important;
            }
            .rdp-button_previous:hover, .rdp-button_next:hover {
              background-color: #e6f7f6 !important;
            }
            .rdp-caption_label {
              color: #0b7a70;
              font-weight: 700;
              text-transform: capitalize;
              font-size: 1.1rem;
            }
            .rdp-head_cell {
              color: #94a3b8;
              font-weight: 600;
              text-transform: lowercase;
              font-size: 0.85rem;
            }
            .rdp-day_button:hover:not([aria-selected='true']) {
              background-color: #f3f4f6 !important;
              border-radius: 50% !important;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            locale={isUA ? uk : enUS}
            showOutsideDays
            className="font-inter"
            modifiersStyles={{
              selected: { 
                backgroundColor: '#5cc8bd',
                color: 'white'
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
