import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBService } from '../types';
import { services as staticServices } from '../../data/services';

export interface Service {
  id: number;
  num: string;
  title: string;
  description: string;
  image: string;
  type: string;
  items?: Array<{ label: string; text: string }>;
}

function mapService(db: DBService): Service {
  return {
    id: db.id,
    num: db.num,
    title: db.title,
    description: db.description,
    image: db.image,
    type: db.type,
    items: db.items.length > 0 ? db.items : undefined,
  };
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      if (error) throw error;
      return (data as DBService[]).map(mapService);
    },
    placeholderData: staticServices as Service[],
    staleTime: 5 * 60 * 1000,
  });
}
