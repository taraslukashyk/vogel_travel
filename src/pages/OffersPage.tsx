import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CalendarClock, CalendarDays, MapPin, ChevronRight } from 'lucide-react';
import { useOffers } from '../lib/queries/offers';
import SEOHead from '../components/SEOHead';
import aboutPoster from '../assets/about-bg.png';
import OptimizedImage from '../components/OptimizedImage';
import { useLanguage } from '../hooks/useLanguage';
import { useLanguageContent } from '../hooks/useLanguageContent';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../lib/utils/dateUtils';
import OfferSearchPanel, { type FilterState, emptyFilter } from '../components/OfferSearchPanel';

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

/* ─── Helpers ─── */
function parseIsoDate(s: string): Date | null {
  if (!s) return null;
  // support formats: YYYY-MM-DD, MM/DD, DD/MM
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
  if (iso) return new Date(iso);
  return null;
}

function calcNights(offer: any): number {
  const from = new Date(offer.stayFrom || offer.stay_from || '');
  const to = new Date(offer.stayTo || offer.stay_to || '');
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function applyFilter(offers: any[], filter: FilterState, isUA: boolean): any[] {
  if (filter.mode === 'custom') return offers;

  return offers.filter(offer => {
    const offerCountry = isUA ? (offer.country || '') : (offer.country_en || offer.country || '');
    const offerCity = isUA ? (offer.city || '') : (offer.city_en || offer.city || '');

    if (filter.country) {
      if (!offerCountry.toLowerCase().includes(filter.country.toLowerCase())) return false;
    }
    if (filter.city) {
      if (!offerCity.toLowerCase().includes(filter.city.toLowerCase())) return false;
    }

    // Date filter: offer stay overlaps with selected departure range
    if (filter.dateFrom) {
      const offerFrom = parseIsoDate(offer.stayFrom || offer.stay_from || '');
      const offerTo = parseIsoDate(offer.stayTo || offer.stay_to || '');
      const selFrom = parseIsoDate(filter.dateFrom);
      const selTo = filter.dateTo ? parseIsoDate(filter.dateTo) : selFrom;
      if (offerFrom && offerTo && selFrom && selTo) {
        if (offerTo < selFrom || offerFrom > selTo) return false;
      }
    }

    // Nights filter (±2 tolerance)
    if (filter.nights !== '') {
      const nights = calcNights(offer);
      if (nights > 0 && Math.abs(nights - Number(filter.nights)) > 2) return false;
    }

    return true;
  });
}

/* ─── Single Offer Card ─── */
const OfferCard = ({ offer, idx }: { offer: any; idx: number }) => {
  const ref = useScrollReveal();
  const { l, currentLang } = useLanguage();
  const { t } = useLanguageContent();
  const { t: tr } = useTranslation();
  const isUA = currentLang === 'ua';

  const hotelName = t(offer, 'hotel');
  const locationName = t(offer, 'location');
  const bookBy = t(offer, 'book_by');
  const stayFrom = t(offer, 'stay_from');
  const stayTo = t(offer, 'stay_to');
  const discountVal = t(offer, 'discount');
  const slug = t(offer, 'slug');

  // Country, City tag
  const country = isUA ? offer.country : (offer.country_en || offer.country);
  const city = isUA ? offer.city : (offer.city_en || offer.city);
  const locationTag = (country && city) ? `${country}, ${city}` : (country || city || locationName);

  return (
    <div
      ref={ref}
      id={`offer-${slug}`}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out scroll-mt-32 h-full"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      <Link to={l(`/offers/${slug}`)} className="block h-full group">
        <article className="bg-[#0b1a15]/40 backdrop-blur-md border border-[#5cc8bd]/10 rounded-none overflow-hidden hover:bg-[#0b1a15]/60 md:hover:-translate-y-2 transition-all duration-700 flex flex-col h-full group/card shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
          {/* Image */}
          <div className="relative h-60 overflow-hidden">
            <OptimizedImage
              src={offer.image}
              alt={t(offer, 'image_alt') || hotelName}
              className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-all duration-1000 group-hover/card:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a15] via-[#0b1a15]/20 to-transparent" />

            {/* Discount badge */}
            {discountVal && (
              <div className="absolute top-5 right-5 bg-[#5cc8bd] text-black font-montserrat font-black text-[13px] px-5 py-2 rounded-none shadow-[0_10px_20px_rgba(92,200,189,0.3)] tracking-wider">
                {discountVal}
              </div>
            )}

            {/* Location tag */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 text-[#5cc8bd] text-[10px] font-montserrat font-black uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-none border border-white/5">
              <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
              {locationTag}
            </div>
          </div>

          {/* Card body */}
          <div className="flex-1 p-8 flex flex-col gap-6">
            <h2 className="font-montserrat font-black text-xl text-white leading-tight group-hover/card:text-[#5cc8bd] transition-colors duration-500 tracking-tight">
              {hotelName}
            </h2>

            <div className="space-y-0 mt-auto border-t border-[#5cc8bd]/10 pt-6 divide-y divide-[#5cc8bd]/5">
              <div className="flex items-center gap-4 text-white/60 py-4 group/item">
                <div className="w-10 h-10 rounded-none bg-[#5cc8bd]/5 flex items-center justify-center text-[#5cc8bd] group-hover/item:bg-[#5cc8bd] group-hover/item:text-black transition-all duration-300">
                  <CalendarClock className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5 leading-tight">
                  <span className="font-inter text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
                    {tr('offers.book_by')}
                  </span>
                  <strong className="text-white/90 font-bold text-[15px] font-montserrat">
                    {formatDate(bookBy)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/60 py-4 group/item">
                <div className="w-10 h-10 rounded-none bg-[#5cc8bd]/5 flex items-center justify-center text-[#5cc8bd] group-hover/item:bg-[#5cc8bd] group-hover/item:text-black transition-all duration-300">
                  <CalendarDays className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5 leading-tight">
                  <span className="font-inter text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
                    {tr('offers.stay_period')}
                  </span>
                  <strong className="text-white/90 font-bold text-[15px] font-montserrat tracking-tight">
                    {formatDate(stayFrom)} — {formatDate(stayTo)}
                  </strong>
                </div>
              </div>

              {discountVal && (
                <div className="flex items-center justify-between py-4">
                  <span className="font-inter text-[14px] text-white/30 font-bold uppercase tracking-widest">{tr('common.discount')}</span>
                  <span className="font-montserrat font-black text-[#5cc8bd] text-2xl tracking-tight">
                    {discountVal}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 w-full bg-[#5cc8bd] text-black font-montserrat uppercase tracking-[0.2em] text-[11px] font-black py-4 hover:bg-white transition-all duration-500 rounded-none text-center flex items-center justify-center gap-3 group/btn">
              <span>{tr('common.details')}</span>
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
  const [filter, setFilter] = useState<FilterState>(emptyFilter());
  const location = useLocation();
  const { currentLang } = useLanguage();
  const { t: tr } = useTranslation();
  const isUA = currentLang === 'ua';

  const filteredOffers = applyFilter(offers, filter, isUA);

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

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-32 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              {tr('nav.offers')}
            </span>
          </h1>

          <div className={`absolute bottom-10 right-10 flex flex-col items-center gap-2 transition-opacity duration-[2000ms] ease-in-out ${showScrollIndicator ? 'opacity-100 animate-pulse' : 'opacity-0 pointer-events-none'}`}>
            <span className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">{currentLang === 'ua' ? 'Гортай' : 'Scroll'}</span>
            <div className="scroll-indicator"></div>
          </div>
        </div>
      </section>


      {/* ── Search / Filter Panel ── */}
      <div className="relative z-20 -mt-12 md:-mt-24">
        <OfferSearchPanel filter={filter} onChange={setFilter} />
      </div>

      {/* ── Offer cards grid ── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24">
        {filteredOffers.length === 0 && filter.mode === 'search' ? (
          <div className="text-center py-20">
            <p className="font-montserrat font-bold text-white/40 text-xl uppercase tracking-widest">
              {isUA ? 'Не знайдено пропозицій за заданими критеріями' : 'No offers match your criteria'}
            </p>
            <button
              onClick={() => setFilter(emptyFilter())}
              className="mt-6 text-[#5cc8bd] text-sm font-inter underline hover:no-underline"
            >
              {isUA ? 'Скинути фільтр' : 'Reset filter'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredOffers.map((offer: any, idx: number) => (
              <OfferCard key={offer.id} offer={offer} idx={idx} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default OffersPage;
