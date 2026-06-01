import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: LucideIcon;
  className?: string;
}

const ToggleButton = ({ active, onClick, label, icon: Icon, className = "" }: ToggleButtonProps) => (
  <motion.button 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${
      active 
      ? 'bg-accent/15 border-accent/50 text-white accent-glow shadow-[0_0_30px_rgba(99,102,241,0.08)]' 
      : 'bg-[#101014]/40 border-white/[0.04] text-white/20 hover:border-white/10 hover:bg-[#14141a]/60 hover:text-white/45 shadow-sm'
    } ${className}`}
  >
    <Icon size={13} strokeWidth={active ? 2.5 : 1.5} className={active ? 'text-accent' : 'opacity-40'} />
    {label}
  </motion.button>
);

export default ToggleButton;
