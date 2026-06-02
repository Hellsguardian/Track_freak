import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const getLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

async function run() {
  const today = getLocalDateString(new Date());
  console.log(`Exact date string being used for filtering: "${today}"\n`);
  console.log(`Exact DELETE query being executed: .from('sleep_sessions').delete().eq('sleep_date', '${today}')\n`);

  // 1. Fetch all rows in sleep_sessions to see their sleep_date values
  const { data: allRows, error: fetchErr } = await supabase
    .from('sleep_sessions')
    .select('id, sleep_date, start_time');
    
  if (fetchErr) {
    console.error("Fetch error:", fetchErr);
    return;
  }
  
  console.log(`Actual sleep_date values in the DB before delete:`);
  allRows?.forEach(r => console.log(`- ID: ${r.id} | sleep_date: ${r.sleep_date} | start_time: ${r.start_time}`));
  console.log();

  // 2. Perform the DELETE
  const { data: deletedRows, error: deleteErr } = await supabase
    .from('sleep_sessions')
    .delete()
    .eq('sleep_date', today)
    .select(); // use select() to return the deleted rows!

  if (deleteErr) {
    console.error(`Supabase Delete Error:`, deleteErr.message, deleteErr.details, deleteErr.hint);
  } else {
    console.log(`Supabase delete response:`);
    console.log(`- Rows matched / deleted: ${deletedRows?.length || 0}`);
  }
  console.log();

  // 3. Fetch again to see what survived
  const { data: survivingRows } = await supabase
    .from('sleep_sessions')
    .select('id, sleep_date, start_time');
    
  console.log(`Actual sleep_date values that remain in the database:`);
  survivingRows?.forEach(r => console.log(`- ID: ${r.id} | sleep_date: ${r.sleep_date} | start_time: ${r.start_time}`));
}

run();
