import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ icon: Icon, title, subtitle }: SectionHeaderProps) => (
  <div className="flex flex-col gap-2 mb-10 select-none">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#0d0d12]/60 border border-white/[0.06] flex items-center justify-center text-accent shadow-xl relative group overflow-hidden transition-all duration-500 hover:border-accent/30">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Icon size={20} className="relative z-10 transition-transform duration-500 group-hover:scale-110" />
      </div>
      <h2 className="text-lg font-black tracking-[0.2em] uppercase text-white/90">{title}</h2>
    </div>
    {subtitle && <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black ml-16">{subtitle}</p>}
  </div>
);

export default SectionHeader;
