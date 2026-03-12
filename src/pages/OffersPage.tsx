import { useEffect, useRef } from 'react';
import { CalendarClock, CalendarDays, Tag } from 'lucide-react';

/* ─── Mock offer data (ready for future dynamic loading from admin DB) ─── */
const offers = [
  {
    id: 1,
    location: 'Мальдіви',
    hotel: 'Dusit Thani Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
    bookBy: '12/04',
    stayFrom: '05/05',
    stayTo: '30/09',
    discount: '-60%',
  },
  {
    id: 2,
    location: 'Греція, Санторіні',
    hotel: 'Canaves Oia Suites',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800',
    bookBy: '20/04',
    stayFrom: '01/06',
    stayTo: '15/10',
    discount: '-45%',
  },
  {
    id: 3,
    location: 'ОАЕ, Дубай',
    hotel: 'Atlantis The Royal',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    bookBy: '05/05',
    stayFrom: '10/06',
    stayTo: '31/08',
    discount: '-35%',
  },
  {
    id: 4,
    location: 'Індонезія, Балі',
    hotel: 'Four Seasons Resort Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    bookBy: '15/04',
    stayFrom: '01/05',
    stayTo: '30/07',
    discount: '-50%',
  },
  {
    id: 5,
    location: 'Сейшельські Острови',
    hotel: 'Four Seasons Seychelles',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800',
    bookBy: '25/04',
    stayFrom: '15/06',
    stayTo: '20/09',
    discount: '-40%',
  },
  {
    id: 6,
    location: 'Швейцарія, Альпи',
    hotel: 'The Chedi Andermatt',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    bookBy: '30/04',
    stayFrom: '01/12',
    stayTo: '15/03',
    discount: '-30%',
  },
];

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
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      <article className="group bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={offer.image}
            alt={offer.hotel}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Discount badge — glassmorphism */}
          <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm text-white font-montserrat font-bold text-base px-4 py-1.5 rounded-sm shadow-lg tracking-wider">
            {offer.discount}
          </div>

          {/* Location tag at bottom of image */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/70 text-xs font-montserrat uppercase tracking-widest">
            <Tag className="w-3 h-3" strokeWidth={1.5} />
            {offer.location}
          </div>
        </div>

        {/* Card body */}
        <div className="flex-1 p-7 flex flex-col gap-5">
          {/* Hotel name */}
          <h2 className="font-montserrat font-bold text-xl text-white leading-snug group-hover:text-primary transition-colors duration-300 tracking-tight">
            {offer.hotel}
          </h2>

          {/* Details */}
          <div className="space-y-0 mt-auto border-t border-white/10 pt-5 divide-y divide-white/10">
            {/* Book by */}
            <div className="flex items-center gap-3 text-white/60 py-3">
              <CalendarClock className="w-4 h-4 text-primary/70 shrink-0" strokeWidth={1.5} />
              <span className="font-inter text-[14px] font-light">
                Бронюй до <strong className="text-white/90 font-medium">{offer.bookBy}</strong>
              </span>
            </div>

            {/* Stay period */}
            <div className="flex items-center gap-3 text-white/60 py-3">
              <CalendarDays className="w-4 h-4 text-primary/70 shrink-0" strokeWidth={1.5} />
              <span className="font-inter text-[14px] font-light">
                Живи з{' '}
                <strong className="text-white/90 font-medium">
                  {offer.stayFrom} — {offer.stayTo}
                </strong>
              </span>
            </div>

            {/* Discount row */}
            <div className="flex items-center justify-between py-3">
              <span className="font-inter text-[14px] text-white/50 font-light">Знижка</span>
              <span className="font-montserrat font-bold text-primary text-lg tracking-wider">
                {offer.discount}
              </span>
            </div>
          </div>

          {/* CTA button */}
          <button className="mt-1 w-full border border-white/20 text-white/80 font-montserrat uppercase tracking-[0.15em] text-xs font-bold py-3 hover:bg-white hover:text-black transition-all duration-500 rounded-sm">
            Дізнатися більше
          </button>
        </div>
      </article>
    </div>
  );
};

/* ─── Page Component ─── */
const OffersPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const introRef = useScrollReveal();

  return (
    <main className="w-full bg-zinc-950/95 text-white selection:bg-primary/30 min-h-screen overflow-hidden relative">

      {/* Background video */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-15"
          src="about-video.mp4"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1920"
          alt="Offers hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              Пропозиції
            </span>
          </h1>
        </div>
      </section>

      {/* ── Intro / description card ── */}
      <section className="relative z-10 bg-white/5 backdrop-blur-xl border-y border-white/10 py-14">
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
