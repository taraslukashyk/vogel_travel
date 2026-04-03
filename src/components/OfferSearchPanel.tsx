import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Sparkles, MapPin, CalendarDays, Moon, Users, Send, CheckCircle2, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { COUNTRIES, DEPARTURE_CITIES, DEPARTURE_CITIES_EN } from '../lib/data/countries';
import { sendTelegramNotification } from '../lib/notifications';
import { escapeHTML } from '../lib/utils/html';
import { useLanguage } from '../hooks/useLanguage';

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

/* ── Helpers ── */
const UA_MONTHS = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
const UA_DAYS = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','НД'];

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(s: string): string {
  const d = parseDate(s);
  if (!d) return '...';
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
}

function toIso(y: number, m: number, day: number): string {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function getDaysInMonth(y: number, m: number): number {
  return new Date(y, m+1, 0).getDate();
}
function getFirstWeekday(y: number, m: number): number {
  // 0=Mon..6=Sun
  const d = new Date(y, m, 1).getDay();
  return (d + 6) % 7;
}

/* ── Calendar Popup ── */
function CalendarPopup({ dateFrom, dateTo, onChange, onClose }: {
  dateFrom: string; dateTo: string;
  onChange: (from: string, to: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selecting, setSelecting] = useState<'from' | 'to'>('from');
  const [hoverDate, setHoverDate] = useState('');

  const months: { y: number; m: number }[] = [];
  for (let i = 0; i < 18; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i);
    months.push({ y: d.getFullYear(), m: d.getMonth() });
  }

  const days = getDaysInMonth(viewYear, viewMonth);
  const firstWd = getFirstWeekday(viewYear, viewMonth);

  const inRange = (iso: string) => {
    const f = dateFrom, t = dateTo || hoverDate;
    if (!f) return false;
    return iso > f && iso < t;
  };

  const handleDay = (iso: string) => {
    if (selecting === 'from') {
      onChange(iso, '');
      setSelecting('to');
    } else {
      if (iso < dateFrom) {
        onChange(iso, dateFrom);
      } else {
        onChange(dateFrom, iso);
      }
      setSelecting('from');
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 z-50 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-2xl flex w-[520px] max-w-[95vw] overflow-hidden">
      {/* Month list */}
      <div className="w-32 border-r border-white/10 overflow-y-auto max-h-72 py-2 shrink-0">
        {months.map(({ y, m }) => {
          const active = y === viewYear && m === viewMonth;
          return (
            <button
              key={`${y}-${m}`}
              onClick={() => { setViewYear(y); setViewMonth(m); }}
              className={`w-full text-left px-4 py-2 text-xs font-montserrat uppercase tracking-wider transition-colors ${active ? 'bg-[#5cc8bd]/20 text-[#5cc8bd] font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {y !== today.getFullYear() && m === 0 && <span className="block text-white/30 text-[9px] mb-0.5">{y}</span>}
              {UA_MONTHS[m]}
            </button>
          );
        })}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { const d = new Date(viewYear, viewMonth - 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }} className="text-white/40 hover:text-white p-1"><ChevronLeft size={14} /></button>
          <span className="font-montserrat font-bold text-white text-xs uppercase tracking-widest">{UA_MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={() => { const d = new Date(viewYear, viewMonth + 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }} className="text-white/40 hover:text-white p-1"><ChevronRight size={14} /></button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {UA_DAYS.map(d => (
            <div key={d} className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstWd }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const iso = toIso(viewYear, viewMonth, day);
            const isFrom = iso === dateFrom;
            const isTo = iso === dateTo;
            const isIn = inRange(iso);
            const isPast = iso < toIso(today.getFullYear(), today.getMonth(), today.getDate());
            return (
              <button
                key={day}
                disabled={isPast}
                onMouseEnter={() => setHoverDate(iso)}
                onMouseLeave={() => setHoverDate('')}
                onClick={() => handleDay(iso)}
                className={`w-full aspect-square text-xs font-inter font-semibold rounded-[2px] transition-all
                  ${isPast ? 'text-white/15 cursor-not-allowed' : 'cursor-pointer'}
                  ${isFrom || isTo ? 'bg-[#5cc8bd] text-white' : ''}
                  ${isIn ? 'bg-[#5cc8bd]/20 text-white' : ''}
                  ${!isFrom && !isTo && !isIn && !isPast ? 'text-white/70 hover:bg-white/10 hover:text-white' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {(dateFrom || dateTo) && (
          <button
            onClick={() => { onChange('', ''); setSelecting('from'); }}
            className="mt-3 w-full text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-bold"
          >
            Очистити дати
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Guests Popup ── */
function GuestsPopup({ adults, children, childAges, onChange, onClose }: {
  adults: number; children: number; childAges: number[];
  onChange: (a: number, c: number, ages: number[]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const setAdults = (n: number) => onChange(Math.max(1, n), children, childAges);
  const setChildren = (n: number) => {
    const c = Math.max(0, n);
    const ages = Array.from({ length: c }, (_, i) => childAges[i] ?? 7);
    onChange(adults, c, ages);
  };
  const setAge = (i: number, age: number) => {
    const ages = [...childAges];
    ages[i] = Math.min(15, Math.max(0, age));
    onChange(adults, children, ages);
  };

  return (
    <div ref={ref} className="absolute top-full left-0 z-50 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-2xl p-5 w-64">
      {/* Adults */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-montserrat font-black uppercase tracking-widest text-white">Дорослі</p>
          <p className="text-[10px] text-white/40">Вік 16+</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAdults(adults - 1)} className="w-7 h-7 rounded-full border border-white/20 text-white/60 hover:border-[#5cc8bd] hover:text-[#5cc8bd] flex items-center justify-center transition-colors"><Minus size={12} /></button>
          <span className="text-white font-bold w-5 text-center font-montserrat">{adults}</span>
          <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 rounded-full border border-white/20 text-white/60 hover:border-[#5cc8bd] hover:text-[#5cc8bd] flex items-center justify-center transition-colors"><Plus size={12} /></button>
        </div>
      </div>

      {/* Children */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-montserrat font-black uppercase tracking-widest text-white">Діти</p>
          <p className="text-[10px] text-white/40">Вік 0–15</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setChildren(children - 1)} className="w-7 h-7 rounded-full border border-white/20 text-white/60 hover:border-[#5cc8bd] hover:text-[#5cc8bd] flex items-center justify-center transition-colors"><Minus size={12} /></button>
          <span className="text-white font-bold w-5 text-center font-montserrat">{children}</span>
          <button onClick={() => setChildren(children + 1)} className="w-7 h-7 rounded-full border border-white/20 text-white/60 hover:border-[#5cc8bd] hover:text-[#5cc8bd] flex items-center justify-center transition-colors"><Plus size={12} /></button>
        </div>
      </div>

      {/* Child ages */}
      {childAges.map((age, i) => (
        <div key={i} className="flex items-center justify-between mt-2 border-t border-white/5 pt-2">
          <span className="text-[11px] text-white/50 font-inter">вік дитини:</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setAge(i, age - 1)} className="w-6 h-6 rounded-full border border-white/20 text-white/50 hover:text-[#5cc8bd] flex items-center justify-center transition-colors"><Minus size={10} /></button>
            <span className="text-white font-bold w-4 text-center text-sm">{age}</span>
            <button onClick={() => setAge(i, age + 1)} className="w-6 h-6 rounded-full border border-white/20 text-white/50 hover:text-[#5cc8bd] flex items-center justify-center transition-colors"><Plus size={10} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Field Cell ── */
const FieldCell = ({ label, icon, children, onClick, className = '' }: {
  label: string; icon?: React.ReactNode; children: React.ReactNode;
  onClick?: () => void; className?: string;
}) => (
  <div
    onClick={onClick}
    className={`bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 flex flex-col justify-center focus-within:border-white/40 hover:border-white/20 transition-colors h-[64px] relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    <label className="text-[10px] uppercase text-white/60 font-montserrat font-black tracking-[0.1em] mb-1 flex items-center gap-1.5 pointer-events-none">
      {icon && <span className="opacity-60">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

/* ── Main Component ── */
const OfferSearchPanel = ({ filter, onChange }: OfferSearchPanelProps) => {
  const { currentLang } = useLanguage();
  const isUA = currentLang === 'ua';

  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    if (!showCalendar) return;
    const h = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCalendar(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showCalendar]);

  const set = useCallback(<K extends keyof FilterState>(key: K, val: FilterState[K]) => {
    onChange({ ...filter, [key]: val });
  }, [filter, onChange]);

  const selectedCountry = COUNTRIES.find(c => isUA ? c.name === filter.country : c.name_en === filter.country);
  const departureCities = isUA ? DEPARTURE_CITIES : DEPARTURE_CITIES_EN;
  const guestSummary = filter.children > 0
    ? `${filter.adults} + ${filter.children} ${isUA ? 'туристи' : 'tourists'}`
    : `${filter.adults} ${isUA ? (filter.adults === 1 ? 'турист' : 'туристи') : (filter.adults === 1 ? 'tourist' : 'tourists')}`;
  const dateSummary = filter.dateFrom
    ? `${formatDisplay(filter.dateFrom)} — ${filter.dateTo ? formatDisplay(filter.dateTo) : '...'}`
    : '...';

  const phoneValid = !phone || /^[+]?[\d\s\-().]{10,20}$/.test(phone);
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = (!!phone || !!email) && phoneValid && emailValid && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    const modeLabel = filter.mode === 'search'
      ? (isUA ? 'Пошук із акційних турів' : 'Search from deals')
      : (isUA ? 'Індивідуальний підбір' : 'Custom selection');

    const countryEntry = COUNTRIES.find(c => c.name === filter.country || c.name_en === filter.country);
    const flagStr = countryEntry ? `${countryEntry.flag} ` : '';

    const lines = [
      `🔍 <b>${isUA ? 'Запит на підбір туру' : 'Tour selection request'}</b>`,
      '',
      `<b>Режим:</b> ${escapeHTML(modeLabel)}`,
      filter.departureCity ? `<b>${isUA ? 'Вирушаємо з' : 'Departing from'}:</b> ${escapeHTML(filter.departureCity)}` : null,
      filter.country ? `<b>${isUA ? 'Країна' : 'Country'}:</b> ${flagStr}${escapeHTML(filter.country)}` : null,
      filter.city ? `<b>${isUA ? 'Місто' : 'City'}:</b> ${escapeHTML(filter.city)}` : null,
      (filter.dateFrom || filter.dateTo) ? `<b>${isUA ? 'Дати' : 'Dates'}:</b> ${escapeHTML(dateSummary)}` : null,
      filter.nights !== '' ? `<b>${isUA ? 'Ночей' : 'Nights'}:</b> ${filter.nights}` : null,
      `<b>${isUA ? 'Гості' : 'Guests'}:</b> ${isUA ? 'Дорослі' : 'Adults'}: ${filter.adults}${filter.children > 0 ? ` | ${isUA ? 'Діти' : 'Children'}: ${filter.children} (${isUA ? 'вік' : 'age'}: ${filter.childAges.join(', ')})` : ''}`,
      '',
      `<b>👤 ${isUA ? 'Клієнт' : 'Client'}:</b>`,
      name ? `${isUA ? "Ім'я" : 'Name'}: ${escapeHTML(name)}` : null,
      phone ? `${isUA ? 'Телефон' : 'Phone'}: ${escapeHTML(phone)}` : null,
      email ? `Email: ${escapeHTML(email)}` : null,
    ].filter(Boolean).join('\n');

    const result = await sendTelegramNotification(lines);
    if (result.success) {
      setIsSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setTimeout(() => setIsSuccess(false), 4000);
    } else {
      alert(isUA ? 'Помилка надсилання: ' + result.error : 'Send error: ' + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="relative z-10 bg-black/90 backdrop-blur-3xl border-y border-white/10 py-8 md:py-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => set('mode', 'search')}
            className={`flex items-center gap-2 px-4 py-2 text-[11px] font-montserrat font-black uppercase tracking-widest rounded-[2px] transition-all duration-300 ${filter.mode === 'search' ? 'bg-[#5cc8bd] text-white' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
          >
            <Search size={12} />
            {isUA ? 'Пошук із акційних турів' : 'Search from deals'}
          </button>
          <button
            onClick={() => set('mode', 'custom')}
            className={`flex items-center gap-2 px-4 py-2 text-[11px] font-montserrat font-black uppercase tracking-widest rounded-[2px] transition-all duration-300 ${filter.mode === 'custom' ? 'bg-[#5cc8bd] text-white' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
          >
            <Sparkles size={12} />
            {isUA ? 'Індивідуальний підбір' : 'Custom selection'}
          </button>
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">

          {/* Departure city */}
          <FieldCell label={isUA ? 'Вирушаємо з' : 'Departing from'} icon={<MapPin size={10} />}>
            <input
              list="departure-cities"
              value={filter.departureCity}
              onChange={e => set('departureCity', e.target.value)}
              placeholder={isUA ? 'Місто вильоту' : 'Departure city'}
              className="w-full outline-none text-white font-inter font-semibold text-sm bg-transparent placeholder-white/25 border-none p-0"
            />
            <datalist id="departure-cities">
              {departureCities.map(c => <option key={c} value={c} />)}
            </datalist>
          </FieldCell>

          {/* Country */}
          <FieldCell label={isUA ? 'Країна прибуття' : 'Destination country'} icon={<MapPin size={10} />}>
            <select
              value={isUA ? filter.country : (COUNTRIES.find(c => c.name === filter.country)?.name_en || filter.country)}
              onChange={e => {
                const val = e.target.value;
                const entry = COUNTRIES.find(c => isUA ? c.name === val : c.name_en === val);
                onChange({ ...filter, country: entry ? entry.name : val, city: '' });
              }}
              className="w-full outline-none text-white font-inter font-semibold text-sm bg-transparent border-none p-0 appearance-none"
            >
              <option value="">{isUA ? 'Будь-яка' : 'Any'}</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={isUA ? c.name : c.name_en} style={{ background: '#111' }}>
                  {c.flag} {isUA ? c.name : c.name_en}
                </option>
              ))}
            </select>
          </FieldCell>

          {/* City */}
          <FieldCell label={isUA ? 'Місто / Регіон' : 'City / Region'} icon={<MapPin size={10} />}>
            <input
              list="dest-cities"
              value={filter.city}
              onChange={e => set('city', e.target.value)}
              placeholder={isUA ? 'Всі регіони' : 'All regions'}
              className="w-full outline-none text-white font-inter font-semibold text-sm bg-transparent placeholder-white/25 border-none p-0"
            />
            <datalist id="dest-cities">
              {(isUA ? selectedCountry?.cities : selectedCountry?.cities_en)?.map(c => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </FieldCell>

          {/* Date range */}
          <div className="relative" ref={calRef}>
            <FieldCell
              label={isUA ? 'Відправлення' : 'Departure dates'}
              icon={<CalendarDays size={10} />}
              onClick={() => setShowCalendar(v => !v)}
            >
              <span className={`font-inter font-semibold text-sm ${filter.dateFrom ? 'text-white' : 'text-white/30'}`}>
                {dateSummary}
              </span>
            </FieldCell>
            {showCalendar && (
              <CalendarPopup
                dateFrom={filter.dateFrom}
                dateTo={filter.dateTo}
                onChange={(from, to) => onChange({ ...filter, dateFrom: from, dateTo: to })}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>

          {/* Nights */}
          <FieldCell label={isUA ? 'Ночей' : 'Nights'} icon={<Moon size={10} />}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => set('nights', typeof filter.nights === 'number' ? Math.max(1, filter.nights - 1) : 7)}
                className="text-white/40 hover:text-[#5cc8bd] transition-colors"
              >
                <Minus size={12} />
              </button>
              <input
                type="number"
                min={1}
                max={30}
                value={filter.nights}
                onChange={e => set('nights', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="7"
                className="w-8 outline-none text-white font-inter font-bold text-sm bg-transparent border-none p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => set('nights', typeof filter.nights === 'number' ? Math.min(30, filter.nights + 1) : 1)}
                className="text-white/40 hover:text-[#5cc8bd] transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </FieldCell>

          {/* Guests */}
          <div className="relative" ref={guestsRef}>
            <FieldCell
              label={isUA ? 'Гості' : 'Guests'}
              icon={<Users size={10} />}
              onClick={() => setShowGuests(v => !v)}
            >
              <span className="font-inter font-semibold text-sm text-white">
                {guestSummary}
              </span>
            </FieldCell>
            {showGuests && (
              <GuestsPopup
                adults={filter.adults}
                children={filter.children}
                childAges={filter.childAges}
                onChange={(a, c, ages) => onChange({ ...filter, adults: a, children: c, childAges: ages })}
                onClose={() => setShowGuests(false)}
              />
            )}
          </div>
        </div>

        {/* Contact + Submit row */}
        {isSuccess ? (
          <div className="flex items-center gap-3 py-3 animate-in fade-in duration-500">
            <CheckCircle2 className="text-[#5cc8bd] w-6 h-6 shrink-0" />
            <p className="text-white/80 font-inter text-sm">
              {isUA ? 'Дякуємо! Менеджер зв\'яжеться з вами найближчим часом.' : 'Thank you! A manager will contact you soon.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
            <p className="text-[10px] uppercase tracking-widest text-[#5cc8bd] font-black border-l-2 border-[#5cc8bd] pl-3 shrink-0 self-center">
              {isUA ? "Заповніть для отримання розрахунку" : "Fill in to get a quote"}
            </p>

            {/* Name */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 flex flex-col justify-center focus-within:border-white/40 transition-colors h-[56px]">
              <label className="text-[9px] uppercase text-white/40 font-montserrat font-black tracking-[0.1em] mb-0.5">{isUA ? "Ім'я" : 'Name'}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="outline-none text-white font-inter font-semibold text-sm bg-transparent border-none p-0 placeholder-white/25"
              />
            </div>

            {/* Phone */}
            <div className={`flex-1 bg-white/5 border rounded-[2px] p-3 px-5 flex flex-col justify-center transition-colors h-[56px] ${phone && !phoneValid ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/40'}`}>
              <label className="text-[9px] uppercase text-white/40 font-montserrat font-black tracking-[0.1em] mb-0.5">{isUA ? 'Телефон' : 'Phone'}</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+380 XX XXX XX XX"
                className="outline-none text-white font-inter font-semibold text-sm bg-transparent border-none p-0 placeholder-white/25"
              />
            </div>

            {/* Email */}
            <div className={`flex-1 bg-white/5 border rounded-[2px] p-3 px-5 flex flex-col justify-center transition-colors h-[56px] ${email && !emailValid ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/40'}`}>
              <label className="text-[9px] uppercase text-white/40 font-montserrat font-black tracking-[0.1em] mb-0.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mail@example.com"
                className="outline-none text-white font-inter font-semibold text-sm bg-transparent border-none p-0 placeholder-white/25"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-black text-xs h-[56px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-8 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {isSubmitting ? (isUA ? 'Надсилаємо...' : 'Sending...') : (isUA ? 'Розрахувати' : 'Get a quote')}
              <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default OfferSearchPanel;
