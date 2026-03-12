import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { blogPosts } from '../data/blog';

const ArticlePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const post = blogPosts.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <main className="min-h-screen bg-white text-gray-900 selection:bg-[#5cc8bd]/20">
      
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
            
            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 drop-shadow-sm">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Article Content (Magazine Style) ── */}
      <section className="relative py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="flex items-center justify-between mb-16 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Calendar className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Опубліковано</p>
                <p className="text-sm font-medium text-gray-900">{post.date}</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#5cc8bd] transition-colors group">
              <span className="text-[11px] font-bold uppercase tracking-widest">Поділитися</span>
              <Share2 className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
            </button>
          </div>

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
                  <div key={idx} className="mb-12 bg-gray-50 p-8 md:p-12 rounded-sm border-l-4 border-[#5cc8bd]">
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
                  <figure key={idx} className="my-16 -mx-6 md:-mx-20">
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
