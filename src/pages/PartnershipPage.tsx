import { useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Building, ChevronRight } from 'lucide-react';
import FinalQuote from '../components/FinalQuote';
import SEOHead from '../components/SEOHead';
import { usePartners } from '../lib/queries/partners';
import { useLanguage } from '../hooks/useLanguage';
import { useLanguageContent } from '../hooks/useLanguageContent';
import { useTranslation } from 'react-i18next';

const PartnershipMap = lazy(() => import('../components/PartnershipMap'));

const PartnershipPage = () => {
  const { data: partners = [] } = usePartners();
  const { currentLang, l } = useLanguage();
  const { t } = useLanguageContent();
  const { t: tr } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapPartners = partners
    .filter(p => p.lng != null && p.lat != null)
    .map(p => ({
      id: p.id,
      name: t(p, 'name'),
      slug: t(p, 'slug'),
      lng: p.lng!,
      lat: p.lat!,
      tag: t(p, 'tag') || t(p, 'name').slice(0, 2).toUpperCase(),
      color: p.color || '#5cc8bd',
      logo: p.logo || '',
    }));

  return (
    <main className="w-full bg-black min-h-screen text-white pt-[76px] xl:pt-[85px] overflow-x-hidden">
      <SEOHead 
        pagePath={`/${currentLang}/partners`} 
        fallbackTitle={tr('nav.partners') + " — Vogel Family Travel"} 
      />

      {/* ── Map ── */}
      <section className="relative w-full z-10 border-b border-white/5">
        <Suspense fallback={<div className="h-[600px] flex items-center justify-center bg-zinc-950">{tr('common.loading')}</div>}>
          <PartnershipMap partners={mapPartners} />
        </Suspense>
      </section>

      {/* ── Partner Cards Grid ── */}
      <section className="relative w-full py-24 bg-zinc-950">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-montserrat font-bold tracking-[0.2em] uppercase text-white/90">
              {tr('partners.title')}
            </h2>
            <div className="w-12 h-px bg-[#5cc8bd] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner: any) => {
              const name = t(partner, 'name');
              const category = t(partner, 'category');
              const location = t(partner, 'location');
              const slug = t(partner, 'slug');
              const tag = t(partner, 'tag');

              return (
                <Link
                  key={partner.id}
                  to={l(`/partners/${slug}`)}
                  className="group bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-[#5cc8bd]/40 transition-all duration-500 flex flex-col gap-4"
                >
                  {/* Logo */}
                  <div className="h-12 flex items-center">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={`${name} logo`}
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
                        {tag || name.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-base text-white group-hover:text-[#5cc8bd] transition-colors duration-300 leading-tight mb-1">
                      {name}
                    </h3>
                    <p className="text-[#5cc8bd] text-xs font-bold uppercase tracking-widest font-montserrat mb-1">
                      {category}
                    </p>
                    <p className="text-white/50 text-sm font-inter">
                      {location}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[#5cc8bd] text-[10px] font-bold uppercase tracking-[0.3em] font-montserrat opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>{tr('common.details')}</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="relative w-full py-24 bg-zinc-950/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-montserrat font-bold tracking-[0.2em] uppercase text-white/90">
              {tr('partners.become_title')}
            </h2>
            <div className="w-12 h-px bg-[#5cc8bd] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">
                {currentLang === 'ua' ? 'ЕКСКЛЮЗИВНІ УМОВИ' : 'EXCLUSIVE TERMS'}
              </h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                {currentLang === 'ua' 
                  ? 'Доступ до закритих баз даних та найкращі фінансові умови співпраці на спеціальному порталі.'
                  : 'Access to closed databases and the best financial terms of cooperation on a special portal.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">
                {currentLang === 'ua' ? 'ПЕРСОНАЛЬНИЙ МЕНЕДЖЕР' : 'PERSONAL MANAGER'}
              </h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                {currentLang === 'ua'
                  ? 'Кожен партнер отримує виділеного експерта для розв\'язання будь-яких запитів 24/7.'
                  : 'Each partner receives a dedicated expert to solve any requests 24/7.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors duration-500">
              <h3 className="font-montserrat font-bold text-lg mb-4 text-[#5cc8bd]">
                {currentLang === 'ua' ? 'ГЛОБАЛЬНЕ ПОКРИТТЯ' : 'GLOBAL COVERAGE'}
              </h3>
              <p className="text-sm tracking-wide text-white/70 leading-relaxed">
                {currentLang === 'ua'
                  ? 'Працюйте з нами для охоплення найпреміальніших локацій та сервісів у всьому світі.'
                  : 'Work with us to cover the most premium locations and services worldwide.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Additional Partners Info Block ── */}
      <section className="relative w-full py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden group backdrop-blur-xl transition-all duration-500 hover:bg-white/10 p-6 md:p-14">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-8">
                <div className="mb-0 p-4 bg-white/5 inline-block rounded-sm transition-transform duration-500 group-hover:scale-110 border border-white/5">
                  <Briefcase className="w-8 h-8 text-[#5cc8bd]" />
                </div>
                <h2 className="font-montserrat text-3xl font-bold uppercase text-white tracking-[0.05em] group-hover:text-[#5cc8bd] transition-colors">{tr('contacts.partners_title')}</h2>
                <p className="font-inter text-white/50 text-lg leading-relaxed max-w-lg">
                  {tr('contacts.partners_description')}
                </p>
                <button
                  type="button"
                  className="group/btn flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all"
                >
                  {tr('contacts.b2b_btn')} <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
              <div className="w-full md:w-1/3 aspect-[4/3] bg-white/5 border border-white/10 rounded-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5cc8bd]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Building className="w-16 h-16 text-white/10 mb-5 relative z-10" />
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 leading-tight relative z-10">Global Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalQuote />
    </main>
  );
};

export default PartnershipPage;
