import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktksnxaeofajhamukglv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a3NueGFlb2ZhamhhbXVrZ2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzcxOTgsImV4cCI6MjA5MzY1MzE5OH0.84L8I_kdKFoGLQEb7WGzLUFr0HYdbkvfFTw3Z715ujM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_schema');
  console.log(data, error);
  // Alternative: try to insert a duplicate and see the exact error
  const today = '2026-06-01';
  const newNode = {
    log_date: today,
    coding_seconds: 0,
    is_coding: false,
    book_reading: false,
    ukulele_practice: false,
    workout: false
  };
  const response = await supabase.from('productivity_nodes').insert([newNode]).select().single();
  console.log('Duplicate insert response:', response.error);
}

checkSchema();
