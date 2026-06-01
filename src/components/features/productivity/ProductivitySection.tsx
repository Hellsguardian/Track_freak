import React from 'react';
import { motion } from 'motion/react';
import { Code, Zap, BookOpen, Music, Dumbbell } from 'lucide-react';
import { formatTime } from '../../../utils/formatters';
import ControlSection from '../../ui/ControlSection';
import SectionHeader from '../../ui/SectionHeader';
import ToggleButton from '../../ui/ToggleButton';

interface ProductivitySectionProps {
  timerSeconds: number;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  reading: boolean;
  setReading: React.Dispatch<React.SetStateAction<boolean>>;
  ukulele: boolean;
  setUkulele: React.Dispatch<React.SetStateAction<boolean>>;
  training: boolean;
  setTraining: React.Dispatch<React.SetStateAction<boolean>>;
  addTime: (seconds: number) => void;
}

const ProductivitySection = ({
  timerSeconds, isTimerRunning, setIsTimerRunning,
  reading, setReading, ukulele, setUkulele,
  training, setTraining, addTime,
}: ProductivitySectionProps) => (
  <ControlSection>
    <SectionHeader icon={Code} title="Productivity & Work" subtitle="Cognitive Output & Mastery" />
    
    <div className="flex flex-col gap-10">
      {/* Main Focus Stat */}
      <div className="relative group perspective-1000">
        <div className="absolute inset-0 bg-accent/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative bg-[#08080C]/40 border border-white/[0.04] p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between overflow-hidden gap-10 shadow-2xl group-hover:border-white/[0.09] transition-all duration-700">
          <div className="flex flex-col gap-4 relative z-10">
            <span className="text-[9px] text-white/20 uppercase tracking-[0.45em] font-black">Coding Hours</span>
            <div className={`text-7xl font-mono font-black tracking-tighter leading-none transition-all duration-1000 ${
              isTimerRunning 
              ? 'text-accent drop-shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-[1.03]' 
              : 'text-white/80 group-hover:text-white'
            }`}>
              {formatTime(timerSeconds)}
            </div>
          </div>
          <div className="flex flex-col gap-5 w-full md:w-auto relative z-10">
            <motion.button 
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              onClick={() => setIsTimerRunning(!isTimerRunning)} 
              className={`group px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] rounded-3xl transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 border ${
                isTimerRunning 
                ? 'bg-red-500/[0.06] text-red-400 border-red-500/20 hover:bg-red-500/10' 
                : 'bg-white text-black hover:bg-zinc-100 border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]'
              }`}
            >
              <Zap size={18} fill="currentColor" className={isTimerRunning ? "animate-pulse" : "group-hover:rotate-12 transition-transform duration-500"} />
              {isTimerRunning ? 'Stop Stream' : 'Start Stream'}
            </motion.button>
            <div className="grid grid-cols-2 gap-4">
              <motion.button whileHover={{ y: -1 }} onClick={() => addTime(3600)} className="px-5 py-3 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] border border-white/[0.04] bg-[#101014]/40 text-white/25 hover:border-white/15 hover:text-white/50 transition-all shadow-md">+1 Hour</motion.button>
              <motion.button whileHover={{ y: -1 }} onClick={() => addTime(900)} className="px-5 py-3 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] border border-white/[0.04] bg-[#101014]/40 text-white/25 hover:border-white/15 hover:text-white/50 transition-all shadow-md">+15 Min</motion.button>
            </div>
          </div>
          {/* Background visual detail */}
          <div className="absolute right-[-15%] top-[-10%] opacity-[0.015] group-hover:opacity-[0.04] rotate-6 pointer-events-none group-hover:scale-110 transition-all duration-1000">
             <Code size={450} strokeWidth={0.5} />
          </div>
        </div>
      </div>

      {/* Moved Toggles */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <ToggleButton 
            active={reading} 
            icon={BookOpen} 
            onClick={() => setReading(!reading)} 
            label="Book Reading" 
            className="h-[78px] flex-col justify-center gap-3"
          />
          <ToggleButton 
            active={ukulele} 
            icon={Music} 
            onClick={() => setUkulele(!ukulele)} 
            label="Ukulele Practice" 
            className="h-[78px] flex-col justify-center gap-3"
          />
        </div>
        <button 
          onClick={() => setTraining(!training)}
          className={`group relative flex items-center justify-between px-8 py-5 rounded-2xl transition-all duration-500 border w-full ${
            training 
            ? 'bg-accent/10 border-accent/40 text-white accent-glow' 
            : 'bg-[#101014]/30 text-white/20 border-white/[0.04] hover:border-white/10 hover:bg-[#14141a]/50 hover:text-white/40 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg transition-transform duration-500 ${training ? 'scale-110 text-accent' : 'group-hover:scale-105'}`}>
              <Dumbbell size={18} strokeWidth={training ? 2.5 : 1.5} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Workout Performance Session</span>
          </div>
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${training ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'bg-white/10'}`} />
        </button>
      </div>
    </div>
  </ControlSection>
);

export default ProductivitySection;
