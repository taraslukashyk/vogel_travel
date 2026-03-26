
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nuzljtexciclocgcinjh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51emxqdGV4Y2ljbG9jZ2NpbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTEwNjksImV4cCI6MjA4OTc4NzA2OX0.VQQchNArL7CdB7E2L_FrfPsJCRWiuPUdPwCVc3USXdc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    console.log('--- Testing .or with non-existent column ---');
    const { data, error } = await supabase.from('services').select('*').or('slug.eq."test",slug_en.eq."test"').maybeSingle();
    if (error) {
      console.log('ERROR as expected:', error.message);
    } else {
      console.log('DATA:', data);
    }
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

check();
