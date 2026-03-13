import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { blogPosts } from '../data/blog';

const ArticlePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const post = blogPosts.find(p => p.id === Number(id));
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Fix Vite base path issue for public assets
  const audioUrl = post?.audio ? (post.audio.startsWith('/') ? `${import.meta.env.BASE_URL}${post.audio.slice(1)}` : post.audio) : undefined;

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio block:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Посилання скопійовано в буфер обміну!');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Статтю не знайдено</h1>
          <Link to="/blog" className="text-[#5cc8bd] font-bold uppercase tracking-widest">
            Повернутися до блогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-200/50 text-gray-900 selection:bg-[#5cc8bd]/20">

      {/* ── Article Hero (Dark Theme Overlay for Title) ── */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for better title legibility if needed, but keeping it light and premium */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-20 w-full">
          <div className="max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-[#5cc8bd] transition-colors text-xs font-bold uppercase tracking-[0.2em] mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Назад до блогу
            </Link>

            <div className="flex items-center gap-4 text-[#5cc8bd] text-xs font-black uppercase tracking-[0.2em] mb-4">
              <span>{post.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              <span className="text-white/60 font-medium">{post.date}</span>
            </div>

            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-10 drop-shadow-sm">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 md:gap-12 pt-4">
              {/* Audio Listen Button */}
              {post.audio && (
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-3 group text-left"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg group-hover:scale-105 active:scale-95 border border-white/10 ${isPlaying ? 'bg-[#5cc8bd]' : 'bg-white/10 backdrop-blur-md'}`}>
                    {isPlaying ? (
                      <svg className="w-5 h-5 focus:outline-none" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="7" y="6" width="3" height="12" rx="1" />
                        <rect x="14" y="6" width="3" height="12" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 ml-[-2px] focus:outline-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 8.5a5 5 0 1 1 10 0c0 4-4 4-4 7a2.5 2.5 0 1 1-5 0" />
                        <path d="M14 8.5a1.5 1.5 0 0 0-3 0v1a1.5 1.5 0 1 1 0 3" />
                        <path d="M19 7a3.5 3.5 0 0 1 0 5" />
                        <path d="M21.5 5.5a6 6 0 0 1 0 8" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-montserrat font-bold text-[12px] uppercase tracking-widest text-white group-hover:text-[#5cc8bd] transition-colors">
                      {isPlaying ? 'Пауза' : 'Прослухати'}
                    </span>
                    <span className="font-inter text-[13px] font-medium text-white/40 mt-0.5">
                      {duration ? `${Math.ceil(duration / 60)} хв прослуховування` : 'Завантаження...'}
                    </span>
                  </div>

                  <audio 
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onLoadedMetadata={() => {
                      if (audioRef.current) setDuration(audioRef.current.duration);
                    }}
                    preload="auto"
                    className="hidden"
                  />
                </button>
              )}

              {/* Share Button */}
              <button 
                onClick={handleShare}
                className="flex items-center gap-3 text-white/60 hover:text-[#5cc8bd] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-widest">Поділитися</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Content (Magazine Style) ── */}
      <section className="relative py-16 px-6 md:px-8 bg-zinc-200/50">
        <div className="max-w-5xl mx-auto">
          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-serif prose-headings:italic prose-p:font-inter prose-p:leading-relaxed prose-p:text-gray-700">
            {post.sections.map((section, idx) => {
              if (section.type === 'text') {
                return (
                  <div key={idx} className="mb-12">
                    {section.title && (
                      <h2 className="text-3xl font-serif italic text-gray-900 mt-16 mb-6">
                        {section.title}
                      </h2>
                    )}
                    <p className="text-lg text-gray-700 leading-relaxed font-inter mb-6">
                      {section.content}
                    </p>
                  </div>
                );
              }

              if (section.type === 'list') {
                return (
                  <div key={idx} className="mb-12 bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-sm border-l-4 border-[#5cc8bd] shadow-sm">
                    {section.title && (
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-8">
                        {section.title}
                      </h3>
                    )}
                    <ul className="space-y-6">
                      {(section.content as string[]).map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5cc8bd] shrink-0 mt-2"></span>
                          <span className="text-lg text-gray-700 leading-relaxed font-inter italic">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (section.type === 'image') {
                return (
                  <figure key={idx} className="my-16">
                    <img
                      src={section.image}
                      alt={section.title || 'Article image'}
                      className="w-full h-auto rounded-sm shadow-xl"
                    />
                    {section.content && (
                      <figcaption className="mt-4 text-center text-sm text-gray-400 italic">
                        {section.content}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return null;
            })}
          </div>

          <div className="mt-24 pt-16 border-t border-gray-100 flex flex-col items-center">
            <p className="text-gray-400 font-serif italic text-xl mb-8">Плануєте свою наступну подорож?</p>
            <Link
              to="/services"
              className="bg-black text-white font-montserrat font-bold uppercase tracking-[0.2em] text-xs px-10 py-5 hover:bg-[#5cc8bd] transition-all duration-300 rounded-[2px]"
            >
              Переглянути наші сервіси
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
};

export default ArticlePage;
