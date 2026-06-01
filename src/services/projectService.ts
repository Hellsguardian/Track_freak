import type { Project } from '../types';
// import { supabase } from '../lib/supabase';

/**
 * Project Service
 * 
 * Responsibilities:
 * - CRUD operations for the `projects` table.
 * - Transforming the frontend history map (`Record<string, boolean>`) into relational 
 *   database operations (e.g., a related `project_history` table or `jsonb` column).
 */
export const projectService = {
  /**
   * Fetch all active projects and their historical consistency data for the user.
   * TODO: Implement Supabase `select` from the `projects` table.
   */
  fetchProjects: async (): Promise<Project[]> => {
    console.log('TODO: Fetch projects from Supabase');
    return [];
  },

  /**
   * Create a new project node in the database.
   * TODO: Implement Supabase `insert` into the `projects` table.
   */
  createProject: async (project: Omit<Project, 'id' | 'history'>): Promise<Project | null> => {
    console.log('TODO: Insert new project into Supabase', project);
    return null;
  },

  /**
   * Delete an existing project node and its associated history.
   * TODO: Implement Supabase `delete` from the `projects` table.
   */
  deleteProject: async (id: string): Promise<void> => {
    console.log('TODO: Delete project from Supabase', id);
  },

  /**
   * Toggle the operational success state for a project on a specific date.
   * TODO: Implement Supabase `insert` or `delete` into a related history table, 
   * or perform a `jsonb` upsert.
   */
  toggleProjectSuccess: async (projectId: string, dateStr: string): Promise<void> => {
    console.log('TODO: Toggle project success state in Supabase', projectId, dateStr);
  }
};
