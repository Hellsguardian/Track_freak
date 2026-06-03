import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function run() {
  const { data: projects } = await supabase.from('projects').select('*').limit(1);
  const { data: logs } = await supabase.from('project_logs').select('*').limit(1);

  if (projects && logs) {
    console.log("projects.id type:", typeof projects[0].id, "value:", projects[0].id);
    console.log("project_logs.project_id type:", typeof logs[0].project_id, "value:", logs[0].project_id);
    console.log("projects.id === project_logs.project_id:", projects[0].id === logs[0].project_id);
  }
}
run();
