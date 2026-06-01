import { Zap } from 'lucide-react';

const Footer = () => (
  <footer className="mt-12 flex flex-col items-center gap-12 border-t border-white/5 pt-20">
    <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-500 group">
       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:rotate-12 transition-transform">
         <Zap size={18} fill="black" className="text-black" />
       </div>
       <span className="text-2xl font-black tracking-tighter uppercase italic">Track Freak Terminal</span>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-6 opacity-20">
       <a href="#" className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-colors">Uplink Status</a>
       <a href="#" className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-colors">Neural Sync</a>
       <a href="#" className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-colors">Operator Key</a>
       <a href="#" className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-accent transition-colors">V1.2.42-X</a>
    </div>
    
    <div className="max-w-[400px] text-center px-6">
       <p className="text-[9px] text-white/10 uppercase tracking-[0.2em] font-bold leading-relaxed mb-8">
         Personal performance is a cold discipline. Data remains the only absolute truth 
         in an unpredictable reality. Sync finalized at {new Date().toLocaleTimeString()}
       </p>
       <div className="flex justify-center gap-1">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="w-4 h-[1px] bg-white/5" />
          ))}
       </div>
    </div>
  </footer>
);

export default Footer;
