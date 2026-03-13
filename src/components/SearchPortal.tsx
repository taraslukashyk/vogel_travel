import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, BookOpen, ArrowRight, X } from 'lucide-react';
import { offers } from '../data/offers';
import { services } from '../data/services';
import { blogPosts } from '../data/blog';

interface SearchPortalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchPortal: React.FC<SearchPortalProps> = ({ isOpen, onClose, query }) => {
  const filteredResults = useMemo(() => {
    if (!query || query.length < 2) return null;

    const q = query.toLowerCase();

    const matchedOffers = offers.filter(
      (o) => o.hotel.toLowerCase().includes(q) || o.location.toLowerCase().includes(q)
    );
    const matchedServices = services.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
    );
    const matchedBlog = blogPosts.filter(
      (b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)
    );

    return {
      offers: matchedOffers,
      services: matchedServices,
      blog: matchedBlog,
      total: matchedOffers.length + matchedServices.length + matchedBlog.length
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[100px] pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Results Container */}
      <div className="relative w-full max-w-4xl mx-auto px-6 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-zinc-900/90 border border-white/10 rounded-sm shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Active Search Context */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-[#5cc8bd]" strokeWidth={2} />
              <span className="text-white/40 font-montserrat text-xs uppercase tracking-widest">Результати пошуку для:</span>
              <span className="text-white font-bold tracking-wider italic">"{query}"</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {!filteredResults || filteredResults.total === 0 ? (
              <div className="p-12 text-center">
                <p className="text-white/60 font-inter text-lg mb-8 leading-relaxed">
                  На жаль, за вашим запитом нічого не знайдено.<br/>
                  <span className="text-white/30 text-sm">Але ви завжди можете перейти на відповідну вкладку та обрати саме те, що вас цікавить:</span>
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/offers" onClick={onClose} className="border border-white/10 px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white hover:text-black transition-all">Пропозиції</Link>
                  <Link to="/services" onClick={onClose} className="border border-white/10 px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white hover:text-black transition-all">Сервіси</Link>
                  <Link to="/blog" onClick={onClose} className="border border-white/10 px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white hover:text-black transition-all">Блог</Link>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-12">
                
                {/* Offers Category */}
                {filteredResults.offers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-4 h-4 text-[#5cc8bd]" />
                      <h3 className="text-[#5cc8bd] font-montserrat text-[11px] font-black uppercase tracking-[0.2em]">Пропозиції</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResults.offers.map(offer => (
                        <Link key={offer.id} to={`/offers/${offer.id}`} onClick={onClose} className="group p-4 bg-white/5 border border-white/5 hover:border-[#5cc8bd]/30 rounded-sm transition-all flex gap-4">
                          <div className="w-20 h-20 shrink-0 rounded-sm overflow-hidden">
                            <img src={offer.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={offer.hotel} />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#5cc8bd] transition-colors">{offer.hotel}</h4>
                            <p className="text-white/40 text-[11px] uppercase tracking-widest">{offer.location}</p>
                            {offer.discount && <span className="inline-block mt-2 text-[#5cc8bd] text-[10px] font-bold">Знижка {offer.discount}</span>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Category */}
                {filteredResults.services.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="w-4 h-4 text-[#5cc8bd]" />
                      <h3 className="text-[#5cc8bd] font-montserrat text-[11px] font-black uppercase tracking-[0.2em]">Сервіси</h3>
                    </div>
                    <div className="space-y-4">
                      {filteredResults.services.map(service => (
                        <Link key={service.id} to={`/services#service-${service.id}`} onClick={onClose} className="group block p-5 bg-white/5 border border-white/5 hover:border-[#5cc8bd]/30 rounded-sm transition-all">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-white font-bold text-base mb-2 group-hover:text-[#5cc8bd] transition-colors">{service.title}</h4>
                              <p className="text-white/40 text-sm leading-relaxed line-clamp-2 max-w-2xl">{service.description}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#5cc8bd] group-hover:translate-x-2 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Category */}
                {filteredResults.blog.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-4 h-4 text-[#5cc8bd]" />
                      <h3 className="text-[#5cc8bd] font-montserrat text-[11px] font-black uppercase tracking-[0.2em]">Блог</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredResults.blog.map(post => (
                        <Link key={post.id} to={`/blog/${post.id}`} onClick={onClose} className="group flex flex-col gap-4">
                          <div className="aspect-video w-full rounded-sm overflow-hidden bg-white/5">
                            <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#5cc8bd] uppercase tracking-widest">{post.category}</span>
                            <h4 className="text-white font-bold text-base mt-2 mb-2 group-hover:text-[#5cc8bd] transition-colors">{post.title}</h4>
                            <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white/5 text-center">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Vogel Family Travel — Шукайте найкраще</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPortal;
