import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function run() {
  // 1. Fetch a single log
  const { data: logs } = await supabase.from('project_logs').select('*').limit(1);
  if (!logs || logs.length === 0) {
    console.log("No logs found");
    return;
  }
  const log = logs[0];
  console.log("Found log:", log);

  // 2. Subscribe to realtime updates
  const channel = supabase.channel('test_realtime')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'project_logs' }, (payload) => {
      console.log("REALTIME UPDATE PAYLOAD RECEIVED:");
      console.log(JSON.stringify(payload, null, 2));
      process.exit(0);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log("Subscribed! Triggering update...");
        // 3. Trigger update
        await supabase.from('project_logs').update({ worked_today: !log.worked_today }).eq('id', log.id);
      }
    });
}
run();
