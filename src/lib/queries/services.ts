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

function mapService(db: DBService): any {
  return {
    ...db,
    id: db.id,
    num: db.num,
    title: db.title,
    title_en: db.title_en,
    description: db.description,
    description_en: db.description_en,
    image: db.image,
    type: db.type,
    type_en: db.type_en,
    items: db.items && db.items.length > 0 ? db.items : undefined,
    items_en: db.items_en && db.items_en.length > 0 ? db.items_en : undefined,
    sections: db.sections && db.sections.length > 0 ? db.sections : undefined,
    sections_en: db.sections_en && db.sections_en.length > 0 ? db.sections_en : undefined,
    slug: db.slug || String(db.id),
    slug_en: db.slug_en,
    seoTitle: db.seo_title ?? undefined,
    seoTitle_en: db.seo_title_en ?? undefined,
    seoDescription: db.seo_description ?? undefined,
    seoDescription_en: db.seo_description_en ?? undefined,
  };
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      if (error) throw error;
      return (data as DBService[]).map(mapService);
    },
    placeholderData: staticServices as any[],
    staleTime: 5 * 60 * 1000,
  });
}

export function useService(idOrSlug: number | string) {
  const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  return useQuery({
    queryKey: ['service', idOrSlug],
    queryFn: async (): Promise<any | null> => {
      let query = supabase.from('services').select('*');
      if (isId) {
        query = query.eq('id', Number(idOrSlug));
      } else {
        query = query.or(`slug.eq."${idOrSlug}",slug_en.eq."${idOrSlug}"`);
      }
      
      const { data, error } = await query.maybeSingle();
      
      // If we got an error about missing column, retry without slug_en
      if (error && error.message.includes('slug_en')) {
        const fallbackQuery = supabase.from('services').select('*');
        if (isId) {
          fallbackQuery.eq('id', Number(idOrSlug));
        } else {
          fallbackQuery.eq('slug', idOrSlug);
        }
        const { data: retryData } = await fallbackQuery.maybeSingle();
        if (retryData) return mapService(retryData as DBService);
      }

      if (!data) {
        const found = staticServices.find(s => isId ? s.id === Number(idOrSlug) : (s as any).slug === idOrSlug) as any;
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
    placeholderData: (staticServices.find(s => isId ? s.id === Number(idOrSlug) : (s as any).slug === idOrSlug) as any) ?? null,
    staleTime: 5 * 60 * 1000,
  });
}
