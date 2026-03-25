import { useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FinalQuote from '../components/FinalQuote';
import SEOHead from '../components/SEOHead';
import { usePartners } from '../lib/queries/partners';

const PartnershipMap = lazy(() => import('../components/PartnershipMap'));

const PartnershipPage = () => {
  const { data: partners = [] } = usePartners();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapPartners = partners
    .filter(p => p.lng != null && p.lat != null)
    .map(p => ({
      id: p.id,
      name: p.name,
      lng: p.lng!,
      lat: p.lat!,
      tag: p.tag || p.name.slice(0, 2).toUpperCase(),
      color: p.color || '#5cc8bd',
      logo: p.logo || '',
    }));

  return (
    <div className="w-full bg-black min-h-screen text-white pt-[76px] xl:pt-[85px]">
      <SEOHead pagePath="/partners" fallbackTitle="Партнерство — Vogel Family Travel" />

      {/* ── Map ── */}
      <section className="relative w-full z-10 border-b border-white/5">
        <Suspense fallback={<div className="h-[600px] flex items-center justify-center bg-zinc-950">Завантаження мапи...</div>}>
          <PartnershipMap partners={mapPartners} />
        </Suspense>
      </section>

      {/* ── Partner Cards Grid ── */}
      <section className="relative w-full py-24 bg-zinc-950">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-montserrat font-bold tracking-[0.2em] uppercase text-white/90">
              Наші партнери
            </h2>
            <div className="w-12 h-px bg-[#5cc8bd] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map(partner => (
              <Link
                key={partner.id}
                to={`/partners/${partner.id}`}
                className="group bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-[#5cc8bd]/40 transition-all duration-500 flex flex-col gap-4"
              >
                {/* Logo */}
                <div className="h-12 flex items-center">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-h-full max-w-[140px] w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span
                      className="text-2xl font-black font-montserrat tracking-wider"
                      style={{ color: partner.color || '#5cc8bd' }}
                    >
                      {partner.tag || partner.name.slice(0, 2)}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-montserrat font-bold text-base text-white group-hover:text-[#5cc8bd] transition-colors duration-300 leading-tight mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-[#5cc8bd] text-xs font-bold uppercase tracking-widest font-montserrat mb-1">
                    {partner.category}
                  </p>
                  <p className="text-white/50 text-sm font-inter">
                    {partner.location}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[#5cc8bd] text-[10px] font-bold uppercase tracking-[0.3em] font-montserrat opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Детальніше</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="relative w-full py-24 bg-zinc-950/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-montserrat font-bold tracking-[0.2em] uppercase text-white/90">
              Станьте нашим партнером
            </h2>
            <div className="w-12 h-px bg-[#5cc8bd] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ЕКСКЛЮЗИВНІ УМОВИ</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Доступ до закритих баз даних та найкращі фінансові умови співпраці на спеціальному порталі.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ПЕРСОНАЛЬНИЙ МЕНЕДЖЕР</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Кожен партнер отримує виділеного експерта для розв'язання будь-яких запитів 24/7.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">ГЛОБАЛЬНЕ ПОКРИТТЯ</h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                Працюйте з нами для охоплення найпреміальніших локацій та сервісів у всьому світі.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center flex justify-center">
            <a
              href="#footer"
              className="inline-flex items-center justify-center border border-[#5cc8bd] text-[#5cc8bd] py-4 px-10 hover:bg-[#5cc8bd] hover:text-black transition-all duration-500 tracking-[0.2em] font-bold text-sm"
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
