import { supabase } from '../lib/supabase';
import { VibeNode } from '../types';

export const vibeService = {
  getTodayDateString(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  async fetchTodayNode(): Promise<VibeNode | null> {
    const today = this.getTodayDateString();
    
    try {
      const { data, error } = await supabase
        .from('vibe_nodes')
        .select('*')
        .eq('log_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching today vibe node:', error);
        return null;
      }

      if (!data) {
        // Create one automatically with default null values
        const newNode = {
          log_date: today,
          mood: null,
          stress_level: null
        };
        
        const { data: inserted, error: insertError } = await supabase
          .from('vibe_nodes')
          .insert([newNode])
          .select()
          .single();
          
        if (insertError) {
          // If it's a unique constraint violation, it means another tab created it simultaneously
          if (insertError.code === '23505') {
            const { data: retryData } = await supabase
              .from('vibe_nodes')
              .select('*')
              .eq('log_date', today)
              .single();
            if (retryData) return retryData as VibeNode;
          }
          console.error('Error creating today vibe node:', insertError);
          return null;
        }
        return inserted as VibeNode;
      }

      return data as VibeNode;
    } catch (err) {
      console.error('Exception fetching vibe node:', err);
      return null;
    }
  },

  async updateNode(id: string, updates: Partial<VibeNode>): Promise<void> {
    try {
      const { error } = await supabase
        .from('vibe_nodes')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating vibe node:', error);
      }
    } catch (err) {
      console.error('Exception updating vibe node:', err);
    }
  },

  subscribeToNodes(callback: (payload: any) => void) {
    const channel = supabase
      .channel('vibe_nodes_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'vibe_nodes',
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
