import { useEffect, useRef, useState } from 'react';
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
  MapPin,
  ChevronRight,
  Cookie
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import SEOHead from '../components/SEOHead';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import aboutPoster from '../assets/about-bg.png';
import VoiceRecorder from '../components/VoiceRecorder';
import { sendTelegramVoice } from '../lib/notifications';
import { toast } from 'sonner';

const ContactsPage = () => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { settings } = useSettings();
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [isSendingVoice, setIsSendingVoice] = useState(false);
  const [phoneForVoice, setPhoneForVoice] = useState('');

  const handleSendVoice = async () => {
    if (!voiceBlob) return;
    if (!phoneForVoice.trim()) {
      toast.error(currentLang === 'ua' ? 'Будь ласка, вкажіть ваш номер телефону' : 'Please provide your phone number');
      return;
    }
    
    setIsSendingVoice(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(voiceBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const pureBase64 = base64data.split(',')[1];
        
        const result = await sendTelegramVoice(
          `🎤 Голосове повідомлення\n📱 Від: ${phoneForVoice}\n📍 Сторінка контактів`,
          pureBase64,
          'voice_message.ogg'
        );
        
        if (result.success) {
          toast.success(currentLang === 'ua' ? 'Повідомлення надіслано!' : 'Message sent!');
          setVoiceBlob(null);
          setPhoneForVoice('');
        } else {
          toast.error(result.error || (currentLang === 'ua' ? 'Помилка відправки' : 'Send error'));
        }
        setIsSendingVoice(false);
      };
    } catch (error) {
      console.error('Error sending voice:', error);
      toast.error(currentLang === 'ua' ? 'Помилка відправки' : 'Send error');
      setIsSendingVoice(false);
    }
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
        dragPan: true,
        scrollZoom: true,
        touchZoomRotate: true
      });

      // Add navigation control to make it feel more "pro"
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      const markerEl = document.createElement('div');
      markerEl.className = 'w-6 h-6 bg-[#5cc8bd] rounded-full border-2 border-white shadow-[0_0_15px_rgba(92,200,189,0.5)] animate-pulse';

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
          poster={aboutPoster}
          autoPlay muted loop playsInline
          preload="metadata"
        >
          <source src="/about-video.mp4" type="video/mp4" />
        </video>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-stretch">
          
          {/* Row 1: Primary Info Cards */}
          {/* Direct Line */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 space-y-8 hover:bg-white/10 transition-all duration-500 h-full flex flex-col">
            <h3 className="font-montserrat text-sm font-black uppercase tracking-[0.3em] text-[#5cc8bd]">{t('contacts.direct_line')}</h3>
            <div className="space-y-8 flex-grow">
               <a href={`tel:${settings?.phone_primary?.replace(/\s/g, '') || '+380504692882'}`} className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500">
                  <Phone className="w-5 h-5 text-[#5cc8bd] group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{t('contacts.mobile')}</p>
                  <p className="text-lg font-bold text-white group-hover:text-[#5cc8bd] transition-colors">{settings?.phone_primary || '+38 050 469 2882'}</p>
                </div>
              </a>
              <a href={`tel:${settings?.phone_secondary?.replace(/\s/g, '') || '+380444692882'}`} className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500">
                  <Phone className="w-5 h-5 text-[#5cc8bd] group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{t('contacts.office')}</p>
                  <p className="text-lg font-bold text-white group-hover:text-[#5cc8bd] transition-colors">{settings?.phone_secondary || '+38 044 469 2882'}</p>
                </div>
              </a>
              <a href={`mailto:${settings?.email || 'booking@vogel.travel'}`} className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500">
                  <Mail className="w-5 h-5 text-[#5cc8bd] group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Email</p>
                  <p className="text-base font-bold text-white group-hover:text-[#5cc8bd] transition-colors break-all">{settings?.email || 'booking@vogel.travel'}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 pb-0 space-y-8 hover:bg-white/10 transition-all duration-500 h-full flex flex-col group/card overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat text-sm font-black uppercase tracking-[0.3em] text-[#5cc8bd]">{t('contacts.location')}</h3>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=50.4382,30.5233"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-[#5cc8bd] hover:border-[#5cc8bd]/50 hover:bg-[#5cc8bd]/5 transition-all flex items-center gap-2 rounded-full"
              >
                <span>GOOGLE MAPS</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            
            <div className="space-y-6 flex-grow flex flex-col">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white/20" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{t('contacts.office_hours')}</p>
                  <div className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest whitespace-pre-line">
                    {t('contacts.office_hours_desc')}
                  </div>
                </div>
              </div>
              
              <div className="w-[calc(100%+64px)] -mx-8 mt-auto h-64 bg-black/40 border-t border-white/10 relative group bg-zinc-900 group-hover/card:bg-zinc-800 transition-colors">
                <div ref={mapContainer} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-8 flex items-center gap-3">
                   <div className="p-2 bg-[#5cc8bd] rounded-sm">
                     <MapPin className="w-3 h-3 text-black" />
                   </div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1 rounded-sm border border-white/10">
                     {(currentLang === 'en' ? settings?.address_en : settings?.address) || 'Kyiv, Gulliver BC'}
                   </span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 md:p-10 hover:bg-white/10 transition-all duration-500 h-full">
             <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5cc8bd] mb-8">{t('contacts.documents_title')}</h4>
             <div className="space-y-4">
                {[
                  { id: 'offer', name: t('contacts.doc_offer'), icon: <FileText className="w-4 h-4" /> },
                  { id: 'privacy', name: t('contacts.doc_privacy'), icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 'returns', name: t('contacts.doc_returns'), icon: <Undo2 className="w-4 h-4" /> },
                  { id: 'cookie', name: t('contacts.doc_cookie'), icon: <Cookie className="w-4 h-4" /> },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      if (link.id === 'cookie') {
                        window.dispatchEvent(new CustomEvent('openCookieSettings'));
                      } else {
                        // Handle other documents (e.g. open PDF or another modal)
                        toast.info(currentLang === 'ua' ? 'Документ в процесі оновлення' : 'Document is being updated');
                      }
                    }}
                    className="w-full flex items-center justify-between px-6 py-5 bg-white/5 border border-white/5 rounded-sm group/link hover:bg-white hover:text-black transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="opacity-40 group-hover/link:opacity-100">{link.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-all -translate-x-4 group-hover/link:translate-x-0" />
                  </button>
                ))}
             </div>
          </div>

          {/* Row 2: Secondary Content - Full Width Socials */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 md:p-12">
             <div className="flex items-center gap-4 mb-10">
               <div className="w-8 h-[1px] bg-[#5cc8bd]" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">{t('contacts.social_channels')}</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Instagram />, label: 'Instagram', url: settings?.instagram_url },
                  { icon: <Facebook />, label: 'Facebook', url: settings?.facebook_url },
                  { icon: <Send />, label: 'Telegram', url: settings?.telegram_url },
                  { icon: <MessageCircle />, label: 'WhatsApp', url: settings?.whatsapp_url },
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/5 rounded-sm hover:bg-white hover:text-black transition-all group"
                  >
                    <span className="text-[#5cc8bd] group-hover:text-black transition-colors">{social.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">{social.label}</span>
                  </a>
                ))}
             </div>
          </div>

          {/* Row 3: Quick Support - Full Width */}
          <div className="lg:col-span-3 bg-[#5cc8bd]/10 border border-[#5cc8bd]/20 rounded-sm p-8 md:p-12 text-center space-y-10 flex flex-col md:flex-row items-center justify-between gap-12">
             <div className="flex-1 space-y-6 text-left">
                <div className="w-16 h-16 bg-[#5cc8bd] text-black rounded-full flex items-center justify-center shadow-xl shadow-[#5cc8bd]/20">
                   <Send className="w-8 h-8" />
                </div>
                <h4 className="font-montserrat font-bold text-3xl uppercase tracking-tight">{t('contacts.help_title')}</h4>
                <p className="text-lg text-white/50 leading-relaxed font-medium max-w-xl">{t('contacts.help_description')}</p>
                <a 
                 href={settings?.telegram_url || 'https://t.me/Taras_luka'} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-block px-12 py-5 border border-[#5cc8bd] text-[#5cc8bd] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#5cc8bd] hover:text-black transition-all"
                >
                  {t('contacts.help_btn')}
                </a>
             </div>

             <div className="flex-1 w-full max-w-md p-8 bg-black/40 border border-white/5 rounded-sm space-y-6">
               <p className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-black">
                 {currentLang === 'ua' ? 'Або запиши голосове повідомлення' : 'Or record a voice message'}
               </p>
               
               <div className="flex flex-col items-center gap-6">
                 <VoiceRecorder 
                   onRecordingComplete={setVoiceBlob} 
                   className="justify-center scale-125 my-4"
                 />
                 
                 {voiceBlob && (
                   <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="relative group">
                       <input
                         type="tel"
                         id="tel"
                         name="tel"
                         autoComplete="tel"
                         placeholder={currentLang === 'ua' ? "+380 (__) ___ __ __" : "+44 ___ ___ ____"}
                         value={phoneForVoice}
                         onChange={(e) => setPhoneForVoice(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm font-bold text-white placeholder:text-white/10 focus:border-[#5cc8bd] focus:bg-white/10 transition-all outline-none rounded-sm"
                         autoFocus
                       />
                       <label htmlFor="tel" className="absolute top-[18px] right-6 text-[8px] uppercase tracking-widest font-black text-white/20 group-focus-within:text-[#5cc8bd] transition-colors cursor-text">
                         {currentLang === 'ua' ? 'ТЕЛЕФОН' : 'PHONE'}
                       </label>
                     </div>
                     
                     <button
                       onClick={handleSendVoice}
                       disabled={isSendingVoice}
                       className="w-full py-5 bg-[#5cc8bd] text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#5cc8bd]/90 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                     >
                       {isSendingVoice ? (
                         <>
                           <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                           <span>{currentLang === 'ua' ? 'ВІДПРАВКА...' : 'SENDING...'}</span>
                         </>
                       ) : (
                         <>
                           <Send className="w-4 h-4" />
                           <span>{currentLang === 'ua' ? 'ВІДПРАВИТИ' : 'SEND MESSAGE'}</span>
                         </>
                       )}
                     </button>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactsPage;
