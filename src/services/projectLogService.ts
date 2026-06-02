import { supabase } from '../lib/supabase';

export interface ProjectLog {
  id: string;
  created_at: string;
  log_date: string;
  project_name: string;
  description: string | null;
  tech_stack: string | null;
  worked_today: boolean;
}

export const projectLogService = {
  getTodayDateString(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  async fetchAllLogs(): Promise<ProjectLog[]> {
    try {
      const { data, error } = await supabase
        .from('project_logs')
        .select('*')
        .order('log_date', { ascending: false });

      if (error) {
        console.error('Error fetching project logs:', error);
        return [];
      }
      return data as ProjectLog[];
    } catch (err) {
      console.error('Exception fetching project logs:', err);
      return [];
    }
  },

  async createLog(log: Omit<ProjectLog, 'id' | 'created_at'>): Promise<ProjectLog | null> {
    try {
      const { data, error } = await supabase
        .from('project_logs')
        .insert([log])
        .select()
        .single();
      
      if (error) {
        // Unique constraint violation (project_name, log_date)
        if (error.code === '23505') {
          console.log('[projectLogService] Unique constraint violation. Fetching the created row...');
          const { data: retryData } = await supabase
            .from('project_logs')
            .select('*')
            .eq('log_date', log.log_date)
            .eq('project_name', log.project_name)
            .single();
          if (retryData) return retryData as ProjectLog;
        }
        console.error('Error creating project log:', error);
        return null;
      }
      return data as ProjectLog;
    } catch (err) {
      console.error('Exception creating project log:', err);
      return null;
    }
  },

  async updateLog(id: string, updates: Partial<ProjectLog>): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_logs')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating project log:', error);
      }
    } catch (err) {
      console.error('Exception updating project log:', err);
    }
  },

  async deleteLogByProjectName(projectName: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_logs')
        .delete()
        .eq('project_name', projectName);
        
      if (error) console.error('Error deleting project logs:', error);
    } catch (err) {
      console.error('Exception deleting project logs:', err);
    }
  },

  subscribeToLogs(callback: (payload: any) => void) {
    const channel = supabase
      .channel('project_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_logs',
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
