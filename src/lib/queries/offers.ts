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
    bookBy: db.book_by,
    stayFrom: db.stay_from,
    stayTo: db.stay_to,
    discount: db.discount,
    description: db.description ?? undefined,
    sections: db.sections,
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

export function useOffer(id: number) {
  return useQuery({
    queryKey: ['offers', id],
    queryFn: async (): Promise<Offer | null> => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? mapOffer(data as DBOffer) : null;
    },
    placeholderData: () => staticOffers.find(o => o.id === id),
    staleTime: 5 * 60 * 1000,
  });
}
