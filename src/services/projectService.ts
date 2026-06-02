import { supabase } from '../lib/supabase';

export interface DbProject {
  id: string;
  created_at: string;
  project_name: string;
  description: string | null;
  tech_stack: string | null;
  is_archived: boolean;
}

export interface DbProjectLog {
  id: string;
  created_at: string;
  project_id: string;
  log_date: string;
  worked_today: boolean;
}

export const projectService = {
  getTodayDateString(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  async fetchActiveProjects(): Promise<DbProject[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching active projects:', error);
        return [];
      }
      return data as DbProject[];
    } catch (err) {
      console.error('Exception fetching active projects:', err);
      return [];
    }
  },

  async createProject(project: Omit<DbProject, 'id' | 'created_at'>): Promise<DbProject | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        return null;
      }
      return data as DbProject;
    } catch (err) {
      console.error('Exception creating project:', err);
      return null;
    }
  },

  async archiveProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) {
        console.error('Error archiving project:', error);
      }
    } catch (err) {
      console.error('Exception archiving project:', err);
    }
  },

  async fetchProjectLogs(): Promise<DbProjectLog[]> {
    try {
      const { data, error } = await supabase
        .from('project_logs')
        .select('*');

      if (error) {
        console.error('Error fetching project logs:', error);
        return [];
      }
      return data as DbProjectLog[];
    } catch (err) {
      console.error('Exception fetching project logs:', err);
      return [];
    }
  },

  async ensureTodayLog(projectId: string): Promise<DbProjectLog | null> {
    const today = this.getTodayDateString();
    try {
      // 1. Check if a log exists for (project_id, today)
      const { data, error } = await supabase
        .from('project_logs')
        .select('*')
        .eq('project_id', projectId)
        .eq('log_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching today log:', error);
        return null;
      }

      if (data) {
        return data as DbProjectLog;
      }

      // 2. If missing, automatically create it
      const { data: inserted, error: insertError } = await supabase
        .from('project_logs')
        .insert([{
          project_id: projectId,
          log_date: today,
          worked_today: false
        }])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          // Unique constraint violation (project_id, log_date)
          const { data: retryData } = await supabase
            .from('project_logs')
            .select('*')
            .eq('project_id', projectId)
            .eq('log_date', today)
            .single();
          if (retryData) return retryData as DbProjectLog;
        }
        console.error('Error auto-creating today log:', insertError);
        return null;
      }
      
      return inserted as DbProjectLog;
    } catch (err) {
      console.error('Exception ensuring today log:', err);
      return null;
    }
  },

  async updateLog(id: string, workedToday: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_logs')
        .update({ worked_today: workedToday })
        .eq('id', id);

      if (error) {
        console.error('Error updating project log:', error);
      }
    } catch (err) {
      console.error('Exception updating project log:', err);
    }
  },

  subscribeToProjects(callback: (payload: any) => void) {
    const channel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => callback(payload)
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },

  subscribeToLogs(callback: (payload: any) => void) {
    const channel = supabase
      .channel('project_logs_table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_logs' },
        (payload) => callback(payload)
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }
};
