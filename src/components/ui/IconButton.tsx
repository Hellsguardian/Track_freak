import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

const IconButton = ({ active, onClick, icon: Icon, label }: IconButtonProps) => (
  <motion.button 
    whileHover={{ scale: 1.025, y: -2 }}
    whileTap={{ scale: 0.975 }}
    onClick={onClick}
    className={`group relative flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all duration-500 border ${
      active 
      ? 'bg-accent/10 border-accent/40 text-white accent-glow shadow-[0_0_35px_rgba(99,102,241,0.12)]' 
      : 'bg-[#101014]/30 text-white/20 border-white/[0.04] hover:border-white/10 hover:bg-[#14141a]/50 hover:text-white/50 shadow-md'
    }`}
  >
    <div className={`p-2 rounded-xl transition-all duration-500 ${active ? 'scale-110 text-accent' : 'group-hover:scale-105 opacity-50 group-hover:opacity-100'}`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
    </div>
    <span className={`text-[8.5px] uppercase tracking-[0.2em] font-black transition-colors duration-300 ${active ? 'text-white' : 'text-white/25 group-hover:text-white/45'}`}>{label}</span>
    {active && (
      <motion.div 
        layoutId="active-dot" 
        className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(99,102,241,1)]" 
      />
    )}
  </motion.button>
);

export default IconButton;
