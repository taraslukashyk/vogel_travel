
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nuzljtexciclocgcinjh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51emxqdGV4Y2ljbG9jZ2NpbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTEwNjksImV4cCI6MjA4OTc4NzA2OX0.VQQchNArL7CdB7E2L_FrfPsJCRWiuPUdPwCVc3USXdc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    console.log('--- Services ---');
    const { data: services, error: sErr } = await supabase.from('services').select('id, slug, slug_en, is_published, title').limit(10);
    if (sErr) console.error('Services Error:', sErr);
    else console.log(JSON.stringify(services, null, 2));

    console.log('\n--- Blog Posts ---');
    const { data: blog, error: bErr } = await supabase.from('blog_posts').select('id, slug, slug_en, is_published, title').limit(10);
    if (bErr) console.error('Blog Error:', bErr);
    else console.log(JSON.stringify(blog, null, 2));

    console.log('\n--- Partners ---');
    const { data: partners, error: pErr } = await supabase.from('partners').select('id, slug, slug_en, is_published, name').limit(10);
    if (pErr) console.error('Partners Error:', pErr);
    else console.log(JSON.stringify(partners, null, 2));
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

check();
