import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-6 md:px-10 lg:px-12 pointer-events-auto">
      <div className="flex items-start justify-between text-white font-oswald tracking-wide font-medium text-sm md:text-base">
        
        {/* Left Section: Logo & Links */}
        <div className="flex gap-12 lg:gap-24">
          {/* Logo */}
          <div className="flex flex-col uppercase leading-tight text-xl md:text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
            <span>VOGEL</span>
            <span>TRAVEL</span>
          </div>

          {/* Nav Links Column 1 */}
          <nav className="hidden md:flex flex-col space-y-1 uppercase leading-snug">
            <a href="#" className="hover:text-gray-300 transition-colors">ГОЛОВНА</a>
            <a href="#" className="hover:text-gray-300 transition-colors">БЛОГ</a>
            <a href="#" className="hover:text-gray-300 transition-colors">КОНТАКТИ</a>
          </nav>

          {/* Nav Links Column 2 */}
          <nav className="hidden md:flex flex-col space-y-1 uppercase leading-snug">
            <a href="#" className="hover:text-gray-300 transition-colors">НАПРЯМКИ</a>
            <a href="#" className="hover:text-gray-300 transition-colors">ГОТЕЛІ</a>
            <a href="#" className="hover:text-gray-300 transition-colors">ПАРТНЕРСТВО</a>
          </nav>
        </div>

        {/* Center Icons */}
        <div className="hidden md:flex flex-col items-center gap-3 absolute left-1/2 -translate-x-1/2 top-4">
          <div className="flex items-center gap-4 border border-white/50 rounded-md py-2 px-4 bg-white/5 backdrop-blur-sm">
            {/* Plane Icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.182 12.015h7.62l-3.328-9h3.765l5.05 9h4.3c1.325 0 2.41 1.085 2.41 2.41s-1.085 2.41-2.41 2.41h-4.3l-5.05 9h-3.765l3.328-9h-7.62l-1.92 2.64H1.5L2.64 12 1.5 9.36h1.762l1.92 2.655z" />
            </svg>
            <div className="w-[1px] h-6 bg-white/50"></div>
            {/* Building/Hotel Icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Right Section: Language, Search, Login */}
        <div className="flex gap-8 lg:gap-16 items-start">
          {/* Languages */}
          <div className="hidden md:flex flex-col space-y-1 uppercase leading-snug">
            <button className="hover:text-gray-300 text-left transition-colors">УКР</button>
            <button className="hover:text-gray-300 text-left transition-colors opacity-70 border-b border-transparent">ENG</button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-gray-300 transition-colors uppercase">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              ПОШУК
            </button>
            
            <div className="flex items-center gap-4 uppercase">
              <button className="hover:text-gray-300 transition-colors">УВІЙТИ</button>
              <button className="hover:text-gray-300 transition-colors">РЕЄСТРАЦІЯ</button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex items-center p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-black/80 backdrop-blur-md rounded-lg p-6 flex flex-col gap-6 text-white font-oswald tracking-wide font-medium uppercase animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-3">
             <a href="#">ГОЛОВНА</a>
             <a href="#">БЛОГ</a>
             <a href="#">КОНТАКТИ</a>
             <a href="#">НАПРЯМКИ</a>
             <a href="#">ГОТЕЛІ</a>
             <a href="#">ПАРТНЕРСТВО</a>
          </div>
          <div className="h-[1px] bg-white/20 w-full"></div>
          <div className="flex gap-4">
            <button>УКР</button>
            <button className="opacity-70">ENG</button>
          </div>
          <div className="flex flex-col gap-3">
            <button className="text-left flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              ПОШУК
            </button>
            <button className="text-left">УВІЙТИ</button>
            <button className="text-left">РЕЄСТРАЦІЯ</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
