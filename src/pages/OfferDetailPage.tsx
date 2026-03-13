import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CalendarClock, CalendarDays, ArrowLeft, ArrowRight, Share2, Tag, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { offers } from '../data/offers';

const OfferDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const offer = offers.find(o => o.id === Number(id));

  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');

  if (!offer) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4 italic font-serif">Пропозицію не знайдено</h2>
          <Link to="/offers" className="text-[#5cc8bd] hover:underline font-medium uppercase tracking-widest text-sm font-montserrat">
            Повернутися до списку пропозицій
          </Link>
        </div>
      </div>
    );
  }

  const openLightbox = (url: string) => {
    setLightboxImg(url);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offer.hotel,
          text: offer.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Посилання скопійовано в буфер обміну!');
    }
  };

  const textSections = offer.sections?.filter(s => s.type !== 'image') || [];
  const imageSections = offer.sections?.filter(s => s.type === 'image') || [];

  const nextImg = () => setCurrentImg(prev => (prev + 1) % imageSections.length);
  const prevImg = () => setCurrentImg(prev => (prev - 1 + imageSections.length) % imageSections.length);

  return (
    <main className="w-full bg-white selection:bg-[#5cc8bd]/30 min-h-screen">

      {/* ── Top Section: Split-Screen Header (Image 3/5, Content 2/5) ── */}
      <section className="relative lg:h-screen flex flex-col lg:flex-row lg:overflow-hidden bg-zinc-950">

        {/* Left Side: Hero Image (3/5, Edge-to-Edge) */}
        <div
          className="w-full lg:w-[60%] relative z-20 h-48 lg:h-auto overflow-hidden cursor-zoom-in group"
          onClick={() => openLightbox(offer.image)}
        >
          <img
            src={offer.image}
            alt={offer.hotel}
            className="w-full h-full object-cover saturate-[1.15] transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-y-0 right-0 w-px bg-white/10 hidden lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em] font-montserrat">Натисніть для перегляду</span>
          </div>
        </div>

        {/* Right Side: Frosted Content Area (2/5) */}
        <div className="w-full lg:w-[40%] relative z-10 flex flex-col justify-center">
          {/* Background Blurred Effect (Lightened "Matte Field") */}
          <div className="absolute inset-0 z-0">
            <img
              src={offer.image}
              className="w-full h-full object-cover opacity-40 saturate-[1.3] blur-[12px] scale-110"
              alt=""
            />
            <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[12px]" />
            <div className="absolute inset-0 bg-gradient-to-l from-zinc-950/30 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 px-6 md:px-12 lg:px-16 py-12 lg:py-24 w-full">
            {/* Back button */}
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 text-white/50 hover:text-[#5cc8bd] transition-all text-xs font-bold uppercase tracking-[0.3em] mb-10 group font-montserrat"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Всі пропозиції
            </Link>

            <div className="flex flex-col text-white">
              <div className="flex items-center gap-3 text-[#5cc8bd] text-[13px] font-black uppercase tracking-[0.4em] mb-6 font-montserrat">
                <Tag className="w-4 h-4" />
                <span>{offer.location}</span>
              </div>

              <h1 className="font-serif italic text-3xl md:text-4xl lg:text-5xl leading-[1.2] mb-10 text-white drop-shadow-sm">
                {offer.hotel}
              </h1>

              <p className="hidden lg:block text-white/80 text-lg leading-relaxed mb-12 font-inter font-light border-l-2 border-[#5cc8bd]/40 pl-8">
                {offer.description}
              </p>

              {/* Data Grid with Accents */}
              <div className="grid grid-cols-1 gap-4 mb-10 font-montserrat">
                <div className="bg-white/5 backdrop-blur-xl rounded-sm border border-white/10 p-5 flex items-center gap-5 group hover:bg-white/10 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] border border-[#5cc8bd]/20">
                    <CalendarClock className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#5cc8bd] font-black mb-0.5">Бронюй до</span>
                    <span className="text-base font-bold tracking-wide">{offer.bookBy}</span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-sm border border-white/10 p-5 flex items-center gap-5 group hover:bg-white/10 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#5cc8bd]/10 flex items-center justify-center text-[#5cc8bd] border border-[#5cc8bd]/20">
                    <CalendarDays className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#5cc8bd] font-black mb-0.5">Проживання</span>
                    <span className="text-base font-bold tracking-wide whitespace-nowrap">{offer.stayFrom} — {offer.stayTo}</span>
                  </div>
                </div>
              </div>

              {offer.discount && (
                <div className="flex items-center gap-4 mb-12">
                  <div className="bg-[#5cc8bd] text-white font-montserrat font-black text-2xl px-8 py-2 rounded-sm shadow-2xl">
                    {offer.discount}
                  </div>
                  <span className="text-white/40 font-montserrat text-[10px] font-black uppercase tracking-[0.3em]">
                    Ексклюзивна пропозиція
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-row gap-3 font-montserrat">
                <button className="flex-1 py-4 lg:py-5 px-4 lg:px-8 bg-white text-black font-black uppercase tracking-normal text-[14px] lg:text-[20px] hover:bg-[#5cc8bd] hover:text-white transition-all duration-500 flex items-center justify-center gap-2 lg:gap-3">
                  <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
                  <span>Замовити у менеджера</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-14 lg:w-16 h-14 lg:h-16 shrink-0 flex items-center justify-center border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/20 transition-all backdrop-blur-md rounded-sm group"
                >
                  <Share2 className="w-5 h-5 transition-transform group-hover:rotate-12" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Text Details Section ── */}
      <section className="relative py-24 px-6 md:px-8 bg-zinc-200/50 border-b border-zinc-200/50">
        <div className="max-w-4xl mx-auto">
          {textSections.map((section, index) => (
            <div key={index} className="mb-20 last:mb-0">
              {section.title && (
                <h2 className="font-serif italic text-3xl md:text-4xl text-gray-900 mt-16 mb-8 uppercase tracking-tight">
                  {section.title}
                </h2>
              )}
              {section.type === 'text' && (
                <p className="font-inter text-xl text-gray-700 leading-relaxed font-light italic">
                  {section.content as string}
                </p>
              )}
              {section.type === 'list' && (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                  {(section.content as string[]).map((item, i) => (
                    <li key={i} className="flex gap-5 p-8 bg-white rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 group hover:border-[#5cc8bd]/40 transition-all duration-300">
                      <CheckCircle2 className="w-6 h-6 text-[#5cc8bd] shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="font-inter text-gray-700 leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Images Carousel Section ── */}
      {imageSections.length > 0 && (
        <section className="relative py-20 overflow-hidden bg-zinc-950">
          {/* Background Blurred Effect (Matching Header Matte Field) */}
          <div className="absolute inset-0 z-0 opacity-60">
            <img
              src={offer.image}
              className="w-full h-full object-cover opacity-20 saturate-[1.2] blur-[20px] scale-110"
              alt=""
            />
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[20px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-10 flex items-end justify-between">
            <h2 className="font-serif italic text-4xl md:text-5xl text-white">
              Галерея <br />
              <span className="text-white/30 not-italic font-montserrat uppercase text-sm font-black tracking-[0.4em]">Resort View</span>
            </h2>

            <div className="flex items-center gap-4">
              <button
                onClick={prevImg}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#5cc8bd] hover:text-[#5cc8bd] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImg}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#5cc8bd] hover:text-[#5cc8bd] transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative h-[600px] w-full flex items-center justify-center px-4">
            <div className="relative w-full max-w-5xl h-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden border border-white/5">
              {imageSections.map((section, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-zoom-in group ${idx === currentImg ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                  onClick={() => openLightbox(section.image || '')}
                >
                  <img
                    src={section.image}
                    alt={section.content as string}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 max-w-2xl">
                    <p className="text-white/40 font-montserrat text-[10px] font-black uppercase tracking-[0.3em] mb-4">Деталі курорту — Натисніть для перегляду</p>
                    <p className="text-white text-2xl font-serif italic leading-relaxed">
                      {section.content as string}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {imageSections.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`transition-all duration-500 h-1.5 rounded-full ${i === currentImg ? 'w-12 bg-[#5cc8bd]' : 'w-2 bg-white/10 hover:bg-white/20'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-10 h-10" />
          </button>
          <img
            src={lightboxImg}
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-500"
            alt="Fullscreen view"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Fallback for offers without content */}
      {!offer.sections && (
        <section className="py-32 px-6 bg-zinc-200/50">
          <div className="max-w-2xl mx-auto py-20 px-12 bg-white border border-gray-100 rounded-sm text-center shadow-xl">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Tag className="w-10 h-10 text-gray-200" strokeWidth={1} />
            </div>
            <p className="font-montserrat text-gray-400 text-lg uppercase tracking-widest font-bold mb-4">Контент готується</p>
            <p className="font-inter text-gray-500 font-light leading-relaxed">
              Наші спеціалісти збирають найсвіжішу інформацію про цей курорт.
              Будь ласка, зверніться до менеджера для презентації.
            </p>
          </div>
        </section>
      )}

    </main>
  );
};

// ... X icon used in lightbox should be imported from lucide-react if not already ...


export default OfferDetailPage;
