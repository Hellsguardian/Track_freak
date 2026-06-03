import type { SleepBatch } from '../types';
import { supabase } from '../lib/supabase';

// Helper to format Date to HH:MM:SS
const getLocalTimeString = (date: Date) => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

// Helper to format Date to YYYY-MM-DD in local time
const getLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const sleepService = {
  checkOverlap: async (newStartEpoch: number, newEndEpoch: number): Promise<boolean> => {
    if (!supabase) return false;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const { data } = await supabase
      .from('sleep_sessions')
      .select('*')
      .in('sleep_date', [getLocalDateString(yesterday), getLocalDateString(today), getLocalDateString(tomorrow)])
      .eq('is_active', false);
      
    if (!data) return false;
    
    for (const row of data) {
      if (!row.start_time || !row.end_time) continue;
      
      const [y, m, d] = row.sleep_date.split('-').map(Number);
      const [eH, eM, eS] = row.end_time.split(':').map(Number);
      const [sH, sM, sS] = row.start_time.split(':').map(Number);
      
      const rowEnd = new Date(y, m - 1, d, eH, eM, eS || 0).getTime();
      let rowStart = new Date(y, m - 1, d, sH, sM, sS || 0).getTime();
      
      if (rowStart > rowEnd) {
        rowStart -= 24 * 60 * 60 * 1000;
      }
      
      if (newStartEpoch < rowEnd && newEndEpoch > rowStart) {
        return true;
      }
    }
    return false;
  },

  getSleepSessions: async (): Promise<SleepBatch[]> => {
    if (!supabase) return [];
    
    console.log('[sleepService] Fetching historical sleep sessions...');
    const today = getLocalDateString(new Date());

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
      const datePart = data.sleep_date || getLocalDateString(new Date());
      const [y, m, d] = datePart.split('-').map(Number);
      const [h, min, s] = data.start_time.split(':').map(Number);
      const fullStartDate = new Date(y, m - 1, d, h, min, s || 0);
      
      return {
        id: data.id,
        start: data.start_time.substring(0, 5),
        startTimeIso: fullStartDate.toISOString() // Pass full valid ISO string to the hook for calculation
      };
    }
    
    console.log('[sleepService] No active session found.');
    return null;
  },

  startSleepSession: async (): Promise<{ id: string, start: string } | { error: 'OVERLAP' } | null> => {
    if (!supabase) return null;

    // Overlap check
    const now = new Date();
    const nowEpoch = now.getTime();
    if (await sleepService.checkOverlap(nowEpoch, nowEpoch + 1000)) {
      return { error: 'OVERLAP' };
    }

    // 1. Query for existing active sessions
    const { data: existingActive, error: checkError } = await supabase
      .from('sleep_sessions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error('[sleepService] Error checking for active sessions:', checkError.message);
      return null;
    }

    // 2. If active session exists, return it
    if (existingActive) {
      console.log('[sleepService] Active session already exists. Restoring:', existingActive.id);
      return {
        id: existingActive.id,
        start: existingActive.start_time.substring(0, 5)
      };
    }

    // 3. Create a new row
    const sleepDate = getLocalDateString(now);
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

    // 4. Handle constraint violations gracefully
    if (error) {
      console.error('[sleepService] Error starting sleep session:', error.message, error.details);
      
      // If unique constraint violation (Postgres code 23505), fetch the concurrently created session
      if (error.code === '23505') {
        console.log('[sleepService] Caught unique constraint violation. Fetching the concurrent active session...');
        const { data: concurrentActive } = await supabase
          .from('sleep_sessions')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();
          
        if (concurrentActive) {
          return {
            id: concurrentActive.id,
            start: concurrentActive.start_time.substring(0, 5)
          };
        }
      }
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

    const datePart = sessionData.sleep_date || getLocalDateString(new Date());
    const [y, m, d] = datePart.split('-').map(Number);
    const [h, min, s] = sessionData.start_time.split(':').map(Number);
    const start = new Date(y, m - 1, d, h, min, s || 0);
    const end = new Date();
    const todayStr = getLocalDateString(end);
    
    let durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (durationSeconds < 0) durationSeconds = 0; // Ensure duration is never negative

    const endTimeString = getLocalTimeString(end);

    console.log(`[sleepService] Updating session ${id} with End Time: ${endTimeString}, Duration: ${durationSeconds}s, Sleep Date: ${todayStr}`);
    const { data, error } = await supabase
      .from('sleep_sessions')
      .update({
        end_time: endTimeString,
        sleep_date: todayStr,
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

  createManualSession: async (start: string, end: string, duration: number): Promise<SleepBatch | { error: 'OVERLAP' } | null> => {
    if (!supabase) return null;
    const today = new Date();
    const todayStr = getLocalDateString(today);

    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    
    let startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sH, sM, 0);
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), eH, eM, 0);
    
    if (endDate.getTime() < startDate.getTime()) {
      startDate.setDate(startDate.getDate() - 1);
    }
    
    if (await sleepService.checkOverlap(startDate.getTime(), endDate.getTime())) {
      return { error: 'OVERLAP' };
    }

    const startStr = `${start}:00`;
    const endStr = `${end}:00`;

    console.log(`[sleepService] Creating manual session for today (${todayStr})...`);
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
