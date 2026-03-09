import { Instagram, Send, MessageCircle, Facebook } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-black/60 backdrop-blur-[40px] text-white pt-24 pb-12 relative overflow-hidden font-montserrat border-t border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">

      {/* Background Ornament Influence */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

        {/* Top Section: Main Content Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-10">

          {/* Left Block: Destinations */}
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-8">
              Напрямки
            </h2>
            <p className="font-inter text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-md">
              Відкрийте для себе найдивовижніші куточки світу — від прихованих островів до найпопулярніших мегаполісів.
              Ми створюємо маршрути, що надихають і залишають незабутні спогади.
            </p>
            <button className="w-full py-4 bg-white/5 border border-white/10 text-white uppercase tracking-[0.2em] font-bold text-sm hover:bg-white hover:text-black transition-all duration-500 rounded-sm">
              Дослідити Напрямки
            </button>
          </div>

          {/* Right Block: Newsletter & WhatsApp */}
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
              Telegram Канал
            </h2>
            <p className="font-inter text-white/50 text-base mb-8">
              Якщо ви з мобільного пристрою — просто натисніть на QR-код.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
              {/* QR Code Placeholder */}
              <div className="w-40 h-40 bg-white p-2 rounded-sm shrink-0 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-500">
                {/* This represents a QR code */}
                <div className="w-full h-full border-2 border-black border-dashed flex items-center justify-center opacity-80">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-black/20" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center py-2 text-left">
                <p className="font-inter text-white/50 text-sm leading-relaxed mb-4">
                  Ексклюзивна VIP-група у Telegram для отримання найкращих пропозицій, преміальних готелів та трендових маршрутів по всьому світу.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Оновлення
                </div>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <input
                type="email"
                placeholder="Введіть вашу e-mail адресу"
                className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white/30 transition-colors uppercase tracking-widest font-medium"
              />
              <button className="px-10 py-4 bg-white text-black text-sm uppercase font-bold tracking-[0.2em] hover:bg-white/90 transition-all rounded-sm">
                Підписатися
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-10 border-t border-white/5">

          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">Навігація</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">ПРО НАС</a>
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">БЛОГ</a>
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">КОНТАКТИ</a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">Подорожі</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">ПРОПОЗИЦІЇ</a>
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">СЕРВІСИ</a>
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">ПАРТНЕРСТВО</a>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">Мови</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">УКРАЇНСЬКА</a>
              <a href="#" className="text-[13px] uppercase font-bold tracking-widest hover:text-white transition-colors text-white/70">ENGLISH</a>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30">Соцмережі</h4>
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/vogel.family.travel/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/vogelfamilytravel/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white transition-all transform hover:scale-110"><Send className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Copy & Logo */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Vogel Logo" className="w-8 h-8 opacity-50 grayscale" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">
              © 2026 Vogel Family Travel. Всі права захищено. • 
              Created by <a href="https://www.linkedin.com/in/taras-lukashyk/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/10 decoration-1">Taras Lukashyk</a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
