import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePartners } from '../lib/queries/partners';
import { useLanguage } from '../hooks/useLanguage';
import { useLanguageContent } from '../hooks/useLanguageContent';
import { useTranslation } from 'react-i18next';

const Partners = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { data: partners = [] } = usePartners();
  const { l } = useLanguage();
  const { t } = useLanguageContent();
  const { t: tr } = useTranslation();

  const displayPartners = partners.length > 0 ? partners : [];

  return (
    <section className="w-full py-20 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <Link to={l('/partners')} className="group flex items-center gap-3 text-white/40 hover:text-[#5cc8bd] transition-colors cursor-pointer">
          <h3 className="font-montserrat uppercase tracking-[0.2em] text-sm md:text-base font-black italic drop-shadow-sm transition-colors cursor-pointer">
            {tr('partners.map_cta')}
          </h3>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-3 transition-transform duration-300" strokeWidth={3} />
        </Link>
        <div className="w-8 h-[1px] bg-white/10 mt-4"></div>
      </div>

      {displayPartners.length > 0 ? (
        <div
          className="relative w-full overflow-hidden flex"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-16 md:gap-28 items-center shrink-0 w-max animate-infinite-scroll"
            style={{
              animationDuration: '60s',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* First set */}
            <div className="flex gap-16 md:gap-28 items-center">
              {displayPartners.map((partner: any) => {
                const name = t(partner, 'name');
                const slug = t(partner, 'slug');
                return (
                  <Link
                    key={`p1-${partner.id}`}
                    to={l(`/partners/${slug}`)}
                    className="flex-shrink-0 select-none group"
                    title={name}
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={name}
                        className="h-8 md:h-12 w-auto max-w-[120px] md:max-w-[160px] object-contain brightness-0 invert opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = 'none';
                          const fallback = el.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span
                      className="font-montserrat font-extrabold text-2xl md:text-4xl uppercase tracking-[0.2em] text-white/10 group-hover:text-white/30 transition-all duration-500 whitespace-nowrap"
                      style={{ display: partner.logo ? 'none' : 'block' }}
                    >
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>
            {/* Second set for seamless loop */}
            <div className="flex gap-16 md:gap-28 items-center">
              {displayPartners.map((partner: any) => {
                const name = t(partner, 'name');
                const slug = t(partner, 'slug');
                return (
                  <Link
                    key={`p2-${partner.id}`}
                    to={l(`/partners/${slug}`)}
                    className="flex-shrink-0 select-none group"
                    title={name}
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={name}
                        className="h-8 md:h-12 w-auto max-w-[120px] md:max-w-[160px] object-contain brightness-0 invert opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = 'none';
                          const fallback = el.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span
                      className="font-montserrat font-extrabold text-2xl md:text-4xl uppercase tracking-[0.2em] text-white/10 group-hover:text-white/30 transition-all duration-500 whitespace-nowrap"
                      style={{ display: partner.logo ? 'none' : 'block' }}
                    >
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Fallback while loading */
        <div className="relative w-full overflow-hidden flex opacity-30">
          <div className="flex gap-16 md:gap-28 items-center">
            {['Four Seasons', 'Aman', 'Emirates', 'Belmond', 'Silversea', 'Six Senses'].map((name) => (
              <span key={name} className="flex-shrink-0 font-montserrat font-extrabold text-2xl md:text-4xl uppercase tracking-[0.2em] text-white/10 whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Partners;
