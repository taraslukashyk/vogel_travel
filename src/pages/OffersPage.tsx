import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CalendarClock, CalendarDays, Tag } from 'lucide-react';
import { offers } from '../data/offers';

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
const OfferCard = ({ offer, idx }: { offer: typeof offers[0]; idx: number }) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      id={`offer-${offer.id}`}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out scroll-mt-32"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      <article className="group bg-black/40 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden hover:bg-black/60 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={offer.image}
            alt={offer.hotel}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Discount badge — glassmorphism */}
          {offer.discount && (
            <div className="absolute top-4 right-4 bg-[#5cc8bd]/80 backdrop-blur-sm text-white font-montserrat font-bold text-base px-4 py-1.5 rounded-sm shadow-lg tracking-wider">
              {offer.discount}
            </div>
          )}

          {/* Location tag at bottom of image */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/70 text-xs font-montserrat uppercase tracking-widest">
            <Tag className="w-3 h-3" strokeWidth={1.5} />
            {offer.location}
          </div>
        </div>

        {/* Card body */}
        <div className="flex-1 p-7 flex flex-col gap-5">
          {/* Hotel name */}
          <h2 className="font-montserrat font-bold text-xl text-white leading-snug group-hover:text-[#5cc8bd] transition-colors duration-300 tracking-tight">
            {offer.hotel}
          </h2>

          {/* Details */}
          <div className="space-y-0 mt-auto border-t border-white/10 pt-5 divide-y divide-white/10">
            {/* Book by */}
            <div className="flex items-center gap-3 text-white/60 py-3">
              <CalendarClock className="w-4 h-4 text-[#5cc8bd]/70 shrink-0" strokeWidth={1.5} />
              <span className="font-inter text-[14px] font-light">
                Бронюй до <strong className="text-white/90 font-medium">{offer.bookBy}</strong>
              </span>
            </div>

            {/* Stay period */}
            <div className="flex items-center gap-3 text-white/60 py-3">
              <CalendarDays className="w-4 h-4 text-[#5cc8bd]/70 shrink-0" strokeWidth={1.5} />
              <span className="font-inter text-[14px] font-light">
                Період проживання з{' '}
                <strong className="text-white/90 font-medium">
                  {offer.stayFrom} — {offer.stayTo}
                </strong>
              </span>
            </div>

            {/* Discount row */}
            {offer.discount && (
              <div className="flex items-center justify-between py-3">
                <span className="font-inter text-[14px] text-white/50 font-light">Знижка</span>
                <span className="font-montserrat font-bold text-[#5cc8bd] text-lg tracking-wider">
                  {offer.discount}
                </span>
              </div>
            )}
          </div>

          {/* CTA button */}
          <Link 
            to={`/offers/${offer.id}`}
            className="mt-1 w-full border border-white/20 text-white/80 font-montserrat uppercase tracking-[0.15em] text-xs font-bold py-3 hover:bg-white hover:text-black transition-all duration-500 rounded-sm text-center block"
          >
            Дізнатися більше
          </Link>
        </div>
      </article>
    </div>
  );
};

/* ─── Page Component ─── */
const OffersPage = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const location = useLocation();

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

      {/* Background video (matched with About page) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          src="about-video.mp4"
          autoPlay muted loop playsInline
        />
        {/* Light gradient overlay to brighten the video edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
      </div>

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1920"
          alt="Offers hero"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              Пропозиції
            </span>
          </h1>

          {/* Scroll Indicator with smooth fade out */}
          <div className={`absolute bottom-10 right-10 flex flex-col items-center gap-2 transition-opacity duration-[2000ms] ease-in-out ${showScrollIndicator ? 'opacity-100 animate-pulse' : 'opacity-0 pointer-events-none'}`}>
            <span className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Гортай</span>
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
              Актуальні знижки
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              Ексклюзивні пропозиції від наших партнерів — перевірених готелів преміального рівня по
              всьому світу. Бронюйте завчасно та отримуйте найкращі умови.
            </p>
          </div>
          <div>
            <p className="font-inter text-white/50 text-base leading-relaxed border-l border-white/10 pl-8">
              Кожна пропозиція перевірена нашими менеджерами особисто. Ми гарантуємо відповідність
              заявленого рівня сервісу та захист інтересів клієнта на кожному етапі бронювання.
            </p>
          </div>
        </div>
      </section>

      {/* ── Offer cards grid ── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {offers.map((offer, idx) => (
            <OfferCard key={offer.id} offer={offer} idx={idx} />
          ))}
        </div>
      </section>

    </main>
  );
};

export default OffersPage;
