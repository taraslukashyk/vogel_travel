import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blog';

const BlogCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const total = blogPosts.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  // Mouse/Touch drag handlers for swipe effect
  const handleDragStart = (x: number) => {
    setIsDragging(true);
    setStartX(x);
  };

  const handleDragEnd = (x: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = startX - x;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-32 border-t border-white/5 overflow-hidden"
    >
      {/* Header */}
      <div
        className={`max-w-[1440px] mx-auto px-6 md:px-12 mb-16 flex items-end justify-between transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >
        <div>
          <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.3em] text-[#5cc8bd] mb-3">
            Наш Блог
          </p>
          <h2 className="font-serif italic text-4xl md:text-5xl text-white leading-tight">
            Читайте про<br />
            <span className="text-white/50">найкращі напрямки</span>
          </h2>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Попередня стаття"
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#5cc8bd] hover:text-[#5cc8bd] transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={next}
            aria-label="Наступна стаття"
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#5cc8bd] hover:text-[#5cc8bd] transition-all duration-300 group"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Sliding track Viewport */}
      <div
        className={`relative transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ 
            transform: `translateX(calc(50% - (var(--card-width) / 2) - (${current} * (var(--card-width) + var(--gap)))))`,
            '--card-width': 'min(85vw, 840px)',
            '--gap': '32px'
          } as any}
        >
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`shrink-0 transition-all duration-700 select-none ${current === index ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
              style={{ width: 'var(--card-width)', marginRight: 'var(--gap)' }}
            >
              <Link to={`/blog/${post.id}`} className="block group">
                <article className={`relative rounded-sm overflow-hidden transition-shadow duration-500 ${current === index ? 'shadow-2xl shadow-black/60' : ''}`}>
                  {/* Image */}
                  <div className="relative h-[320px] md:h-[480px] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className={`w-full h-full object-cover transition-transform duration-1000 ${current === index ? 'group-hover:scale-105' : ''}`}
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-6 left-6">
                      <span className="font-montserrat text-[10px] font-black uppercase tracking-[0.25em] bg-[#5cc8bd] text-black px-4 py-2 rounded-[2px] shadow-lg">
                        {post.category}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <p className="font-montserrat text-[11px] text-white/50 uppercase tracking-widest mb-3">{post.date}</p>
                      <h3 className={`font-serif italic text-white leading-tight mb-4 transition-all duration-500 ${current === index ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                        {post.title}
                      </h3>
                      {current === index && (
                        <p className="font-inter text-white/60 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl opacity-0 translate-y-4 animate-fade-up">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover line */}
                  {current === index && (
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#5cc8bd] group-hover:w-full transition-all duration-700 ease-out" />
                  )}
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-3 mt-12">
        {blogPosts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Стаття ${i + 1}`}
            className={`transition-all duration-500 rounded-full h-1.5 ${i === current
                ? 'w-10 bg-[#5cc8bd]'
                : 'w-1.5 bg-white/10 hover:bg-white/30'
              }`}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-4 font-montserrat font-bold uppercase tracking-[0.2em] text-[10px] text-white/40 hover:text-[#5cc8bd] transition-all duration-300 group"
        >
          <span>Всі матеріали блогу</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </Link>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
};

export default BlogCarousel;
