import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import BirdCursorEffect from './BirdCursorEffect';
import OrderTourModal from './OrderTourModal';
import { useTranslation } from 'react-i18next';

import heroPoster from '../assets/hero-bg.png';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <section className="relative w-full min-h-[100svh] overflow-hidden bg-black flex flex-col justify-center pt-24 lg:pt-32 pb-16 lg:pb-20">
      <BirdCursorEffect />

      {/* Background Video with Poster fallback */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => {
          window.__VOGEL_VIDEO_READY__ = true;
          console.log("Hero video ready");
        }}
      >
        <source src="/hero-video.webm" type="video/webm" />
        {/* Fallback for browsers that don't support WebM (like older iOS Safari) */}
        {/* <source src="/hero-video.mp4" type="video/mp4" /> */}
      </video>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full px-6 md:px-8 lg:px-12 mx-auto max-w-[1440px] flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-6 md:gap-10 lg:gap-16 pt-[10px] lg:pt-0">

        {/* Mobile: Logo */}
        <div className="lg:hidden flex justify-center w-full mb-2">
          <img src={logo} alt="Vogel Logo" width={288} height={288} className="w-[216px] sm:w-[288px] h-auto object-contain opacity-90 drop-shadow-2xl" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-[620px]">
          <h1 className="text-white leading-[1.1] tracking-tight mb-6 flex flex-col items-center lg:items-start">
            <span className="block font-script text-5xl md:text-7xl lg:text-8xl text-white/90 mb-1">
              {t('home.hero_title_top')}
            </span>
            <span className="block font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold uppercase tracking-tight leading-[1]">
              {t('home.hero_title_mid')}
            </span>
            <span className="block font-script text-4xl md:text-6xl lg:text-7xl text-white/90 mt-1">
              {t('home.hero_title_bot')}
            </span>
          </h1>

          <button 
            onClick={() => navigate(`/${i18n.language}/offers`)}
            className="bg-white text-black font-montserrat uppercase tracking-[0.2em] font-bold py-4 px-10 hover:bg-white/90 active:scale-95 transition-all duration-300 rounded-[2px] shadow-lg w-full sm:w-auto text-sm"
          >
            {t('home.hero_order_btn')}
          </button>
        </div>

        {/* Desktop: Huge Logo Ornament */}
        <div className="hidden lg:flex flex-col items-end justify-center h-full pointer-events-none">
          <img src={logo} alt="Vogel Logo Ornament" width={828} height={828} className="w-[648px] xl:w-[828px] object-contain opacity-80 drop-shadow-2xl" />
        </div>

      </div>
      </section>
      <OrderTourModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Hero;
