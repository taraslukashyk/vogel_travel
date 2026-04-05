import { useEffect, useRef } from 'react';
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

const ContactsPage = () => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { settings } = useSettings();

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Blocks Area */}
          <div className="lg:col-span-2 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Direct Line Group */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 space-y-8 hover:bg-white/10 transition-all duration-500">
                <h3 className="font-montserrat text-sm font-black uppercase tracking-[0.3em] text-[#5cc8bd]">Direct Line</h3>
                <div className="space-y-8">
                   <a href={`tel:${settings?.phone_primary?.replace(/\s/g, '') || '+380504692882'}`} className="flex items-center gap-6 group">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500">
                      <Phone className="w-5 h-5 text-[#5cc8bd] group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Mobile</p>
                      <p className="text-lg font-bold text-white group-hover:text-[#5cc8bd] transition-colors">{settings?.phone_primary || '+38 050 469 2882'}</p>
                    </div>
                  </a>
                  <a href={`tel:${settings?.phone_secondary?.replace(/\s/g, '') || '+380444692882'}`} className="flex items-center gap-6 group">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#5cc8bd] group-hover:border-[#5cc8bd] transition-all duration-500">
                      <Phone className="w-5 h-5 text-[#5cc8bd] group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Office</p>
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

              {/* Office & Map Group */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 space-y-8 hover:bg-white/10 transition-all duration-500">
                <h3 className="font-montserrat text-sm font-black uppercase tracking-[0.3em] text-[#5cc8bd]">Location</h3>
                <div className="space-y-6">
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
                  <div className="w-full h-32 bg-black/40 rounded-sm overflow-hidden border border-white/10 relative group">
                    <div ref={mapContainer} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                       <MapPin className="w-3 h-3 text-[#5cc8bd]" />
                       <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{(currentLang === 'en' ? settings?.address_en : settings?.address) || 'Kyiv'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials Connection */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 md:p-12">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-8 h-[1px] bg-[#5cc8bd]" />
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Social Channels</h3>
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
          </div>

          {/* Legal Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 md:p-10 hover:bg-white/10 transition-all duration-500">
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5cc8bd] mb-8">{t('contacts.documents_title')}</h4>
               <div className="space-y-4">
                  {[
                    { id: 'offer', name: t('contacts.doc_offer'), icon: <FileText className="w-4 h-4" /> },
                    { id: 'privacy', name: t('contacts.doc_privacy'), icon: <ShieldCheck className="w-4 h-4" /> },
                    { id: 'cookie', name: t('contacts.doc_cookie'), icon: <Cookie className="w-4 h-4" /> },
                    { id: 'returns', name: t('contacts.doc_returns'), icon: <Undo2 className="w-4 h-4" /> },
                  ].map((link) => (
                    <button
                      key={link.id}
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

            {/* Quick Support Card */}
            <div className="bg-[#5cc8bd]/10 border border-[#5cc8bd]/20 rounded-sm p-8 text-center space-y-6">
               <div className="w-16 h-16 bg-[#5cc8bd] text-black rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#5cc8bd]/20">
                  <Send className="w-8 h-8" />
               </div>
               <h4 className="font-montserrat font-bold text-lg uppercase tracking-tight">Need help?</h4>
               <p className="text-sm text-white/50 leading-relaxed font-medium">Our assistants are online 24/7 in Telegram.</p>
               <a 
                href={settings?.telegram_url || 'https://t.me/Taras_luka'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 border border-[#5cc8bd] text-[#5cc8bd] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#5cc8bd] hover:text-black transition-all"
               >
                 Start Chat
               </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ContactsPage;
