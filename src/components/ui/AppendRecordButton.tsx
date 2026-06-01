import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface AppendRecordButtonProps {
  onComplete: () => void;
  disabled: boolean;
}

const AppendRecordButton = ({ onComplete, disabled }: AppendRecordButtonProps) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const startTimeRef = React.useRef<number | null>(null);
  const frameRef = React.useRef<number | null>(null);

  const duration = 240; // 240ms for buttery fast but intentional feel

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const p = Math.min((elapsed / duration) * 100, 100);
    
    setProgress(p);

    if (p < 100) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      onComplete();
      stopHolding();
    }
  };

  const startHolding = () => {
    if (disabled) return;
    setIsHolding(true);
    startTimeRef.current = null;
    frameRef.current = requestAnimationFrame(animate);
  };

  const stopHolding = () => {
    setIsHolding(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    startTimeRef.current = null;
    setProgress(0);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.01 }}
      animate={isHolding ? { scale: 0.985, backgroundColor: 'rgba(99, 102, 241, 0.12)' } : { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onPointerDown={startHolding}
      onPointerUp={stopHolding}
      onPointerLeave={stopHolding}
      disabled={disabled}
      className={`group relative w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] border overflow-hidden select-none touch-none transition-colors duration-200 ${
        disabled 
        ? 'bg-white/2 border-white/5 text-white/10 opacity-20' 
        : isHolding 
          ? 'border-accent/50 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)]'
          : 'border-white/5 text-white/40 hover:border-white/20 shadow-2xl'
      }`}
    >
      <motion.div 
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ type: "tween", ease: "linear", duration: 0.016 }}
        className="absolute left-0 top-0 bottom-0 bg-accent/40 pointer-events-none" 
      />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {isHolding && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
          >
            <Activity size={12} className="text-accent" />
          </motion.div>
        )}
        {isHolding ? "Syncing..." : "Append Record"}
      </span>
    </motion.button>
  );
};

export default AppendRecordButton;
