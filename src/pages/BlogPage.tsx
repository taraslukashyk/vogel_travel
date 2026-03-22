import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../lib/queries/blog';
import type { BlogPost } from '../data/blog';
import SEOHead from '../components/SEOHead';

/* ─── Scroll-reveal hook ─── */
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-10');
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Single Blog Card ─── */
const BlogCard = ({ post, idx }: { post: BlogPost; idx: number }) => {
  const ref = useScrollReveal<HTMLAnchorElement>();
  return (
    <Link
      to={`/blog/${post.id}`}
      ref={ref}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out group"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      <article className="bg-black/40 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden hover:bg-black/60 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-4 left-4">
            <span className="bg-[#5cc8bd]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#5cc8bd]/70" />
            {post.date}
          </div>
          
          <h2 className="font-montserrat font-bold text-xl text-white leading-snug group-hover:text-[#5cc8bd] transition-colors duration-300 mb-4 line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 font-inter">
            {post.excerpt}
          </p>
          
          <div className="mt-auto flex items-center gap-2 text-[#5cc8bd] text-xs font-bold uppercase tracking-widest group/link">
            Читати далі
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
};

/* ─── Page Component ─── */
const BlogPage = () => {
  const { data: blogPosts = [] } = useBlogPosts();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollIndicator(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const introRef = useScrollReveal<HTMLDivElement>();

  return (
    <main className="w-full bg-zinc-950/95 text-white selection:bg-[#5cc8bd]/30 min-h-screen overflow-hidden relative">
      <SEOHead pagePath="/blog" fallbackTitle="Блог — Vogel Family Travel" fallbackDescription="Натхнення, практичні поради та ексклюзивні огляди найкращих місць планети." />

      {/* Background video */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          className="w-full h-full object-cover opacity-20"
          src="about-video.mp4"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
      </div>

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[60vh] min-h-[480px] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
          alt="Blog hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <h1 className="font-montserrat font-extrabold uppercase tracking-tight leading-none">
            <span className="block text-white/30 text-2xl md:text-3xl mb-2">Vogel Family Travel</span>
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
              Блог
            </span>
          </h1>

          <div className={`absolute bottom-10 right-10 flex flex-col items-center gap-2 transition-opacity duration-[2000ms] ease-in-out ${showScrollIndicator ? 'opacity-100 animate-pulse' : 'opacity-0 pointer-events-none'}`}>
            <span className="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Гортай</span>
            <div className="scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* ── Intro Section ── */}
      <section className="relative z-10 bg-zinc-950 border-y border-white/5 py-14">
        <div
          ref={introRef}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out max-w-[1440px] mx-auto px-6 md:px-12"
        >
          <div className="max-w-3xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-white/30" />
              Мистецтво подорожувати
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              Ділимося натхненням, практичними порадами та ексклюзивними оглядами найкращих місць планети. Наш блог — це компас у світі розкішного відпочинку та справжніх емоцій.
            </p>
          </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <BlogCard key={post.id} post={post} idx={idx} />
          ))}
        </div>
      </section>

    </main>
  );
};

export default BlogPage;
