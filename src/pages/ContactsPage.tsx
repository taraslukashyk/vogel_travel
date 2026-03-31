import { useEffect, useState, useRef } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Send,
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
  Lock,
  Cookie
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useOffers } from '../lib/queries/offers';
import { useServices } from '../lib/queries/services';
import SEOHead from '../components/SEOHead';
import { useSettings } from '../hooks/useSettings';
import { sendTelegramNotification } from '../lib/notifications';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import SpeechButton from '../components/SpeechButton';


const ContactsPage = () => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { data: offers = [] } = useOffers();
  const { data: services = [] } = useServices();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [persons, setPersons] = useState('1');
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [ _, setCopiedField] = useState<string | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    details: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    window.scrollTo(0, 0);

    if (mapContainer.current && !mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [30.5233, 50.4382], // Kyiv, Sportyvna Sq, 1A
        zoom: 15,
        attributionControl: false,
      });

      // Marker for Kyiv office
      const markerEl = document.createElement('div');
      markerEl.className = 'w-5 h-5 bg-[#5cc8bd] rounded-full border-2 border-white shadow-lg animate-pulse';

      new maplibregl.Marker({ element: markerEl })
        .setLngLat([30.5233, 50.4382])
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
    if (selectedServiceId === 'custom') {
      return parseFloat(customAmount) || 0;
    }
    if (!selectedServiceId) return 0;

    const isOffer = offers.find(o => `offer-${o.slug}` === selectedServiceId);
    const basePrice = isOffer ? 5000 : 2000; // Mock base prices

    const personsCount = persons === '5+' ? 5 : parseInt(persons);
    return basePrice * personsCount;
  };

  const totalAmount = calculateTotal();

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare message for Telegram
    const message = `
<b>🔔 Нова заявка на бронювання!</b>

<b>👤 Клієнт:</b> ${formData.firstName} ${formData.lastName}
<b>📞 Телефон:</b> ${formData.phone}
<b>📧 Email:</b> ${formData.email}

<b>🏷️ Послуга:</b> ${selectedServiceId}
<b>👥 Гостей:</b> ${persons}
<b>💰 Сума:</b> ${totalAmount.toLocaleString()} UAH
<b>💳 Оплата:</b> ${selectedPayment}

<b>📝 Деталі:</b>
${formData.details || 'не вказано'}
    `.trim();

    await sendTelegramNotification(message);
    
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const isFormValid = () => {
    return (
      isOfferAccepted &&
      isPrivacyAccepted &&
      selectedPayment &&
      selectedServiceId &&
      (selectedServiceId !== 'custom' || parseFloat(customAmount) > 0)
    );
  };

  return (
    <main className="w-full bg-zinc-950 text-white min-h-screen overflow-hidden relative selection:bg-[#5cc8bd]/30">
      <SEOHead 
        pagePath={`/${currentLang}/contacts`} 
        fallbackTitle={currentLang === 'ua' ? "Контакти — Vogel Family Travel" : "Contacts — Vogel Family Travel"} 
        fallbackDescription={currentLang === 'ua' ? "Зв'яжіться з нами для консультації та бронювання преміальних подорожей." : "Contact us for consultation and booking of premium travels."} 
      />

      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          src="/about-video.mp4"
          autoPlay muted loop playsInline
          preload="none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-24 md:pt-40 pb-12 md:pb-24 font-inter">

        {/* Header */}
        <section className="mb-12 md:mb-20 text-center md:text-left">
          <span className="text-[#5cc8bd] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t('contacts.title')}
          </span>
          <h1 className="font-montserrat text-4xl sm:text-5xl md:text-7xl lg:text-[88px] font-extrabold uppercase tracking-tight leading-[0.9] mb-6 md:mb-8 text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 italic">
            {t('contacts.hero_title')} <br /> <span className="text-white/20 not-italic">{t('contacts.hero_subtitle')}</span>
          </h1>
          <p className="font-inter text-white/50 text-base md:text-xl max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            {t('contacts.hero_description')}
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Area: Form */}
          <div className="lg:col-span-2 space-y-8">

            {showSuccess ? (
              <div className="bg-white/5 border border-white/10 rounded-sm p-16 text-center shadow-2xl animate-in zoom-in-95 duration-500 backdrop-blur-xl">
                <div className="w-24 h-24 bg-white/5 rounded-sm flex items-center justify-center mx-auto mb-10 border border-white/10 font-bold">
                  <Check className="w-12 h-12 text-[#5cc8bd]" />
                </div>
                <h2 className="font-montserrat text-4xl font-bold uppercase mb-6 text-white tracking-widest">{t('contacts.success_title')}</h2>
                <p className="font-inter text-white/50 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                  {t('contacts.success_description')}
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-12 py-5 bg-white text-black rounded-sm text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#5cc8bd] transition-all shadow-lg"
                >
                  {t('contacts.new_request_btn')}
                </button>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden shadow-2xl backdrop-blur-xl group transition-all duration-500 hover:bg-white/10">
                <div className="bg-white/5 px-6 md:px-12 py-6 md:py-10 border-b border-white/10">
                  <h2 className="font-montserrat text-xl md:text-2xl font-bold uppercase text-white flex items-center gap-4 md:gap-5 tracking-wide mb-1 md:mb-2">
                    <span className="w-1.5 md:w-2 h-6 md:h-8 bg-[#5cc8bd]" />
                    {t('contacts.form_title')}
                  </h2>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 ml-5.5 md:ml-7">
                    {t('contacts.form_subtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-8 md:space-y-12">
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-[1px] bg-[#5cc8bd]" />
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">{t('contacts.personal_data')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('contacts.first_name')}</label>
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} required type="text" placeholder={t('contacts.first_name_placeholder')} className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('contacts.last_name')}</label>
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} required type="text" placeholder={t('contacts.last_name_placeholder')} className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('contacts.phone_label')}</label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" placeholder="+380" className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('contacts.email_label')}</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="mail@example.com" className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all placeholder:text-white/20" />
                      </div>
                    </div>

                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-[1px] bg-[#5cc8bd]" />
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">{t('contacts.trip_composition')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('contacts.service_label')}</label>
                        <div className="relative">
                          <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-zinc-900 text-white">{t('contacts.service_placeholder')}</option>
                            <optgroup label="Tours" className="bg-zinc-950 text-white">
                              {offers.map(offer => (
                                <option key={`offer-${offer.id}`} value={`offer-${offer.slug}`} className="bg-zinc-950 text-white">
                                  {currentLang === 'en' && offer.hotel_en ? offer.hotel_en : offer.hotel}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Services" className="bg-zinc-950 text-white">
                              {services.map(service => (
                                <option key={`service-${service.id}`} value={`service-${service.slug}`} className="bg-zinc-950 text-white">
                                  {currentLang === 'en' && service.title_en ? service.title_en : service.title}
                                </option>
                              ))}
                            </optgroup>
                            <option value="custom" className="bg-zinc-900 text-white">{t('contacts.service_custom') || 'Custom Invoice'}</option>
                          </select>
                          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 w-4 h-4 rotate-90" />
                        </div>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('contacts.persons_label')}</label>
                        <div className="relative">
                          <select
                            value={persons}
                            onChange={(e) => setPersons(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-zinc-900 text-white">1 {t('contacts.person_unit')}</option>
                            <option value="2" className="bg-zinc-900 text-white">2 {t('contacts.persons_unit')}</option>
                            <option value="3" className="bg-zinc-900 text-white">3 {t('contacts.persons_unit')}</option>
                            <option value="4" className="bg-zinc-900 text-white">4 {t('contacts.persons_unit')}</option>
                            <option value="5+" className="bg-zinc-900 text-white">{t('contacts.persons_group')}</option>
                          </select>
                          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {selectedServiceId === 'custom' && (
                      <div className="space-y-2 md:space-y-3 animate-in slide-in-from-top-4 duration-300">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#5cc8bd] ml-1">Сума згідно з інвойсом (UAH)</label>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white/10 border border-[#5cc8bd]/30 rounded-sm px-5 py-4 md:px-6 md:py-5 text-lg md:text-xl font-bold text-white focus:outline-none focus:border-[#5cc8bd] transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('contacts.details_label')}</label>
                        <SpeechButton
                          lang={currentLang === 'ua' ? 'uk-UA' : 'en-US'}
                          onResult={(text) => {
                            const prev = formData.details;
                            handleInputChange({ target: { name: 'details', value: prev ? prev + ' ' + text : text } } as React.ChangeEvent<HTMLTextAreaElement>);
                          }}
                        />
                      </div>
                      <textarea name="details" value={formData.details} onChange={handleInputChange} rows={3} placeholder={t('contacts.details_placeholder')} className="w-full bg-white/5 border border-white/10 rounded-sm px-5 py-4 md:px-6 md:py-5 text-sm font-medium text-white focus:outline-none focus:border-[#5cc8bd]/50 focus:bg-white/10 transition-all resize-none placeholder:text-white/20" />
                    </div>


                    {totalAmount > 0 && (
                      <div className="bg-[#5cc8bd]/10 border border-[#5cc8bd]/20 rounded-sm p-5 md:p-8 flex justify-between items-center animate-in zoom-in-95 duration-300">
                        <div className="space-y-0.5 md:space-y-1">
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#5cc8bd]">{t('contacts.total_to_pay')}</p>
                          <p className="text-white/40 text-[9px] md:text-[11px] uppercase tracking-widest font-bold">
                            {t('contacts.final_amount_note')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-montserrat text-2xl md:text-4xl font-extrabold text-white tracking-tighter">{totalAmount.toLocaleString()}</span>
                          <span className="text-[#5cc8bd] text-xs md:text-sm ml-2 md:ml-3 font-black uppercase tracking-widest">UAH</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-[1px] bg-[#5cc8bd]" />
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">{t('contacts.payment_method')}</h3>
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
                          className={`flex flex-col items-center gap-3 p-5 sm:p-8 rounded-sm border transition-all group ${selectedPayment === method.id
                              ? 'bg-[#5cc8bd]/20 border-[#5cc8bd] text-white'
                              : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className={`p-3 md:p-4 rounded-full transition-all ${selectedPayment === method.id ? 'bg-[#5cc8bd] text-black shadow-lg shadow-[#5cc8bd]/30' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                            {method.icon}
                          </div>
                          <div className="text-center">
                            <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-0.5 md:mb-1 transition-colors ${selectedPayment === method.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{method.name}</p>
                            <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-40">{method.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedPayment && (
                      <div className="p-8 bg-black/40 border border-white/5 rounded-sm animate-in slide-in-from-top-4 duration-300">
                        {selectedPayment === 'liqpay' && <p className="text-sm text-white/50 leading-relaxed italic">{t('contacts.payment_liqpay_desc')}</p>}
                        {selectedPayment === 'wayforpay' && <p className="text-sm text-white/50 leading-relaxed italic">{t('contacts.payment_wayforpay_desc')}</p>}
                        {selectedPayment === 'transfer' && (
                          <div className="space-y-5">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5cc8bd]">{t('contacts.official_requisites')}</h4>
                            <div className="space-y-1">
                              {[
                                { label: 'ТОВ', value: 'Vogel Family Travel' },
                                { label: 'IBAN', value: 'UA21 3117 9600 0000 0026 0025 1234' },
                              ].map((row) => (
                                <div key={row.label} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{row.label}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-white tracking-wide">{row.value}</span>
                                    <button type="button" onClick={() => handleCopy(row.value, row.label)} className="p-2 bg-white/5 border border-white/10 rounded-sm hover:bg-[#5cc8bd] hover:text-black transition-all">
                                      <Copy className="w-3.5 h-3.5" />
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

                  <div className="pt-8 space-y-5">
                    {[
                      { id: 'offer', label: t('contacts.agree_offer'), link: t('contacts.public_offer_link'), state: isOfferAccepted, setState: setIsOfferAccepted },
                      { id: 'privacy', label: t('contacts.agree_privacy'), link: t('contacts.privacy_policy_link'), state: isPrivacyAccepted, setState: setIsPrivacyAccepted },
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
                  </div>

                  <button
                    disabled={!isFormValid()}
                    className="w-full py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-sm hover:bg-[#5cc8bd] transition-all disabled:opacity-20 mt-8 shadow-2xl active:scale-[0.98]"
                  >
                    {t('contacts.pay_btn')}
                  </button>
                </form>
              </div>
            )}

            <section className="bg-white/5 border border-white/10 rounded-sm overflow-hidden group backdrop-blur-xl transition-all duration-500 hover:bg-white/10 p-6 md:p-14">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-8">
                  <div className="mb-0 p-4 bg-white/5 inline-block rounded-sm transition-transform duration-500 group-hover:scale-110 border border-white/5">
                    <Briefcase className="w-8 h-8 text-[#5cc8bd]" />
                  </div>
                  <h2 className="font-montserrat text-3xl font-bold uppercase text-white tracking-[0.05em] group-hover:text-primary transition-colors">{t('contacts.partners_title')}</h2>
                  <p className="font-inter text-white/50 text-lg leading-relaxed max-w-lg">
                    {t('contacts.partners_description')}
                  </p>
                  <button
                    type="button"
                    className="group/btn flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all"
                  >
                    {t('contacts.b2b_btn')} <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                  </button>
                </div>
                <div className="w-full md:w-1/3 aspect-[4/3] bg-white/5 border border-white/10 rounded-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <Building className="w-16 h-16 text-white/10 mb-5 relative z-10" />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 leading-tight relative z-10">Global Network</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-6 md:p-10 space-y-10 md:space-y-12 sticky top-32 shadow-2xl overflow-hidden hover:bg-white/10 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5cc8bd]/5 blur-3xl rounded-full" />

              <h3 className="font-montserrat text-xl font-bold uppercase text-white tracking-[0.2em] border-b border-white/5 pb-8 relative z-10">
                Direct Line
              </h3>

              <div className="space-y-10 font-inter relative z-10">
                <a href={`tel:${settings?.phone_primary?.replace(/\s/g, '') || '+380504692882'}`} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500 shadow-md">
                    <Phone className="w-6 h-6 text-[#5cc8bd] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">Mobile Line</p>
                    <p className="text-lg font-extrabold text-white group-hover:text-[#5cc8bd] transition-colors tracking-tighter transition-colors">{settings?.phone_primary || '+38 050 469 2882'}</p>
                  </div>
                </a>

                <a href={`tel:${settings?.phone_secondary?.replace(/\s/g, '') || '+380444692882'}`} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500 shadow-md">
                    <Phone className="w-6 h-6 text-[#5cc8bd] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">Office Line</p>
                    <p className="text-lg font-extrabold text-white group-hover:text-[#5cc8bd] transition-colors tracking-tighter transition-colors">{settings?.phone_secondary || '+38 044 469 2882'}</p>
                  </div>
                </a>

                <a href={`mailto:${settings?.email || 'booking@vogel.travel'}`} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500 shadow-md">
                    <Mail className="w-6 h-6 text-[#5cc8bd] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">Direct Email</p>
                    <p className="text-base font-bold text-white group-hover:text-[#5cc8bd] transition-colors break-all">{settings?.email || 'booking@vogel.travel'}</p>
                  </div>
                </a>


                <div className="pt-4 space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-[1px] bg-white/10" />
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Social Connect</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <a href={settings?.instagram_url || 'https://www.instagram.com/vogel.family.travel/'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 bg-white/5 border border-white/5 rounded-sm hover:bg-white/10 transition-all">
                      <Instagram className="w-5 h-5 text-white/20 group-hover:text-[#5cc8bd] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Instagram</span>
                    </a>
                    <a href={settings?.facebook_url || 'https://www.facebook.com/vogelfamilytravel/'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 bg-white/5 border border-white/5 rounded-sm hover:bg-white/10 transition-all">
                      <Facebook className="w-5 h-5 text-white/20 group-hover:text-[#5cc8bd] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Facebook</span>
                    </a>
                    <a href={settings?.telegram_url || 'https://t.me/Taras_luka'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 bg-white/5 border border-white/5 rounded-sm hover:bg-white/10 transition-all">
                      <Send className="w-5 h-5 text-white/20 group-hover:text-[#5cc8bd] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Telegram</span>
                    </a>
                    <a href={settings?.whatsapp_url || 'https://wa.me/380685032230'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 bg-white/5 border border-white/5 rounded-sm hover:bg-white/10 transition-all">
                      <MessageCircle className="w-5 h-5 text-white/20 group-hover:text-[#5cc8bd] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">WhatsApp</span>
                    </a>
                  </div>

                </div>

                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-white/20" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1.5">{t('contacts.office_hours')}</p>
                      <div className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest whitespace-pre-line">
                        {t('contacts.office_hours_desc')}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-44 bg-black/40 rounded-sm overflow-hidden border border-white/10 shadow-inner group mt-4 relative">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((currentLang === 'en' ? settings?.address_en : settings?.address) || 'Спортивна площа, 1А, Київ')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 z-20 bg-zinc-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm text-[8px] font-black text-white/50 hover:text-[#5cc8bd] hover:border-[#5cc8bd]/50 transition-all opacity-0 group-hover:opacity-100 uppercase tracking-widest flex items-center gap-2"
                    >
                      {t('contacts.open_in_maps')}
                      <ChevronRight className="w-2.5 h-2.5" />
                    </a>
                    <div ref={mapContainer} className="w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-x-0 bottom-0 bg-zinc-950/90 backdrop-blur-sm py-2 px-3 flex justify-between items-center z-20">
                      <span className="text-[9px] font-black text-[#5cc8bd] uppercase tracking-widest">{(currentLang === 'en' ? settings?.address_en : settings?.address) || (currentLang === 'ua' ? 'Спортивна площа, 1А' : 'Sportyvna Square, 1A')}</span>
                      <MapPin className="w-3 h-3 text-white/40" />
                    </div>

                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-4 font-montserrat relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">{t('contacts.documents_title')}</h4>
                {[
                  { id: 'offer', name: t('contacts.doc_offer'), icon: <FileText className="w-4 h-4" /> },
                  { id: 'privacy', name: t('contacts.doc_privacy'), icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 'cookie', name: t('contacts.doc_cookie'), icon: <Cookie className="w-4 h-4" /> },
                  { id: 'returns', name: t('contacts.doc_returns'), icon: <Undo2 className="w-4 h-4" /> },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setActiveModal(link.id)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-white/5 border border-white/5 rounded-sm group/link hover:bg-white hover:text-black transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="opacity-40 group-hover/link:opacity-100">{link.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{link.name}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setActiveModal(null)} />
          <div className="relative bg-[#111] border border-white/10 rounded-sm max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="font-montserrat text-xl font-bold uppercase text-white tracking-[0.3em]">
                {activeModal === 'offer' && t('contacts.doc_offer')}
                {activeModal === 'privacy' && t('contacts.doc_privacy')}
                {activeModal === 'cookie' && t('contacts.doc_cookie')}
                {activeModal === 'returns' && t('contacts.doc_returns')}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:bg-white hover:text-black transition-all"
              >
                <div className="text-2xl font-light">&times;</div>
              </button>
            </div>
            <div className="p-10 md:p-14 overflow-y-auto font-inter text-[15px] text-white/50 leading-relaxed space-y-8 scrollbar-thin scrollbar-thumb-white/10">
              <h3 className="text-white font-bold text-lg uppercase tracking-widest font-montserrat">{t('contacts.modal_legal_basis')}</h3>
              <p>{t('contacts.modal_legal_desc1')}</p>
              <p>{t('contacts.modal_legal_desc2')}</p>
              <div className="p-8 bg-white/5 border-l-2 border-[#5cc8bd] italic text-white/70">
                {t('contacts.modal_legal_footer')}
              </div>
            </div>
            <div className="p-10 border-t border-white/5 bg-white/5 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-sm hover:bg-[#5cc8bd] transition-all font-montserrat"
              >
                {t('contacts.modal_close_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContactsPage;
