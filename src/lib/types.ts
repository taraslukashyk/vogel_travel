export interface DBOffer {
  id: number;
  location: string;
  hotel: string;
  location_en?: string;
  hotel_en?: string;
  image: string;
  image_alt: string | null;
  image_alt_en?: string;
  book_by: string;
  stay_from: string;
  stay_to: string;
  discount: string;
  book_by_en?: string;
  stay_from_en?: string;
  stay_to_en?: string;
  discount_en?: string;
  description: string | null;
  description_en?: string;
  sections: DBSection[];
  sections_en?: DBSection[];
  seo_title: string | null;
  seo_title_en?: string;
  seo_description: string | null;
  seo_description_en?: string;
  country?: string;
  country_en?: string;
  city?: string;
  city_en?: string;
  slug: string | null;
  slug_en?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBService {
  id: number;
  num: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image: string;
  image_alt?: string | null;
  image_alt_en?: string;
  type: string;
  type_en?: string;
  items: DBServiceItem[];
  items_en?: DBServiceItem[];
  sections: DBSection[];
  sections_en?: DBSection[];
  seo_title: string | null;
  seo_title_en?: string;
  seo_description: string | null;
  seo_description_en?: string;
  slug: string | null;
  slug_en?: string;
  sort_order: number;
  price?: number | null;
  is_for_payment: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBPartner {
  id: number;
  name: string;
  name_en?: string;
  category: string;
  category_en?: string;
  location: string;
  location_en?: string;
  logo: string;
  image: string;
  image_alt: string | null;
  image_alt_en?: string;
  description: string | null;
  description_en?: string;
  website: string | null;
  tag: string | null;
  tag_en?: string;
  color: string | null;
  lng: number | null;
  lat: number | null;
  sections: DBSection[];
  sections_en?: DBSection[];
  seo_title: string | null;
  seo_title_en?: string;
  seo_description: string | null;
  seo_description_en?: string;
  slug: string | null;
  slug_en?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBBlogPost {
  id: number;
  title: string;
  title_en?: string;
  excerpt: string;
  excerpt_en?: string;
  date: string;
  image: string;
  image_alt: string | null;
  image_alt_en?: string;
  category: string;
  category_en?: string;
  audio: string | null;
  audio_en?: string | null;
  sections: DBSection[];
  sections_en?: DBSection[];
  seo_title: string | null;
  seo_title_en?: string;
  seo_description: string | null;
  seo_description_en?: string;
  slug: string | null;
  slug_en?: string;
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

export interface DBPayment {
  id: string;
  invoice_id: string | null;
  status: 'pending' | 'processing' | 'success' | 'failure' | 'reversed' | 'expired';
  amount: number;
  ccy: number;
  final_amount: number | null;
  service_id: number | null;
  service_title: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  reference: string | null;
  failure_reason: string | null;
  payment_info: Record<string, any> | null;
  monobank_modified_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBSeoMeta {
  id: number;
  page_path: string;
  title: string | null;
  title_en?: string;
  description: string | null;
  description_en?: string;
  og_title: string | null;
  og_title_en?: string;
  og_description: string | null;
  og_description_en?: string;
  og_image: string | null;
  keywords: string | null;
  keywords_en?: string | null;
  canonical_url: string | null;
  updated_at: string;
}
