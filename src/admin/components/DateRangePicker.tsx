import { useState, useRef, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format, parseISO, isValid } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  from: string | undefined;
  to: string | undefined;
  onChange: (range: { from: string; to: string }) => void;
  label?: string;
  isUA?: boolean;
}

export default function DateRangePicker({ from, to, onChange, label, isUA = true }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const initialRange: DateRange | undefined = {
    from: from && isValid(parseISO(from)) ? parseISO(from) : undefined,
    to: to && isValid(parseISO(to)) ? parseISO(to) : undefined,
  };

  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  useEffect(() => {
    // Sync internal state if props change externally
    setRange({
      from: from && isValid(parseISO(from)) ? parseISO(from) : undefined,
      to: to && isValid(parseISO(to)) ? parseISO(to) : undefined,
    });
  }, [from, to]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    if (newRange?.from && newRange?.to) {
      onChange({
        from: format(newRange.from, 'yyyy-MM-dd'),
        to: format(newRange.to, 'yyyy-MM-dd')
      });
      // Delay closing slightly so user sees the selection
      setTimeout(() => setIsOpen(false), 300);
    } else if (newRange?.from) {
      // Only one date selected, keep open but maybe sync partially if needed
      // (usually we wait for second date for ranges)
    } else if (!newRange) {
        onChange({ from: '', to: '' });
    }
  };

  const displayText = range?.from && range?.to 
    ? `${format(range.from, 'dd/MM/yyyy')} — ${format(range.to, 'dd/MM/yyyy')}`
    : isUA ? 'Оберіть період' : 'Select period';

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-left hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-gray-400" />
          <span className={range?.from ? 'text-gray-800' : 'text-gray-400'}>{displayText}</span>
        </div>
        {range?.from && (
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
              --rdp-accent-color: #5cc8bd;
              --rdp-background-color: #e6f7f6;
              margin: 0;
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
            .rdp {
              --rdp-cell-size: 44px;
              --rdp-accent-color: #5cc8bd !important;
              --rdp-accent-background-color: #e6f7f6 !important;
              margin: 0;
            }
            /* Universal selection override */
            .rdp-day_button[aria-selected='true'],
            .rdp-selected .rdp-day_button,
            [class*='rdp-selected'] .rdp-day_button,
            .rdp-range_start .rdp-day_button,
            .rdp-range_end .rdp-day_button {
              background-color: #5cc8bd !important;
              color: white !important;
            }
            .rdp-range_middle {
              background-color: #e6f7f6 !important;
              color: #0b7a70 !important;
            }
            .rdp-range_start {
              border-top-left-radius: 50% !important;
              border-bottom-left-radius: 50% !important;
            }
            .rdp-range_end {
              border-top-right-radius: 50% !important;
              border-bottom-right-radius: 50% !important;
            }
            /* Navigation and headers */
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
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={isUA ? uk : enUS}
            showOutsideDays
            className="font-inter"
            modifiersStyles={{
              selected: { 
                backgroundColor: '#5cc8bd',
                color: 'white'
              },
              range_start: {
                backgroundColor: '#5cc8bd',
                color: 'white'
              },
              range_end: {
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
