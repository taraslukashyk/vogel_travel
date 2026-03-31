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
const key = env['VITE_SUPABASE_SERVICE_ROLE_KEY'] || env['VITE_SUPABASE_ANON_KEY'];
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('services').select('*').eq('id', 1);
  if (error) {
    console.log(error);
  } else {
    for (const row of data) {
      console.log(`ID: ${row.id}`);
      console.log(`title: ${row.title}`);
      console.log(`title_en: ${row.title_en}`);
      console.log(`description: ${row.description}`);
      console.log(`description_en: ${row.description_en}`);
      console.log(`items_en:`, row.items_en);
    }
  }
}
check();
