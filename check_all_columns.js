
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nuzljtexciclocgcinjh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51emxqdGV4Y2ljbG9jZ2NpbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTEwNjksImV4cCI6MjA4OTc4NzA2OX0.VQQchNArL7CdB7E2L_FrfPsJCRWiuPUdPwCVc3USXdc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    console.log('--- Services columns ---');
    const { data: sData, error: sErr } = await supabase.from('services').select('*').limit(1).single();
    if (sErr) console.log('S Error:', sErr.message); else console.log('S:', Object.keys(sData));

    console.log('--- Blog columns ---');
    const { data: bData, error: bErr } = await supabase.from('blog_posts').select('*').limit(1).single();
    if (bErr) console.log('B Error:', bErr.message); else console.log('B:', Object.keys(bData));

    console.log('--- Partners columns ---');
    const { data: pData, error: pErr } = await supabase.from('partners').select('*').limit(1).single();
    if (pErr) console.log('P Error:', pErr.message); else console.log('P:', Object.keys(pData));

    console.log('--- Offers columns ---');
    const { data: oData, error: oErr } = await supabase.from('offers').select('*').limit(1).single();
    if (oErr) console.log('O Error:', oErr.message); else console.log('O:', Object.keys(oData));
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

check();
