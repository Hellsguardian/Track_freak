import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ktksnxaeofajhamukglv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a3NueGFlb2ZhamhhbXVrZ2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzcxOTgsImV4cCI6MjA5MzY1MzE5OH0.84L8I_kdKFoGLQEb7WGzLUFr0HYdbkvfFTw3Z715ujM'
);

async function test() {
  const { data, error } = await supabase.rpc('get_schema');
  console.log("Schema:", data, error);
}

test();
