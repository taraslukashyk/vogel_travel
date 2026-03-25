import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBService, DBSection } from '../types';
import { services as staticServices } from '../../data/services';

export interface Service {
  id: number;
  num: string;
  title: string;
  description: string;
  image: string;
  type: string;
  items?: Array<{ label: string; text: string }>;
  sections?: DBSection[];
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
}

function mapService(db: DBService): Service {
  return {
    id: db.id,
    num: db.num,
    title: db.title,
    description: db.description,
    image: db.image,
    type: db.type,
    items: db.items && db.items.length > 0 ? db.items : undefined,
    sections: db.sections && db.sections.length > 0 ? db.sections : undefined,
    slug: db.slug || String(db.id),
    seoTitle: db.seo_title ?? undefined,
    seoDescription: db.seo_description ?? undefined,
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

export function useService(idOrSlug: number | string) {
  const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  return useQuery({
    queryKey: ['service', idOrSlug],
    queryFn: async (): Promise<Service | null> => {
      const query = supabase.from('services').select('*');
      if (isId) {
        query.eq('id', Number(idOrSlug));
      } else {
        query.eq('slug', idOrSlug);
      }
      const { data, error } = await query.single();
      if (error) {
        const found = staticServices.find(s => isId ? s.id === Number(idOrSlug) : (s as any).slug === idOrSlug) as Service;
        return found ?? null;
      }
      const mapped = mapService(data as DBService);
      // Use static sections as fallback when DB has none yet
      if (!mapped.sections || mapped.sections.length === 0) {
        const staticSvc = staticServices.find(s => isId ? s.id === Number(idOrSlug) : (s as any).slug === idOrSlug) as any;
        if (staticSvc?.sections) mapped.sections = staticSvc.sections as DBSection[];
        if (!mapped.seoTitle && staticSvc?.seoTitle) mapped.seoTitle = staticSvc.seoTitle;
        if (!mapped.seoDescription && staticSvc?.seoDescription) mapped.seoDescription = staticSvc.seoDescription;
      }
      return mapped;
    },
    placeholderData: (staticServices.find(s => isId ? s.id === Number(idOrSlug) : (s as any).slug === idOrSlug) as Service) ?? null,
    staleTime: 5 * 60 * 1000,
  });
}
