import { motion } from 'motion/react';

interface StreakViewProps {
  history: Record<string, boolean>;
}

const StreakView = ({ history }: StreakViewProps) => {
  // Generate last 10 days for the streak view
  const days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (9 - i));
    const key = d.toISOString().split('T')[0];
    return { key, worked: !!history[key] };
  });

  return (
    <div className="flex gap-1.5 xs:gap-2 mt-4 items-center justify-between w-full px-0.5 select-none">
      {days.map((day, idx) => {
        // High-fidelity futuristic emerald green glowing status hierarchy
        const intensities = [
          'bg-emerald-500/20 border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.12)]',
          'bg-emerald-500/50 border-emerald-500/35 shadow-[0_0_16px_rgba(16,185,129,0.35)]',
          'bg-emerald-400/80 border-emerald-300/45 shadow-[0_0_24px_rgba(52,211,153,0.6)]',
        ];

        // Variation of intensity over days to mimic GitHub patterns with organic glow variation
        const hashIdx = (idx * 3 + (day.key.charCodeAt(day.key.length - 1) || idx)) % intensities.length;
        const activeStyle = intensities[hashIdx];
        const inactiveStyle = 'bg-white/[0.015] border-white/[0.03] hover:border-white/10 hover:bg-white/[0.04] shadow-none';

        // Precise tooltip formatting
        const d = new Date(day.key);
        const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <motion.div
            key={day.key}
            whileHover={{ scale: 1.25, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className={`w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] rounded-[3px] border flex-shrink-0 cursor-pointer transition-all duration-300 relative ${
              day.worked ? activeStyle : inactiveStyle
            }`}
            title={`${formattedDate}: ${day.worked ? 'System Activity Sync Active' : 'Offline'}`}
          />
        );
      })}
    </div>
  );
};

export default StreakView;
