import React from 'react';
import { motion } from 'motion/react';
import { 
  Moon, 
  Sun, 
  Zap, 
  LayoutDashboard, 
  Activity, 
  TrendingUp 
} from 'lucide-react';

interface HeaderProps {
  isLightMode: boolean;
  setIsLightMode: React.Dispatch<React.SetStateAction<boolean>>;
  isResetHolding: boolean;
  setIsResetHolding: React.Dispatch<React.SetStateAction<boolean>>;
  holdProgress: number;
}

const Header = ({ isLightMode, setIsLightMode, isResetHolding, setIsResetHolding, holdProgress }: HeaderProps) => (
  <header className="flex flex-col gap-8 mb-8 select-none">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full pb-4 border-b border-white/[0.03]">
      {/* Logo and Brand Title */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="relative group flex-shrink-0">
            {/* Refined ambient back glow */}
            <div className="absolute -inset-3.5 bg-gradient-to-tr from-accent/25 via-indigo-500/20 to-purple-600/15 blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
            
            {/* High-tech balanced capsule: dimensions match the stacked words perfectly physically */}
            <div className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] bg-gradient-to-br from-[#121216] via-[#16161f] to-[#0a0a0d] border border-white/[0.08] rounded-2xl flex items-center justify-center relative shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 group-hover:scale-[1.05] group-hover:border-accent/40 group-hover:shadow-[0_0_35px_rgba(99,102,241,0.22)]">
              {/* Digital scanline overlay */}
              <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
              
              {/* Inside glow sphere */}
              <div className="absolute -inset-1 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none group-hover:scale-110 transition-all duration-500" />
              
              {/* Technical circular bracket frame */}
              <div className="absolute inset-2 rounded-xl border border-dashed border-white/10 group-hover:border-accent/30 group-hover:rotate-90 transition-all duration-1000" />
              
              {/* Tiny operational neon light dot in the top left corner */}
              <span className="absolute top-2 left-2 flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-400/80"></span>
              </span>

              {/* High-end tech indicators around edges */}
              <div className="absolute top-2 right-2 text-[5px] font-mono tracking-widest text-white/25 select-none scale-90">01</div>
              <div className="absolute bottom-2 left-2 text-[5px] font-mono tracking-widest text-white/25 select-none scale-90">SYS</div>

              {/* Corner sci-fi brackets */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/25 rounded-tl-[3px] group-hover:border-accent transition-colors duration-300" />
              <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-white/25 rounded-br-[3px] group-hover:border-accent transition-colors duration-300" />
              
              {/* Neon main ZAP mark */}
              <Zap size={24} className="text-accent drop-shadow-[0_0_15px_rgba(99,102,241,0.7)] transform transition-transform duration-500 group-hover:scale-115 group-hover:rotate-12 z-10" fill="rgba(99,102,241,0.25)" />
            </div>
          </div>
          
          <div className="flex flex-col select-none justify-center leading-[0.9] gap-1.5 py-1">
            {/* TRACK - Upgraded to Syne with high-impact geometric letterforms */}
            <span className="text-[25px] md:text-[33px] font-syne font-extrabold tracking-[0.16em] text-white/95 uppercase leading-none select-none">
              TRACK
            </span>
            
            {/* FREAK - Matches size, weight and tracking perfectly with custom neon gradient */}
            <span className="text-[25px] md:text-[33px] font-syne font-black tracking-[0.16em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-accent via-violet-300 to-indigo-300 drop-shadow-[0_0_25px_rgba(99,102,241,0.35)] select-none">
              FREAK
            </span>
          </div>
        </div>
        
        {/* Tech info subtitle block */}
        <div className="flex items-center gap-1.5 mt-1 select-none font-mono text-[8px] sm:text-[9px] tracking-wider text-white/25 pl-[72px] md:pl-[92px]">
          <span className="text-accent/70 font-bold uppercase tracking-widest">CC.OS</span>
          <span className="text-white/10">//</span>
          <span className="uppercase text-white/40 tracking-wider">Operator Console</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* Top Control Track */}
      <div className="flex flex-col gap-2 w-full md:w-[312px] flex-shrink-0">
        {/* Top Row: System Reset & Light Mode side-by-side with equal dimensions */}
        <div className="flex items-center gap-2 w-full">
          {/* System Reset / Purge Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            onPointerDown={() => setIsResetHolding(true)}
            onPointerUp={() => setIsResetHolding(false)}
            onPointerLeave={() => setIsResetHolding(false)}
            className="group relative flex items-center justify-center gap-2 h-10 flex-1 rounded-xl bg-[#101014]/50 border border-white/[0.04] backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 hover:border-red-500/35 hover:bg-[#14141a]/60 overflow-hidden shadow-xl select-none touch-none"
          >
            {/* Progress Fill Background - Animated with buttery-smooth structural spring physics */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-red-500/20 pointer-events-none border-r border-red-500/35" 
              initial={{ width: "0%" }}
              animate={{ width: `${holdProgress}%` }}
              transition={{ 
                type: "spring", 
                stiffness: holdProgress === 0 ? 140 : 250, 
                damping: holdProgress === 0 ? 18 : 28,
                mass: 0.5,
                restDelta: 0.1
              }}
            />
            
            <div className="flex items-center justify-center gap-2 relative z-10 w-full px-1">
              <Activity 
                size={12} 
                className={`transition-all duration-300 flex-shrink-0 ${
                  holdProgress > 0 
                    ? 'text-red-400 animate-spin' 
                    : 'text-white/30 group-hover:text-red-400 group-hover:scale-110'
                }`} 
              />
              <span 
                className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 truncate ${
                  holdProgress > 0 
                    ? 'text-red-400 font-extrabold drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                    : 'text-white/30 group-hover:text-white'
                }`}
              >
                {holdProgress > 0 ? "Purging..." : "System Reset"}
              </span>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-red-500/0 via-red-500/5 to-transparent" />
          </motion.button>

          {/* Light Mode Control */}
          <motion.button 
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLightMode(prev => !prev)}
            className="group relative flex items-center justify-center gap-2 h-10 flex-1 rounded-xl bg-[#101014]/50 border border-white/[0.04] backdrop-blur-md transition-all hover:border-accent/35 hover:bg-[#14141a]/60 overflow-hidden shadow-xl select-none"
          >
            <div className="flex items-center justify-center gap-2 relative z-10 w-full px-1">
              {isLightMode ? (
                <Sun size={12} className="text-accent group-hover:text-amber-400 transition-colors duration-300 flex-shrink-0" />
              ) : (
                <Moon size={12} className="text-white/30 group-hover:text-accent transition-colors duration-300 flex-shrink-0" />
              )}
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors duration-300 truncate">
                {isLightMode ? "Light HUD" : "Dark HUD"}
              </span>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-accent/0 via-accent/5 to-transparent" />
          </motion.button>
        </div>

        {/* Bottom Row: Dashboard (full width below both buttons) */}
        <motion.button 
          id="header-dashboard-btn"
          whileHover={{ scale: 1.015, y: -0.5 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group relative flex items-center justify-center gap-2 h-10 w-full rounded-xl bg-[#101014]/50 border border-white/[0.04] text-white/40 shadow-xl overflow-hidden transition-all duration-300 hover:bg-accent/10 hover:border-accent/35 hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]"
        >
          <div className="flex items-center justify-center gap-2 relative z-10 w-full px-2">
            <LayoutDashboard size={12} className="text-white/30 group-hover:text-accent group-hover:rotate-6 transition-all duration-300 flex-shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors duration-300 truncate">
              Dashboard Overview
            </span>
            <span className="relative flex h-1 w-1 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-0 group-hover:opacity-75 transition-opacity duration-300"></span>
              <span className="relative inline-flex rounded-full h-1 w-1 bg-white/20 group-hover:bg-accent transition-colors duration-300"></span>
            </span>
          </div>
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-accent/0 via-accent/5 to-transparent" />
        </motion.button>
      </div>
    </div>
    
    {/* Status Panel Metrics Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 bg-[#0a0a0f]/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-white/[0.04] shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
      
      {/* Card 1: Circadian Sync */}
      <div className="bg-[#060608]/40 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col gap-4 relative group overflow-hidden border border-white/[0.02] hover:border-white/[0.07] transition-all duration-550">
        <div className="absolute inset-0 bg-accent/[0.012] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <span className="text-[9px] text-white/25 uppercase tracking-[0.3em] font-black relative z-10">Circadian Sync</span>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
          <motion.div initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="h-full bg-accent shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-[9.5px] font-mono text-accent font-bold tracking-tight">68% DEPLETED</span>
          <span className="text-[9.5px] font-mono text-white/25">42M LEFT</span>
        </div>
      </div>

      {/* Card 2: Bio Load */}
      <div className="bg-[#060608]/40 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col gap-4 relative group overflow-hidden border border-white/[0.02] hover:border-white/[0.07] transition-all duration-550">
        <div className="absolute inset-0 bg-emerald-500/[0.012] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <span className="text-[9px] text-white/25 uppercase tracking-[0.3em] font-black relative z-10">Bio Load</span>
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">Optimal Range</span>
        </div>
        <span className="text-[9.5px] font-mono text-white/25 uppercase tracking-wider relative z-10">HRV: 72ms <span className="text-emerald-400/80">(+2.4)</span></span>
      </div>

      {/* Card 3: Network Status */}
      <div className="bg-[#060608]/40 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col gap-4 relative group overflow-hidden border border-white/[0.02] hover:border-white/[0.07] transition-all duration-550">
        <div className="absolute inset-0 bg-accent/[0.012] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <span className="text-[9px] text-white/25 uppercase tracking-[0.3em] font-black relative z-10">Network Status</span>
        <div className="flex items-center gap-2.5 relative z-10">
          <TrendingUp size={13} className="text-white/35 group-hover:text-accent transition-colors duration-300" />
          <span className="text-xs font-mono text-white/40 uppercase font-black tracking-widest">Encrypted Node</span>
        </div>
        <span className="text-[9.5px] font-mono text-emerald-500/70 font-semibold uppercase tracking-wider relative z-10">SECURE_TUNNEL: ACTIVE</span>
      </div>
    </div>
  </header>
);

export default Header;
