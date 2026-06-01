import React, { useState, useEffect, useRef } from 'react';
import type { SleepState, SleepBatch, NutritionState } from '../types';
import { sleepService } from '../services/sleepService';

export function useWellness() {
  // Sleep state
  const [sleep, setSleep] = useState<SleepState>({ start: "23:15", end: "06:40", isSleeping: false });
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [batches, setBatches] = useState<SleepBatch[]>([]);
  const activeSessionIdRef = useRef<string | null>(null);

  const syncActiveSession = async () => {
    const activeSession = await sleepService.getActiveSession();
    if (activeSession) {
      activeSessionIdRef.current = activeSession.id;
      const now = new Date();
      const start = new Date(activeSession.startTimeIso);
      const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
      setCurrentSessionSeconds(diffSeconds);
      setSleep(prev => ({ ...prev, start: activeSession.start, isSleeping: true }));
      return true;
    } else {
      // If it was stopped in another tab, sync the stoppage
      setSleep(prev => ({ ...prev, isSleeping: false }));
      activeSessionIdRef.current = null;
      return false;
    }
  };

  useEffect(() => {
    const loadSleepData = async () => {
      await syncActiveSession();

      const historicalBatches = await sleepService.getSleepSessions();
      setBatches(historicalBatches);
    };
    loadSleepData();

    const handleVisibilityFocus = () => {
      if (document.visibilityState === 'visible') {
        syncActiveSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityFocus);
    window.addEventListener('focus', handleVisibilityFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityFocus);
      window.removeEventListener('focus', handleVisibilityFocus);
    };
  }, []);

  // Water state
  const [water, setWater] = useState(3);
  const [isWaterDragging, setIsWaterDragging] = useState(false);
  const waterRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);

  // Nutrition state
  const [nutrition, setNutrition] = useState<NutritionState>({ breakfast: true, lunch: true, dinner: false });

  // Training state
  const [training, setTraining] = useState(true);

  // Sleep timer effect
  useEffect(() => {
    let interval: any;
    if (sleep.isSleeping) {
      interval = setInterval(() => {
        setCurrentSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleep.isSleeping]);

  const totalRestSeconds = batches.reduce((acc, b) => acc + b.duration, 0) + (sleep.isSleeping ? currentSessionSeconds : 0);

  const toggleSleep = async () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (!sleep.isSleeping) {
      // 1. Pre-flight check: Was it started in another tab while this tab was stale?
      const existingActive = await syncActiveSession();
      if (existingActive) {
        alert("Sleep session already active. Syncing current session.");
        return; // Halt here, syncActiveSession already updated the UI
      }

      // Optimistic UI update
      setSleep(prev => ({ ...prev, start: timeStr, isSleeping: true }));
      setCurrentSessionSeconds(0);
      
      const newSession = await sleepService.startSleepSession();
      if (newSession) {
        activeSessionIdRef.current = newSession.id;
        setSleep(prev => ({ ...prev, start: newSession.start }));
      } else {
        // Revert on failure
        setSleep(prev => ({ ...prev, isSleeping: false }));
      }
    } else {
      const sessionId = activeSessionIdRef.current;
      
      // Optimistic UI update
      setSleep(prev => ({ ...prev, end: timeStr, isSleeping: false }));
      setCurrentSessionSeconds(0);
      
      if (sessionId) {
        const completedBatch = await sleepService.stopSleepSession(sessionId);
        if (completedBatch) {
          setBatches(prev => [completedBatch, ...prev]);
          activeSessionIdRef.current = null;
        }
      }
    }
  };

  const pushManualSleep = async () => {
    const [sH, sM] = sleep.start.split(':').map(Number);
    const [eH, eM] = sleep.end.split(':').map(Number);
    let diffMin = (eH * 60 + eM) - (sH * 60 + sM);
    if (diffMin < 0) diffMin += 24 * 60;
    const duration = diffMin * 60;
    
    // Optimistic UI update (using a temporary ID)
    const tempId = Date.now().toString();
    setBatches(prev => [{ id: tempId, start: sleep.start, end: sleep.end, duration }, ...prev]);

    const newBatch = await sleepService.createManualSession(sleep.start, sleep.end, duration);
    if (newBatch) {
      setBatches(prev => prev.map(b => b.id === tempId ? newBatch : b));
    } else {
      // Revert if failed
      setBatches(prev => prev.filter(b => b.id !== tempId));
    }
  };

  // Water pointer handlers
  const updateWaterFromPointer = (clientX: number) => {
    if (!waterRef.current) return;
    const rect = waterRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const value = Math.round(percentage * 5);
    setWater(value);
  };

  const onWaterPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsWaterDragging(true);
    isDraggingRef.current = true;
    updateWaterFromPointer(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onWaterPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateWaterFromPointer(e.clientX);
  };

  const onWaterPointerUp = (e: React.PointerEvent) => {
    setIsWaterDragging(false);
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Reset function for daily reset
  const resetWellness = () => {
    setSleep({ start: "23:15", end: "06:40", isSleeping: false });
    setCurrentSessionSeconds(0);
    setBatches([]);
    setWater(0);
    setNutrition({ breakfast: false, lunch: false, dinner: false });
    setTraining(false);
  };

  return {
    // Sleep
    sleep,
    setSleep,
    currentSessionSeconds,
    batches,
    totalRestSeconds,
    toggleSleep,
    pushManualSleep,
    // Water
    water,
    setWater,
    isWaterDragging,
    waterRef,
    onWaterPointerDown,
    onWaterPointerMove,
    onWaterPointerUp,
    // Nutrition
    nutrition,
    setNutrition,
    // Training
    training,
    setTraining,
    // Reset
    resetWellness,
  };
}
