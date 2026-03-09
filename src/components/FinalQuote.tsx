import { useEffect, useState, useRef } from 'react';

const FinalQuote = () => {
  const quoteText = '«Подорож, як найбільша і найсерйозніша наука, допомагає нам знову віднайти себе.»';
  const authorText = "– Альбер Камю";
  
  const [displayedQuote, setDisplayedQuote] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setIsTyping(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isTyping) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < quoteText.length) {
        setDisplayedQuote(quoteText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        // Add a small delay before showing author
        setTimeout(() => setShowAuthor(true), 500);
      }
    }, 50); // Speed of typing

    return () => clearInterval(typingInterval);
  }, [isTyping]);

  return (
    <section ref={sectionRef} className="w-full py-32 bg-transparent text-white relative flex flex-col items-center justify-center border-t border-white/5">
      <div className="max-w-4xl px-6 text-center flex flex-col items-center min-h-[150px]">
        {/* Quote Container */}
        <div className="relative inline-block mb-6">
          <p className="font-script text-2xl md:text-3xl lg:text-4xl text-white/90 leading-relaxed italic pr-1">
            {displayedQuote}
            <span className={`inline-block w-[2px] h-[1em] bg-white/70 ml-1 translate-y-1 align-middle transition-opacity duration-100 ${isTyping || !showAuthor ? 'animate-pulse' : 'opacity-0'}`}></span>
          </p>
        </div>
        
        {/* Author */}
        <div className={`transition-opacity duration-1000 transform mt-4 ${showAuthor ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <p className="font-montserrat uppercase tracking-widest text-white/50 text-sm md:text-base font-semibold">
              {authorText}
           </p>
        </div>
      </div>
    </section>
  );
};

export default FinalQuote;
