import { motion } from 'motion/react';
import { Smartphone, Instagram, Activity } from 'lucide-react';
import { formatHyperSocial } from '../../../utils/formatters';
import ControlSection from '../../ui/ControlSection';
import SectionHeader from '../../ui/SectionHeader';

interface DigitalBehaviorSectionProps {
  consoleLogHours: number;
  hyperSocialMinutes: number;
  incrementConsoleLog: () => void;
  incrementHyperSocial: () => void;
  resetDigitalBehavior: () => void;
}

const DigitalBehaviorSection = ({
  consoleLogHours, hyperSocialMinutes,
  incrementConsoleLog, incrementHyperSocial,
  resetDigitalBehavior,
}: DigitalBehaviorSectionProps) => (
  <ControlSection>
    <div className="flex items-center justify-between mb-2">
      <SectionHeader icon={Smartphone} title="Digital Behavior" subtitle="Information Hygiene & Usage" />
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetDigitalBehavior}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.04] bg-[#101014]/40 hover:bg-accent/10 hover:border-accent/20 transition-all mb-10 shadow-lg"
      >
        <Activity size={11} className="text-white/20 group-hover:text-accent transition-colors" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-colors">System Cleanse</span>
      </motion.button>
    </div>
    
    <div className="flex flex-col gap-10">
      {/* Screen Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.button 
          whileHover={{ scale: 1.025, y: -2 }}
          whileTap={{ scale: 0.975 }}
          onClick={incrementConsoleLog}
          className="p-10 bg-[#08080C]/40 border border-white/[0.04] rounded-[3rem] group hover:border-white/15 hover:bg-[#101014]/40 transition-all text-left relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.02] transition-colors pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                <Smartphone size={16} className="text-white/40 group-hover:text-accent transition-colors" />
              </div>
              <span className="text-[9px] text-white/20 uppercase tracking-[0.25em] font-black leading-none group-hover:text-white transition-colors">Console Log</span>
            </div>
            <div className={`w-2 h-2 rounded-full transition-all duration-700 ${consoleLogHours > 0 ? 'bg-accent shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'bg-white/10'}`} />
          </div>
          <div className="flex items-end justify-between relative z-10">
            <div className="text-5xl font-mono font-black text-white/90">{consoleLogHours}<span className="text-xl text-white/10 ml-2 uppercase">h</span></div>
            <span className="text-[8px] font-mono text-white/10 mb-2 uppercase tracking-widest font-bold group-hover:text-white/20 transition-colors">Total_Uptime</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity duration-700 rotate-12">
            <Smartphone size={120} />
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.025, y: -2 }}
          whileTap={{ scale: 0.975 }}
          onClick={incrementHyperSocial}
          className="p-10 bg-[#08080C]/40 border border-white/[0.04] rounded-[3rem] group hover:border-pink-500/15 hover:bg-[#101014]/40 transition-all text-left relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/[0.02] transition-colors pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                <Instagram size={16} className="text-pink-500/40 group-hover:text-pink-500 transition-colors" />
               </div>
               <span className="text-[9px] text-pink-500/20 uppercase tracking-[0.25em] font-black leading-none group-hover:text-pink-500 transition-colors">Hyper-Social</span>
            </div>
            <div className={`w-2 h-2 rounded-full transition-all duration-700 ${hyperSocialMinutes > 0 ? 'bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)]' : 'bg-white/10'}`} />
          </div>
          <div className="flex items-end justify-between relative z-10">
            <div className="text-5xl font-mono font-black text-pink-500/80 group-hover:text-pink-500 transition-colors">
              {formatHyperSocial(hyperSocialMinutes)}
            </div>
            <span className="text-[9px] font-mono text-pink-500/10 mb-2 uppercase tracking-widest font-bold group-hover:text-pink-500/30 transition-colors">Signal_Waste</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 -rotate-12">
            <Instagram size={120} />
          </div>
        </motion.button>
      </div>
    </div>
  </ControlSection>
);

export default DigitalBehaviorSection;
