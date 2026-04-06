import { Instagram, Send, MessageCircle, Facebook } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';

const Footer = () => {
  const { settings } = useSettings();
  const { t, l, changeLanguage, currentLang } = useLanguage();

  return (
    <footer className="w-full bg-black/60 backdrop-blur-[40px] text-white pt-24 pb-12 relative overflow-hidden font-montserrat border-t border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">

      {/* Background Ornament Influence */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

        {/* Top Section: Main Content Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-10">

          {/* Left Block: Contacts */}
          <div className="flex flex-col h-full">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-8">
              {t('footer.contacts')}
            </h2>

            <div className="flex flex-col gap-3 font-inter text-white/90 text-sm md:text-base leading-relaxed mb-8 xl:mb-0">
              <a href={`tel:${settings?.phone_primary?.replace(/\s/g, '') || '+380504692882'}`} className="hover:text-white transition-colors text-lg tracking-wider font-semibold w-fit">{settings?.phone_primary || '+38 050 469 2882'}</a>
              <a href={`tel:${settings?.phone_secondary?.replace(/\s/g, '') || '+380444692882'}`} className="hover:text-white transition-colors text-lg tracking-wider font-semibold w-fit">{settings?.phone_secondary || '+38 044 469 2882'}</a>
              <a href={`mailto:${settings?.email || 'booking@vogel.travel'}`} className="hover:text-white transition-colors text-white/70 w-fit">{settings?.email || 'booking@vogel.travel'}</a>

              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((currentLang === 'en' ? settings?.address_en : settings?.address) || 'Спортивна площа, 1А, Київ')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors max-w-sm block leading-relaxed"
                >
                  {t('footer.address_text')} <span className="underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">{(currentLang === 'en' ? settings?.address_en : settings?.address) || (currentLang === 'ua' ? 'Спортивна площа, 1А' : 'Sportyvna Square, 1A')}</span>
                </a>
                <span className="text-white/80 font-semibold block mt-1">{t('footer.by_appointment')}</span>
              </div>
            </div>

          </div>

          {/* Right Block: Newsletter & WhatsApp */}
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
              {t('footer.telegram_title')}
            </h2>
            <p className="font-inter text-white/50 text-base mb-8">
              {t('footer.telegram_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
              {/* QR Code Placeholder */}
              <a
                href={settings?.telegram_group_url || 'https://t.me/VogelTravelGroup'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 h-40 bg-white p-3 rounded-xl shrink-0 flex items-center justify-center group cursor-pointer hover:scale-105 transition-all duration-500 shadow-[0_10px_30px_rgba(255,255,255,0.1)] relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <QRCodeCanvas 
                  value={settings?.telegram_group_url || 'https://t.me/VogelTravelGroup'}
                  size={140}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: logo,
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              </a>

              <div className="flex flex-col justify-center py-2 text-left">
                <p className="font-inter text-white/50 text-sm leading-relaxed mb-4">
                  {t('footer.telegram_description')}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {t('footer.live_updates')}
                </div>
              </div>
            </div>

            {/* Email Subscription - Temporarily hidden
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <input
                type="email"
                placeholder={t('footer.newsletter_placeholder')}
                className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/30 transition-colors uppercase tracking-widest font-medium"
              />
              <button className="px-10 py-4 bg-white text-black text-sm uppercase font-bold tracking-[0.2em] hover:bg-white/90 transition-all rounded-sm">
                {t('footer.subscribe')}
              </button>
            </div>
            */}
          </div>
        </div>

        {/* Bottom Section: Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 pt-10 border-t border-white/5">

          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">{t('footer.navigation')}</h4>
            <div className="flex flex-col gap-3">
              <Link to={l('/about')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('nav.about')}</Link>
              <Link to={l('/blog')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('nav.blog')}</Link>
              <Link to={l('/contacts')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('nav.contacts')}</Link>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">{t('footer.travels')}</h4>
            <div className="flex flex-col gap-3">
              <Link to={l('/offers')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('nav.offers')}</Link>
              <Link to={l('/services')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('nav.services')}</Link>
              <Link to={l('/partners')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('nav.partners')}</Link>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">{t('footer.languages')}</h4>
            <div className="flex flex-col gap-3">
              <button onClick={() => changeLanguage('ua')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70 text-left">{t('footer.lang_ua')}</button>
              <button onClick={() => changeLanguage('en')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70 text-left">{t('footer.lang_en')}</button>
            </div>
          </div>

          {/* Col 4 - Legal */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">{t('footer.legal')}</h4>
            <div className="flex flex-col gap-3">
              <Link to={l('/public-offer')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('footer.public_offer')}</Link>
              <Link to={l('/privacy-policy')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('footer.privacy_policy')}</Link>
              <Link to={l('/refund-terms')} className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">{t('footer.refund_terms')}</Link>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
                className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70 text-left"
              >
                {t('footer.cookie_policy')}
              </button>
            </div>
          </div>

          {/* Col 5 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">{t('footer.socials')}</h4>
            <div className="flex items-center gap-6">
              <a href={settings?.instagram_url || 'https://www.instagram.com/vogel.family.travel/'} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><Instagram className="w-5 h-5" /></a>
              <a href={settings?.facebook_url || 'https://www.facebook.com/vogelfamilytravel/'} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><Facebook className="w-5 h-5" /></a>
              <a href={settings?.whatsapp_url || 'https://wa.me/380685032230'} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><MessageCircle className="w-5 h-5" /></a>
              <a href={settings?.telegram_url || 'https://t.me/Taras_luka'} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><Send className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Copy & Logo */}
        <div className="mt-20 flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <img src={logo} alt="Vogel Logo" className="w-[48px] h-[48px] opacity-30 grayscale" />
            <span className="text-[10px] md:text-[11px] font-inter font-medium tracking-wider text-white/30 text-center md:text-left leading-relaxed">
              {t('footer.copy')} <span className="hidden md:inline mx-2 text-white/10">•</span>
              <br className="md:hidden" />
              Created by <a href="https://www.linkedin.com/in/taras-lukashyk/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/10 decoration-1">Taras Lukashyk</a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
