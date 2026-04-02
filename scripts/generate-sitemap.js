import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const BASE_URL = 'https://www.vogel.travel';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// These should be set in the environment or .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL or Key is missing. Skipping sitemap generation.');
  process.exit(0); // Exit gracefully during build if not available
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generate() {
  console.log('🚀 Starting Sitemap generation...');

  try {
    // 1. Fetch dynamic content
    const [
      { data: services },
      { data: offers },
      { data: blogPosts },
      { data: partners }
    ] = await Promise.all([
      supabase.from('services').select('slug, slug_en').eq('is_published', true),
      supabase.from('offers').select('slug, slug_en', 'is_published', true), // Added published check
      supabase.from('blog_posts').select('slug, slug_en').eq('is_published', true),
      supabase.from('partners').select('slug, slug_en')
    ]);

    // 2. Define static routes
    const languages = ['ua', 'en'];
    const staticPages = ['', '/about', '/services', '/offers', '/blog', '/partners', '/contacts'];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Static Pages
    for (const lang of languages) {
      for (const page of staticPages) {
        const url = `${BASE_URL}/${lang}${page}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
      }
    }

    // Dynamic: Services
    services?.forEach(item => {
      if (item.slug) xml += `\n  <url><loc>${BASE_URL}/ua/services/${item.slug}</loc><priority>0.7</priority></url>`;
      if (item.slug_en) xml += `\n  <url><loc>${BASE_URL}/en/services/${item.slug_en}</loc><priority>0.7</priority></url>`;
    });

    // Dynamic: Offers
    offers?.forEach(item => {
      if (item.slug) xml += `\n  <url><loc>${BASE_URL}/ua/offers/${item.slug}</loc><priority>0.9</priority></url>`;
      if (item.slug_en) xml += `\n  <url><loc>${BASE_URL}/en/offers/${item.slug_en}</loc><priority>0.9</priority></url>`;
    });

    // Dynamic: Blog
    blogPosts?.forEach(item => {
      if (item.slug) xml += `\n  <url><loc>${BASE_URL}/ua/blog/${item.slug}</loc><priority>0.6</priority></url>`;
      if (item.slug_en) xml += `\n  <url><loc>${BASE_URL}/en/blog/${item.slug_en}</loc><priority>0.6</priority></url>`;
    });

    // Dynamic: Partners
    partners?.forEach(item => {
      if (item.slug) xml += `\n  <url><loc>${BASE_URL}/ua/partners/${item.slug}</loc><priority>0.5</priority></url>`;
      if (item.slug_en) xml += `\n  <url><loc>${BASE_URL}/en/partners/${item.slug_en}</loc><priority>0.5</priority></url>`;
    });

    xml += `\n</urlset>`;

    // 3. Save to public folder
    const outputPath = path.join(PUBLIC_DIR, 'sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`✅ Sitemap successfully generated at ${outputPath}`);

  } catch (err) {
    console.error('❌ Error generating sitemap:', err);
  }
}

generate();
