import { supabase } from '../lib/supabase';
import type { NutritionState } from '../types';

// Helper to format Date to YYYY-MM-DD in local time
const getLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const wellnessService = {
  getTodayNode: async () => {
    if (!supabase) return null;
    const today = getLocalDateString(new Date());
    
    // 1. Query today's node
    const { data, error } = await supabase
      .from('wellness_nodes')
      .select('*')
      .eq('log_date', today)
      .maybeSingle();

    if (error) {
      console.error('[wellnessService] Error fetching node:', error.message);
      return null;
    }

    if (data) {
      return data;
    }

    // 2. If no row exists, create one
    console.log('[wellnessService] No node for today. Creating fresh node...');
    const { data: newNode, error: insertError } = await supabase
      .from('wellness_nodes')
      .insert({
        log_date: today,
        breakfast: false,
        lunch: false,
        dinner: false,
        hydration_units: 0
      })
      .select()
      .single();

    if (insertError) {
      // Concurrency check: If another tab created it
      if (insertError.code === '23505') {
        const { data: concurrentNode } = await supabase
          .from('wellness_nodes')
          .select('*')
          .eq('log_date', today)
          .single();
        return concurrentNode;
      }
      console.error('[wellnessService] Error creating node:', insertError.message);
      return null;
    }

    return newNode;
  },

  updateNutrition: async (nutrition: NutritionState) => {
    if (!supabase) return null;
    const today = getLocalDateString(new Date());
    
    const { data, error } = await supabase
      .from('wellness_nodes')
      .update({
        breakfast: nutrition.breakfast,
        lunch: nutrition.lunch,
        dinner: nutrition.dinner
      })
      .eq('log_date', today)
      .select()
      .single();

    if (error) {
      console.error('[wellnessService] Error updating nutrition:', error.message);
      return null;
    }
    return data;
  },

  updateHydration: async (units: number) => {
    if (!supabase) return null;
    const today = getLocalDateString(new Date());
    
    const { data, error } = await supabase
      .from('wellness_nodes')
      .update({ hydration_units: units })
      .eq('log_date', today)
      .select()
      .single();

    if (error) {
      console.error('[wellnessService] Error updating hydration:', error.message);
      return null;
    }
    return data;
  }
};
