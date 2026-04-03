import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CalendarClock, CalendarDays, Tag } from 'lucide-react';
import { useOffers } from '../lib/queries/offers';
import SEOHead from '../components/SEOHead';
import aboutPoster from '../assets/about-bg.png';
import OptimizedImage from '../components/OptimizedImage';
import { useLanguage } from '../hooks/useLanguage';
import { useLanguageContent } from '../hooks/useLanguageContent';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../lib/utils/dateUtils';

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

/* ─── Single Offer Card ─── */
const OfferCard = ({ offer, idx }: { offer: any; idx: number }) => {
  const ref = useScrollReveal();
  const { l } = useLanguage();
  const { t } = useLanguageContent();
  const { t: tr } = useTranslation();

  const hotelName = t(offer, 'hotel');
  const locationName = t(offer, 'location');
  const bookBy = t(offer, 'book_by');
  const stayFrom = t(offer, 'stay_from');
  const stayTo = t(offer, 'stay_to');
  const discountVal = t(offer, 'discount');
  const slug = t(offer, 'slug');

  return (
    <div
      ref={ref}
      id={`offer-${slug}`}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out scroll-mt-32 h-full"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      <Link to={l(`/offers/${slug}`)} className="block h-full group">
        <article className="bg-black/40 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden hover:bg-black/60 md:hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <OptimizedImage
              src={offer.image}
              alt={t(offer, 'image_alt') || hotelName}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Discount badge — glassmorphism */}
            {discountVal && (
              <div className="absolute top-4 right-4 bg-[#5cc8bd]/80 backdrop-blur-sm text-white font-montserrat font-bold text-base px-4 py-1.5 rounded-sm shadow-lg tracking-wider">
                {discountVal}
              </div>
            )}

            {/* Location tag at bottom of image */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/70 text-xs font-montserrat uppercase tracking-widest">
              <Tag className="w-3 h-3" strokeWidth={1.5} />
              {locationName}
            </div>
          </div>

          {/* Card body */}
          <div className="flex-1 p-7 flex flex-col gap-5">
            {/* Hotel name */}
            <h2 className="font-montserrat font-bold text-xl text-white leading-snug group-hover:text-[#5cc8bd] transition-colors duration-300 tracking-tight">
              {hotelName}
            </h2>

            {/* Details */}
            <div className="space-y-0 mt-auto border-t border-white/10 pt-5 divide-y divide-white/10">
              {/* Book by */}
              <div className="flex items-center gap-3 text-white/60 py-4">
                <CalendarClock className="w-4 h-4 text-[#5cc8bd]/70 shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col gap-0.5 leading-tight">
                  <span className="font-inter text-[11px] font-medium uppercase tracking-[0.05em] text-white/40">
                    {tr('offers.book_by')}
                  </span>
                  <strong className="text-white/90 font-bold text-[15px] font-montserrat">
                    {formatDate(bookBy)}
                  </strong>
                </div>
              </div>

              {/* Stay period */}
              <div className="flex items-center gap-3 text-white/60 py-4">
                <CalendarDays className="w-4 h-4 text-[#5cc8bd]/70 shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col gap-0.5 leading-tight">
                  <span className="font-inter text-[11px] font-medium uppercase tracking-[0.05em] text-white/40">
                    {tr('offers.stay_period')}
                  </span>
                  <strong className="text-white/90 font-bold text-[15px] font-montserrat">
                    {formatDate(stayFrom)} — {formatDate(stayTo)}
                  </strong>
                </div>
              </div>

              {/* Discount row */}
              {discountVal && (
                <div className="flex items-center justify-between py-3">
                  <span className="font-inter text-[14px] text-white/50 font-light">{tr('common.discount')}</span>
                  <span className="font-montserrat font-bold text-[#5cc8bd] text-lg tracking-wider">
                    {discountVal}
                  </span>
                </div>
              )}
            </div>

            {/* CTA row (visual button) */}
            <div className="mt-1 w-full border border-white/20 text-white/80 font-montserrat uppercase tracking-[0.15em] text-xs font-bold py-3 group-hover:bg-white group-hover:text-black transition-all duration-500 rounded-sm text-center block">
              {tr('common.details')}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

/* ─── Page Component ─── */
const OffersPage = () => {
  const { data: offers = [] } = useOffers();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const location = useLocation();
  const { currentLang } = useLanguage();
  const { t: tr } = useTranslation();

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
        pagePath={`/${currentLang}/offers`} 
        fallbackTitle={tr('nav.offers') + " — Vogel Family Travel"} 
        fallbackDescription={tr('offers.subtitle')} 
      />

      {/* Background video */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          poster={aboutPoster}
          autoPlay muted loop playsInline
          preload="metadata"
        >
          <source src="/about-video.mp4" type="video/mp4" />
        </video>
        {/* Light gradient overlay to brighten the video edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
      </div>

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1920"
          alt="Offers hero"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              {tr('nav.offers')}
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
              {tr('offers.title')}
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              {tr('offers.subtitle')}
            </p>
          </div>
          <div>
            <p className="font-inter text-white/50 text-base leading-relaxed border-l border-white/10 pl-8">
              {currentLang === 'ua' 
                ? "Кожна пропозиція перевірена нашими менеджерами особисто. Ми гарантуємо відповідність заявленого рівня сервісу та захист інтересів клієнта на кожному етапі бронювання."
                : "Each offer is personally verified by our managers. We guarantee compliance with the stated level of service and protection of client interests at every stage of booking."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Offer cards grid ── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {offers.map((offer: any, idx: number) => (
            <OfferCard key={offer.id} offer={offer} idx={idx} />
          ))}
        </div>
      </section>

    </main>
  );
};

export default OffersPage;
