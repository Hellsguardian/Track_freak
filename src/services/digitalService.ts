import { supabase } from '../lib/supabase';
import { DigitalNode } from '../types';

export const digitalService = {
  getTodayDateString(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  async fetchTodayNode(): Promise<DigitalNode | null> {
    const today = this.getTodayDateString();
    
    try {
      const { data, error } = await supabase
        .from('digital_nodes')
        .select('*')
        .eq('log_date', today)
        .maybeSingle();

      if (error) {
        console.error('[digitalService] Error fetching today digital node:', error);
        return null;
      }

      if (!data) {
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
          console.error('[digitalService] Error creating today digital node:', insertError);
          if (insertError.code === '23505') {
            const { data: retryData, error: retryError } = await supabase
              .from('digital_nodes')
              .select('*')
              .eq('log_date', today)
              .single();
              
            if (retryError) {
               return null;
            }
            return retryData as DigitalNode;
          }
          return null;
        }
        
        return inserted as DigitalNode;
      }

      return data as DigitalNode;
    } catch (err) {
      console.error('[digitalService] Exception fetching digital node:', err);
      return null;
    }
  },

  async updateNode(id: string, updates: Partial<DigitalNode>): Promise<void> {
    try {
      const { error } = await supabase
        .from('digital_nodes')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('[digitalService] Error updating digital node:', error);
      }
    } catch (err) {
      console.error('[digitalService] Exception updating digital node:', err);
    }
  },

  subscribeToNodes(callback: (payload: any) => void) {
    const channel = supabase
      .channel('digital_nodes_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'digital_nodes',
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
