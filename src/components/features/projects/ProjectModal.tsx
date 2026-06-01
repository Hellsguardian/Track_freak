import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { Project } from '../../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (p: Omit<Project, 'id' | 'history'>) => void;
}

const ProjectModal = ({ isOpen, onClose, onAdd }: ProjectModalProps) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [stack, setStack] = useState('');
  const [category, setCategory] = useState('Engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc) return;
    onAdd({ name, desc, stack, category });
    setName(''); setDesc(''); setStack(''); setCategory('Engineering');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0A0A0C] border border-white/10 rounded-[3rem] p-10 shadow-3xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black uppercase tracking-widest text-white">New Project Node</h3>
                <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Initialize Architecture</span>
              </div>
              <button onClick={onClose} className="p-3 bg-white/2 hover:bg-white/5 rounded-2xl border border-white/5 transition-all">
                <X size={18} className="text-white/20" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-4">Terminal Name</label>
                <input 
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Project Obsidian"
                  className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent/40 placeholder:text-white/5 transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-4">Architecture Desc</label>
                <textarea 
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="The core objective of this node..."
                  className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent/40 placeholder:text-white/5 transition-all text-sm h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-4">Tech Stack</label>
                  <input 
                    value={stack}
                    onChange={e => setStack(e.target.value)}
                    placeholder="React, D3, GLSL"
                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent/40 placeholder:text-white/5 transition-all text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/20 ml-4">Type</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent/40 transition-all text-xs font-mono appearance-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Research">Research</option>
                    <option value="Creative">Creative</option>
                    <option value="Experimental">Experimental</option>
                  </select>
                </div>
              </div>

              <button className="mt-4 w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-accent hover:text-white transition-all shadow-2xl">
                Commit Node
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
