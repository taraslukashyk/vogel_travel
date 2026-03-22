import { useEffect, lazy, Suspense } from 'react';
import FinalQuote from '../components/FinalQuote';
import SEOHead from '../components/SEOHead';

const PartnershipMap = lazy(() => import('../components/PartnershipMap'));

const PartnershipPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-black min-h-screen text-white pt-[76px] xl:pt-[85px]">
      <SEOHead pagePath="/partners" fallbackTitle="Партнерство — Vogel Family Travel" />
      {/* ── 3D Scroll-driven Map Section ── */}
      <section className="relative w-full z-10 border-b border-white/5">
        <Suspense fallback={<div className="h-[600px] flex items-center justify-center bg-zinc-950">Завантаження мапи...</div>}>
          <PartnershipMap />
        </Suspense>
      </section>

      {/* ── More Content Below to enable scrolling past map ── */}
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
            <div className="bg-white/5 border border-white/10 p-8 rounded-none backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ЕКСКЛЮЗИВНІ УМОВИ</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Доступ до закритих баз даних та найкращі фінансові умови співпраці на спеціальному порталі.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-none backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ПЕРСОНАЛЬНИЙ МЕНЕДЖЕР</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Кожен партнер отримує виділеного експерта для розв'язання будь-яких запитів 24/7.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-none backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
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
  );
};

export default PartnershipPage;
