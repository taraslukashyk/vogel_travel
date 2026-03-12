import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send, MessageCircle, Facebook, X, Search } from 'lucide-react';
import logo from '../assets/logo.svg';
import BookingModal from './BookingModal';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-auto flex flex-col">
        
        {/* ── Top Bar Container ── */}
        <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/5 py-1.5 px-6 md:px-8 lg:px-12 hidden md:flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/70">
          
          {/* Left: Phone Numbers */}
          <div className="flex items-center gap-6">
            <a href="tel:+380504692882" className="hover:text-white transition-colors flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              +38 050 469 2882
            </a>
            <a href="tel:+380444692882" className="hover:text-white transition-colors flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              +38 044 469 2882
            </a>
          </div>

          {/* Right: Socials & Language */}
          <div className="flex items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a href="#" target="_blank" className="hover:text-white transition-colors">
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>

            <div className="w-px h-3 bg-white/20"></div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <button className="text-white hover:text-white transition-colors">UA</button>
              <span className="text-white/30">/</span>
              <button className="text-white/40 hover:text-white transition-colors">EN</button>
            </div>
          </div>
        </div>

        {/* ── Main Navigation Row ── */}
        <div className="w-full bg-black/40 backdrop-blur-lg border-b border-white/10 h-[90px] xl:h-[100px]">
          <div className="max-w-[1440px] h-full mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between text-white font-montserrat tracking-wide font-medium">

            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center cursor-pointer group">
                <img src={logo} alt="Vogel Logo" className="w-[100px] xl:w-[120px] h-[100px] xl:h-[120px] object-contain transition-transform group-hover:scale-105" />
              </Link>
            </div>

            {/* Center: Horizontal Navigation (Desktop Only) */}
            <nav className="hidden xl:flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0.15em] ml-8">
              <Link to="/about" className="hover:text-white/70 transition-colors py-2">ПРО НАС</Link>
              <Link to="/offers" className="hover:text-white/70 transition-colors py-2">ПРОПОЗИЦІЇ</Link>
              <Link to="/services" className="hover:text-white/70 transition-colors py-2">СЕРВІСИ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors py-2">ПАРТНЕРСТВО</Link>
              <Link to="#" className="hover:text-white/70 transition-colors py-2">БЛОГ</Link>
              <Link to="#" className="hover:text-white/70 transition-colors py-2">КОНТАКТИ</Link>
            </nav>

            <div className="flex-grow hidden xl:block"></div>

            {/* Right: Search & Action Button */}
            <div className="flex items-center gap-6 shrink-0">
              {/* Search Icon */}
              <button className="hidden sm:flex text-white/60 hover:text-white transition-colors p-2">
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Action Button: "Тарифи" */}
              <button
                onClick={() => setIsBookingModalOpen(!isBookingModalOpen)}
                className="hidden sm:flex items-center justify-center border border-white/20 rounded-sm py-3 px-8 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer group text-xs lg:text-sm font-bold uppercase tracking-widest min-w-[160px]"
              >
                {isBookingModalOpen ? (
                  <X className="w-5 h-5 group-hover:text-black transition-colors" strokeWidth={1.5} />
                ) : (
                  <span>ТАРИФИ</span>
                )}
              </button>

              {/* Mobile Hamburger Trigger */}
              <button
                className="xl:hidden flex items-center p-2 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-7 h-7" strokeWidth={1.5} />
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-10 6h10" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 p-8 flex flex-col gap-8 text-white font-montserrat tracking-widest uppercase font-semibold animate-in fade-in slide-in-from-top-2 max-h-[calc(100vh-100px)] overflow-y-auto">
            
            {/* Mobile Contact Info (shown in menu if top bar is hidden on mobile) */}
            <div className="md:hidden flex flex-col gap-3 text-sm text-white/70 mb-4 border-b border-white/10 pb-6">
              <a href="tel:+380504692882" className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>+38 050 469 2882</a>
              <a href="tel:+380444692882" className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>+38 044 469 2882</a>
            </div>

            <div className="flex flex-col gap-6 text-lg">
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>ПРО НАС</Link>
              <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)}>ПРОПОЗИЦІЇ</Link>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>СЕРВІСИ</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>ПАРТНЕРСТВО</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>БЛОГ</Link>
              <Link to="#" className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>КОНТАКТИ</Link>
            </div>
            
            <div className="h-px bg-white/10 w-full my-2"></div>
            
            <button
              onClick={() => {
                setIsBookingModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="sm:hidden border border-white/20 py-4 px-6 text-center text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
            >
              ПЕРЕВІРИТИ ТАРИФИ
            </button>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
               {/* Mobile Language */}
               <div className="flex gap-4 text-sm">
                <button className="text-white">UA</button>
                <button className="text-white/40">EN</button>
              </div>
              
              {/* Mobile Socials */}
              <div className="flex items-center gap-6 text-white/50">
                <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </>
  );
};

export default Header;
