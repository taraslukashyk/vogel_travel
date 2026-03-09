import { useEffect, useRef, useState } from 'react';
import cardImg from '../assets/hero-bg.png';
import logo from '../assets/logo.png';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = height - windowHeight;

      if (top > 0 || scrollableDistance <= 0) {
        setTranslateY(0);
        setOpacity(1);
        return;
      }

      const scrolled = -top;
      const progress = Math.min(1, scrolled / scrollableDistance);

      // Elements start moving UP only after 5% scroll progress
      const startMoving = 0.05;
      if (progress > startMoving) {
        const moveProgress = (progress - startMoving) / (1 - startMoving);
        // Negative Y → elements slide UP when scrolling down
        setTranslateY(-moveProgress * windowHeight * 1.1);
        setOpacity(Math.max(0, 1 - moveProgress * 2));
      } else {
        setTranslateY(0);
        setOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // 300vh tall container — scroll through it while the inner content sticks to viewport
    <section ref={containerRef} className="relative w-full h-[300vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">

        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

        {/* UI Elements that move/fade away on scroll */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateY(${translateY}px)`,
            opacity: opacity,
            willChange: 'transform, opacity',
            transition: 'transform 0.05s linear, opacity 0.05s linear',
          }}
        >
          <div className="relative z-10 w-full h-full px-6 md:px-8 lg:px-12 mx-auto max-w-[1440px] flex justify-between items-end pb-16 pt-32 pointer-events-auto">

            {/* Left Content */}
            <div className="flex flex-col max-w-[620px] self-center pt-10">
              {/* Mix of calligraphic and bold sans-serif */}
              <h1 className="text-white leading-[1.1] tracking-tight mb-8">
                {/* First line: calligraphic script font */}
                <span className="block font-script text-5xl md:text-7xl lg:text-8xl text-white/90 mb-1">
                  Відкрийте світ:
                </span>
                {/* Second line: strong Montserrat */}
                <span className="block font-montserrat text-4xl md:text-6xl lg:text-[72px] font-extrabold uppercase tracking-tight leading-[1]">
                  ваша подорож
                </span>
                {/* Third line: italic script again */}
                <span className="block font-script text-4xl md:text-6xl lg:text-7xl text-white/90 mt-1">
                  починається
                </span>
              </h1>

              <p className="font-inter text-white/90 text-base md:text-lg mb-10 max-w-[540px] leading-relaxed font-light">
                Vogel Family Travel — туристичний оператор, що створює індивідуальні подорожі для
                клієнтів із високими вимогами до сервісу, приватності та деталей. Ми працюємо з
                нестандартними запитами і повністю беремо на себе організацію подорожі — від ідеї до повернення.
              </p>

              <button className="bg-white text-black font-montserrat uppercase tracking-widest font-bold py-4 px-10 w-max hover:bg-gray-100 active:scale-95 transition-all rounded-sm shadow-lg">
                Дослідити Зараз
              </button>
            </div>

            {/* Right Bottom Section: Logo + Blog Card */}
            <div className="hidden lg:flex flex-col items-center gap-12 self-end">
              {/* Large Central Logo (Opaque and Bigger) */}
              <div className="w-[432px] h-[432px] pointer-events-none">
                <img src={logo} alt="Vogel Logo Ornament" className="w-full h-full object-contain transition-opacity duration-700 hover:opacity-90" />
              </div>

              {/* Blog Card */}
              <div className="w-[420px] h-[150px] bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden rounded-sm flex">
                {/* Card Image */}
                <div
                  className="w-1/2 h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${cardImg})` }}
                />

                {/* Card Text */}
                <div className="w-1/2 p-5 flex flex-col justify-between font-montserrat text-black">
                  <div>
                    <h3 className="text-sm leading-snug uppercase font-semibold line-clamp-2 mb-2">
                      10 розкішних місць для відпустки
                    </h3>
                    <a
                      href="#"
                      className="text-[11px] uppercase font-bold underline decoration-2 underline-offset-2 hover:text-gray-600 transition-colors"
                    >
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
      </div>
    </section>
  );
};

export default Hero;
