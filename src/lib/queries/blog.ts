import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBBlogPost } from '../types';
import { blogPosts as staticPosts } from '../../data/blog';
import type { BlogPost } from '../../data/blog';

function mapPost(db: DBBlogPost): BlogPost {
  return {
    id: db.id,
    title: db.title,
    excerpt: db.excerpt,
    date: db.date,
    image: db.image,
    imageAlt: db.image_alt ?? undefined,
    category: db.category,
    audio: db.audio || undefined,
    sections: db.sections,
    slug: db.slug || String(db.id),
    seoTitle: db.seo_title || undefined,
    seoDescription: db.seo_description || undefined,
  };
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async (): Promise<BlogPost[]> => {
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
    queryFn: async (): Promise<BlogPost | null> => {
      const query = supabase.from('blog_posts').select('*');
      
      if (isId) {
        query.eq('id', Number(idOrSlug));
      } else {
        query.eq('slug', idOrSlug);
      }
      
      const { data, error } = await query.single();
      if (error) {
        // Якщо за slug не знайдено, спробуємо знайти старі записи за ID, якщо idOrSlug це число у форматі рядка
        if (!isId) return null;
        throw error;
      };
      return data ? mapPost(data as DBBlogPost) : null;
    },
    placeholderData: () => staticPosts.find(p => isId ? p.id === Number(idOrSlug) : p.slug === idOrSlug),
    staleTime: 5 * 60 * 1000,
  });
}
