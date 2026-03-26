import aboutBg from '../assets/about-bg.png';
import viktoria from '../assets/viktoria.jpg';
import OptimizedImage from './OptimizedImage';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full relative py-20 md:py-28 overflow-hidden">
      {/* Blurred exotic background */}
      <OptimizedImage
        src={aboutBg}
        alt="Background Blur"
        className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
        style={{
          filter: 'blur(8px)',
          WebkitFilter: 'blur(8px)',
        }}
        sizes="100vw"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

        {/* Left: Victoria Photo */}
        <div className="w-full lg:w-[380px] xl:w-[440px] flex-shrink-0">
          <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm overflow-hidden shadow-2xl">
            <OptimizedImage 
              src={viktoria} 
              alt={t('about.founder_name')} 
              className="w-full h-auto block" 
              sizes="(max-width: 1024px) 100vw, 440px"
            />
          </div>
        </div>

        {/* Right: Quote + Mission */}
        <div className="flex flex-col gap-12 flex-1 pt-2">

          {/* Blockquote */}
          <div className="border-l-4 border-white/70 pl-6 md:pl-8">
            <span className="block font-serif text-5xl text-white/80 leading-none mb-3 select-none">&ldquo;</span>

            <blockquote className="font-inter text-white text-lg md:text-xl leading-relaxed font-light">
              {t('about.quote')}
            </blockquote>

            <cite className="block mt-5 text-white/70 font-inter text-sm not-italic">
              <em>{t('about.founder_name')}, {t('about.founder_role')}</em>
            </cite>
          </div>

          {/* Mission */}
          <div>
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-4">
              {t('about.mission_title')}
            </h2>
            <p className="font-inter text-white/80 text-base md:text-lg leading-relaxed">
              {t('about.mission_description')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
