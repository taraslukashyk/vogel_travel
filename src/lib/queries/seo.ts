import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { DBSeoMeta } from '../types';

export function useSeoMeta(pagePath: string) {
  return useQuery({
    queryKey: ['seo_meta', pagePath],
    queryFn: async (): Promise<DBSeoMeta | null> => {
      const { data, error } = await supabase
        .from('seo_meta')
        .select('*')
        .eq('page_path', pagePath)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as DBSeoMeta | null;
    },
    staleTime: 10 * 60 * 1000,
  });
}
