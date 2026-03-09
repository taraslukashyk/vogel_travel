import { useEffect, useRef, useState } from 'react';
import cardImg from '../assets/hero-bg.png';
import logo from '../assets/logo.png';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = height - windowHeight;

      if (top > 0) {
        setProgress(0);
        return;
      }

      if (-top >= scrollableDistance) {
        setProgress(1);
        return;
      }

      const scrolled = -top;
      setProgress(scrolled / scrollableDistance);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Desktop opacity: stays until 75% scroll and then quickly fades
  const desktopOpacity = progress > 0.75 ? Math.max(0, 1 - (progress - 0.75) * 4) : 1;
  const desktopTranslateY = progress > 0.75 ? -(progress - 0.75) * 100 : 0;

  // Mobile sequential logic: updated to squeeze into the last 10% as well if needed, 
  // but usually sequential logic uses the whole range. 
  // User said "texts scroll only at 90% scroll", interpreted as staying static until late.
  const getMobileStyles = (peak: number, distance: number) => {
    // Shifting peak visibility to the end of the scroll
    const diff = Math.abs(progress - peak);
    const opacity = Math.max(0, 1 - (diff / distance));
    const translateY = (progress - peak) * 20;
    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      display: opacity <= 0 ? 'none' : 'flex'
    };
  };

  const logoStyles = isMobile ? getMobileStyles(0, 0.25) : { opacity: desktopOpacity, transform: `translateY(${desktopTranslateY}px)` };
  const contentStyles = isMobile ? getMobileStyles(0.4, 0.3) : { opacity: desktopOpacity, transform: `translateY(${desktopTranslateY}px)` };
  const cardStyles = isMobile ? getMobileStyles(0.85, 0.35) : { opacity: desktopOpacity, transform: `translateY(${desktopTranslateY}px)` };

  return (
    // Height back to 130vh as requested
    <section ref={containerRef} className="relative w-full h-[130vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">

        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full h-full px-6 md:px-8 lg:px-12 mx-auto max-w-[1440px] flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-end pb-16 lg:pb-16 pt-32 pointer-events-none">

          {/* Mobile Logo Stage (Centered) */}
          {isMobile && (
            <div
              className="absolute inset-0 flex items-center justify-center p-12 transition-all duration-75 ease-linear"
              style={logoStyles}
            >
              <img src={logo} alt="Vogel Logo" className="w-full max-w-[280px] h-auto object-contain" />
            </div>
          )}

          {/* Left Content / Main Text Stage */}
          <div
            className={`flex flex-col max-w-[620px] transition-all duration-75 ease-linear pointer-events-auto ${isMobile ? 'absolute inset-0 items-center justify-center text-center px-6' : 'self-center pt-10'}`}
            style={contentStyles}
          >
            <h1 className="text-white leading-[1.1] tracking-tight mb-4">
              <span className="block font-script text-5xl md:text-7xl lg:text-8xl text-white/90 mb-1">
                Відкрийте світ:
              </span>
              <span className="block font-montserrat text-4xl md:text-6xl lg:text-[72px] font-extrabold uppercase tracking-tight leading-[1]">
                ваша подорож
              </span>
              <span className="block font-script text-4xl md:text-6xl lg:text-7xl text-white/90 mt-1">
                починається
              </span>
            </h1>

            <p className="font-inter text-white/90 text-sm md:text-lg mb-8 max-w-[540px] leading-relaxed font-light">
              Vogel Family Travel — туристичний оператор, що створює індивідуальні подорожі для
              клієнтів із високими вимогами до сервісу, приватності та деталей. Ми працюємо з
              нестандартними запитами і повністю беремо на себе організацію подорожі — від ідеї до повернення.
            </p>

            <button className="bg-white text-black font-montserrat uppercase tracking-widest font-bold py-4 px-10 w-max hover:bg-gray-100 active:scale-95 transition-all rounded-sm shadow-lg">
              Дослідити Напрямки
            </button>
          </div>

          {/* Right Section: Logo (Desktop only) + Blog Card (Sequential on Mobile) */}
          <div className={`transition-all duration-100 ease-out ${isMobile ? 'absolute inset-0 flex items-center justify-center pointer-events-auto' : 'hidden lg:flex flex-col items-center gap-12 self-end'}`}>

            {/* Logo Ornament (Desktop only, now fades with card) */}
            {!isMobile && (
              <div className="w-[432px] h-[432px] pointer-events-none mb-12" style={cardStyles}>
                <img src={logo} alt="Vogel Logo Ornament" className="w-full h-full object-contain" />
              </div>
            )}

            {/* Blog Card Stage */}
            <div
              className="w-[90%] max-w-[420px] h-[150px] bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden rounded-sm flex transition-all duration-100 ease-out"
              style={cardStyles}
            >
              <div
                className="w-1/2 h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${cardImg})` }}
              />
              <div className="w-1/2 p-5 flex flex-col justify-between font-montserrat text-black">
                <div>
                  <h3 className="text-sm leading-snug uppercase font-semibold line-clamp-2 mb-2">
                    10 розкішних місць для відпустки
                  </h3>
                  <a href="#" className="text-[11px] uppercase font-bold underline decoration-2 underline-offset-2 hover:text-gray-600 transition-colors">
                    Читати зараз
                  </a>
                </div>
                <div className="text-[10px] text-gray-500 uppercase leading-snug font-medium">
                  Reiseguides <br />
                  Жовтень 27, 2024
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

