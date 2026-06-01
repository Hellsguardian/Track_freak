import { supabase } from '../lib/supabase';
import { ProductivityNode } from '../types';

export const productivityService = {
  getTodayDateString(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  async fetchTodayNode(): Promise<ProductivityNode | null> {
    const today = this.getTodayDateString();
    
    try {
      const { data, error } = await supabase
        .from('productivity_nodes')
        .select('*')
        .eq('log_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching today productivity node:', error);
        return null;
      }

      if (!data) {
        // Create one automatically
        const newNode = {
          log_date: today,
          coding_seconds: 0,
          coding_started_at: null,
          is_coding: false,
          book_reading: false,
          ukulele_practice: false,
          workout: false
        };
        
        const { data: inserted, error: insertError } = await supabase
          .from('productivity_nodes')
          .insert([newNode])
          .select()
          .single();
          
        if (insertError) {
          // If it's a unique constraint violation, it means another tab created it
          if (insertError.code === '23505') {
            // Fetch it again
            const { data: retryData } = await supabase
              .from('productivity_nodes')
              .select('*')
              .eq('log_date', today)
              .single();
            if (retryData) return retryData as ProductivityNode;
          }
          console.error('Error creating today productivity node:', insertError);
          return null;
        }
        return inserted as ProductivityNode;
      }

      return data as ProductivityNode;
    } catch (err) {
      console.error('Exception fetching productivity node:', err);
      return null;
    }
  },

  async updateNode(id: string, updates: Partial<ProductivityNode>): Promise<void> {
    try {
      const { error } = await supabase
        .from('productivity_nodes')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating productivity node:', error);
      }
    } catch (err) {
      console.error('Exception updating productivity node:', err);
    }
  },

  subscribeToNodes(callback: (payload: any) => void) {
    const channel = supabase
      .channel('productivity_nodes_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'productivity_nodes',
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
