import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Hotel, Instagram, Send, MessageCircle, Facebook } from 'lucide-react';
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
          <Link to="/" className="flex items-center gap-4 cursor-pointer group">
            <img src={logo} alt="Vogel Logo" className="w-14 h-14 object-contain" />
            <div className="flex flex-col uppercase leading-[0.75] text-xl md:text-2xl font-black">
              <span className="group-hover:text-white/80 transition-colors tracking-tighter">VOGEL</span>
              <span className="group-hover:text-white/80 transition-colors tracking-tighter">TRAVEL</span>
            </div>
          </Link>

          {/* Navigation Links (Increased font size) */}
          <div className="hidden xl:flex gap-10">
            <nav className="flex flex-col space-y-0.5 uppercase leading-none text-[15px] font-bold">
              <Link to="/about" className="hover:text-white/70 transition-colors">ПРО НАС</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">БЛОГ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">КОНТАКТИ</Link>
            </nav>
            <nav className="flex flex-col space-y-0.5 uppercase leading-none text-[15px] font-bold">
              <Link to="#" className="hover:text-white/70 transition-colors">ПРОПОЗИЦІЇ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">СЕРВІСИ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">ПАРТНЕРСТВО</Link>
            </nav>
          </div>
        </div>

        {/* Center Icons (Lifted Higher) */}
        <div className="hidden md:flex items-center gap-4 border border-white/10 rounded-sm py-4 px-6 bg-white/5 backdrop-blur-md shadow-lg absolute left-1/2 -translate-x-1/2 top-[19px]">
          <Plane className="w-5 h-5 text-white/80" strokeWidth={1.5} />
          <div className="w-[1px] h-6 bg-white/10"></div>
          <Hotel className="w-5 h-5 text-white/80" strokeWidth={1.5} />
        </div>

        {/* Right: Socials, Search, Language */}
        <div className="flex items-center gap-6 lg:gap-8">
          
          <div className="hidden lg:flex flex-col items-end gap-1">
            {/* Tagline (Shifted Up and Right, smaller calligraphic font) */}
            <p className="font-script text-[15px] opacity-70 normal-case tracking-wider italic whitespace-nowrap -mt-4 mr-[-28px] mb-2 transform">
              Кожна подорож — це історія, яку ви розповідатимете роками
            </p>

            {/* Social Icons Group */}
            <div className="flex items-center gap-4 text-white/60">
              {/* Instagram */}
              <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
              {/* WhatsApp (MessageCircle) */}
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              </a>
              {/* Telegram (Send) */}
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <Send className="w-4 h-4" strokeWidth={1.5} />
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
        <div className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-lg p-8 flex flex-col gap-10 text-white font-montserrat tracking-widest uppercase font-semibold animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 text-base">
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>ПРО НАС</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>БЛОГ</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>КОНТАКТИ</Link>
            </div>
            <div className="flex flex-col gap-4 text-base">
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>ПРОПОЗИЦІЇ</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>СЕРВІСИ</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>ПАРТНЕРСТВО</Link>
            </div>
          </div>
          <div className="h-px bg-white/10 w-full"></div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <button className="text-white">УКР</button>
              <button className="text-white/40">ENG</button>
            </div>
            
            {/* Mobile Social Icons */}
            <div className="flex items-center gap-6 text-white/50">
              <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <Send className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
