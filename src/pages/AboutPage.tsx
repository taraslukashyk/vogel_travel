import { useEffect } from 'react';
import { ListChecks, Key, Clock, Target, UserCheck, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.svg';
import SEOHead from '../components/SEOHead';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

const AboutPage = () => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reasons = [
    {
      icon: <ListChecks className="w-8 h-8 text-white/80" />,
      title: t('about.reason1_title'),
      description: t('about.reason1_description')
    },
    {
      icon: <Key className="w-8 h-8 text-white/80" />,
      title: t('about.reason2_title'),
      description: t('about.reason2_description')
    },
    {
      icon: <Clock className="w-8 h-8 text-white/80" />,
      title: t('about.reason3_title'),
      description: t('about.reason3_description')
    },
    {
      icon: <Target className="w-8 h-8 text-white/80" />,
      title: t('about.reason4_title'),
      description: t('about.reason4_description')
    },
    {
      icon: <UserCheck className="w-8 h-8 text-white/80" />,
      title: t('about.reason5_title'),
      description: t('about.reason5_description')
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white/80" />,
      title: t('about.reason6_title'),
      description: t('about.reason6_description')
    }
  ];

  return (
    <main className="w-full bg-zinc-950/95 text-white selection:bg-primary/30 min-h-screen pt-40 pb-24 overflow-hidden relative">
      <SEOHead 
        pagePath={`/${currentLang}/about`} 
        fallbackTitle={currentLang === 'ua' ? "Про нас — Vogel Family Travel" : "About Us — Vogel Family Travel"} 
      />

      {/* Background Video Decor */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          src="/about-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onLoadedData={() => {
            window.__VOGEL_VIDEO_READY__ = true;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <style>{`
        .mask-gradient {
          mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }
      `}</style>
      
      {/* Hero Section of About Page */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h1 className="font-montserrat text-5xl md:text-7xl font-extrabold uppercase tracking-tight leading-none mb-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              {t('about.hero_title')} <br /> <span className="text-white/40">{t('about.hero_subtitle')}</span>
            </h1>
            <div className="w-24 h-1 bg-white mb-10" />

            <div className="font-inter text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
              <p>{t('about.hero_description1')}</p>
              <br />
              <p>{t('about.hero_description2')}</p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex justify-center animate-in fade-in zoom-in-75 duration-1000 delay-300">
            <img src={logo} alt="Vogel Logo" className="w-[450px] lg:w-[500px] h-auto opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
          </div>
        </div>
      </section>

      {/* Expertise & Name Origin Section */}
      <section className="relative z-10 bg-white/5 backdrop-blur-xl border-y border-white/10 py-24 mb-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="flex flex-col gap-8">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white flex items-center gap-4">
              <span className="w-8 h-px bg-white/30" /> {t('about.expertise_title')}
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              {t('about.expertise_description')}
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white flex items-center gap-4">
              <span className="w-8 h-px bg-white/30" /> {t('about.philosophy_title')}
            </h2>
            <div className="font-inter text-white/70 text-lg leading-relaxed">
              {t('about.philosophy_description')}
            </div>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="font-montserrat text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-20 text-center">
          {t('about.reasons_title')} <br /> <span className="text-white/30">{t('about.reasons_subtitle')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="group p-10 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-8 p-4 bg-white/5 inline-block rounded-sm transition-transform duration-500 group-hover:scale-110">
                {reason.icon}
              </div>
              <h3 className="font-montserrat font-bold text-xl mb-4 tracking-tight group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="font-inter text-white/50 leading-relaxed text-sm">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
