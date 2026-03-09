const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-[1440px] mx-auto h-full px-6 md:px-8 lg:px-12 flex items-center justify-between">

        {/* Left: Contacts */}
        <div className="flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-widest text-white/70">
          <a href="tel:+380634535983" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +38 (063) 453-59-83
          </a>
          <span className="hidden md:block text-white/30">·</span>
          <a href="https://t.me/me_ppo" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.04 13.99l-2.968-.924c-.643-.204-.657-.643.136-.953l11.57-4.462c.537-.194 1.006.131.836.95l.12-.38z"/>
            </svg>
            @me_ppo
          </a>
        </div>

        {/* Center: Tagline */}
        <p className="hidden lg:block font-script text-sm text-white/60 italic absolute left-1/2 -translate-x-1/2">
          Кожна подорож — це історія, яку ви розповідатимете роками
        </p>

        {/* Right: Socials + Language */}
        <div className="flex items-center gap-4">
          {/* Instagram */}
          <a href="#" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>

          <div className="w-px h-3.5 bg-white/20"></div>

          {/* Language switcher */}
          <div className="flex items-center gap-2 font-montserrat text-[11px] uppercase tracking-widest">
            <button className="text-white hover:text-white/80 transition-colors">УКР</button>
            <span className="text-white/20">/</span>
            <button className="text-white/50 hover:text-white transition-colors">ENG</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopBar;
