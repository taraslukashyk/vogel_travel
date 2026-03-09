import { useState } from 'react';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-auto bg-black/40 backdrop-blur-lg border-b border-white/10">

      {/* Main Navigation Row (More compact height) */}
      <div className="w-full py-4 mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12 flex items-center justify-between text-white font-montserrat tracking-wide font-medium relative">

        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-10 lg:gap-16">
          {/* Logo Group */}
          <div className="flex items-center gap-4 cursor-pointer group">
            <img src={logo} alt="Vogel Logo" className="w-14 h-14 object-contain" />
            <div className="flex flex-col uppercase leading-[0.75] text-xl md:text-2xl font-black">
              <span className="group-hover:text-white/80 transition-colors tracking-tighter">VOGEL</span>
              <span className="group-hover:text-white/80 transition-colors tracking-tighter">TRAVEL</span>
            </div>
          </div>

          {/* Navigation Links (Increased font size) */}
          <div className="hidden xl:flex gap-10">
            <nav className="flex flex-col space-y-0.5 uppercase leading-none text-[15px] font-bold">
              <a href="#" className="hover:text-white/70 transition-colors">ГОЛОВНА</a>
              <a href="#" className="hover:text-white/70 transition-colors">БЛОГ</a>
              <a href="#" className="hover:text-white/70 transition-colors">КОНТАКТИ</a>
            </nav>
            <nav className="flex flex-col space-y-0.5 uppercase leading-none text-[15px] font-bold">
              <a href="#" className="hover:text-white/70 transition-colors">НАПРЯМКИ</a>
              <a href="#" className="hover:text-white/70 transition-colors">ГОТЕЛІ</a>
              <a href="#" className="hover:text-white/70 transition-colors">ПАРТНЕРСТВО</a>
            </nav>
          </div>
        </div>

        {/* Center Icons (Lifted Higher) */}
        <div className="hidden md:flex items-center gap-4 border border-white/10 rounded-sm py-2 px-6 bg-white/5 backdrop-blur-md shadow-lg absolute left-1/2 -translate-x-1/2 top-4">
          <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3.182 12.015h7.62l-3.328-9h3.765l5.05 9h4.3c1.325 0 2.41 1.085 2.41 2.41s-1.085 2.41-2.41 2.41h-4.3l-5.05 9h-3.765l3.328-9h-7.62l-1.92 2.64H1.5L2.64 12 1.5 9.36h1.762l1.92 2.655z" />
          </svg>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        {/* Right: Socials, Search, Language */}
        <div className="flex items-center gap-6 lg:gap-8">
          
          <div className="hidden lg:flex flex-col items-center gap-1">
            {/* Tagline (Centered over socials) */}
            <p className="font-script text-sm text-white/50 normal-case tracking-normal italic whitespace-nowrap">
              Кожна подорож — це історія, яку ви розповідатимете роками
            </p>

            {/* Social Icons Group */}
            <div className="flex items-center gap-4 text-white/60">
              {/* Instagram */}
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163v.015c3.21 0 3.584.012 4.85.07 3.253.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-2.015-.001-3.996-.511-5.751-1.48L0 24zm5.835-3.366l.333.198c1.55.92 3.327 1.405 5.163 1.406 5.563 0 10.091-4.528 10.094-10.092.002-2.696-1.046-5.231-2.955-7.14-1.908-1.908-4.443-2.956-7.141-2.957-5.565 0-10.092 4.528-10.095 10.092-.001 1.93.529 3.815 1.535 5.462l.219.356-.99 3.618 3.703-.971zm11.367-7.793c-.303-.151-1.793-.884-2.071-.985-.278-.102-.48-.153-.682.151-.201.303-.782.985-.959 1.187-.177.202-.353.226-.656.075-.303-.151-1.28-.472-2.439-1.506-.902-.803-1.51-1.795-1.687-2.098-.176-.302-.019-.466.132-.616.136-.135.303-.353.454-.53.151-.176.202-.302.303-.504.101-.202.05-.378-.025-.53-.076-.151-.682-1.642-.933-2.247-.245-.589-.493-.51-.682-.52-.177-.008-.378-.01-.58-.01-.202 0-.53.076-.807.378-.278.303-1.06 1.035-1.06 2.525s1.085 2.929 1.237 3.131c.151.202 2.135 3.26 5.174 4.57.723.312 1.288.499 1.728.639.726.231 1.387.198 1.909.12.583-.087 1.793-.733 2.046-1.439.252-.705.252-1.313.177-1.439-.077-.126-.279-.202-.582-.353z" />
                </svg>
              </a>
              {/* Telegram */}
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.04 13.99l-2.968-.924c-.643-.204-.657-.643.136-.953l11.57-4.462c.537-.194 1.006.131.836.95l.12-.38z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden md:flex h-5 w-px bg-white/10"></div>

          {/* Search Icon */}
          <button className="text-white/60 hover:text-white transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Language Toggle (Vertical, in main row) */}
          <div className="hidden md:flex flex-col text-[11px] font-bold uppercase tracking-widest leading-tight">
            <button className="text-white hover:text-white/80 transition-colors text-left">УКР</button>
            <button className="text-white/40 hover:text-white transition-colors text-left">ENG</button>
          </div>

          <button
            className="xl:hidden flex items-center p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-10 6h10" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl p-8 flex flex-col gap-10 text-white font-montserrat tracking-widest uppercase font-semibold animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 text-base">
              <a href="#">ГОЛОВНА</a>
              <a href="#" className="opacity-70">БЛОГ</a>
              <a href="#" className="opacity-70">КОНТАКТИ</a>
            </div>
            <div className="flex flex-col gap-4 text-base">
              <a href="#" className="opacity-70">НАПРЯМКИ</a>
              <a href="#" className="opacity-70">ГОТЕЛІ</a>
              <a href="#" className="opacity-70">ПАРТНЕРСТВО</a>
            </div>
          </div>
          <div className="h-px bg-white/10 w-full"></div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <button className="text-white">УКР</button>
              <button className="text-white/40">ENG</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
