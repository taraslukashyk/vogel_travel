import { useState } from 'react';
import { Link } from 'react-router-dom';
import { offers } from '../data/offers';

// Use first 4 offers from the shared data source (same as /offers page)
const TOURS = offers.slice(0, 4);

const FeaturedTours = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-16 bg-transparent border-t border-white/5 relative z-10">
      <div className="max-w-[1440px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
          <div>
            <h2 className="text-white/90 font-serif italic text-4xl mb-2 sm:text-5xl">Ваша подорож</h2>
            <h1 className="text-white font-serif text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.15em]">
              На все життя
            </h1>
          </div>

          <div className="max-w-[500px] flex flex-col items-start lg:items-start lg:ml-auto">
            <p className="text-white/90 font-inter text-sm md:text-[15px] leading-relaxed mb-6 font-normal">
              Дозвольте нам запропонувати вам подорож на край світу. Відкрийте для себе неповторні курорти в найрідкісніших місцях світу — де захопливі враження та незаймана природна краса створюють міцні зв'язки.
            </p>
            <Link
              to="/offers"
              className="border border-white/40 text-white font-montserrat uppercase tracking-[0.15em] text-xs md:text-sm font-bold py-4 px-8 hover:bg-white hover:text-black transition-all duration-500 rounded-[2px] shadow-sm"
            >
              Ознайомитися з пропозиціями
            </Link>
          </div>
        </div>

        {/* Accordion Gallery Section */}
        <div className="flex flex-col lg:flex-row h-[70vh] min-h-[500px] max-h-[700px] gap-2 lg:gap-4 overflow-hidden">
          {TOURS.map((tour, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={tour.id}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex-shrink-0 group rounded-sm ${isActive
                  ? 'flex-[5] lg:flex-[8] min-h-[300px] lg:min-h-0'
                  : 'flex-1 min-h-[80px] lg:min-h-0 opacity-70 hover:opacity-100'
                  }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ backgroundImage: `url(${tour.image})`, transform: isActive ? 'scale(1)' : 'scale(1.15)' }}
                />

                {/* Overlay gradient */}
                <div
                  className={`absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? 'bg-gradient-to-t from-black/90 via-black/20 to-black/10' : 'bg-black/40 group-hover:bg-black/20'}`}
                />

                {/* Discount Badge */}
                {tour.discount && (
                  <div className="absolute top-4 right-4 bg-[#5cc8bd]/80 backdrop-blur-sm text-white font-montserrat font-bold text-sm px-3 py-1 rounded-sm shadow-lg tracking-wider z-10">
                    {tour.discount}
                  </div>
                )}

                {/* Content (visible when active) */}
                <div className={`absolute bottom-0 left-0 w-full p-8 md:p-10 transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform ${isActive ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                  <p className="text-white/60 font-montserrat text-xs uppercase tracking-widest mb-2">{tour.location}</p>
                  <h3 className="text-white font-serif italic text-3xl md:text-4xl mb-3 leading-tight">
                    {tour.hotel}
                  </h3>
                  <div className="flex items-center gap-4 text-white/70 text-sm font-inter">
                    <span>Бронюй до <strong className="text-white">{tour.bookBy}</strong></span>
                    <span className="w-px h-4 bg-white/20"></span>
                    <span>Живи з <strong className="text-white">{tour.stayFrom} — {tour.stayTo}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedTours;

