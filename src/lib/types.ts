export interface DBOffer {
  id: number;
  location: string;
  hotel: string;
  image: string;
  image_alt: string | null;
  book_by: string;
  stay_from: string;
  stay_to: string;
  discount: string;
  description: string | null;
  sections: DBSection[];
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBService {
  id: number;
  num: string;
  title: string;
  description: string;
  image: string;
  type: string;
  items: DBServiceItem[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBBlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  image_alt: string | null;
  category: string;
  audio: string | null;
  sections: DBSection[];
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBSection {
  type: 'text' | 'image' | 'list';
  title?: string;
  content: string | string[];
  image?: string;
  alt?: string;
}

export interface DBServiceItem {
  label: string;
  text: string;
}

export interface DBSeoMeta {
  id: number;
  page_path: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  keywords: string | null;
  canonical_url: string | null;
  updated_at: string;
}
