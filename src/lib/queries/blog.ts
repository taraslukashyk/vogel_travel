import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBBlogPost } from '../types';
import { blogPosts as staticPosts } from '../../data/blog';

function mapPost(db: DBBlogPost): any {
  return {
    ...db,
    id: db.id,
    title: db.title,
    title_en: db.title_en,
    excerpt: db.excerpt,
    excerpt_en: db.excerpt_en,
    date: db.date,
    image: db.image,
    imageAlt: db.image_alt ?? undefined,
    imageAlt_en: db.image_alt_en ?? undefined,
    category: db.category,
    category_en: db.category_en,
    audio: db.audio || undefined,
    audio_en: db.audio_en || undefined,
    sections: db.sections,
    sections_en: db.sections_en,
    slug: db.slug || String(db.id),
    slug_en: db.slug_en,
    seoTitle: db.seo_title || undefined,
    seoTitle_en: db.seo_title_en || undefined,
    seoDescription: db.seo_description || undefined,
    seoDescription_en: db.seo_description_en || undefined,
  };
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      if (error) throw error;
      return (data as DBBlogPost[]).map(mapPost);
    },
    placeholderData: staticPosts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPost(idOrSlug: number | string) {
  const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
  return useQuery({
    queryKey: ['blog_posts', idOrSlug],
    queryFn: async (): Promise<any | null> => {
      let query = supabase.from('blog_posts').select('*');
      if (isId) {
        query = query.eq('id', Number(idOrSlug));
      } else {
        query = query.or(`slug.eq."${idOrSlug}",slug_en.eq."${idOrSlug}"`);
      }
      
      const { data, error } = await query.maybeSingle();
      
      // If we got an error about missing column, retry without slug_en
      if (error && error.message.includes('slug_en')) {
        const fallbackQuery = supabase.from('blog_posts').select('*');
        if (isId) {
          fallbackQuery.eq('id', Number(idOrSlug));
        } else {
          fallbackQuery.eq('slug', idOrSlug);
        }
        const { data: retryData } = await fallbackQuery.maybeSingle();
        if (retryData) return mapPost(retryData as DBBlogPost);
      }

      if (!data) {
        return (staticPosts.find(p => isId ? p.id === Number(idOrSlug) : p.slug === idOrSlug) ?? null);
      };
      return mapPost(data as DBBlogPost);
    },
    placeholderData: () => staticPosts.find(p => isId ? p.id === Number(idOrSlug) : p.slug === idOrSlug) ?? null,
    staleTime: 5 * 60 * 1000,
  });
}
