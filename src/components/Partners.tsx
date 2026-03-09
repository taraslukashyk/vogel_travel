import { useRef, useState } from 'react';

// Using placeholder logos that fit the travel theme
const PARTNERS = [
  { name: 'Emirates', url: 'https://www.emirates.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/512px-Emirates_logo.svg.png?20200508092822' },
  { name: 'Four Seasons', url: 'https://www.fourseasons.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Four_Seasons_Hotels_and_Resorts_logo.svg/512px-Four_Seasons_Hotels_and_Resorts_logo.svg.png?20200215160829' },
  { name: 'Qatar Airways', url: 'https://www.qatarairways.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/512px-Qatar_Airways_Logo.svg.png?20150917024317' },
  { name: 'Ritz-Carlton', url: 'https://www.ritzcarlton.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/The_Ritz-Carlton_Hotel_Company_Logo.svg/512px-The_Ritz-Carlton_Hotel_Company_Logo.svg.png?20220104192131' },
  { name: 'Lufthansa', url: 'https://www.lufthansa.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/512px-Lufthansa_Logo_2018.svg.png' },
  { name: 'Aman Resorts', url: 'https://www.aman.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Aman_Resorts_Logo.svg/512px-Aman_Resorts_Logo.svg.png' },
];

const Partners = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate partners once to create a seamless infinite loop
  const duplicatedPartners = [...PARTNERS, ...PARTNERS];

  return (
    <section className="w-full py-16 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 mb-10 flex flex-col items-center">
        <h3 className="text-white/40 font-montserrat uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold">
          Наші партнери
        </h3>
        <div className="w-12 h-px bg-white/20 mt-4"></div>
      </div>

      <div 
        className="relative w-full overflow-hidden flex"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={containerRef}
          className={`flex gap-16 md:gap-24 items-center px-8 shrink-0 w-max ${
            isPaused ? 'animate-none' : 'animate-infinite-scroll'
          }`}
          style={{ animationDuration: '40s' }}
        >
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 transition-all duration-300"
              aria-label={`Visit ${partner.name} website`}
            >
              <img
                src={partner.logoUrl}
                alt={`${partner.name} logo`}
                className="h-8 md:h-12 w-auto object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 max-w-[120px] md:max-w-[150px]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
