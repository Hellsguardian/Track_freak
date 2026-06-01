import { useState, useEffect } from 'react';
import type { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('trackfreak_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 2 && parsed[0]?.name === "Obsidian Core") {
          return [
            parsed[0],
            parsed[1],
            { id: '3', name: "System Zero", desc: "Automating home micro-climate control via sensors.", stack: "Arduino, Python", category: "Experimental", history: { "2024-05-11": true } },
          ];
        }
        return parsed;
      } catch (e) {
        // Fallback to defaults
      }
    }
    return [
      { id: '1', name: "Obsidian Core", desc: "Developing a custom layout engine for markdown nodes.", stack: "React, D3, Canvas", category: "Engineering", history: { "2024-05-11": true } },
      { id: '2', name: "Prism Flux", desc: "Exploring color theory in real-time noise shaders.", stack: "WebGL, GLSL", category: "Creative", history: { "2024-05-11": true } },
      { id: '3', name: "System Zero", desc: "Automating home micro-climate control via sensors.", stack: "Arduino, Python", category: "Experimental", history: { "2024-05-11": true } },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('trackfreak_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (p: Omit<Project, 'id' | 'history'>) => {
    const newProject: Project = {
      ...p,
      id: Math.random().toString(36).substring(7),
      history: {}
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleProjectSuccess = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newHistory = { ...p.history };
        if (newHistory[today]) {
          delete newHistory[today];
        } else {
          newHistory[today] = true;
        }
        return { ...p, history: newHistory };
      }
      return p;
    }));
  };

  const isWorkedToday = (project: Project) => {
    const today = new Date().toISOString().split('T')[0];
    return !!project.history[today];
  };

  const resetProjectsToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => {
      const newHistory = { ...p.history };
      delete newHistory[today];
      return { ...p, history: newHistory };
    }));
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
