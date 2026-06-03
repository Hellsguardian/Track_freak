import React from 'react';
import { Moon, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatSleepTime, formatTime } from '../../../utils/formatters';
import AppendRecordButton from '../../ui/AppendRecordButton';
import type { SleepState, SleepBatch } from '../../../types';

interface SleepTrackerProps {
  sleep: SleepState;
  setSleep: React.Dispatch<React.SetStateAction<SleepState>>;
  sleepError: string | null;
  currentSessionSeconds: number;
  batches: SleepBatch[];
  totalRestSeconds: number;
  toggleSleep: () => void;
  pushManualSleep: () => void;
}

const SleepTracker = ({ 
  sleep, setSleep, sleepError, currentSessionSeconds, batches, 
  totalRestSeconds, toggleSleep, pushManualSleep 
}: SleepTrackerProps) => (
  <div className="flex flex-col gap-10">
    {/* Sleep Data */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end pb-12 border-b border-white/[0.05]">
      <div className="col-span-1 h-[180px] flex flex-col justify-end pt-0 pb-10 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 blur-[80px] pointer-events-none" />
        <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black block mb-6">Total Rest</span>
        <div className={`flex items-baseline gap-2 transition-all duration-700 ${sleep.isSleeping ? 'text-accent drop-shadow-[0_0_25px_rgba(99,102,241,0.35)] scale-[1.02]' : 'text-white/85'}`}>
          {(() => {
            const { hours, minutes } = formatSleepTime(totalRestSeconds);
            return (
              <>
                <span className="text-8xl font-mono font-black tracking-tighter leading-none">
                  {hours}
                </span>
                <span className="text-3xl font-mono opacity-15 mb-2">h</span>
                <span className="text-5xl font-mono font-bold opacity-50 ml-3 tracking-tight">
                  {minutes}
                </span>
                <span className="text-xl font-mono opacity-15 mb-1">m</span>
              </>
            );
          })()}
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-6">
        <AnimatePresence>
          {sleepError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0, padding: 0 }}
              className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold"
            >
              <AlertCircle size={14} />
              {sleepError}
            </motion.div>
          )}
          {totalRestSeconds > 24 * 3600 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0, padding: 0 }}
              className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-400 text-xs font-bold"
            >
              <AlertCircle size={14} />
              Total rest exceeds 24 hours. Please verify your records.
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-2 gap-5">
          <div className="p-6 bg-[#101014]/40 border border-white/[0.04] rounded-[2rem] flex flex-col group hover:border-white/15 focus-within:border-accent/40 transition-all duration-500 shadow-inner">
            <span className="text-[8.5px] text-white/20 uppercase tracking-[0.25em] font-black mb-4 flex items-center gap-2">
               <Clock size={11} className="text-accent/60 group-hover:scale-110 transition-transform" /> Initiation
            </span>
            <input type="time" value={sleep.start} className="bg-transparent text-3xl font-mono font-black outline-none border-none p-0 cursor-pointer text-white/80 focus:text-accent group-hover:text-white transition-colors" onChange={e => setSleep({...sleep, start: e.target.value})} />
          </div>
          <div className="p-6 bg-[#101014]/40 border border-white/[0.04] rounded-[2rem] flex flex-col group hover:border-white/15 focus-within:border-emerald-500/40 transition-all duration-500 shadow-inner">
            <span className="text-[8.5px] text-white/20 uppercase tracking-[0.25em] font-black mb-4 flex items-center gap-2">
               <Clock size={11} className="text-emerald-500/60 group-hover:scale-110 transition-transform" /> Termination
            </span>
            <input type="time" value={sleep.end} className="bg-transparent text-3xl font-mono font-black outline-none border-none p-0 cursor-pointer text-white/80 focus:text-emerald-400 group-hover:text-white transition-colors" onChange={e => setSleep({...sleep, end: e.target.value})} />
          </div>
        </div>
        <AppendRecordButton 
          onComplete={pushManualSleep}
          disabled={sleep.isSleeping}
        />
      </div>
    </div>

    {/* Batch Tracking System */}
    <AnimatePresence>
      {batches.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col gap-4 overflow-hidden"
        >
          <span className="text-[9px] text-white/30 uppercase tracking-[0.25em] font-black">Tracking History</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch, index) => {
               const { hours, minutes } = formatSleepTime(batch.duration);
               return (
                <motion.div 
                  key={batch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#101014]/30 border border-white/[0.04] rounded-[2rem] flex items-center justify-between group hover:border-white/10 hover:bg-[#14141a]/40 transition-all duration-500"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] text-white/20 uppercase font-black">Batch {batches.length - index}</span>
                    <div className="flex items-center gap-4 text-[10.5px] font-mono font-bold text-white/60">
                      <div className="flex flex-col">
                        <span className="text-[7.5px] opacity-30 uppercase mb-0.5">Start</span>
                        {batch.start}
                      </div>
                      <ArrowRight size={10} className="opacity-15 group-hover:translate-x-0.5 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[7.5px] opacity-30 uppercase mb-0.5">End</span>
                        {batch.end}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-black text-accent group-hover:text-white transition-colors">
                      {batch.duration < 3600 ? (
                        <>
                          {minutes}
                          <span className="text-[9px] ml-0.5 opacity-30 uppercase">m</span>
                        </>
                      ) : (
                        <>
                          {hours}.{Math.floor(minutes/6)}
                          <span className="text-[9px] ml-1 opacity-30 uppercase">hrs</span>
                        </>
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Global Sleep Trigger */}
    <motion.button 
      id="sleep-trigger-btn"
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={toggleSleep}
      className={`group w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 border relative overflow-hidden ${
        sleep.isSleeping 
        ? 'bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/15 shadow-[0_0_40px_rgba(239,68,68,0.12)] hover:shadow-red-500/20' 
        : 'bg-accent text-white border-accent/20 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:bg-zinc-100 hover:text-black hover:border-white/40 hover:shadow-[0_0_35px_rgba(255,255,255,0.12)]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      <div className="flex items-center justify-center gap-4 relative z-10">
        {sleep.isSleeping ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        ) : (
          <Moon 
            size={16} 
            fill="currentColor" 
            className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105" 
          />
        )}
        <span className="transition-all duration-550 flex items-center gap-3">
          {sleep.isSleeping ? (
            <>
              <span className="group-hover:tracking-[0.45em] transition-all duration-500 text-red-400">System Active</span>
              <span className="font-mono text-xs font-bold bg-red-500/15 text-red-400 px-3 py-0.5 rounded-lg border border-red-500/20 tracking-normal normal-case shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                {formatTime(currentSessionSeconds)}
              </span>
            </>
          ) : (
            <span className="group-hover:tracking-[0.45em] transition-all duration-500">Initiate Sleep Session</span>
          )}
        </span>
      </div>
    </motion.button>
  </div>
);

export default SleepTracker;
