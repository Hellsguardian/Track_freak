import { supabase } from '../lib/supabase';

// Helper to format Date to YYYY-MM-DD in local time
const getLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const resetService = {
  resetTodayData: async (): Promise<boolean> => {
    if (!supabase) return false;
    
    const today = getLocalDateString(new Date());
    console.log(`[resetService] Initiating System Reset for date: ${today}`);

    try {
      // 1. Delete today's sleep sessions
      const { error: err1 } = await supabase
        .from('sleep_sessions')
        .delete()
        .eq('sleep_date', today);
      if (err1) throw err1;

      // 2. Reset today's wellness node
      const { error: err2 } = await supabase
        .from('wellness_nodes')
        .update({
          breakfast: false,
          lunch: false,
          dinner: false,
          hydration_units: 0
        })
        .eq('log_date', today);
      if (err2) throw err2;

      // 3. Reset today's productivity node
      const { error: err3 } = await supabase
        .from('productivity_nodes')
        .update({
          coding_seconds: 0,
          is_coding: false,
          coding_started_at: null,
          book_reading: false,
          ukulele_practice: false,
          workout: false
        })
        .eq('log_date', today);
      if (err3) throw err3;

      // 4. Reset today's digital node
      const { error: err4 } = await supabase
        .from('digital_nodes')
        .update({
          screen_time: 0,
          insta_time: 0
        })
        .eq('log_date', today);
      if (err4) throw err4;

      // 5. Reset today's vibe node
      const { error: err5 } = await supabase
        .from('vibe_nodes')
        .update({
          mood: null,
          stress_level: null
        })
        .eq('log_date', today);
      if (err5) throw err5;

      // 6. Reset today's project logs
      const { error: err6 } = await supabase
        .from('project_logs')
        .update({
          worked_today: false
        })
        .eq('log_date', today);
      if (err6) throw err6;

      console.log('[resetService] System Reset completed successfully.');
      return true;
    } catch (error: any) {
      console.error('[resetService] Error during System Reset:', error.message);
      return false;
    }
  }
};
