import { useState, useEffect } from 'react';
import type { Project } from '../types';
import { projectService, DbProject, DbProjectLog } from '../services/projectService';

export function useProjects() {
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [dbLogs, setDbLogs] = useState<DbProjectLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // Load active projects
      const fetchedProjects = await projectService.fetchActiveProjects();
      
      // Load all logs to compute history
      const fetchedLogs = await projectService.fetchProjectLogs();
      
      if (mounted) {
        setDbProjects(fetchedProjects);
        setDbLogs(fetchedLogs);
      }

      // Ensure today's logs exist for all active projects
      // This satisfies the requirement: "On application load: Get today's date. For every active project: Check if row exists... If missing: Auto create"
      for (const p of fetchedProjects) {
        await projectService.ensureTodayLog(p.id);
      }
    };

    loadData();

    // Subscribe to projects table
    const unsubscribeProjects = projectService.subscribeToProjects((payload) => {
      if (!mounted) return;
      const { eventType, new: newRecord } = payload;
      
      setDbProjects(prev => {
        if (eventType === 'INSERT') {
          if (prev.some(p => p.id === newRecord.id)) return prev;
          if (newRecord.is_archived) return prev;
          // Note: Tab A (the creator) already ensures the today log upon project creation.
          // The today log will arrive to Tab B via the project_logs Realtime subscription.
          // Therefore, we DO NOT call ensureTodayLog here, which prevents the race condition 
          // that was causing duplicate rows in the DB before the unique constraint was added.
          return [...prev, newRecord as DbProject];
        } else if (eventType === 'UPDATE') {
          if (newRecord.is_archived) {
            return prev.filter(p => p.id !== newRecord.id); // Hide archived
          }
          return prev.map(p => p.id === newRecord.id ? newRecord as DbProject : p);
        }
        return prev;
      });
    });

    // Subscribe to project_logs table
    const unsubscribeLogs = projectService.subscribeToLogs((payload) => {
      if (!mounted) return;
      const { eventType, new: newRecord } = payload;
      
      setDbLogs(prev => {
        if (eventType === 'INSERT') {
          if (prev.some(l => l.id === newRecord.id)) return prev;
          return [...prev, newRecord as DbProjectLog];
        } else if (eventType === 'UPDATE') {
          return prev.map(l => l.id === newRecord.id ? newRecord as DbProjectLog : l);
        }
        return prev;
      });
    });

    return () => {
      mounted = false;
      unsubscribeProjects();
      unsubscribeLogs();
    };
  }, []);

  // Compute UI "projects" dynamically
  const projects: Project[] = dbProjects.map(p => {
    const history: Record<string, boolean> = {};
    const projectLogs = dbLogs.filter(l => l.project_id === p.id);
    
    projectLogs.forEach(log => {
      if (log.worked_today) {
        history[log.log_date] = true;
      }
    });

    return {
      id: p.id,
      name: p.project_name,
      desc: p.description || '',
      stack: p.tech_stack || '',
      category: 'Engineering', // Hardcoded fallback for UI layout
      history
    };
  });

  const addProject = async (p: Omit<Project, 'id' | 'history'>) => {
    const newProject = await projectService.createProject({
      project_name: p.name,
      description: p.desc,
      tech_stack: p.stack,
      is_archived: false
    });
    
    if (newProject) {
      setDbProjects(prev => {
        if (prev.some(existing => existing.id === newProject.id)) return prev;
        return [...prev, newProject];
      });
      // Trigger the daily log creation for the newly created project
      const todayLog = await projectService.ensureTodayLog(newProject.id);
      if (todayLog) {
        setDbLogs(prev => {
          if (prev.some(l => l.id === todayLog.id)) return prev;
          return [...prev, todayLog];
        });
      }
    }
  };

  const deleteProject = (id: string) => {
    // "When user clicks delete/archive: DO NOT delete the row. Instead UPDATE projects SET is_archived = true"
    // Optimistic UI update
    setDbProjects(prev => prev.filter(p => p.id !== id));
    projectService.archiveProject(id);
  };

  const toggleProjectSuccess = async (id: string) => {
    const today = projectService.getTodayDateString();
    
    // Find today's log for this project_id
    const todayLog = dbLogs.find(l => l.project_id === id && l.log_date === today);
    
    if (todayLog) {
      const newWorkedStatus = !todayLog.worked_today;
      // Optimistic UI update
      setDbLogs(prev => prev.map(l => l.id === todayLog.id ? { ...l, worked_today: newWorkedStatus } : l));
      await projectService.updateLog(todayLog.id, newWorkedStatus);
    } else {
      // If missing (edge case because ensureTodayLog runs on load), we ensure it and toggle
      const newLog = await projectService.ensureTodayLog(id);
      if (newLog) {
        await projectService.updateLog(newLog.id, true);
        setDbLogs(prev => {
          const filtered = prev.filter(l => l.id !== newLog.id);
          return [...filtered, { ...newLog, worked_today: true }];
        });
      }
    }
  };

  const isWorkedToday = (project: Project) => {
    const today = projectService.getTodayDateString();
    return !!project.history[today];
  };

  const resetProjectsToday = () => {
    const today = projectService.getTodayDateString();
    dbLogs.forEach(log => {
      if (log.log_date === today && log.worked_today) {
        // Optimistic
        setDbLogs(prev => prev.map(l => l.id === log.id ? { ...l, worked_today: false } : l));
        projectService.updateLog(log.id, false);
      }
    });
  };

  return {
    projects,
    isModalOpen,
    setIsModalOpen,
    addProject,
    deleteProject,
    toggleProjectSuccess,
    isWorkedToday,
    resetProjectsToday,
  };
}
