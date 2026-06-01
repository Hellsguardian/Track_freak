import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ChevronRight, Plus } from 'lucide-react';
import SectionHeader from '../../ui/SectionHeader';
import ProjectCard from './ProjectCard';
import type { Project } from '../../../types';

interface ProjectsSectionProps {
  projects: Project[];
  isWorkedToday: (project: Project) => boolean;
  deleteProject: (id: string) => void;
  toggleProjectSuccess: (id: string) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const ProjectsSection = ({
  projects, isWorkedToday, deleteProject, toggleProjectSuccess,
  setIsModalOpen, scrollRef,
}: ProjectsSectionProps) => (
  <section className="flex flex-col gap-8 pb-12">
    <div className="flex items-end justify-between px-2">
       <SectionHeader icon={LayoutDashboard} title="System Nodes" subtitle="Project Lifecycle Archive" />
       <button className="text-[9px] uppercase font-black text-white/40 hover:text-white tracking-[0.3em] pb-12 transition-all hover:translate-x-1 flex items-center gap-2">
          Deployment Ops <ChevronRight size={10} />
       </button>
    </div>
    <div 
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto overflow-y-hidden hide-scrollbar pb-10 snap-x snap-mandatory w-full select-none"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => {
          const workedToday = isWorkedToday(project);
          return (
            <ProjectCard
              key={project.id}
              project={project}
              workedToday={workedToday}
              onDelete={deleteProject}
              onToggleSuccess={toggleProjectSuccess}
            />
          );
        })}
        
        {/* Add New Ghost Card (Created to match size and visual proportion) */}
        <motion.button 
          layout
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0 w-[calc(44%-0.5rem)] min-w-[250px] md:min-w-0 snap-start group flex flex-col relative self-center cursor-pointer outline-none text-left py-4"
        >
          <div className="p-8 flex flex-col justify-between items-center justify-center text-center h-[380px] min-h-[380px] w-full bg-gradient-to-b from-[#060608]/80 to-[#010102]/60 backdrop-blur-3xl rounded-[3rem] border border-dashed border-white/5 group-hover:border-accent/20 group-hover:shadow-[0_0_35px_rgba(99,102,241,0.04)] transition-all duration-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.005] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="flex flex-col items-center justify-center gap-5 my-auto">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 text-white/15 group-hover:text-accent/60 group-hover:border-accent/20 flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-105">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-widest text-white/20 uppercase group-hover:text-white/55 transition-all duration-500">Initialize Node</h3>
                <p className="text-[8px] text-white/5 uppercase tracking-[0.3em] font-black mt-1.5">Create New Card</p>
              </div>
            </div>
          </div>
        </motion.button>
      </AnimatePresence>
    </div>
  </section>
);

export default ProjectsSection;
