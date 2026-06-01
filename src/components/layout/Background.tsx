import { motion } from 'motion/react';

const Background = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="cinematic-bg" />
    <div className="mesh-grid shadow-inner" />
    <div className="vignette" />
    <div className="scan-line" />
    
    {/* Floating Atmospheric Nodes */}
    <motion.div 
      animate={{ 
        x: [0, 60, 0], 
        y: [0, -40, 0],
        opacity: [0.05, 0.1, 0.05] 
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[15%] left-[20%] w-[35vw] h-[35vw] bg-accent/10 blur-[140px] rounded-full"
    />
    <motion.div 
      animate={{ 
        x: [0, -80, 0], 
        y: [0, 60, 0],
        opacity: [0.03, 0.12, 0.03] 
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[20%] right-[15%] w-[45vw] h-[45vw] bg-purple-500/5 blur-[160px] rounded-full"
    />

    {/* Framing HUD Units */}
    <div className="absolute inset-10 opacity-[0.12] hidden 2xl:block">
      <div className="absolute top-0 left-0 space-y-4">
        <div className="flex gap-2">
          <div className="w-16 h-[1px] bg-white" />
          <div className="w-2 h-2 rounded-full border border-white" />
        </div>
        <p className="text-[9px] font-mono tracking-[0.6em] uppercase">Control_Link: Establishing</p>
      </div>
      <div className="absolute top-0 right-0 space-y-4 text-right">
        <div className="flex gap-2 justify-end items-center">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <div className="w-16 h-[1px] bg-white" />
        </div>
        <p className="text-[9px] font-mono tracking-[0.6em] uppercase">Core_Sync: Stable</p>
      </div>
      <div className="absolute bottom-0 left-0 space-y-4">
        <p className="text-[9px] font-mono tracking-[0.4em] mb-4">V_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        <div className="w-24 h-[1px] bg-gradient-to-r from-white to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 space-y-4 text-right">
        <p className="text-[9px] font-mono tracking-[0.4em] mb-4">REGION_IDENT: HQ_ASIA</p>
        <div className="w-24 h-[1px] bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  </div>
);

export default Background;
