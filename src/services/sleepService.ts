import type { SleepBatch } from '../types';
import { supabase } from '../lib/supabase';

// Helper to format Date to HH:MM:SS
const getLocalTimeString = (date: Date) => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

export const sleepService = {
  getSleepSessions: async (): Promise<SleepBatch[]> => {
    if (!supabase) return [];
    
    console.log('[sleepService] Fetching historical sleep sessions...');
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('sleep_sessions')
      .select('*')
      .eq('is_active', false)
      .eq('sleep_date', today)
      .order('end_time', { ascending: false });

    if (error) {
      console.error('[sleepService] Error fetching sleep sessions:', error.message);
      return [];
    }

    console.log('[sleepService] Fetched raw rows:', data.length);
    
    // Filter out corrupted rows and log warnings
    const validRows = (data || []).filter(row => {
      if (!row.is_active && (!row.end_time || row.duration === null)) {
        console.warn('[sleepService] Skipping corrupted completed row:', row);
        return false;
      }
      return true;
    });

    return validRows.map(row => {
      return {
        id: row.id,
        start: row.start_time ? row.start_time.substring(0, 5) : "--:--",
        end: row.end_time ? row.end_time.substring(0, 5) : "--:--",
        duration: row.duration ?? 0,
      };
    });
  },

  getActiveSession: async (): Promise<{ id: string, start: string, startTimeIso: string } | null> => {
    if (!supabase) return null;

    console.log('[sleepService] Checking for active sleep session...');
    const { data, error } = await supabase
      .from('sleep_sessions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[sleepService] Error fetching active sleep session:', error.message);
      return null;
    }

    if (data) {
      console.log('[sleepService] Found active session:', data.id);
      // Construct a valid local Date string from DB date and time fields to pass to the hook
      // Fallback to today's date if sleep_date is somehow missing
      const datePart = data.sleep_date || new Date().toISOString().split('T')[0];
      const fullStartDate = new Date(`${datePart}T${data.start_time}`);
      
      return {
        id: data.id,
        start: data.start_time.substring(0, 5),
        startTimeIso: fullStartDate.toISOString() // Pass full valid ISO string to the hook for calculation
      };
    }
    
    console.log('[sleepService] No active session found.');
    return null;
  },

  startSleepSession: async (): Promise<{ id: string, start: string } | null> => {
    if (!supabase) return null;

    const now = new Date();
    const sleepDate = now.toISOString().split('T')[0];
    const timeString = getLocalTimeString(now);

    console.log(`[sleepService] Starting sleep session... Time: ${timeString}`);
    const { data, error } = await supabase
      .from('sleep_sessions')
      .insert({
        start_time: timeString,
        sleep_date: sleepDate,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[sleepService] Error starting sleep session:', error.message, error.details);
      return null;
    }

    console.log('[sleepService] Successfully started session:', data.id);
    return {
      id: data.id,
      start: data.start_time.substring(0, 5)
    };
  },

  stopSleepSession: async (id: string): Promise<SleepBatch | null> => {
    if (!supabase) return null;

    console.log(`[sleepService] Stopping sleep session ${id}...`);
    // Need to fetch sleep_date and start_time to accurately compute duration
    const { data: sessionData, error: fetchError } = await supabase
      .from('sleep_sessions')
      .select('start_time, sleep_date')
      .eq('id', id)
      .single();

    if (fetchError || !sessionData) {
      console.error('[sleepService] Error fetching session to stop:', fetchError?.message);
      return null;
    }

    const datePart = sessionData.sleep_date || new Date().toISOString().split('T')[0];
    const start = new Date(`${datePart}T${sessionData.start_time}`);
    const end = new Date();
    
    let durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    // Safety check if session spanned midnight and simple parsing went wrong
    if (durationSeconds < 0) durationSeconds += 24 * 3600;

    const endTimeString = getLocalTimeString(end);

    console.log(`[sleepService] Updating session ${id} with End Time: ${endTimeString}, Duration: ${durationSeconds}s`);
    const { data, error } = await supabase
      .from('sleep_sessions')
      .update({
        end_time: endTimeString,
        duration: durationSeconds,
        is_active: false
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[sleepService] Error stopping sleep session:', error.message);
      return null;
    }

    console.log('[sleepService] Successfully stopped session:', data.id);
    return {
      id: data.id,
      start: data.start_time.substring(0, 5),
      end: data.end_time.substring(0, 5),
      duration: data.duration
    };
  },

  createManualSession: async (start: string, end: string, duration: number): Promise<SleepBatch | null> => {
    if (!supabase) return null;
    const today = new Date().toISOString().split('T')[0];

    const startStr = `${start}:00`;
    const endStr = `${end}:00`;

    console.log(`[sleepService] Creating manual session for today (${today})...`);
    const { data, error } = await supabase
      .from('sleep_sessions')
      .insert({
        start_time: startStr,
        end_time: endStr,
        sleep_date: today,
        duration: duration,
        is_active: false
      })
      .select()
      .single();

    if (error) {
      console.error('[sleepService] Error creating manual session:', error.message);
      return null;
    }

    console.log('[sleepService] Successfully created manual session:', data.id);
    return {
      id: data.id,
      start: data.start_time.substring(0, 5),
      end: data.end_time.substring(0, 5),
      duration: data.duration
    };
  }
};
