import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktksnxaeofajhamukglv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a3NueGFlb2ZhamhhbXVrZ2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzcxOTgsImV4cCI6MjA5MzY1MzE5OH0.84L8I_kdKFoGLQEb7WGzLUFr0HYdbkvfFTw3Z715ujM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetchTodayNode() {
  const today = '2026-06-02';
  
  console.log('[DEBUG] fetchTodayNode() called. today:', today);
  
  try {
    const { data, error } = await supabase
      .from('productivity_nodes')
      .select('*')
      .eq('log_date', today)
      .maybeSingle();

    if (!data) {
      console.log('[DEBUG] No node found for today. Creating one...');
      const newNode = {
        log_date: today,
        coding_seconds: 0,
        is_coding: false,
        book_reading: false,
        ukulele_practice: false,
        workout: false
      };
      console.log('[DEBUG] Insert payload:', newNode);
      
      const response = await supabase
        .from('productivity_nodes')
        .insert([newNode])
        .select()
        .single();
        
      console.log('[DEBUG] Supabase insert response data:', response.data);
      console.log('[DEBUG] Supabase insert response error:', response.error);
    }
  } catch (err) {
    console.error('[DEBUG] Exception fetching productivity node:', err);
  }
}

testFetchTodayNode();
