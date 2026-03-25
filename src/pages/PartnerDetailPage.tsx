import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { usePartner } from '../lib/queries/partners';
import OptimizedImage from '../components/OptimizedImage';
import SEOHead from '../components/SEOHead';

const PartnerDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { data: partner, isLoading } = usePartner(slug!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: partner?.name,
          text: partner?.description ?? undefined,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5cc8bd] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Партнера не знайдено</h1>
          <Link to="/ua/partners" className="text-[#5cc8bd] font-bold uppercase tracking-widest">
            Повернутися до партнерів
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-200/50 text-gray-900 selection:bg-[#5cc8bd]/20">
      <SEOHead
        pagePath={`/ua/partners/${slug}`}
        title={partner.seoTitle || `${partner.name} — Vogel Family Travel`}
        description={partner.seoDescription || partner.description || ''}
        ogImage={partner.image}
      />

      {/* ── Hero ── */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <OptimizedImage
            src={partner.image}
            alt={partner.imageAlt || partner.name}
            className="w-full h-full object-cover"
            sizes="100vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <div className="max-w-4xl">
            <Link
              to="/ua/partners"
              className="inline-flex items-center gap-2 text-white/70 hover:text-[#5cc8bd] transition-colors text-xs font-bold uppercase tracking-[0.2em] mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Назад до партнерів
            </Link>

            {/* Logo */}
            {partner.logo && (
              <div className="mb-6">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-10 md:h-14 w-auto object-contain brightness-0 invert opacity-80"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}

            <div className="flex items-center gap-4 text-[#5cc8bd] text-xs font-black uppercase tracking-[0.2em] mb-4">
              <span>{partner.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              <span className="text-white/60 font-medium">{partner.location}</span>
            </div>

            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-10 drop-shadow-sm">
              {partner.name}
            </h1>

            <div className="flex flex-wrap items-center gap-8 md:gap-12 pt-4">
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-[#5cc8bd] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest">Офіційний сайт</span>
                </a>
              )}

              <button
                onClick={handleShare}
                className="flex items-center gap-3 text-white/60 hover:text-[#5cc8bd] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest">Поділитися</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="relative py-16 px-6 md:px-8 bg-zinc-200/50">
        <div className="max-w-5xl mx-auto">

          {/* Description intro */}
          {partner.description && (
            <div className="mb-12 text-xl text-gray-700 leading-relaxed font-inter border-l-4 border-[#5cc8bd] pl-8 italic">
              {partner.description}
            </div>
          )}

          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-serif prose-headings:italic prose-p:font-inter prose-p:leading-relaxed prose-p:text-gray-700">
            {partner.sections?.map((section, idx) => {
              if (section.type === 'text') {
                return (
                  <div key={idx} className="mb-12">
                    {section.title && (
                      <h2 className="text-3xl font-serif italic text-gray-900 mt-16 mb-6">
                        {section.title}
                      </h2>
                    )}
                    <div
                      className="text-lg text-gray-700 leading-relaxed font-inter mb-6 [&_a]:text-[#5cc8bd] [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: section.content as string }}
                    />
                  </div>
                );
              }

              if (section.type === 'list') {
                return (
                  <div key={idx} className="mb-12 bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-sm border-l-4 border-[#5cc8bd] shadow-sm">
                    {section.title && (
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-8">
                        {section.title}
                      </h3>
                    )}
                    <ul className="space-y-6">
                      {(section.content as string[]).map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5cc8bd] shrink-0 mt-2"></span>
                          <span className="text-lg text-gray-700 leading-relaxed font-inter italic">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (section.type === 'image') {
                return (
                  <figure key={idx} className="my-16">
                    <OptimizedImage
                      src={section.image || ''}
                      alt={section.title || 'Partner image'}
                      className="w-full h-auto rounded-sm shadow-xl"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                    {section.content && (
                      <figcaption className="mt-4 text-center text-sm text-gray-400 italic">
                        {section.content as string}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return null;
            })}
          </div>

          <div className="mt-24 pt-16 border-t border-gray-100 flex flex-col items-center">
            <p className="text-gray-400 font-serif italic text-xl mb-8">Хочете скористатися перевагами цього партнерства?</p>
            <Link
              to="/ua/partners"
              className="bg-black text-white font-montserrat font-bold uppercase tracking-[0.2em] text-xs px-10 py-5 hover:bg-[#5cc8bd] transition-all duration-300 rounded-[2px]"
            >
              Всі партнери
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnerDetailPage;
