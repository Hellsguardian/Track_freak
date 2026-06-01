import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Minus, Plus } from 'lucide-react';

interface HydrationControlProps {
  water: number;
  setWater: React.Dispatch<React.SetStateAction<number>>;
  isWaterDragging: boolean;
  waterRef: React.RefObject<HTMLDivElement | null>;
  onWaterPointerDown: (e: React.PointerEvent) => void;
  onWaterPointerMove: (e: React.PointerEvent) => void;
  onWaterPointerUp: (e: React.PointerEvent) => void;
}

const HydrationControl = ({ 
  water, setWater, isWaterDragging, waterRef,
  onWaterPointerDown, onWaterPointerMove, onWaterPointerUp 
}: HydrationControlProps) => (
  <div 
    ref={waterRef}
    onPointerDown={onWaterPointerDown}
    onPointerMove={onWaterPointerMove}
    onPointerUp={onWaterPointerUp}
    onPointerCancel={onWaterPointerUp}
    style={{ touchAction: 'none' }}
    className={`bg-[#08080C]/40 border rounded-[3rem] p-10 flex items-center justify-between group overflow-hidden relative transition-all duration-75 cursor-ew-resize select-none shadow-2xl ${
      isWaterDragging ? 'border-accent/40 shadow-[0_0_50px_rgba(99,102,241,0.15)] scale-[1.01]' : 'border-white/[0.04] hover:border-white/10'
    }`}
  >
    {/* Progress Fill Background */}
    <motion.div 
      initial={false}
      animate={{ width: `${(water / 5) * 100}%` }}
      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent/[0.02] to-accent/[0.08] pointer-events-none" 
    />
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-accent/[0.015] blur-[100px] pointer-events-none" />
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 text-accent/60 mb-3">
        <Droplets size={16} className={water > 0 ? "animate-pulse" : ""} />
        <span className="text-[9px] uppercase font-black tracking-[0.3em] leading-none">Cellular Hydration</span>
      </div>
      <div className="text-6xl font-mono font-black flex items-baseline gap-4 text-white/90">
        {water}
        <span className="text-lg text-white/10 uppercase tracking-[0.4em] font-black">Units</span>
      </div>
      {/* Visual Indicator Track */}
      <div className="flex gap-2 mt-6">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ 
              opacity: i < water ? 1 : 0.15,
              scaleX: i < water ? 1.15 : 1
            }}
            className={`h-1 w-8 rounded-full transition-all duration-500 ${
              i < water ? 'bg-accent shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'bg-white'
            }`} 
          />
        ))}
      </div>
    </div>

    <div className="flex gap-4 relative z-10">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); setWater(Math.max(0, water - 1)); }} 
        className="w-12 h-12 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all shadow-xl"
      >
        <Minus size={14} className="text-white/40" />
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); setWater(Math.min(5, water + 1)); }} 
        className="w-12 h-12 flex items-center justify-center bg-white text-black border border-white/10 rounded-2xl hover:bg-zinc-200 shadow-2xl transition-all"
      >
        <Plus size={14} className="font-bold" />
      </motion.button>
    </div>
  </div>
);

export default HydrationControl;
