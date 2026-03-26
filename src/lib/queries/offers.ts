import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBOffer } from '../types';
import { offers as staticOffers } from '../../data/offers';

function mapOffer(db: DBOffer): any {
  return {
    ...db,
    id: db.id,
    location: db.location,
    hotel: db.hotel,
    image: db.image,
    imageAlt: db.image_alt ?? undefined,
    bookBy: db.book_by,
    stayFrom: db.stay_from,
    stayTo: db.stay_to,
    discount: db.discount,
    description: db.description ?? undefined,
    sections: db.sections,
    slug: db.slug || String(db.id),
    seoTitle: db.seo_title ?? undefined,
    seoDescription: db.seo_description ?? undefined,
  };
}

export function useOffers() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      if (error) throw error;
      return (data as DBOffer[]).map(mapOffer);
    },
    placeholderData: staticOffers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOffer(idOrSlug: number | string) {
  const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  return useQuery({
    queryKey: ['offers', idOrSlug],
    queryFn: async (): Promise<any | null> => {
      let query = supabase.from('offers').select('*');
      if (isId) {
        query = query.eq('id', Number(idOrSlug));
      } else {
        query = query.or(`slug.eq."${idOrSlug}",slug_en.eq."${idOrSlug}"`);
      }
      
      const { data, error } = await query.maybeSingle();
      
      // If we got an error about missing column, retry without slug_en
      if (error && error.message.includes('slug_en')) {
        const fallbackQuery = supabase.from('offers').select('*');
        if (isId) {
          fallbackQuery.eq('id', Number(idOrSlug));
        } else {
          fallbackQuery.eq('slug', idOrSlug);
        }
        const { data: retryData } = await fallbackQuery.maybeSingle();
        if (retryData) return mapOffer(retryData as DBOffer);
      }
      
      if (!data) {
        return (staticOffers.find(o => isId ? o.id === Number(idOrSlug) : (o as any).slug === idOrSlug) ?? null);
      }
      return mapOffer(data as DBOffer);
    },
    placeholderData: () => staticOffers.find(o => isId ? o.id === Number(idOrSlug) : (o as any).slug === idOrSlug) ?? null,
    staleTime: 5 * 60 * 1000,
  });
}
