import { useState } from 'react';

const Partners = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Array of 6 placeholders as requested
  const partnerNames = [
    'Партнер 1',
    'Партнер 2',
    'Партнер 3',
    'Партнер 4',
    'Партнер 5',
    'Партнер 6',
  ];

  return (
    <section className="w-full py-20 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <h3 className="text-white/30 font-montserrat uppercase tracking-[0.3em] text-[10px] font-black italic">
          Наші партнери
        </h3>
        <div className="w-8 h-[1px] bg-white/10 mt-4"></div>
      </div>

      <div 
        className="relative w-full overflow-hidden flex"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex gap-24 md:gap-40 items-center shrink-0 w-max animate-infinite-scroll"
          style={{ 
            animationDuration: '60s',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {/* First set of names */}
          <div className="flex gap-24 md:gap-40 items-center">
            {partnerNames.map((name, index) => (
              <div key={`partner-1-${index}`} className="flex-shrink-0 select-none">
                <span className="font-montserrat font-extrabold text-2xl md:text-5xl uppercase tracking-[0.2em] text-white/10 hover:text-white/30 transition-all duration-1000 whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Second identical set for seamless looping */}
          <div className="flex gap-24 md:gap-40 items-center">
            {partnerNames.map((name, index) => (
              <div key={`partner-2-${index}`} className="flex-shrink-0 select-none">
                <span className="font-montserrat font-extrabold text-2xl md:text-5xl uppercase tracking-[0.2em] text-white/10 hover:text-white/30 transition-all duration-1000 whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
