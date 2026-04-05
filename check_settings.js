import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nuzljtexciclocgcinjh.supabase.co";
const supabaseAnonKey = "sb_publishable_bdkzjkhPNS29-R2Dxw2Juw_oKqu3xEW";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
check();
