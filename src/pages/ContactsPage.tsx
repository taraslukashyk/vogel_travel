import { useEffect, useState, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Undo2, 
  Copy, 
  Check, 
  CreditCard, 
  Building, 
  Briefcase,
  MapPin,
  ChevronRight,
  Shield,
  Lock
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const ContactsPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [service, setService] = useState('');
  const [persons, setPersons] = useState('1');
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [isAgeAccepted, setIsAgeAccepted] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (mapContainer.current && !mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [30.5234, 50.4501], // Kyiv
        zoom: 14,
        attributionControl: false,
      });

      // Simple marker with brand color
      const markerEl = document.createElement('div');
      markerEl.className = 'w-6 h-6 bg-[#5cc8bd] rounded-full border-4 border-white shadow-xl animate-pulse';
      
      new maplibregl.Marker({ element: markerEl })
        .setLngLat([30.5234, 50.4501])
        .addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const calculateTotal = () => {
    if (service === 'custom') {
      return parseFloat(customAmount) || 0;
    }
    if (!service) return 0;
    const basePrice = parseInt(service);
    const personsCount = persons === '5+' ? 5 : parseInt(persons);
    return basePrice * personsCount;
  };

  const totalAmount = calculateTotal();

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFormValid = () => {
    return (
      isOfferAccepted && 
      isPrivacyAccepted && 
      isAgeAccepted && 
      selectedPayment && 
      service &&
      (service !== 'custom' || parseFloat(customAmount) > 0)
    );
  };

  return (
    <main className="w-full bg-zinc-950 text-white min-h-screen overflow-hidden relative selection:bg-[#5cc8bd]/30">
      
      {/* Background Video (Matching Offers/About) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          src="about-video.mp4"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-40 pb-24 font-inter">
        
        {/* Hero Section */}
        <section className="mb-20 text-center md:text-left">
          <span className="text-[#5cc8bd] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
            Зворотній зв'язок
          </span>
          <h1 className="font-montserrat text-5xl md:text-7xl lg:text-[88px] font-extrabold uppercase tracking-tight leading-[0.9] mb-8 text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 italic">
            Контакти <br /> <span className="text-white/20 not-italic">& Бронювання</span>
          </h1>
          <p className="font-inter text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            Vogel Family Travel — це найвищий рівень сервісу. <br />
            Ми на зв'язку 24/7 для наших клієнтів по всьому світу.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Area (Form) */}
          <div className="lg:col-span-2 space-y-8">
            
            {showSuccess ? (
              <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-sm p-16 text-center shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-[#5cc8bd]/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-[#5cc8bd]/30">
                  <Check className="w-12 h-12 text-[#5cc8bd]" />
                </div>
                <h2 className="font-montserrat text-4xl font-bold uppercase mb-6 text-white tracking-widest">Дякуємо!</h2>
                <p className="font-inter text-white/60 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                  Вашу заявку прийнято до обробки. Пріоритетний менеджер сконтактує з вами протягом 15 хвилин.
                </p>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="px-12 py-5 border border-white/20 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all"
                >
                  Нова заявка
                </button>
              </div>
            ) : (
              <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 md:px-12 py-10 border-b border-white/5">
                  <h2 className="font-montserrat text-2xl font-bold uppercase text-white flex items-center gap-5 tracking-wide">
                    <span className="w-2 h-8 bg-[#5cc8bd]" />
                    Оформлення Бронювання
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                  
                  {/* Client Info */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-[1px] bg-[#5cc8bd]" />
                       <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">Персональні дані</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Ім'я</label>
                        <input required type="text" placeholder="Ваше ім'я" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Прізвище</label>
                        <input required type="text" placeholder="Ваше прізвище" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Контактний номер</label>
                        <input required type="tel" placeholder="+380" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">E-mail адреса</label>
                        <input required type="email" placeholder="mail@example.com" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-[1px] bg-[#5cc8bd]" />
                       <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">Склад подорожі</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Обрати напрямок / Послугу</label>
                        <div className="relative">
                          <select 
                            value={service} 
                            onChange={(e) => setService(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-zinc-900">Оберіть послугу...</option>
                            <option value="3500" className="bg-zinc-900">Тур «Відень — Зальцбург» (3 500 грн)</option>
                            <option value="5200" className="bg-zinc-900">Тур «Прага — Будапешт» (5 200 грн)</option>
                            <option value="7800" className="bg-zinc-900">Тур «Барселона — Мадрид» (7 800 грн)</option>
                            <option value="12000" className="bg-zinc-900">Тур «Сімейний у Греції» (12 000 грн)</option>
                            <option value="custom" className="bg-zinc-900">Індивідуальний розрахунок</option>
                          </select>
                          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 w-4 h-4 rotate-90" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Кількість гостей</label>
                        <div className="relative">
                          <select 
                            value={persons} 
                            onChange={(e) => setPersons(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-zinc-900">1 людина</option>
                            <option value="2" className="bg-zinc-900">2 людини</option>
                            <option value="3" className="bg-zinc-900">3 людини</option>
                            <option value="4" className="bg-zinc-900">4 людини</option>
                            <option value="5+" className="bg-zinc-900">Більше 5 (група)</option>
                          </select>
                          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {service === 'custom' && (
                      <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Сума згідно з інвойсом (UAH)</label>
                        <input 
                          type="number" 
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="0.00" 
                          className="w-full bg-white/10 border border-[#5cc8bd]/30 rounded-sm px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-[#5cc8bd] transition-all" 
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Деталі або Побажання</label>
                      <textarea rows={4} placeholder="Вкажіть бажані дати, готель або особливі вимоги до сервісу..." className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all resize-none placeholder:text-white/20" />
                    </div>

                    {totalAmount > 0 && (
                      <div className="bg-[#5cc8bd]/10 border border-[#5cc8bd]/20 rounded-sm p-8 flex justify-between items-center animate-in zoom-in-95 duration-300">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5cc8bd]">Разом до сплати</p>
                          <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
                            Final Amount • Inclusive of taxes
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-montserrat text-4xl font-extrabold text-white tracking-tighter">{totalAmount.toLocaleString()}</span>
                          <span className="text-[#5cc8bd] text-sm ml-3 font-black uppercase tracking-widest">UAH</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-[1px] bg-[#5cc8bd]" />
                       <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">Спосіб розрахунку</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {[
                        { id: 'liqpay', name: 'LiqPay', sub: 'Apple / Google Pay', icon: <CreditCard className="w-5 h-5" /> },
                        { id: 'wayforpay', name: 'WayForPay', sub: 'Карти будь-яких банків', icon: <Lock className="w-5 h-5" /> },
                        { id: 'transfer', name: 'Invoice', sub: 'Реквізити компанії', icon: <FileText className="w-5 h-5" /> },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPayment(method.id)}
                          className={`flex flex-col items-center gap-4 p-8 rounded-sm border transition-all group ${
                            selectedPayment === method.id 
                            ? 'bg-[#5cc8bd]/20 border-[#5cc8bd] text-white' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className={`p-4 rounded-full transition-all ${selectedPayment === method.id ? 'bg-[#5cc8bd] text-black shadow-lg shadow-[#5cc8bd]/30' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                            {method.icon}
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 transition-colors ${selectedPayment === method.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{method.name}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">{method.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Payment Panels (Matching Contrast Analysis) */}
                    {selectedPayment && (
                      <div className="p-8 bg-zinc-900 border border-white/5 rounded-sm animate-in slide-in-from-top-4 duration-300 space-y-6">
                        {selectedPayment === 'liqpay' && (
                          <>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4 text-white font-black text-xl italic tracking-tighter">
                                 <span className="text-[#00AEEF]">Liq</span><span className="text-[#F7941D]">Pay</span>
                               </div>
                               <div className="flex gap-2">
                                  <div className="w-8 h-5 bg-white/10 rounded-sm" />
                                  <div className="w-8 h-5 bg-white/10 rounded-sm" />
                               </div>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed font-normail">
                              Миттєва оплата через захищений шлюз ПриватБанку. Ми не зберігаємо дані вашої картки. Пряме списання без комісії для клієнта.
                            </p>
                          </>
                        )}

                        {selectedPayment === 'wayforpay' && (
                          <>
                            <div className="text-white font-black text-xl italic tracking-tighter">WayForPay</div>
                            <p className="text-sm text-white/50 leading-relaxed">
                              Універсальний платіжний хаб. Підтримує Apple Pay, Google Pay, Приват24 та будь-які карти Visa/Mastercard світу.
                            </p>
                          </>
                        )}

                        {selectedPayment === 'transfer' && (
                          <div className="space-y-5">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5cc8bd]">Офіційні Реквізити</h4>
                            <div className="space-y-1">
                                {[
                                  { label: 'Отримувач', value: 'ФОП Vogel Family Travel' },
                                  { label: 'Код ЄДРПОУ', value: '3456789012' },
                                  { label: 'Рахунок IBAN', value: 'UA21 3117 9600 0000 0026 0025 1234' },
                                  { label: 'Призначення', value: 'Оплата тур. послуг згідно замовлення' },
                                ].map((row) => (
                                  <div key={row.label} className="group flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{row.label}</span>
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm font-bold text-white tracking-wide">{row.value}</span>
                                      <button 
                                        type="button"
                                        onClick={() => handleCopy(row.value, row.label)}
                                        className={`p-2 rounded-sm border transition-all ${
                                          copiedField === row.label ? 'bg-[#5cc8bd] border-[#5cc8bd] text-black' : 'bg-white/5 border-white/10 text-white/40 hover:bg-[#5cc8bd]/20 hover:border-[#5cc8bd] hover:text-[#5cc8bd]'
                                        }`}
                                      >
                                        {copiedField === row.label ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Consents - Strategic alignment with high contrast requirements */}
                  <div className="pt-8 space-y-5">
                    {[
                      { id: 'offer', label: 'Ознайомлений(-а) та погоджуюсь з умовами', link: 'Публічної оферти', state: isOfferAccepted, setState: setIsOfferAccepted },
                      { id: 'privacy', label: 'Надаю згоду на обробку даних згідно з', link: 'Політикою конфіденційності', state: isPrivacyAccepted, setState: setIsPrivacyAccepted },
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-5 cursor-pointer group">
                        <div className="relative mt-1 shrink-0">
                          <input type="checkbox" checked={item.state} onChange={(e) => item.setState(e.target.checked)} className="peer hidden" />
                          <div className="w-6 h-6 border-2 border-white/10 rounded-sm peer-checked:bg-[#5cc8bd] peer-checked:border-[#5cc8bd] transition-all flex items-center justify-center bg-white/5">
                            <Check className="w-4 h-4 text-black opacity-0 peer-checked:opacity-100 font-bold" />
                          </div>
                        </div>
                        <span className="text-[14px] text-white/50 leading-relaxed font-medium group-hover:text-white transition-colors">
                          {item.label} <button type="button" onClick={() => setActiveModal(item.id)} className="text-[#5cc8bd] underline hover:text-white transition-colors font-bold whitespace-nowrap">{item.link}</button>
                        </span>
                      </label>
                    ))}
                    
                    <label className="flex items-start gap-5 cursor-pointer group">
                      <div className="relative mt-1 shrink-0">
                        <input type="checkbox" checked={isAgeAccepted} onChange={(e) => setIsAgeAccepted(e.target.checked)} className="peer hidden" />
                        <div className="w-6 h-6 border-2 border-white/10 rounded-sm peer-checked:bg-[#5cc8bd] peer-checked:border-[#5cc8bd] transition-all flex items-center justify-center bg-white/5">
                          <Check className="w-4 h-4 text-black opacity-0 peer-checked:opacity-100 font-bold" />
                        </div>
                      </div>
                      <span className="text-[14px] text-white/50 leading-relaxed font-medium group-hover:text-white transition-colors">
                        Підтверджую досягнення 18-річного віку та повну дієздатність
                      </span>
                    </label>
                  </div>

                  <button
                    disabled={!isFormValid()}
                    className="w-full py-6 bg-white text-black text-xs font-black uppercase tracking-[0.4em] rounded-sm hover:bg-[#5cc8bd] transition-all disabled:opacity-20 disabled:grayscale mt-8 shadow-2xl shadow-white/5 active:scale-[0.98]"
                  >
                    Перейти до оплати
                  </button>
                </form>
              </div>
            )}

            {/* Partners Block (Glassmorphism) */}
            <section className="bg-black/40 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden group">
              <div className="p-10 md:p-14">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#5cc8bd]/10 rounded-sm flex items-center justify-center border border-[#5cc8bd]/20 group-hover:bg-[#5cc8bd] transition-all duration-500">
                        <Briefcase className="w-7 h-7 text-[#5cc8bd] group-hover:text-black transition-colors" />
                      </div>
                      <h2 className="font-montserrat text-3xl font-bold uppercase text-white tracking-[0.05em]">Для партнерів</h2>
                    </div>
                    <p className="font-inter text-white/40 text-lg leading-relaxed max-w-lg">
                      Ми формуємо мережу найкращих готелів та сервісів світу. Якщо ваші стандарти відповідають рівню Vogel — ми відкриті до діалогу.
                    </p>
                    <button 
                      type="button"
                      className="group/btn flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all"
                    >
                      B2B Співпраця <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                    </button>
                  </div>
                  <div className="w-full md:w-1/3 aspect-[4/3] bg-gradient-to-br from-white/10 to-transparent border border-white/5 rounded-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                     <Building className="w-20 h-20 text-white/10 mb-5 relative z-10" />
                     <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 leading-tight relative z-10">Global Distribution</p>
                     <div className="absolute inset-0 bg-[#5cc8bd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>
              </div>
            </section>

            {/* Map Section */}
            <section className="space-y-8">
              <div className="flex justify-between items-end px-2">
                <div className="space-y-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5cc8bd]">Local Presence</h3>
                  <div className="flex items-center gap-3 text-white font-bold text-lg tracking-wide">
                    <MapPin className="w-5 h-5 text-white/30" />
                    <span>Kyiv, BC Gulliver, 1A Sportivna Sq.</span>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                   <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest text-white/40">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                     By Appointment Only
                   </div>
                </div>
              </div>
              <div className="w-full h-[500px] bg-zinc-900 rounded-sm overflow-hidden border border-white/5 relative group shadow-2xl">
                <div ref={mapContainer} className="w-full h-full grayscale-[0.8] contrast-[1.2] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                
                {/* Overlay with high contrast text */}
                <div className="absolute inset-x-0 bottom-0 p-8 z-20 pointer-events-none">
                  <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-8 rounded-sm max-w-[320px] shadow-2xl slide-in-bottom duration-1000">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-3 h-3 bg-[#5cc8bd] rounded-full" />
                       <p className="text-white font-black text-base uppercase tracking-widest font-montserrat">Vogel Hub Kyiv</p>
                    </div>
                    <p className="text-white/40 text-[12px] leading-relaxed font-medium">
                      Наш головний офіс розташований у самому серці столиці. Вежа А, 17-й поверх. Конфіденційні переговори та підписання договорів.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            
            {/* Direct Contacts Glassmorphism */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-sm p-10 space-y-12 sticky top-32 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5cc8bd]/5 blur-3xl rounded-full" />
              
              <h3 className="font-montserrat text-xl font-bold uppercase text-white tracking-[0.2em] border-b border-white/5 pb-8 relative z-10">
                Direct Line
              </h3>
              
              <div className="space-y-10 font-inter relative z-10">
                <a href="tel:+380504692882" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] group-hover:shadow-[0_0_30px_rgba(92,200,189,0.3)] transition-all duration-500">
                    <Phone className="w-6 h-6 text-white/30 group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">Phone Call</p>
                    <p className="text-lg font-extrabold text-white group-hover:text-[#5cc8bd] transition-colors tracking-tighter">+38 050 469 2882</p>
                  </div>
                </a>

                <a href="mailto:booking@vogel.travel" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] group-hover:shadow-[0_0_30px_rgba(92,200,189,0.3)] transition-all duration-500">
                    <Mail className="w-6 h-6 text-white/30 group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">Email Inquiry</p>
                    <p className="text-base font-bold text-white group-hover:text-[#5cc8bd] transition-colors break-all">booking@vogel.travel</p>
                  </div>
                </a>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-white/30" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">24/7 Messengers</p>
                    <p className="text-base font-bold text-white tracking-widest">@vogel_travel</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-white/30" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">Working Hours</p>
                    <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest text-[11px]">
                      Mon–Fri: 09:00 – 19:00 <br />
                      Sat–Sun: Platinum Concierge Only
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Links (Refining contrast for small text) */}
              <div className="pt-12 border-t border-white/5 space-y-3 font-montserrat relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-6">Legal Framework</h4>
                {[
                  { id: 'offer', name: 'Публічна оферта', icon: <FileText className="w-4 h-4" /> },
                  { id: 'privacy', name: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 'returns', name: 'Refund Policy', icon: <Undo2 className="w-4 h-4" /> },
                ].map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => setActiveModal(link.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 border border-white/5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white hover:text-black hover:border-white transition-all text-left"
                  >
                    <span className="opacity-50">{link.icon}</span>
                    {link.name}
                  </button>
                ))}
              </div>

              {/* Security Badges High Contrast */}
              <div className="pt-12 space-y-6 relative z-10">
                 <div className="flex items-center gap-3 text-[#5cc8bd]">
                    <Shield className="w-5 h-5 shadow-inner" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Security Verified</span>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    {['SSL Secured', 'PCI DSS v4', '3D Secure', 'Protected'].map(label => (
                      <div key={label} className="bg-white/5 border border-white/10 px-3 py-3 rounded-sm text-[9px] font-black text-white/20 uppercase tracking-[0.2em] text-center">
                        {label}
                      </div>
                    ))}
                 </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Extreme Visual Contrast Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setActiveModal(null)} />
          <div className="relative bg-[#111] border border-white/10 rounded-sm max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="font-montserrat text-xl font-bold uppercase text-white tracking-[0.3em]">
                {activeModal === 'offer' && 'Публічна оферта'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'cookie' && 'Cookie Policy'}
                {activeModal === 'returns' && 'Refund Policy'}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:bg-white hover:text-black transition-all"
              >
                <div className="text-2xl font-light">&times;</div>
              </button>
            </div>
            <div className="p-10 md:p-14 overflow-y-auto font-inter text-[15px] text-white/50 leading-relaxed space-y-8 scrollbar-thin scrollbar-thumb-white/10">
              <div className="space-y-6">
                <h3 className="text-white font-bold text-lg uppercase tracking-widest font-montserrat">1. Юридичні засади</h3>
                <p>Цей документ визначає умови надання преміальних туристичних послуг Vogel Family Travel. Ми гарантуємо повну конфіденційність та юридичну відповідність міжнародним стандартам.</p>
                <p>Кожна операція на цьому сайті захищена сертифікатами безпеки найвищого рівня.</p>
              </div>
              <div className="space-y-6">
                <h3 className="text-white font-bold text-lg uppercase tracking-widest font-montserrat">2. Відповідальність сторін</h3>
                <p>Компанія бере на себе зобов'язання щодо повної логістичної підтримки клієнта 24/7 з моменту підписання договору або оплати інвойсу.</p>
              </div>
              <div className="p-8 bg-white/5 border-l-2 border-[#5cc8bd] italic text-white/70">
                Повний текст документу доступний для завантаження у форматі PDF для зареєстрованих клієнтів.
              </div>
            </div>
            <div className="p-10 border-t border-white/5 bg-white/5 flex justify-end gap-5">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-sm hover:bg-[#5cc8bd] transition-all font-montserrat active:scale-95"
              >
                I AGREE
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default ContactsPage;
