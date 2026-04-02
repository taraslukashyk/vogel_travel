import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BASE_URL = 'https://vogel-travel.com.ua';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all dynamic content
    const [
      { data: services },
      { data: offers },
      { data: blogPosts },
      { data: partners }
    ] = await Promise.all([
      supabase.from('services').select('slug, slug_en').eq('is_published', true),
      supabase.from('offers').select('slug, slug_en').eq('is_published', true),
      supabase.from('blog_posts').select('slug, slug_en').eq('is_published', true),
      supabase.from('partners').select('slug, slug_en').eq('is_published', true)
    ]);

    const languages = ['ua', 'en'];
    const staticPages = ['', '/about', '/services', '/offers', '/blog', '/partners', '/contacts'];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // 1. Static Pages
    for (const lang of languages) {
      for (const page of staticPages) {
        const url = `${BASE_URL}/${lang}${page}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
      }
    }

    // 2. Services
    services?.forEach(item => {
      if (item.slug) {
        xml += `
  <url>
    <loc>${BASE_URL}/ua/services/${item.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
      if (item.slug_en) {
        xml += `
  <url>
    <loc>${BASE_URL}/en/services/${item.slug_en}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });

    // 3. Offers
    offers?.forEach(item => {
      if (item.slug) {
        xml += `
  <url>
    <loc>${BASE_URL}/ua/offers/${item.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
      }
      if (item.slug_en) {
        xml += `
  <url>
    <loc>${BASE_URL}/en/offers/${item.slug_en}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
      }
    });

    // 4. Blog Posts
    blogPosts?.forEach(item => {
      if (item.slug) {
        xml += `
  <url>
    <loc>${BASE_URL}/ua/blog/${item.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
      if (item.slug_en) {
        xml += `
  <url>
    <loc>${BASE_URL}/en/blog/${item.slug_en}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    });

    // 5. Partners
    partners?.forEach(item => {
      if (item.slug) {
        xml += `
  <url>
    <loc>${BASE_URL}/ua/partners/${item.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
      }
      if (item.slug_en) {
        xml += `
  <url>
    <loc>${BASE_URL}/en/partners/${item.slug_en}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
      }
    });

    xml += `
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
