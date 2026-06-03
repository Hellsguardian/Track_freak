import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function run() {
  const { data: projects } = await supabase.from('projects').select('id');
  const { data: logs } = await supabase.from('project_logs').select('project_id');

  console.log("Projects ID types:");
  projects?.forEach(p => console.log(typeof p.id, p.id));

  console.log("\nLogs project_id types:");
  logs?.forEach(l => console.log(typeof l.project_id, l.project_id));
}
run();
