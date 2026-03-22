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
    category: db.category,
    audio: db.audio ?? undefined,
    sections: db.sections,
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

export function useBlogPost(id: number) {
  return useQuery({
    queryKey: ['blog_posts', id],
    queryFn: async (): Promise<BlogPost | null> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? mapPost(data as DBBlogPost) : null;
    },
    placeholderData: () => staticPosts.find(p => p.id === id),
    staleTime: 5 * 60 * 1000,
  });
}
