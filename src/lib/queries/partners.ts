import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBPartner, DBSection } from '../types';
import { partners as staticPartners } from '../../data/partners';

export interface Partner {
  id: number;
  name: string;
  category: string;
  location: string;
  logo: string;
  image: string;
  imageAlt?: string;
  description?: string;
  website?: string;
  tag?: string;
  color?: string;
  lng?: number;
  lat?: number;
  sections?: DBSection[];
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
}

function mapPartner(db: DBPartner): any {
  return {
    ...db,
    id: db.id,
    name: db.name,
    category: db.category,
    location: db.location,
    logo: db.logo,
    image: db.image,
    imageAlt: db.image_alt ?? undefined,
    description: db.description ?? undefined,
    website: db.website ?? undefined,
    tag: db.tag ?? undefined,
    color: db.color ?? undefined,
    lng: db.lng ?? undefined,
    lat: db.lat ?? undefined,
    sections: db.sections && db.sections.length > 0 ? db.sections : undefined,
    slug: db.slug || String(db.id),
    seoTitle: db.seo_title ?? undefined,
    seoDescription: db.seo_description ?? undefined,
  };
}

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      // Table may not exist yet — fall back to static data
      if (error) return staticPartners as any[];
      return (data as DBPartner[]).map(mapPartner);
    },
    placeholderData: staticPartners as any[],
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function usePartner(idOrSlug: number | string) {
  const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  return useQuery({
    queryKey: ['partner', idOrSlug],
    queryFn: async (): Promise<any | null> => {
      let query = supabase.from('partners').select('*');
      if (isId) {
        query = query.eq('id', Number(idOrSlug));
      } else {
        query = query.or(`slug.eq."${idOrSlug}",slug_en.eq."${idOrSlug}"`);
      }
      
      const { data, error } = await query.maybeSingle();
      
      // If we got an error about missing column, retry without slug_en
      if (error && error.message.includes('slug_en')) {
        const fallbackQuery = supabase.from('partners').select('*');
        if (isId) {
          fallbackQuery.eq('id', Number(idOrSlug));
        } else {
          fallbackQuery.eq('slug', idOrSlug);
        }
        const { data: retryData } = await fallbackQuery.maybeSingle();
        if (retryData) return mapPartner(retryData as DBPartner);
      }
      // Table may not exist yet or record not found — fall back to static data
      if (!data) {
        const found = staticPartners.find(p => isId ? p.id === Number(idOrSlug) : (p as any).slug === idOrSlug) as any;
        return found ?? null;
      }
      const mapped = mapPartner(data as DBPartner);
      // Use static sections as fallback when DB has none yet
      if (!mapped.sections || mapped.sections.length === 0) {
        const staticP = staticPartners.find(p => isId ? p.id === Number(idOrSlug) : (p as any).slug === idOrSlug) as any;
        if (staticP?.sections) mapped.sections = staticP.sections as DBSection[];
        if (!mapped.description && staticP?.description) mapped.description = staticP.description;
        if (staticP?.seo_title) mapped.seoTitle = staticP.seo_title;
        if (staticP?.seo_description) mapped.seoDescription = staticP.seo_description;
      }
      return mapped;
    },
    placeholderData: (staticPartners.find(p => isId ? p.id === Number(idOrSlug) : (p as any).slug === idOrSlug) as any) ?? null,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
