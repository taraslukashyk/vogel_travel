import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    acc[match[1]] = match[2].replace('\r', '');
  }
  return acc;
}, {} as Record<string, string>);

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_ANON_KEY'];
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('offers').select('*').limit(1);
  if (data && data.length > 0) console.log("Offers:", Object.keys(data[0]));
  const { data: d2 } = await supabase.from('blog_posts').select('*').limit(1);
  if (d2 && d2.length > 0) console.log("Blog:", Object.keys(d2[0]));
}
check();
