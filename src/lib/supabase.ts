import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local.");
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/**
 * Temporary function to verify Supabase connectivity.
 * Tests if the client can reach the backend without throwing network errors.
 */
export async function testSupabaseConnection() {
  try {
    // Attempting a simple query. Even if the table doesn't exist,
    // a valid response (like a 404 or 42P01 error) proves the connection is working.
    const { error } = await supabase.from('sleep_sessions').select('*').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('✅ Connected to Supabase successfully! (Table "sleep_sessions" not found, which is expected before schema creation)');
        return true;
      }
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully!');
    return true;
  } catch (err: any) {
    console.error('❌ Supabase connection error:', err.message);
    return false;
  }
}
