import { useRef } from 'react';
import { X, ArrowRight, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { offers } from '../data/offers';
import { Link } from 'react-router-dom';

interface OrderTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderTourModal = ({ isOpen, onClose }: OrderTourModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dark Overlay */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Modal Container: Full Width, 2/3 Height */}
      <div className={`relative w-full h-[90vh] md:h-[85vh] max-h-[900px] min-h-[500px] md:min-h-[600px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'}`}>

        {/* Modal Window Panel: Glassmorphism */}
        <div className="bg-black/90 md:bg-black/80 backdrop-blur-2xl border-y border-white/10 h-full w-full py-6 md:py-12 flex flex-col justify-center relative overflow-hidden">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 md:top-8 right-4 md:right-8 text-white/40 hover:text-white transition-colors p-2 z-20"
          >
            <X className="w-6 h-6 md:w-8 h-8" strokeWidth={1} />
          </button>

          <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full h-full flex flex-col overflow-y-auto custom-scrollbar pt-4 md:pt-0">
            <div className="mb-4 md:mb-8 text-center md:text-left flex-shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-montserrat font-extrabold text-white mb-1.5 md:mb-3 tracking-tight uppercase">
                  Актуальні пропозиції
                </h2>
                <div className="w-12 md:w-20 h-1 bg-[#5cc8bd] mb-1.5 mx-auto md:mx-0" />
                <p className="text-white/40 text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
                  Гортайте та обирайте свій напрямок
                </p>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center md:justify-end gap-3 mb-1">
                <button
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all active:scale-95 bg-white/5"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all active:scale-95 bg-white/5"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Offers Carousel */}
            <div 
              ref={scrollRef}
              className="flex gap-4 md:gap-6 mb-2 md:mb-4 flex-shrink-0 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-2 md:pb-4 cursor-grab active:cursor-grabbing touch-pan-x"
            >
              {offers.map((offer) => (
                <Link
                  key={offer.id}
                  to={`/offers/${offer.id}`}
                  onClick={onClose}
                  className="group relative min-w-[240px] md:min-w-[320px] h-[160px] md:h-[280px] overflow-hidden rounded-[2px] border border-white/10 hover:border-[#5cc8bd]/50 transition-all duration-500 bg-white/5 snap-start"
                >
                  <img
                    src={offer.image}
                    alt={offer.hotel}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <div className="text-[#5cc8bd] text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">
                      {offer.location}
                    </div>
                    <h3 className="text-white font-montserrat font-bold text-sm md:text-base mb-2 md:mb-3 leading-tight group-hover:text-[#5cc8bd] transition-colors">
                      {offer.hotel}
                    </h3>
                  </div>

                  {offer.discount && (
                    <div className="absolute top-3 left-3 bg-[#5cc8bd] text-black font-montserrat font-black text-[9px] md:text-xs px-2 py-1 rounded-sm">
                      {offer.discount}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Bottom Contact Section */}
            <div className="mt-auto border-t border-white/10 pt-2 md:pt-4 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 text-center md:text-left hidden lg:block">
                <h3 className="text-white font-montserrat font-bold text-lg uppercase tracking-widest mb-1">
                  Ваше побажання
                </h3>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.15em]">
                  Залиште контакти для консультації
                </p>
              </div>

              <form className="flex-grow flex flex-col lg:flex-row gap-3 md:gap-4 w-full items-end">
                {/* Contact Input */}
                <div className="w-full lg:flex-[1.5] bg-white/5 border border-white/10 rounded-[2px] p-3.5 md:p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors">
                  <label className="text-[8px] md:text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                    Контактні дані
                  </label>
                  <input
                    type="text"
                    placeholder="Номер, e-mail, або нікнейм у соцмережі"
                    className="w-full outline-none text-white font-inter font-semibold text-xs md:text-sm border-none p-0 bg-transparent placeholder-white/20"
                    required
                  />
                </div>

                {/* Comment Textarea */}
                <div className="w-full lg:flex-[2] bg-white/5 border border-white/10 rounded-[2px] p-3.5 md:p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors">
                  <label className="text-[8px] md:text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                    Коментар (де ви хочете відпочити?)
                  </label>
                  <input
                    type="text"
                    placeholder="Ваше повідомлення..."
                    className="w-full outline-none text-white font-inter font-semibold text-xs md:text-sm border-none p-0 bg-transparent placeholder-white/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-bold text-xs md:text-[12px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-8 py-4 lg:py-0 shadow-lg shrink-0 w-full lg:w-auto h-auto lg:h-[58px]"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span>Надіслати</span>
                    <Send className="w-4 h-4" />
                  </div>
                </button>
              </form>
            </div>

            <div className="mt-6 text-center md:text-right flex-shrink-0">
              <Link
                to="/offers"
                onClick={onClose}
                className="inline-flex items-center gap-4 text-white hover:text-[#5cc8bd] transition-colors text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] group"
              >
                Переглянути всі пропозиції
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default OrderTourModal;
