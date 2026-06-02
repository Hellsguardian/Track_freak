import React from 'react';
import { motion } from 'motion/react';
import { Smile } from 'lucide-react';
import ControlSection from '../../ui/ControlSection';
import SectionHeader from '../../ui/SectionHeader';

interface VibeSensorSectionProps {
  mood: number | null;
  setMood: React.Dispatch<React.SetStateAction<number | null>>;
  stress: number | null;
  setStress: React.Dispatch<React.SetStateAction<number | null>>;
}

const VibeSensorSection = ({ mood, setMood, stress, setStress }: VibeSensorSectionProps) => (
  <ControlSection>
    <SectionHeader icon={Smile} title="Vibe Sensor" subtitle="Mental Frequency & Load Analysis" />
    
    <div className="flex flex-col gap-12 pt-4">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-4">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Emotional Index</span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/10 uppercase font-black">Status:</span>
            <motion.span 
              key={mood ?? 'null'}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-mono text-accent font-black tracking-[0.2em] shadow-accent/20"
            >
              {mood ? ['CRITICAL', 'UNSTABLE', 'NEUTRAL', 'NOMINAL', 'PEAK'][mood - 1] : 'AWAITING'}
            </motion.span>
          </div>
        </div>
        <div className="flex justify-between items-center bg-[#08080C]/40 p-4 rounded-[3.5rem] border border-white/[0.04] shadow-inner relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.015] via-transparent to-accent/[0.015] pointer-events-none" />
          
          {[1, 2, 3, 4, 5].map((level) => {
            const isActive = mood === level;
            return (
              <motion.button 
                key={level}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMood(level)}
                className={`w-20 h-20 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all duration-700 relative group outline-none`}
              >
                {/* Active Aura */}
                {isActive && (
                  <motion.div 
                    layoutId="mood-aura"
                    className="absolute inset-0 bg-accent/[0.08] blur-3xl rounded-full"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}
                
                {/* Ring Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="mood-ring"
                    className="absolute inset-2 border border-accent/25 rounded-[2rem] shadow-[0_0_25px_rgba(99,102,241,0.15)]"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}

                <span className={`text-4xl relative z-10 transition-all duration-700 ${
                  isActive 
                  ? 'scale-110 saturate-100 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                  : 'opacity-10 grayscale saturate-0 group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-105'
                }`}>
                  {['😭', '😕', '😐', '😊', '🔥'][level - 1]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6">
         <div className="flex items-center justify-between px-3">
           <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Internal Tension</span>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/40">LOAD:</span>
              <span className={`text-[10px] font-mono font-bold ${stress && stress > 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                {stress ? `${stress * 20}%` : '0%'}
              </span>
           </div>
         </div>
         <div className="grid grid-cols-5 gap-3">
           {[
             { label: 'Calm', level: 1, color: 'sky' },
             { label: 'Mild', level: 2, color: 'indigo' },
             { label: 'Moderate', level: 3, color: 'violet' },
             { label: 'High', level: 4, color: 'pink' },
             { label: 'Peak', level: 5, color: 'fuchsia' }
           ].map(({ label, level, color }) => {
             const isActive = stress === level;
             const colorMap: Record<string, string> = {
               sky: 'border-sky-500/30 text-sky-400 bg-sky-500/5 shadow-[0_0_20px_rgba(56,189,248,0.12)]',
               indigo: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.12)]',
               violet: 'border-violet-500/30 text-violet-400 bg-violet-500/5 shadow-[0_0_20_rgba(139,92,246,0.12)]',
               pink: 'border-pink-500/30 text-pink-400 bg-pink-500/5 shadow-[0_0_20_rgba(236,72,153,0.12)]',
               fuchsia: 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/5 shadow-[0_0_20_rgba(217,70,239,0.12)]'
             };

             return (
               <button 
                 key={level}
                 onClick={() => setStress(level)}
                 className={`h-22 rounded-3xl flex flex-col items-center justify-center transition-all border duration-500 group relative ${
                   isActive 
                   ? colorMap[color]
                   : 'bg-[#101014]/30 border-white/[0.04] text-white/30 hover:border-white/15 hover:bg-[#14141a]/40'
                 }`}
               >
                 <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100 font-extrabold' : 'opacity-40 group-hover:opacity-100 text-white/50'}`}>{label}</span>
                 <div className={`w-6 h-[2px] mt-3 rounded-full transition-all duration-500 ${
                   isActive ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-white/10'
                 }`} />
                 {isActive && (
                   <motion.div 
                     layoutId="stress-glow" 
                     className="absolute -inset-[1px] border-[inherit] rounded-[inherit] pointer-events-none"
                     initial={false}
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                 )}
               </button>
             );
           })}
         </div>
      </div>
    </div>
  </ControlSection>
);

export default VibeSensorSection;
