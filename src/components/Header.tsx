import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Hotel, Instagram, Send, MessageCircle, Facebook, X } from 'lucide-react';
import logo from '../assets/logo.svg';
import BookingModal from './BookingModal';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-auto bg-black/40 backdrop-blur-lg border-b border-white/10">

      {/* Main Navigation Row (More compact height) */}
      <div className="w-full h-[100px] mx-auto max-w-[1440px] px-6 md:px-8 lg:px-12 flex items-center justify-between text-white font-montserrat tracking-wide font-medium relative">

        {/* Left: Logo & Title */}
        <div className="flex items-center z-10 relative">
          <Link to="/" className="flex items-center gap-4 cursor-pointer group">
            <img src={logo} alt="Vogel Logo" className="w-[120px] h-[120px] object-contain transition-transform group-hover:scale-105" />
            
            {/* Calligraphy Title in 1 line - REMOVED per user request */}
          </Link>
        </div>

        {/* Center: Nav and Central Button (Absolutely centered container) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          <div className="pointer-events-auto flex items-center gap-10 xl:gap-[80px]">
            {/* Left Navigation Links */}
            <nav className="hidden xl:flex flex-col space-y-0.5 uppercase leading-none text-[15px] font-bold text-right pt-1">
              <Link to="/about" className="hover:text-white/70 transition-colors">ПРО НАС</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">БЛОГ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">КОНТАКТИ</Link>
            </nav>

            {/* Central Trigger Button */}
            <button 
              onClick={() => setIsBookingModalOpen(!isBookingModalOpen)}
              className="flex items-center justify-center gap-3 md:gap-4 border border-white/10 rounded-sm py-3 px-4 md:py-4 md:px-6 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md shadow-lg cursor-pointer group min-w-[100px] md:min-w-[120px]"
            >
              {isBookingModalOpen ? (
                <X className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
              ) : (
                <>
                  <Plane className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
                  <div className="w-[1px] h-6 bg-white/10"></div>
                  <Hotel className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </>
              )}
            </button>

            {/* Right Navigation Links */}
            <nav className="hidden xl:flex flex-col space-y-0.5 uppercase leading-none text-[15px] font-bold text-left pt-1">
              <Link to="/offers" className="hover:text-white/70 transition-colors">ПРОПОЗИЦІЇ</Link>
              <Link to="/services" className="hover:text-white/70 transition-colors">СЕРВІСИ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors">ПАРТНЕРСТВО</Link>
            </nav>
          </div>
        </div>

        {/* Right: Socials, Search, Language */}
        <div className="flex items-center gap-6 lg:gap-8 z-10 relative">
          
          <div className="hidden lg:flex flex-col items-end gap-1">
            {/* Social Icons Group */}
            <div className="flex items-center gap-4 text-white/60">
              <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              </a>
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
              <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)}>ПРОПОЗИЦІЇ</Link>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>СЕРВІСИ</Link>
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

    {/* Booking Modal (rendered outside header to avoid stacking context issues from backdrop-blur) */}
    <BookingModal 
      isOpen={isBookingModalOpen} 
      onClose={() => setIsBookingModalOpen(false)} 
    />
    </>
  );
};

export default Header;
