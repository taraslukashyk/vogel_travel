import { useEffect, useState, useRef } from 'react';
import PartnershipMap from '../components/PartnershipMap';
import FinalQuote from '../components/FinalQuote';
import ScrollTrigger from 'gsap/ScrollTrigger';

const PartnershipPage = () => {
  const [showBottom, setShowBottom] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScrollDown = () => {
    setShowBottom(true);
    // Allow React to mount the DOM node, then refresh ScrollTrigger and scroll down
    setTimeout(() => {
      ScrollTrigger.refresh();
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="w-full bg-black min-h-screen text-white pt-[76px] xl:pt-[85px]">
      {/* ── Text Banner (Hero Section) ── */}
      <section className="relative z-20 w-full py-16 md:py-24 border-b border-white/10 bg-gradient-to-b from-zinc-950/90 to-black overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-montserrat font-black uppercase tracking-[0.3em] mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40 drop-shadow-sm">
            ПАРТНЕРСТВО
          </h1>
          <p className="font-inter text-white/80 text-[16px] md:text-[18px] max-w-[800px] leading-relaxed font-light tracking-wide">
            Наша глобальна мережа партнерів охоплює найкращі агенції, готелі та сервіси по всьому світу.  
            Ми пишаємось співпрацею з лідерами індустрії туризму та консьєрж-послуг.
          </p>
        </div>
      </section>

      {/* ── 3D Scroll-driven Map Section ── */}
      <section className="relative w-full z-10 border-b border-white/5">
        <PartnershipMap onNextDown={handleScrollDown} />
      </section>

      {/* ── More Content Below to enable scrolling past map ── */}
      <div 
        ref={bottomRef}
        className={`transition-opacity duration-1000 ${showBottom ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden select-none pointer-events-none'}`}
      >
      <section className="relative w-full py-24 bg-zinc-950/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-montserrat font-bold tracking-[0.2em] uppercase text-white/90">
              Станьте нашим партнером
            </h2>
            <div className="w-12 h-px bg-[#5cc8bd] mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Features of Partnership */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ЕКСКЛЮЗИВНІ УМОВИ</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Доступ до закритих баз даних та найкращі фінансові умови співпраці на спеціальному порталі.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ПЕРСОНАЛЬНИЙ МЕНЕДЖЕР</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Кожен партнер отримує виділеного експерта для розв'язання будь-яких запитів 24/7.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ГЛОБАЛЬНЕ ПОКРИТТЯ</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Працюйте з нами для охоплення найпреміальніших локацій та сервісів у всьому світі.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center flex justify-center">
            <a 
              href="#footer" 
              className="inline-flex items-center justify-center border border-[#5cc8bd] text-[#5cc8bd] py-4 px-10 rounded-sm hover:bg-[#5cc8bd] hover:text-black transition-all duration-500 tracking-[0.2em] font-bold text-sm"
            >
              ЗАПОВНИТИ ЗАЯВКУ
            </a>
          </div>
        </div>
      </section>

      <FinalQuote />
      </div>
    </div>
  );
};

export default PartnershipPage;
