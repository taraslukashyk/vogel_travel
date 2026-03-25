import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBOffer } from '../types';
import { offers as staticOffers } from '../../data/offers';
import type { Offer } from '../../data/offers';

function mapOffer(db: DBOffer): Offer {
  return {
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
    queryFn: async (): Promise<Offer[]> => {
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
    queryFn: async (): Promise<Offer | null> => {
      const query = supabase.from('offers').select('*');
      if (isId) {
        query.eq('id', Number(idOrSlug));
      } else {
        query.eq('slug', idOrSlug);
      }
      const { data, error } = await query.single();
      // Table may not exist yet or record not found — fall back to static data
      if (error) {
        return (staticOffers.find(o => isId ? o.id === Number(idOrSlug) : (o as any).slug === idOrSlug) ?? null);
      }
      return data ? mapOffer(data as DBOffer) : null;
    },
    placeholderData: () => staticOffers.find(o => isId ? o.id === Number(idOrSlug) : (o as any).slug === idOrSlug) ?? null,
    staleTime: 5 * 60 * 1000,
  });
}
