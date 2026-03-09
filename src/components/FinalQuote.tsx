import { useEffect, useState, useRef } from 'react';

const FinalQuote = () => {
  const quoteText = '«Подорож, як найбільша і найсерйозніша наука, допомагає нам знову віднайти себе.»';
  const authorText = "– Альбер Камю";
  
  const [displayedQuote, setDisplayedQuote] = useState('');
  const [displayedAuthor, setDisplayedAuthor] = useState('');
  const [isTypingQuote, setIsTypingQuote] = useState(false);
  const [isTypingAuthor, setIsTypingAuthor] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setIsTypingQuote(true);
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

  // Type quote
  useEffect(() => {
    if (!isTypingQuote) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < quoteText.length) {
        setDisplayedQuote(quoteText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingQuote(false);
        setTimeout(() => setIsTypingAuthor(true), 600);
      }
    }, 45); 

    return () => clearInterval(typingInterval);
  }, [isTypingQuote]);

  // Type author
  useEffect(() => {
    if (!isTypingAuthor) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < authorText.length) {
        setDisplayedAuthor(authorText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingAuthor(false);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [isTypingAuthor]);

  return (
    <section ref={sectionRef} className="w-full py-40 bg-transparent text-white relative flex flex-col items-center justify-center border-t border-white/5">
      <div className="max-w-6xl w-full px-8 text-left flex flex-col items-start min-h-[200px]">
        {/* Quote Container */}
        <div className="relative mb-8">
          <p className="font-script text-3xl md:text-5xl lg:text-5xl text-white/90 leading-[1.3] italic">
            {displayedQuote}
            {isTypingQuote && (
              <span className="inline-block w-4 h-[2px] bg-white/70 ml-2 mb-2 animate-pulse align-baseline" />
            )}
          </p>
        </div>
        
        {/* Author Container */}
        <div className="min-h-[30px]">
           <p className="font-montserrat uppercase tracking-[0.3em] text-white/40 text-sm md:text-lg font-bold">
              {displayedAuthor}
              {isTypingAuthor && (
                <span className="inline-block w-3 h-[2px] bg-white/40 ml-1 mb-1 animate-pulse align-baseline" />
              )}
           </p>
        </div>
      </div>
    </section>
  );
};

export default FinalQuote;
