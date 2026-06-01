import React from 'react';
import { motion } from 'motion/react';
import { Layers, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import StreakView from './StreakView';
import type { Project } from '../../../types';

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  workedToday: boolean;
  onDelete: (id: string) => void;
  onToggleSuccess: (id: string) => void;
}

const ProjectCard = ({ project, workedToday, onDelete, onToggleSuccess }: ProjectCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9, x: 20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.8, x: -20 }}
    className="flex-shrink-0 w-[calc(50%-0.5rem)] min-w-[280px] md:min-w-0 snap-start group flex flex-col relative"
  >
    <div className="p-10 flex flex-col justify-between h-full bg-gradient-to-b from-[#0B0B0D] to-[#040406] backdrop-blur-3xl rounded-[3rem] border border-white/10 relative overflow-hidden transition-all duration-700 hover:border-accent/30 hover:shadow-[0_0_50px_rgba(99,102,241,0.08)] shadow-2xl min-h-[420px]">
      {/* Background Detail */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
         <Layers size={100} />
      </div>
    
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.3em]">{project.category}</span>
          <button 
            onClick={() => onDelete(project.id)}
            className="p-2 opacity-0 group-hover:opacity-20 hover:!opacity-100 transition-all hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <h3 className="text-2xl font-black tracking-tighter mb-4 group-hover:text-accent transition-colors duration-500">{project.name}</h3>
        <p className="text-[11px] text-white/30 leading-loose font-bold uppercase tracking-wider mb-6 line-clamp-2">
          {project.desc}
        </p>

        {project.stack && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.split(',').map(s => (
              <span key={s} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">{s.trim()}</span>
            ))}
          </div>
        )}

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Consistency Map</span>
            <span className="text-[9px] font-mono text-accent font-bold">LAST 10 DAYS</span>
          </div>
          <StreakView history={project.history} />
        </div>
      </div>
      
      <button 
        onClick={() => onToggleSuccess(project.id)}
        className={`mt-10 w-full py-5 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-4 transition-all duration-300 border ${
          workedToday 
          ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.15)]' 
          : 'bg-white/[0.03] text-white/20 border-white/5 hover:bg-white/5 hover:text-white/60 hover:border-white/20'
        }`}
      >
        {workedToday ? 'Operational Success' : 'Sync Progress'}
        {workedToday ? <CheckCircle2 size={14} className="text-emerald-500" /> : <ChevronRight size={14} />}
      </button>
    </div>
  </motion.div>
);

export default ProjectCard;
