import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ktksnxaeofajhamukglv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a3NueGFlb2ZhamhhbXVrZ2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzcxOTgsImV4cCI6MjA5MzY1MzE5OH0.84L8I_kdKFoGLQEb7WGzLUFr0HYdbkvfFTw3Z715ujM'
);

async function test() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`;
  
  console.log("Checking for existing row...");
  const { data, error } = await supabase
    .from('digital_nodes')
    .select('*')
    .eq('log_date', today)
    .maybeSingle();
    
  if (error) {
    console.error("Select error:", error);
  } else {
    console.log("Select result:", data);
  }

  if (!data) {
    console.log("Attempting insert...");
    const newNode = {
      log_date: today,
      screen_time: 0,
      insta_time: 0
    };
    
    const { data: inserted, error: insertError } = await supabase
      .from('digital_nodes')
      .insert([newNode])
      .select()
      .single();
      
    if (insertError) {
      console.error("Insert error:", insertError);
    } else {
      console.log("Insert success:", inserted);
    }
  }
}

test();
