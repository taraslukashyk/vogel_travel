
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nuzljtexciclocgcinjh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51emxqdGV4Y2ljbG9jZ2NpbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTEwNjksImV4cCI6MjA4OTc4NzA2OX0.VQQchNArL7CdB7E2L_FrfPsJCRWiuPUdPwCVc3USXdc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    console.log('--- Counts ---');
    const { count: sCount } = await supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_published', true);
    const { count: bCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true);
    const { count: pCount } = await supabase.from('partners').select('*', { count: 'exact', head: true }).eq('is_published', true);
    
    console.log('Services (published):', sCount);
    console.log('Blog Posts (published):', bCount);
    console.log('Partners (published):', pCount);

    const { count: sAll } = await supabase.from('services').select('*', { count: 'exact', head: true });
    console.log('Services (all):', sAll);
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

check();
