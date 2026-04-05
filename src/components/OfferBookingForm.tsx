import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  CalendarDays, Moon, Users, 
  Send, CheckCircle2, Minus, Plus, 
  Loader2, ChevronDown, User, Mail, Phone
} from 'lucide-react';
import { sendTelegramNotification, sendTelegramVoice } from '../lib/notifications';
import { escapeHTML } from '../lib/utils/html';
import { useLanguage } from '../hooks/useLanguage';
import { DayPicker, type DateRange } from 'react-day-picker';
import { uk, enUS } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import VoiceRecorder from './VoiceRecorder';

interface OfferBookingFormProps {
  offerName: string;
  offerLocation: string;
  offerSlug: string;
  initialNights?: number;
}

const FieldZone = ({ 
  label, icon: Icon, value, placeholder, onClick, active, subValue 
}: { 
  label: string; icon: any; value: string; placeholder: string; onClick: () => void; active: boolean; subValue?: string;
}) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`relative flex flex-col items-start px-5 py-2 transition-all duration-300 group min-h-[58px] w-full ${
      active ? 'bg-white/15 ring-1 ring-white/30 shadow-[0_0_30px_rgba(255,255,255,0.08)]' : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
    }`}
  >
    <div className="flex items-center gap-2 mb-1.5 pointer-events-none">
      <Icon size={13} className={`${active ? 'text-[#5cc8bd]' : 'text-white/80 group-hover:text-white'} transition-colors`} />
      <span className="text-[10px] font-montserrat font-extrabold tracking-[0.05em] text-white/70 group-hover:text-white/90">
        {label}
      </span>
    </div>
    <div className="flex flex-col items-start overflow-hidden w-full text-left">
      <span className={`text-sm font-montserrat font-bold truncate w-full ${value ? 'text-white' : 'text-white/40'}`}>
        {value || placeholder}
      </span>
      {subValue && !active && <span className="text-[10px] text-[#5cc8bd] font-semibold mt-0.5 truncate w-full">{subValue}</span>}
    </div>
    {active && (
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#5cc8bd] rounded-full shadow-[0_0_12px_rgba(92,200,189,0.8)]" />
    )}
  </button>
);

const OfferBookingForm = ({ offerName, offerLocation, offerSlug, initialNights = 7 }: OfferBookingFormProps) => {
  const { currentLang } = useLanguage();
  const isUA = currentLang === 'ua';

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [booking, setBooking] = useState({
    dateFrom: '',
    dateTo: '',
    nights: initialNights,
    adults: 2,
    children: 0,
    childAges: [] as number[],
  });

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const panelRef = useRef<HTMLDivElement>(null);
  const voiceBlobRef = useRef<Blob | null>(null);

  const availableYears = useMemo(() => {
    const y = new Date().getFullYear();
    return [y, y + 1];
  }, []);

  const monthsList = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push(new Date(calendarYear, i, 1));
    }
    return arr;
  }, [calendarYear]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const guestSummary = useMemo(() => {
    const adultsStr = booking.adults === 1 
      ? (isUA ? '1 дорослий' : '1 adult') 
      : `${booking.adults} ${isUA ? 'дорослих' : 'adults'}`;
    const childrenStr = booking.children > 0 
      ? ` + ${booking.children} ${isUA ? (booking.children === 1 ? 'дит.' : 'дітей') : 'children'}` 
      : '';
    return adultsStr + childrenStr;
  }, [booking.adults, booking.children, isUA]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const kidsAgesStr = booking.children > 0 
      ? ` (вік: ${booking.childAges.slice(0, booking.children).join(', ')})` 
      : '';

    const datesStr = booking.dateFrom 
      ? `${format(parseISO(booking.dateFrom), 'dd.MM.yyyy')}${booking.dateTo ? ` — ${format(parseISO(booking.dateTo), 'dd.MM.yyyy')}` : ''}` 
      : 'Не вказано';

    const lines = [
      `<b>💳 ЗАПИТ НА БРОНЮВАННЯ ТА ІНВОЙС</b>`,
      `<b>Пропозиція:</b> <a href="https://vogel-travel.com/offers/${offerSlug}">${escapeHTML(offerName)}</a>`,
      `<b>Локація:</b> ${escapeHTML(offerLocation)}`,
      '',
      `<b>🗓 Деталі поїздки:</b>`,
      `Дати: ${datesStr}`,
      `Ночей: ${booking.nights}`,
      `Гості: Дорослі: ${booking.adults} | Діти: ${booking.children}${kidsAgesStr}`,
      '',
      `<b>👤 Клієнт:</b>`,
      `Прізвище: ${escapeHTML(form.lastName || '—')}`,
      `Ім'я: ${escapeHTML(form.name || '—')}`,
      form.phone ? `Телефон: ${escapeHTML(form.phone)}` : null,
      form.email ? `Email: ${escapeHTML(form.email)}` : null,
    ].filter(Boolean).join('\n');

    const result = await sendTelegramNotification(lines);
    if (result.success) {
      if (voiceBlobRef.current) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await sendTelegramVoice(
            `🎙 Голосове повідомлення до броні\n👤 ${escapeHTML(form.name || 'Anonymous')}`,
            base64Audio,
            `booking_voice_${Date.now()}.ogg`,
            result.messageId
          );
          voiceBlobRef.current = null;
        };
        reader.readAsDataURL(voiceBlobRef.current);
      }

      setIsSuccess(true);
      setForm({ name: '', lastName: '', email: '', phone: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }
    setIsSubmitting(false);
  };

  return (
    <div ref={panelRef} className="w-full bg-[#0b1a15]/90 backdrop-blur-3xl border border-white/10 p-6 md:p-8 relative overflow-visible shadow-[0_48px_140px_-20px_rgba(0,0,0,0.9)]">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] mb-6 rounded-full border border-[#5cc8bd]/20">
            <CheckCircle2 size={40} className="animate-in zoom-in spin-in-12 duration-1000" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-montserrat font-black uppercase tracking-[0.3em] text-2xl mb-3">
              {isUA ? 'ВАШ ЗАПИТ ПРИЙНЯТИЙ' : 'REQUEST ACCEPTED'}
            </h3>
            <p className="text-white/40 text-sm font-medium max-w-md mx-auto">
              {isUA 
                ? 'Дякуємо! Наш менеджер підготує інвойс та звʼяжеться з вами найближчим часом.' 
                : 'Thank you! Our manager will prepare the invoice and contact you shortly.'}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-[11px] font-black text-[#5cc8bd] uppercase tracking-[0.4em] whitespace-nowrap">
              {isUA ? 'Оформлення замовлення' : 'Order Details'}
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dates Selection */}
            <div className="relative">
              <FieldZone 
                label={isUA ? 'Відправлення' : 'Departure'} 
                icon={CalendarDays} 
                value={booking.dateFrom ? `${format(parseISO(booking.dateFrom), 'dd.MM')}${booking.dateTo ? ` — ${format(parseISO(booking.dateTo), 'dd.MM')}` : ''}` : ''} 
                placeholder={isUA ? 'Оберіть дати' : 'Choose dates'}
                onClick={() => setActiveTab(activeTab === 'dates' ? null : 'dates')}
                active={activeTab === 'dates'}
              />
              {activeTab === 'dates' && (
                <div className="absolute top-full left-0 z-[100] mt-2 w-full md:w-[600px] origin-top animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="bg-[#0b1a15] border border-[#5cc8bd]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col sm:flex-row min-h-[460px]">
                    {/* Month Sidebar */}
                    <div className="w-full sm:w-44 bg-[#081210] border-b sm:border-b-0 sm:border-r border-[#5cc8bd]/10 flex flex-col">
                      <div className="flex border-b border-[#5cc8bd]/10 px-2 py-2 gap-1">
                        {availableYears.map(y => (
                          <button
                            key={y}
                            type="button"
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
                      <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
                        {monthsList.map((m, idx) => {
                          const isActive = m.getMonth() === calendarMonth.getMonth() && m.getFullYear() === calendarMonth.getFullYear();
                          return (
                            <button 
                              key={idx}
                              type="button"
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
                    <div className="flex-1 p-5 flex flex-col justify-between bg-[#0b1a15]">
                      <div
                        onClickCapture={(e) => {
                          const target = e.target as HTMLElement;
                          const btn = target.closest('button');
                          if (btn && btn.type !== 'submit') {
                            btn.setAttribute('type', 'button');
                          }
                        }}
                      >
                        <DayPicker 
                          mode="range"
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          selected={{
                            from: booking.dateFrom ? parseISO(booking.dateFrom) : undefined,
                            to: booking.dateTo ? parseISO(booking.dateTo) : undefined
                          }}
                          onSelect={(range: DateRange | undefined) => {
                            setBooking(prev => ({
                              ...prev,
                              dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
                              dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
                            }));
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
                              {booking.dateFrom ? format(parseISO(booking.dateFrom), 'dd MMM') : '—'}
                            </span>
                          </div>
                          <div className="text-white/20 flex items-center">→</div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{isUA ? 'ПОВЕРНЕННЯ' : 'RETURN'}</span>
                            <span className="text-sm font-bold text-[#5cc8bd]">
                              {booking.dateTo ? format(parseISO(booking.dateTo), 'dd MMM') : '—'}
                            </span>
                          </div>
                        </div>
                        <button 
                          type="button"
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

            {/* Nights Selection */}
            <div className="relative">
              <FieldZone 
                label={isUA ? 'Ночей' : 'Nights'} 
                icon={Moon} 
                value={booking.nights.toString()} 
                placeholder="7"
                onClick={() => setActiveTab(activeTab === 'nights' ? null : 'nights')}
                active={activeTab === 'nights'}
              />
              {activeTab === 'nights' && (
                <div className="absolute top-full left-0 z-[100] mt-2 w-full md:w-[340px] origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-[#0b1a15] border border-[#5cc8bd]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-8 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-10">
                       <button type="button" onClick={() => setBooking(prev => ({...prev, nights: Math.max(1, prev.nights - 1)}))} className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-all active:scale-90">
                          <Minus size={20} />
                       </button>
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-5xl font-montserrat font-black text-white leading-none">{booking.nights}</span>
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{isUA ? 'ночей' : 'nights'}</span>
                       </div>
                       <button type="button" onClick={() => setBooking(prev => ({...prev, nights: Math.min(30, prev.nights + 1)}))} className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-all active:scale-90">
                          <Plus size={20} />
                       </button>
                    </div>
                    <button type="button" onClick={() => setActiveTab(null)} className="w-full py-4 bg-[#5cc8bd] text-black text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-[#5cc8bd]/20 hover:bg-[#4eb1a6] transition-all active:scale-95">
                      {isUA ? 'Застосувати' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Guests Selection */}
            <div className="relative">
              <FieldZone 
                label={isUA ? 'Гості' : 'Guests'} 
                icon={Users} 
                value={guestSummary} 
                placeholder={isUA ? 'Склад родини' : 'Family'}
                onClick={() => setActiveTab(activeTab === 'guests' ? null : 'guests')}
                active={activeTab === 'guests'}
              />
              {activeTab === 'guests' && (
                <div className="absolute top-full right-0 z-[100] mt-2 w-full md:w-[420px] origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-[#0b1a15] border border-[#5cc8bd]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] p-6 space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                         <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{isUA ? 'ДОРОСЛІ' : 'ADULTS'}</h4>
                         <p className="text-[10px] text-white/30 italic">16+ years</p>
                       </div>
                       <div className="flex items-center gap-5">
                          <button type="button" onClick={() => setBooking(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Minus size={14}/></button>
                          <span className="w-6 text-center text-sm font-black text-white">{booking.adults}</span>
                          <button type="button" onClick={() => setBooking(prev => ({...prev, adults: Math.min(9, prev.adults + 1)}))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Plus size={14}/></button>
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                         <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{isUA ? 'ДІТИ' : 'CHILDREN'}</h4>
                         <p className="text-[10px] text-white/30 italic">0 - 15 years</p>
                       </div>
                       <div className="flex items-center gap-5">
                          <button type="button" onClick={() => setBooking(prev => ({...prev, children: Math.max(0, prev.children - 1)}))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Minus size={14}/></button>
                          <span className="w-6 text-center text-sm font-bold text-white">{booking.children}</span>
                          <button type="button" onClick={() => setBooking(prev => ({...prev, children: Math.min(6, prev.children + 1)}))} className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#5cc8bd] text-white/40 hover:text-[#5cc8bd] transition-colors"><Plus size={14}/></button>
                       </div>
                    </div>
                    {booking.children > 0 && (
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <p className="text-[9px] text-white/40 uppercase font-black text-center tracking-widest">{isUA ? 'Вкажіть вік кожної дитини' : 'Specify each child age'}</p>
                        <div className="grid grid-cols-3 gap-2">
                           {Array.from({ length: booking.children }).map((_, i) => (
                             <div key={i} className="bg-white/5 px-3 py-2.5 border border-white/5 hover:border-[#5cc8bd]/30 group transition-all relative">
                               <label className="text-[8px] text-white/30 uppercase font-bold block mb-1">{isUA ? `Дитина ${i + 1}` : `Kid ${i + 1}`}</label>
                               <div className="relative">
                                 <select 
                                   value={booking.childAges[i] || 0}
                                   onChange={(e) => {
                                     const newAges = [...booking.childAges];
                                     newAges[i] = parseInt(e.target.value);
                                     setBooking(prev => ({...prev, childAges: newAges}));
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
                    <button type="button" onClick={() => setActiveTab(null)} className="w-full py-4 bg-[#5cc8bd] text-black text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-[#5cc8bd]/10 hover:bg-[#4eb1a6] transition-all active:scale-95">
                      {isUA ? 'Застосувати' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#5cc8bd] transition-colors" size={16} />
              <input 
                id="first_name"
                name="given-name"
                type="text" 
                placeholder={isUA ? "Ім'я" : "First Name"}
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                autoComplete="given-name"
                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/20 font-montserrat font-bold"
                required
              />
            </div>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#5cc8bd] transition-colors" size={16} />
              <input 
                id="last_name"
                name="family-name"
                type="text" 
                placeholder={isUA ? "Прізвище" : "Last Name"}
                value={form.lastName}
                onChange={e => setForm({...form, lastName: e.target.value})}
                autoComplete="family-name"
                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/20 font-montserrat font-bold"
                required
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#5cc8bd] transition-colors" size={16} />
              <input 
                id="email"
                name="email"
                type="email" 
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/20 font-montserrat font-bold"
                required
              />
            </div>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#5cc8bd] transition-colors" size={16} />
              <input 
                id="phone"
                name="tel"
                type="tel" 
                placeholder="Phone"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                autoComplete="tel"
                className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-5 text-sm text-white focus:bg-white/[0.08] focus:border-[#5cc8bd] outline-none transition-all placeholder:text-white/20 font-montserrat font-bold"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full group bg-white hover:bg-[#5cc8bd] text-black py-4 md:py-6 transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="text-sm md:text-xl font-montserrat font-black uppercase tracking-[0.4em] relative z-10 transition-colors">
              {isSubmitting ? (isUA ? 'НАДСИЛАЄМО...' : 'SENDING...') : (isUA ? 'ОТРИМАТИ ІНВОЙС' : 'GET INVOICE')}
            </span>
            {isSubmitting ? (
              <Loader2 size={24} className="animate-spin relative z-10" />
            ) : (
              <Send size={24} className="relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
            )}
          </button>

          {/* Voice Prompt Below Submit Button */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="text-[10px] md:text-xs text-[#5cc8bd]/40 font-bold tracking-[0.15em] uppercase italic text-center">
              {isUA ? 'Якщо є запитання — записуй голосове повідомлення' : 'Questions? Record a voice message'}
            </span>
            <div className="hidden md:block h-4 w-px bg-white/10" />
            <VoiceRecorder 
              onRecordingComplete={(blob) => { voiceBlobRef.current = blob; }} 
              className="scale-90 md:scale-100 opacity-60 hover:opacity-100 transition-all p-0"
            />
          </div>
        </form>
      )}

      {/* Global styles for calendar and scrollbar */}
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
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5cc8bd;
        }
        
        .calendar-premium-v2 {
          --rdp-accent-color: #5cc8bd;
          --rdp-selected-color: #000;
          color: #e0f7f5;
          font-family: 'Montserrat', sans-serif;
          width: 100%;
        }
        .calendar-premium-v2 .rdp-day_button {
          height: 36px;
          width: 36px;
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
          letter-spacing: 0.1em;
          text-align: center;
        }
        .calendar-premium-v2 th,
        .calendar-premium-v2 td {
          text-align: center;
          padding: 2px;
        }
      `}</style>
    </div>
  );
};

export default OfferBookingForm;
