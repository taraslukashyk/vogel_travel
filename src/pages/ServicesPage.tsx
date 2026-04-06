import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Building2, Compass, PhoneCall, Users, Gem, ArrowRight, CreditCard } from 'lucide-react';
import { useServices } from '../lib/queries/services';
import SEOHead from '../components/SEOHead';
import aboutPoster from '../assets/about-bg.webp';
import OptimizedImage from '../components/OptimizedImage';
import PaymentModal from '../components/PaymentModal';
import { useLanguage } from '../hooks/useLanguage';
import { useLanguageContent } from '../hooks/useLanguageContent';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../lib/utils/formatPrice';

const icons: Record<string, React.ReactNode> = {
  '01': <Building2 className="w-8 h-8" strokeWidth={1} />,
  '02': <Compass className="w-8 h-8" strokeWidth={1} />,
  '03': <PhoneCall className="w-8 h-8" strokeWidth={1} />,
  '04': <Users className="w-8 h-8" strokeWidth={1} />,
  '05': <Gem className="w-8 h-8" strokeWidth={1} />,
};

/* ─── Scroll-reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-10');
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Single Service Block ─── */
const ServiceBlock = ({ service, idx, onPay }: { service: any; idx: number; onPay: (s: any) => void }) => {
  const ref = useScrollReveal();
  const isReversed = idx % 2 !== 0;
  const { l } = useLanguage();
  const { t } = useLanguageContent();
  const { t: tr } = useTranslation();

  const title = t(service, 'title');
  const description = t(service, 'description');
  const items = t(service, 'items') || [];
  const slug = t(service, 'slug');

  return (
    <div
      ref={ref}
      id={`service-${slug}`}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out scroll-mt-32"
      style={{ transitionDelay: `${idx * 80}ms` }}
    >
      <Link to={l(`/services/${slug}`)} className="block">
        <article
          className={`group flex flex-col ${
            isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
          } bg-black/40 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden hover:bg-black/60 hover:-translate-y-1 transition-all duration-500 cursor-pointer`}
        >
          {/* Image */}
          <div className="md:w-[45%] h-64 md:h-auto min-h-[300px] overflow-hidden relative">
            <span className="absolute top-4 left-5 font-montserrat text-8xl font-extrabold text-white/10 select-none z-10 leading-none">
              {service.num}
            </span>
            <OptimizedImage
              src={service.image}
              alt={service.image_alt || title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Text */}
          <div className="flex-1 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
            <h2 className="font-montserrat font-bold text-2xl lg:text-[26px] text-white leading-tight tracking-tight mb-5 group-hover:text-[#5cc8bd] transition-colors duration-300 flex items-center gap-4">
              <span className="shrink-0 text-white/80 group-hover:text-[#5cc8bd] transition-colors duration-300">
                {service.icon}
              </span>
              {title}
            </h2>

            {description && (
              <p className="font-inter text-white/60 text-[15px] leading-relaxed">
                {description}
              </p>
            )}

            {items.length > 0 && (
              <ul className="space-y-4 mt-1">
                {items.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-[7px] w-4 h-px bg-[#5cc8bd]/60 shrink-0" />
                    <p className="font-inter text-[15px] text-white/60 leading-relaxed">
                      <strong className="text-white/90 font-medium">{item.label}:</strong> {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex items-center gap-4 text-[#5cc8bd] text-xs font-bold uppercase tracking-[0.3em] font-montserrat transition-all duration-300">
              {service.is_for_payment ? (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPay(service);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5cc8bd] text-black rounded-sm shadow-lg shadow-[#5cc8bd]/20 hover:bg-white transition-all duration-300 font-black"
                  >
                    <CreditCard size={14} strokeWidth={2.5} />
                    <span>{tr('common.pay')}</span>
                  </button>
                  {service.price && (
                    <span className="text-white text-xl font-black tracking-normal italic font-serif">
                      {formatPrice(service.price)} {tr('common.currency')}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{tr('common.details')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

/* ─── Page Component ─── */
const ServicesPage = () => {
  const { data: servicesData = [] } = useServices();
  const services = servicesData.map(s => ({ ...s, icon: icons[s.num] }));
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const location = useLocation();
  const { currentLang } = useLanguage();
  const { t: tr } = useTranslation();
  const { t } = useLanguageContent();

  const handlePay = (service: any) => {
    setSelectedService(service);
    setIsPaymentModalOpen(true);
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicator(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const introRef = useScrollReveal();

  return (
    <main className="w-full bg-zinc-950/95 text-white selection:bg-[#5cc8bd]/30 min-h-screen overflow-hidden relative">
      <SEOHead 
        pagePath={`/${currentLang}/services`} 
        fallbackTitle={tr('nav.services') + " — Vogel Family Travel"} 
        fallbackDescription={tr('services.subtitle')} 
      />

      {/* Background video (matched with About page) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          poster={aboutPoster}
          autoPlay muted loop playsInline
          preload="metadata"
        >
          <source src="/about-video.webm" type="video/webm" />
        </video>
        {/* Light gradient overlay to brighten the video edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
      </div>

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1920"
          alt="Services hero"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              {tr('nav.services')}
            </span>
          </h1>

          {/* Scroll Indicator with smooth fade out */}
          <div className={`absolute bottom-10 right-10 flex flex-col items-center gap-2 transition-opacity duration-[2000ms] ease-in-out ${showScrollIndicator ? 'opacity-100 animate-pulse' : 'opacity-0 pointer-events-none'}`}>
            <span className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">{currentLang === 'ua' ? 'Гортай' : 'Scroll'}</span>
            <div className="scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* ── Intro / description card (Non-transparent) ── */}
      <section className="relative z-10 bg-zinc-950 border-y border-white/5 py-14">
        <div
          ref={introRef}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-white/30" />
              {currentLang === 'ua' ? 'Гнучкий формат' : 'Flexible Format'}
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              {currentLang === 'ua' 
                ? "Ми працюємо як з повними подорожами «під ключ», так і з окремими запитами — бронювання готелів, авіаперельотів, трансферів, екскурсій чи оренди вілл."
                : "We work both with complete turnkey trips and individual requests — booking hotels, flights, transfers, excursions, or villa rentals."}
            </p>
          </div>
          <div>
            <p className="font-inter text-white/50 text-base leading-relaxed border-l border-white/10 pl-8">
              {currentLang === 'ua'
                ? "Ви обираєте рівень залученості — ми забезпечуємо результат і контроль над кожним етапом. Кожен клієнт отримує персонального менеджера, який веде весь маршрут від першого запиту до повернення додому."
                : "You choose the level of involvement — we provide the result and control over every stage. Each client gets a personal manager who handles the entire route from the first request to returning home."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Service blocks ── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col gap-6">
          {services.map((service, idx) => (
            <ServiceBlock 
              key={service.id} 
              service={service} 
              idx={idx} 
              onPay={handlePay}
            />
          ))}
        </div>
      </section>

      {selectedService && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          serviceTitle={t(selectedService, 'title')}
          price={selectedService.price}
          serviceSlug={selectedService.slug}
        />
      )}

    </main>
  );
};

export default ServicesPage;
