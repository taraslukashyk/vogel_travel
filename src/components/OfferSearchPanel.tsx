import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Sparkles, MapPin, CalendarDays, Moon, Users, 
  Send, CheckCircle2, Minus, Plus, 
  ChevronRight, Loader2, Globe, ChevronDown
} from 'lucide-react';
import { COUNTRIES } from '../lib/data/countries';
import { sendTelegramNotification } from '../lib/notifications';
import { escapeHTML } from '../lib/utils/html';
import { useLanguage } from '../hooks/useLanguage';
import { DayPicker, type DateRange } from 'react-day-picker';
import { uk, enUS } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

/* ── Types ── */
export interface FilterState {
  mode: 'search' | 'custom';
  departureCity: string;
  country: string;
  city: string;
  dateFrom: string; // 'YYYY-MM-DD'
  dateTo: string;
  nights: number | '';
  adults: number;
  children: number;
  childAges: number[];
}

export const emptyFilter = (): FilterState => ({
  mode: 'search',
  departureCity: '',
  country: '',
  city: '',
  dateFrom: '',
  dateTo: '',
  nights: '',
  adults: 2,
  children: 0,
  childAges: [],
});

interface OfferSearchPanelProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

/* ── UI Components ── */



const FieldZone = ({ 
  label, icon: Icon, value, placeholder, onClick, active, subValue, 
  canSearch, searchValue, onSearchChange 
}: { 
  label: string; icon: any; value: string; placeholder: string; onClick: () => void; active: boolean; subValue?: string;
  canSearch?: boolean; searchValue?: string; onSearchChange?: (v: string) => void;
}) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`relative flex flex-col items-start px-5 py-3 transition-all duration-300 group min-h-[70px] w-full ${
      active ? 'bg-white/15 ring-1 ring-white/30 shadow-[0_0_30px_rgba(255,255,255,0.08)]' : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
    }`}
  >
    <div className="flex items-center gap-2 mb-2 pointer-events-none">
      <Icon size={14} className={`${active ? 'text-[#5cc8bd]' : 'text-white/80 group-hover:text-white'} transition-colors`} />
      <span className="text-[10px] uppercase font-montserrat font-black tracking-[0.2em] text-white/70 group-hover:text-white/90">
        {label}
      </span>
    </div>
    <div className="flex flex-col items-start overflow-hidden w-full text-left">
      {active && canSearch ? (
        <input 
          autoFocus
          className="w-full bg-transparent text-sm font-montserrat font-bold text-white border-none outline-none p-0 placeholder:text-white/40 animate-in fade-in duration-300"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder={value || placeholder}
        />
      ) : (
        <span className={`text-sm font-montserrat font-bold truncate w-full ${value ? 'text-white' : 'text-white/40'}`}>
          {value || placeholder}
        </span>
      )}
      {subValue && !active && <span className="text-[10px] text-[#5cc8bd] font-semibold mt-0.5 truncate w-full">{subValue}</span>}
    </div>
    {active && (
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#5cc8bd] rounded-full shadow-[0_0_12px_rgba(92,200,189,0.8)]" />
    )}
  </button>
);

/* ── Main Component ── */
const OfferSearchPanel = ({ filter, onChange }: OfferSearchPanelProps) => {
  const { currentLang } = useLanguage();
  const isUA = currentLang === 'ua';

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const panelRef = useRef<HTMLDivElement>(null);

  const availableYears = useMemo(() => {
    const y = new Date().getFullYear();
    return [y, y + 1, y + 2];
  }, []);

  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push(new Date(calendarYear, i, 1));
    }
    return arr;
  }, [calendarYear]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActiveTab(null);
        setSearchCountry('');
        setSearchCity('');
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const updateFilter = useCallback((updates: Partial<FilterState>) => {
    onChange({ ...filter, ...updates });
  }, [filter, onChange]);

  const set = useCallback(<K extends keyof FilterState>(key: K, val: FilterState[K]) => {
    updateFilter({ [key]: val });
  }, [updateFilter]);

  const guestSummary = useMemo(() => {
    const adultsStr = filter.adults === 1 
      ? (isUA ? '1 дорослий' : '1 adult') 
      : `${filter.adults} ${isUA ? 'дорослих' : 'adults'}`;
    const childrenStr = filter.children > 0 
      ? ` + ${filter.children} ${isUA ? (filter.children === 1 ? 'дит.' : 'дітей') : 'children'}` 
      : '';
    return adultsStr + childrenStr;
  }, [filter.adults, filter.children, isUA]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!form.phone && !form.email) || isSubmitting) return;
    setIsSubmitting(true);

    const countryEntry = COUNTRIES.find(c => c.name === filter.country || c.name_en === filter.country);
    const flagStr = countryEntry ? countryEntry.flag : '';

    const modeLabel = filter.mode === 'search' 
      ? (isUA ? '🔍 Пошук акцій' : '🔍 Deals Search') 
      : (isUA ? '✨ Індивідуальний підбір' : '✨ Individual Quote');

    const kidsAgesStr = filter.children > 0 
      ? ` (вік: ${filter.childAges.slice(0, filter.children).join(', ')})` 
      : '';

    const lines = [
      `<b>🔍 Запит на підбір туру</b>`,
      `<b>Режим:</b> ${modeLabel}`,
      filter.country ? `<b>Країна:</b> ${flagStr} ${escapeHTML(filter.country)}` : null,
      filter.city ? `<b>Місто:</b> ${escapeHTML(filter.city)}` : null,
      filter.nights ? `<b>Ночей:</b> ${filter.nights}` : null,
      `<b>Гості:</b> Дорослі: ${filter.adults} | Діти: ${filter.children}${kidsAgesStr}`,
      '',
      `<b>👤 Клієнт:</b>`,
      `Ім'я: ${escapeHTML(form.name || 'Anonymous')}`,
      form.phone ? `Телефон: ${escapeHTML(form.phone)}` : null,
      form.email ? `Email: ${escapeHTML(form.email)}` : null,
    ].filter(Boolean).join('\n');

    const result = await sendTelegramNotification(lines);
    if (result.success) {
      setIsSuccess(true);
      setForm({ name: '', phone: '', email: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }
    setIsSubmitting(false);
  };

  // Pre-calculate all cities for generic search
  const allCities = useMemo(() => {
    const arr: { name: string; countryName: string; flag: string }[] = [];
    COUNTRIES.forEach(c => {
      const cities = isUA ? c.cities : c.cities_en;
      cities.forEach((city: string) => {
        arr.push({ name: city, countryName: isUA ? c.name : c.name_en, flag: c.flag });
      });
    });
    return arr;
  }, [isUA]);

  const filteredCountries = useMemo(() => {
    if (!searchCountry) return COUNTRIES;
    const s = searchCountry.toLowerCase();
    return COUNTRIES.filter((c) => (isUA ? c.name : c.name_en).toLowerCase().includes(s));
  }, [searchCountry, isUA]);

  const filteredCities = useMemo(() => {
    // If a country is selected, filter cities by that country
    if (filter.country) {
      const c = COUNTRIES.find(cnt => (isUA ? cnt.name : cnt.name_en) === filter.country);
      const cities = isUA ? (c?.cities || []) : (c?.cities_en || []);
      if (!searchCity) return cities.map(city => ({ name: city, countryName: filter.country, flag: c?.flag || '' }));
      const s = searchCity.toLowerCase();
      return cities.filter(city => city.toLowerCase().includes(s)).map(city => ({ name: city, countryName: filter.country, flag: c?.flag || '' }));
    }
    // If no country is selected, search in all cities
    if (!searchCity) return allCities; // Show all cities by default if no search
    const s = searchCity.toLowerCase();
    return allCities.filter(city => city.name.toLowerCase().includes(s));
  }, [filter.country, searchCity, allCities, isUA]);

  return (
    <section className="relative z-30 max-w-[1440px] mx-auto px-4 md:px-12 pointer-events-none">
      <div 
        ref={panelRef}
        className="bg-zinc-950/60 backdrop-blur-3xl border border-white/10 shadow-[0_48px_140px_-20px_rgba(0,0,0,0.9)] p-3 md:p-4 overflow-visible pointer-events-auto"
      >
        {/* Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="text-[9px] uppercase font-montserrat font-black tracking-[0.3em] text-white/20 pl-1">
            {isUA ? 'РЕЖИМ ФІЛЬТРУ' : 'FILTER MODE'}
          </div>
          <div className="flex bg-white/5 p-1 w-fit border border-white/5">
            {[
              { id: 'search', label: isUA ? 'Пошук з акційних пропозицій' : 'Search Deals', icon: Search },
              { id: 'custom', label: isUA ? 'Індивідуальний підбір' : 'Full Custom', icon: Sparkles }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => { set('mode', m.id as any); setActiveTab(null); }}
                className={`flex items-center gap-2.5 px-6 py-2.5 text-[11px] font-montserrat font-black uppercase tracking-widest transition-all duration-500 relative ${
                  filter.mode === m.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {filter.mode === m.id && (
                  <div className="absolute inset-0 bg-white/10 border border-[#5cc8bd]/30 shadow-[0_0_15px_rgba(92,200,189,0.15)] animate-in fade-in zoom-in duration-500" />
                )}
                <m.icon size={13} className="relative z-10" />
                <span className="relative z-10">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          
          {/* Country Field */}
          <div className="relative">
            <FieldZone 
              label={isUA ? 'КРАЇНА' : 'COUNTRY'} 
              icon={Globe} 
              value={filter.country} 
              placeholder={isUA ? 'Куди прямуємо?' : 'Destination?'}
              onClick={() => setActiveTab(activeTab === 'country' ? null : 'country')}
              active={activeTab === 'country'}
              canSearch={true}
              searchValue={searchCountry}
              onSearchChange={setSearchCountry}
            />
            {activeTab === 'country' && (
              <div className="absolute top-full right-0 z-[100] mt-2 w-[280px] sm:w-[320px] origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-[#0b1a15] border border-[#5cc8bd]/20  shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="p-2 border-b border-[#5cc8bd]/10 bg-[#081210]">
                    <button 
                      onClick={() => { set('country', ''); set('city', ''); setActiveTab(null); setSearchCountry(''); }}
                      className="w-full text-left px-4 py-2 text-[10px] text-[#5cc8bd] font-black uppercase tracking-widest hover:bg-white/5  transition-colors"
                    >
                      {isUA ? 'Всі країни' : 'All countries'}
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                    {filteredCountries.length === 0 ? (
                      <div className="px-6 py-8 text-center text-xs text-white/20 italic">{isUA ? 'Нічого не знайдено' : 'Nothing found'}</div>
                    ) : filteredCountries.map(c => (
                      <button
                        key={c.code}
                        onClick={() => { 
                          updateFilter({ country: isUA ? c.name : c.name_en, city: '' });
                          setActiveTab('city'); 
                          setSearchCountry(''); 
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 hover:bg-[#5cc8bd]/10 hover:text-[#5cc8bd] transition-all group text-left"
                      >
                        <span className="text-xl group-hover:scale-125 transition-transform duration-300">{c.flag}</span>
                        <span className="flex-1">{isUA ? c.name : c.name_en}</span>
                        <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* City / Region Field */}
          <div className="relative">
            <FieldZone 
              label={isUA ? 'МІСТО / РЕГІОН' : 'CITY / REGION'} 
              icon={MapPin} 
              value={filter.city} 
              placeholder={isUA ? 'Всі регіони' : 'All regions'}
              onClick={() => setActiveTab(activeTab === 'city' ? null : 'city')}
              active={activeTab === 'city'}
              canSearch={true}
              searchValue={searchCity}
              onSearchChange={setSearchCity}
            />
            {activeTab === 'city' && (
              <div className="absolute top-full lg:left-0 right-0 lg:right-auto z-[100] mt-2 w-[280px] sm:w-[320px] origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-[#0b1a15] border border-[#5cc8bd]/20  shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="p-2 border-b border-[#5cc8bd]/10 bg-[#081210]">
                    <button 
                      onClick={() => { set('city', ''); setActiveTab(null); setSearchCity(''); }}
                      className="w-full text-left px-4 py-2 text-[10px] text-[#5cc8bd] font-black uppercase tracking-widest hover:bg-white/5  transition-colors"
                    >
                      {isUA ? 'Всі регіони' : 'All regions'}
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                    {filteredCities.length === 0 ? (
                      <div className="px-6 py-8 text-center text-xs text-white/20 italic">{isUA ? 'Нічого не знайдено' : 'Nothing found'}</div>
                    ) : filteredCities.map((item: { name: string; countryName: string; flag: string }, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => { set('country', item.countryName); set('city', item.name); setActiveTab(null); setSearchCity(''); }}
                        className="w-full flex flex-col items-start px-4 py-3 hover:bg-[#5cc8bd]/10 transition-all group text-left"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium text-white/70 group-hover:text-[#5cc8bd]">{item.name}</span>
                          <span className="text-lg opacity-40 group-hover:opacity-100 transition-all">{item.flag}</span>
                        </div>
                        <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{item.countryName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="relative">
            <FieldZone 
              label={isUA ? 'ВІДПРАВЛЕННЯ' : 'DEPARTURE'} 
              icon={CalendarDays} 
              value={filter.dateFrom ? `${format(parseISO(filter.dateFrom), 'dd.MM')} — ${filter.dateTo ? format(parseISO(filter.dateTo), 'dd.MM') : '...'}` : ''} 
              placeholder={isUA ? 'Дати' : 'Dates'}
              onClick={() => setActiveTab(activeTab === 'dates' ? null : 'dates')}
              active={activeTab === 'dates'}
            />
            {activeTab === 'dates' && (
              <div className="absolute top-full right-0 z-[100] mt-2 w-[320px] sm:w-[600px] origin-top animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-[#0b1a15] border border-[#5cc8bd]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col sm:flex-row min-h-[460px]">
                  {/* Month Sidebar */}
                  <div className="w-full sm:w-44 bg-[#081210] border-b sm:border-b-0 sm:border-r border-[#5cc8bd]/10 flex flex-col">
                    {/* Year selector */}
                    <div className="flex border-b border-[#5cc8bd]/10 px-2 py-2 gap-1">
                      {availableYears.map(y => (
                        <button
                          key={y}
                          onClick={() => {
                            setCalendarYear(y);
                            setCalendarMonth(new Date(y, calendarMonth.getMonth(), 1));
                          }}
                          className={`flex-1 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all ${
                            calendarYear === y
                              ? 'bg-[#5cc8bd] text-black'
                              : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                    {/* Month list */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
                      {monthsList.map((m, idx) => {
                        const isActive = m.getMonth() === calendarMonth.getMonth() && m.getFullYear() === calendarMonth.getFullYear();
                        return (
                          <button 
                            key={idx}
                            onClick={() => setCalendarMonth(m)}
                            className={`w-full text-left px-5 py-2.5 transition-all flex items-center justify-between ${
                              isActive 
                                ? 'bg-[#5cc8bd] text-black font-black' 
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span className="text-[11px] uppercase font-bold tracking-wider">
                              {format(m, 'LLLL', { locale: isUA ? uk : enUS })}
                            </span>
                            {isActive && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <DayPicker 
                        mode="range"
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        selected={{
                          from: filter.dateFrom ? parseISO(filter.dateFrom) : undefined,
                          to: filter.dateTo ? parseISO(filter.dateTo) : undefined
                        }}
                        onSelect={(range: DateRange | undefined) => {
                          onChange({
                            ...filter,
                            dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
                            dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
                          });
                        }}
                        locale={isUA ? uk : enUS}
                        className="calendar-premium-v2"
                        showOutsideDays={false}
                      />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-[#5cc8bd]/10 flex items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{isUA ? 'ВИЛІТ' : 'DEPARTURE'}</span>
                          <span className="text-sm font-bold text-[#5cc8bd]">
                            {filter.dateFrom ? format(parseISO(filter.dateFrom), 'dd MMM') : '—'}
                          </span>
                        </div>
                        <div className="text-white/20 flex items-center">→</div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{isUA ? 'ПОВЕРНЕННЯ' : 'RETURN'}</span>
                          <span className="text-sm font-bold text-[#5cc8bd]">
                            {filter.dateTo ? format(parseISO(filter.dateTo), 'dd MMM') : '—'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab(null)}
                        className="bg-[#5cc8bd] hover:bg-[#4eb1a6] text-black font-black text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 shadow-lg shadow-[#5cc8bd]/20 transition-all active:scale-95"
                      >
                        {isUA ? 'Застосувати' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nights */}
          <div className="relative">
            <FieldZone 
              label={isUA ? 'НОЧЕЙ' : 'NIGHTS'} 
              icon={Moon} 
              value={filter.nights ? `${filter.nights}` : ''} 
              placeholder={isUA ? '7 - 14' : '7 - 14'}
              onClick={() => setActiveTab(activeTab === 'nights' ? null : 'nights')}
              active={activeTab === 'nights'}
            />
            {activeTab === 'nights' && (
              <div className="absolute top-full left-0 z-[100] mt-2 w-[280px] sm:w-[340px] origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-[#0b1a15] border border-[#5cc8bd]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-8 flex flex-col items-center gap-10">
                  <div className="flex items-center gap-10">
                     <button onClick={(e) => { e.stopPropagation(); set('nights', Math.max(1, Number(filter.nights || 7) - 1)); }} className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-all group scale-100 active:scale-90">
                        <Minus size={20} />
                     </button>
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-5xl font-montserrat font-black text-white leading-none">{filter.nights || 7}</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{isUA ? 'ночей' : 'nights'}</span>
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); set('nights', Math.min(30, Number(filter.nights || 7) + 1)); }} className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-all group scale-100 active:scale-90">
                        <Plus size={20} />
                     </button>
                  </div>
                  <button onClick={() => setActiveTab(null)} className="w-full py-4 bg-[#5cc8bd] text-black text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-[#5cc8bd]/20 hover:bg-[#4eb1a6] transition-all active:scale-95">{isUA ? 'Застосувати' : 'Apply'}</button>
                </div>
              </div>
            )}
          </div>

          {/* Guests */}
          <div className="relative">
            <FieldZone 
              label={isUA ? 'ГОСТІ' : 'GUESTS'} 
              icon={Users} 
              value={guestSummary} 
              placeholder={isUA ? 'Склад родини' : 'Family'}
              onClick={() => setActiveTab(activeTab === 'guests' ? null : 'guests')}
              active={activeTab === 'guests'}
            />
            {activeTab === 'guests' && (
              <div className="absolute top-full right-0 z-[100] mt-2 w-[340px] sm:w-[420px] origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-[#0b1a15] border border-[#5cc8bd]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                       <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{isUA ? 'ДОРОСЛІ' : 'ADULTS'}</h4>
                       <p className="text-[10px] text-white/30 italic">16+ years</p>
                     </div>
                     <div className="flex items-center gap-5">
                        <button onClick={() => set('adults', Math.max(1, filter.adults - 1))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Minus size={14}/></button>
                        <span className="w-6 text-center text-sm font-black text-white">{filter.adults}</span>
                        <button onClick={() => set('adults', Math.min(9, filter.adults + 1))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Plus size={14}/></button>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <div>
                       <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{isUA ? 'ДІТИ' : 'CHILDREN'}</h4>
                       <p className="text-[10px] text-white/30 italic">0 - 15 years</p>
                     </div>
                     <div className="flex items-center gap-5">
                        <button onClick={() => set('children', Math.max(0, filter.children - 1))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Minus size={14}/></button>
                        <span className="w-6 text-center text-sm font-bold text-white">{filter.children}</span>
                        <button onClick={() => set('children', Math.min(6, filter.children + 1))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Plus size={14}/></button>
                     </div>
                  </div>
                  {filter.children > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <p className="text-[9px] text-white/40 uppercase font-black text-center tracking-widest">{isUA ? 'Вкажіть вік кожної дитини' : 'Specify each child age'}</p>
                      <div className="grid grid-cols-3 gap-2">
                         {Array.from({ length: filter.children }).map((_, i) => (
                           <div key={i} className="bg-white/5 px-3 py-2.5 border border-white/5 hover:border-[#5cc8bd]/30 group transition-all relative">
                             <label className="text-[8px] text-white/30 uppercase font-bold block mb-1">{isUA ? `Дитина ${i + 1}` : `Kid ${i + 1}`}</label>
                             <div className="relative">
                               <select 
                                 value={filter.childAges[i] || 0}
                                 onChange={(e) => {
                                   const newAges = [...filter.childAges];
                                   newAges[i] = parseInt(e.target.value);
                                   set('childAges', newAges);
                                 }}
                                 className="w-full bg-transparent text-white text-xs font-bold outline-none cursor-pointer appearance-none relative z-10 pr-5"
                               >
                                 {[...Array(16)].map((_, age) => (
                                   <option key={age} value={age} className="bg-zinc-900 text-white">{age} {isUA ? 'р.' : 'y.'}</option>
                                 ))}
                               </select>
                               <ChevronDown size={11} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#5cc8bd] pointer-events-none transition-colors" />
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => setActiveTab(null)} className="w-full py-4 bg-[#5cc8bd] text-black text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-[#5cc8bd]/10 hover:bg-[#4eb1a6] transition-all active:scale-95">{isUA ? 'Застосувати' : 'Apply'}</button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Lead Form - Luxury Request */}
        <div className="pt-4 border-t border-white/10 relative overflow-hidden">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 animate-in fade-in slide-in-from-bottom duration-1000">
               <div className="w-16 h-16 bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] shadow-[0_0_50px_rgba(92,200,189,0.2)] mb-4">
                  <CheckCircle2 size={40} className="animate-in zoom-in spin-in-12 duration-1000" />
               </div>
               <div className="text-center">
                  <h3 className="text-white font-montserrat font-black uppercase tracking-[0.3em] text-xl mb-2">
                    {isUA ? 'ВАШ ЗАПИТ ПРИЙНЯТИЙ' : 'REQUEST ACCEPTED'}
                  </h3>
                  <p className="text-white/40 text-sm font-medium">
                    {isUA ? 'Персональний менеджер звʼяжеться з вами найближчим часом' : 'A personal manager will contact you shortly'}
                  </p>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
                <input 
                  type="text" 
                  name="name"
                  autoComplete="name"
                  placeholder={isUA ? "ВАШЕ ІМ'Я" : "YOUR NAME"}
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="bg-white/[0.03] border border-white/10 px-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/40 font-bold tracking-wide"
                />
                <input 
                  type="tel" 
                  name="tel"
                  autoComplete="tel"
                  placeholder="+380 XX XXX XX XX"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="bg-white/[0.03] border border-white/10 px-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/40 font-bold tracking-wide"
                />
                <input 
                  type="email" 
                  name="email"
                  autoComplete="email"
                  placeholder="EMAIL"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="bg-white/[0.03] border border-white/10 px-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/40 font-bold tracking-wide"
                />
                
                <button 
                  type="submit"
                  disabled={isSubmitting || (!form.phone && !form.email)}
                  className="group bg-white hover:bg-[#5cc8bd] text-black px-8 py-5 transition-all duration-700 flex items-center justify-center gap-4 relative overflow-hidden active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="text-[13px] font-montserrat font-black uppercase tracking-[0.3em] relative z-10">
                    {isSubmitting ? (isUA ? '...' : '...') : (isUA ? 'РОЗРАХУВАТИ' : 'CALCULATE')}
                  </span>
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin relative z-10" />
                  ) : (
                    <div className="relative w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                      <Send size={18} className="absolute inset-0" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5cc8bd;
        }
        
        /* Premium Calendar Styles */
        .calendar-premium {
          --rdp-accent-color: #5cc8bd;
          --rdp-accent-color-dark: #4eb1a6;
          --rdp-background-color: transparent;
          --rdp-outline: 2px solid var(--rdp-accent-color);
          --rdp-outline-selected: 2px solid var(--rdp-accent-color);
          --rdp-selected-color: #000;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          margin: 0;
        }
        .calendar-premium .rdp-day {
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 500;
        }
        .calendar-premium .rdp-day:hover:not(.rdp-day_selected) {
          background: rgba(92, 200, 189, 0.1) !important;
          color: #5cc8bd;
        }
        .calendar-premium .rdp-day_selected {
          background: #5cc8bd !important;
          color: #000 !important;
          font-weight: 800;
        }
        .calendar-premium .rdp-day_range_middle {
          background: rgba(92, 200, 189, 0.15) !important;
          color: #fff !important;
        }
        .calendar-premium .rdp-month_caption {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
          color: #5cc8bd;
          margin-bottom: 1rem;
        }
        .calendar-premium .rdp-weekday {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
        }
        .calendar-premium .rdp-nav_button {
          color: rgba(255, 255, 255, 0.4);
        }
        .calendar-premium .rdp-nav_button:hover {
          color: #5cc8bd;
          background: rgba(255, 255, 255, 0.05);
        }

        /* V2 Split Calendar — Deep Forest Green */
        .calendar-premium-v2 {
          --rdp-accent-color: #5cc8bd;
          --rdp-selected-color: #000;
          color: #e0f7f5;
          font-family: 'Montserrat', sans-serif;
          width: 100%;
        }
        .calendar-premium-v2 table {
          width: 100%;
          border-collapse: collapse;
        }
        .calendar-premium-v2 .rdp-day {
          height: 40px;
          width: 40px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          transition: all 0.15s;
          padding: 0;
          text-align: center;
          vertical-align: middle;
        }
        .calendar-premium-v2 .rdp-day_button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          cursor: pointer;
          background: none;
          border: none;
          color: inherit;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 0;
          transition: all 0.15s;
        }
        .calendar-premium-v2 .rdp-day_button:hover {
          background-color: rgba(92, 200, 189, 0.2);
          color: #5cc8bd;
        }
        .calendar-premium-v2 .rdp-day_today .rdp-day_button {
          color: #5cc8bd;
          font-weight: 800;
        }
        .calendar-premium-v2 .rdp-month_caption {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #5cc8bd;
          padding: 6px 0 12px;
          text-align: center;
          font-size: 13px;
        }

        /* Essential v9 Range Styling */
        .calendar-premium-v2 .rdp-selected {
          background: none !important;
        }

        .calendar-premium-v2 .rdp-range_start .rdp-day_button {
          background-color: #5cc8bd !important;
          color: #000 !important;
          font-weight: 900 !important;
          width: 100% !important;
        }

        .calendar-premium-v2 .rdp-range_end .rdp-day_button {
          background-color: #5cc8bd !important;
          color: #000 !important;
          font-weight: 900 !important;
          width: 100% !important;
        }

        .calendar-premium-v2 .rdp-range_middle {
          background-color: rgba(92, 200, 189, 0.15) !important;
        }

        .calendar-premium-v2 .rdp-range_middle .rdp-day_button {
          color: #c8f0ec !important;
          width: 100% !important;
          border-radius: 0 !important;
        }

        .calendar-premium-v2 .rdp-range_start.rdp-range_end .rdp-day_button {
          border-radius: 8px !important;
        }

        /* Outside days hidden */
        .calendar-premium-v2 .rdp-day_outside {
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .calendar-premium-v2 .rdp-nav { display: none; }
        .calendar-premium-v2 .rdp-weekday {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          color: rgba(92, 200, 189, 0.45);
          padding-bottom: 8px;
          letter-spacing: 0.08em;
          text-align: center;
        }
        .calendar-premium-v2 th,
        .calendar-premium-v2 td {
          text-align: center;
          padding: 2px;
        }
      `}</style>
    </section>
  );
};

export default OfferSearchPanel;
