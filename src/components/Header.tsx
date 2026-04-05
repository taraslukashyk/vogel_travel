import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send, MessageCircle, Facebook, X, Search } from 'lucide-react';
import logo from '../assets/logo.svg';
import { useLanguage } from '../hooks/useLanguage';
import CurrencyRates from './CurrencyRates';

// Lazy load modals - they are only shown on user interaction
const ContactModal = lazy(() => import('./ContactModal'));
const SearchPortal = lazy(() => import('./SearchPortal'));

const Header = () => {
  const { t, currentLang, changeLanguage, l } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 1) {
      setIsSearchOpen(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

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
          <div className="flex items-center gap-14">
            <CurrencyRates />
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a href="https://wa.me/380685032230" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a href="https://t.me/Taras_luka" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>

            <div className="w-px h-3 bg-white/20"></div>

            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changeLanguage('ua')}
                className={`${currentLang === 'ua' ? 'text-white' : 'text-white/40'} hover:text-white transition-colors`}
              >UA</button>
              <span className="text-white/30">/</span>
              <button 
                onClick={() => changeLanguage('en')}
                className={`${currentLang === 'en' ? 'text-white' : 'text-white/40'} hover:text-white transition-colors`}
              >EN</button>
            </div>
          </div>
        </div>

        {/* ── Main Navigation Row ── */}
        <div className="w-full bg-black/40 backdrop-blur-lg border-b border-white/10 h-[76px] xl:h-[85px]">
          <div className="max-w-[1440px] h-full mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between text-white font-montserrat tracking-wide font-medium">

            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
              <Link to={l('/')} className="flex items-center cursor-pointer group">
                <img src={logo} alt="Vogel Logo" className="w-[85px] xl:w-[95px] h-[85px] xl:h-[95px] object-contain transition-transform group-hover:scale-105" />
              </Link>
            </div>

            {/* Center: Horizontal Navigation (Desktop Only) */}
            <nav className="hidden xl:flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0.15em] ml-24 h-full">
              <Link to={l('/about')} className="hover:text-[#5cc8bd] transition-colors h-full flex items-center">{t('nav.about')}</Link>
              <Link to={l('/offers')} className="hover:text-[#5cc8bd] transition-colors h-full flex items-center">{t('nav.offers')}</Link>
              <Link to={l('/services')} className="hover:text-[#5cc8bd] transition-colors h-full flex items-center">{t('nav.services')}</Link>
              <Link to={l('/partners')} className="hover:text-[#5cc8bd] transition-colors h-full flex items-center">{t('nav.partners')}</Link>
              <Link to={l('/blog')} className="hover:text-[#5cc8bd] transition-colors h-full flex items-center">{t('nav.blog')}</Link>
              <Link to={l('/contacts')} className="hover:text-[#5cc8bd] transition-colors h-full flex items-center">{t('nav.contacts')}</Link>
            </nav>

            <div className="flex-grow hidden xl:block"></div>

            {/* Right: Search & Action Button */}
            <div className="flex items-center gap-6 shrink-0">
              {/* Open Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 focus-within:border-[#5cc8bd]/50 transition-colors"
              >
                <button type="submit" className="text-white/40 hover:text-[#5cc8bd] transition-colors">
                  <Search className="w-4 h-4" strokeWidth={2} />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t('common.search')}
                  className="bg-transparent border-none outline-none text-[11px] font-bold tracking-widest text-white placeholder:text-white/20 ml-2 w-24 lg:w-32"
                />
              </form>

              {/* Action Button: "Зв'язок" */}
              <button
                onClick={() => setIsContactModalOpen(!isContactModalOpen)}
                className="hidden sm:flex items-center justify-center border border-white/20 rounded-sm py-3 px-8 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer group text-xs lg:text-sm font-bold uppercase tracking-widest min-w-[160px]"
              >
                {isContactModalOpen ? (
                  <X className="w-5 h-5 group-hover:text-black transition-colors" strokeWidth={1.5} />
                ) : (
                  <span>{t('nav.contact_us')}</span>
                )}
              </button>

              {/* Mobile Contact Button */}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex sm:hidden items-center justify-center w-10 h-10 border border-white/20 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
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

            {/* Mobile Contact Info */}
            <div className="md:hidden flex flex-col gap-3 text-sm text-white/70 mb-4 border-b border-white/10 pb-6">
              <a href="tel:+380504692882" className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>+38 050 469 2882</a>
              <a href="tel:+380444692882" className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>+38 044 469 2882</a>
            </div>

            <div className="flex flex-col gap-6 text-lg items-end">
              <Link to={l('/about')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
              <Link to={l('/offers')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.offers')}</Link>
              <Link to={l('/services')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.services')}</Link>
              <Link to={l('/partners')} className="opacity-70" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.partners')}</Link>
              <Link to={l('/blog')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.blog')}</Link>
              <Link to={l('/contacts')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contacts')}</Link>
            </div>

            <div className="h-px bg-white/10 w-full my-2"></div>

            <button
              onClick={() => {
                setIsContactModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="sm:hidden border border-white/20 py-4 px-6 text-center text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
            >
              {t('nav.contact_us')}
            </button>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                {/* Mobile Language */}
                <div className="flex gap-4 text-sm">
                  <button 
                    onClick={() => { changeLanguage('ua'); setIsMobileMenuOpen(false); }}
                    className={currentLang === 'ua' ? 'text-white' : 'text-white/40'}
                  >UA</button>
                  <button 
                    onClick={() => { changeLanguage('en'); setIsMobileMenuOpen(false); }}
                    className={currentLang === 'en' ? 'text-white' : 'text-white/40'}
                  >EN</button>
                </div>
                <CurrencyRates />
              </div>

              {/* Mobile Socials */}
              <div className="flex flex-col items-end gap-6 mt-4">
                <div className="flex items-center gap-6 text-white/50">
                <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="https://wa.me/380685032230" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="https://t.me/Taras_luka" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Send className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      </header>

      {/* Contact Modal */}
      <Suspense fallback={null}>
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </Suspense>
      {/* Search Results Portal */}
      <Suspense fallback={null}>
        <SearchPortal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          query={searchQuery}
        />
      </Suspense>
    </>
  );
};

export default Header;
