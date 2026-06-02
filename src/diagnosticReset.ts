import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const getLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

async function runDiagnostics() {
  const today = getLocalDateString(new Date());
  console.log(`[Diagnostic] Exact date string being used for filtering: "${today}"\n`);

  const tables = [
    { name: 'sleep_sessions', dateColumn: 'sleep_date' },
    { name: 'wellness_nodes', dateColumn: 'log_date' },
    { name: 'productivity_nodes', dateColumn: 'log_date' },
    { name: 'digital_nodes', dateColumn: 'log_date' },
    { name: 'vibe_nodes', dateColumn: 'log_date' },
    { name: 'project_logs', dateColumn: 'log_date' }
  ];

  for (const table of tables) {
    console.log(`--- Table: ${table.name} ---`);
    
    // 1. Check rows matched
    const { data: matchedRows, error: matchError } = await supabase
      .from(table.name)
      .select('*')
      .eq(table.dateColumn, today);
      
    if (matchError) {
      console.error(`Error matching ${table.name}:`, matchError.message);
      continue;
    }
    
    console.log(`Filter used: .eq('${table.dateColumn}', '${today}')`);
    console.log(`Rows matched: ${matchedRows?.length || 0}`);
    
    let affectedRows = 0;
    
    if (table.name === 'sleep_sessions') {
      console.log(`Supabase response (simulated delete): Would delete ${matchedRows?.length || 0} rows`);
      console.log(`Rows affected: ${matchedRows?.length || 0}`);
    } else {
      let payload = {};
      if (table.name === 'wellness_nodes') payload = { breakfast: false, lunch: false, dinner: false, hydration_units: 0 };
      if (table.name === 'productivity_nodes') payload = { coding_seconds: 0, is_coding: false, coding_started_at: null, book_reading: false, ukulele_practice: false, workout: false };
      if (table.name === 'digital_nodes') payload = { screen_time: 0, insta_time: 0 };
      if (table.name === 'vibe_nodes') payload = { mood: null, stress_level: null };
      if (table.name === 'project_logs') payload = { worked_today: false };

      const { data: updatedRows, error: updateError } = await supabase
        .from(table.name)
        .update(payload)
        .eq(table.dateColumn, today)
        .select();
        
      if (updateError) {
        console.error(`Error updating ${table.name}:`, updateError.message);
      } else {
        console.log(`Supabase response:`, updatedRows ? `Success` : `Empty`);
        console.log(`Rows affected: ${updatedRows?.length || 0}`);
      }
    }
    console.log('');
  }
}

runDiagnostics();
