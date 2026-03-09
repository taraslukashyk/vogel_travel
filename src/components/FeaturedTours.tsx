import { useState } from 'react';

const TOURS = [
  {
    id: 1,
    location: "Кап-Кана, Домінікана",
    title: "Eden Roc Cap Cana",
    description: "Насолоджуйтеся бездоганним сервісом, власним басейном та кришталево чистим Карибським морем.",
    img: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    location: "Гуанакасте, Коста-Рика",
    title: "Резерв",
    description: "Відкрийте для себе неповторні курорти в екзотичних місцях – заповідниках, де захопливі враження та незаймана дика природа створюють міцні зв'язки.",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 3,
    location: "Рів'єра-Наяріт, Мексика",
    title: "Заповідник Наяріт",
    description: "Нове в портфоліо, заповідник Riviera Nayarit, пропонує приватний тихоокеанський курорт неперевершеного масштабу та усамітнення.",
    img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 4,
    location: "Баа Атол, Мальдіви",
    title: "Духовне усамітнення",
    description: "Надзвичайні вілли над водою та унікальний надводний сервіс на березі Індійського океану, створені для максимального комфорту.",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200"
  }
];

const FeaturedTours = () => {
  const [activeIndex, setActiveIndex] = useState(2); // За замовчуванням відкриваємо 3-й слайд як на скріншоті

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
            <button className="border border-white/40 text-white font-montserrat uppercase tracking-[0.15em] text-xs md:text-sm font-bold py-4 px-8 hover:bg-white hover:text-black transition-all duration-500 rounded-[2px] shadow-sm">
              Ознайомитися з пропозиціями
            </button>
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
                  style={{ backgroundImage: `url(${tour.img})`, transform: isActive ? 'scale(1)' : 'scale(1.15)' }}
                />

                {/* Overlay gradient (darker at bottom for active slide) */}
                <div
                  className={`absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? 'bg-gradient-to-t from-black/90 via-black/20 to-black/10' : 'bg-black/40 group-hover:bg-black/20'}`}
                />

                {/* Content */}
                <div className={`absolute bottom-0 left-0 w-full p-8 md:p-10 transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform ${isActive ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                  <h3 className="text-white font-serif italic text-4xl md:text-5xl mb-4 text-shadow-lg leading-tight">
                    {tour.location}
                  </h3>
                  <div className="max-w-[450px]">
                    <p className="text-white/95 font-inter text-[15px] leading-relaxed drop-shadow-md font-medium">
                      {tour.description}
                    </p>
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
