import React, { useState, useEffect, useRef } from 'react';
import { productivityService } from '../services/productivityService';
import { ProductivityNode } from '../types';

export function useProductivity() {
  const [nodeId, setNodeId] = useState<string | null>(null);
  
  // Actual database values
  const [dbCodingSeconds, setDbCodingSeconds] = useState(0);
  const [dbStartedAt, setDbStartedAt] = useState<string | null>(null);
  
  // Display value
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reading, setReading] = useState(false);
  const [ukulele, setUkulele] = useState(false);
  const [training, setTraining] = useState(false);

  // Sync state when DB values change
  useEffect(() => {
    let interval: any;
    
    if (isTimerRunning && dbStartedAt) {
      // Timer is actively running, update display every second based on elapsed time
      const startTime = new Date(dbStartedAt).getTime();
      
      const updateDisplay = () => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        setTimerSeconds(dbCodingSeconds + elapsedSeconds);
      };
      
      updateDisplay(); // Run immediately
      interval = setInterval(updateDisplay, 1000);
    } else {
      // Timer is paused, just show DB seconds
      setTimerSeconds(dbCodingSeconds);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, dbStartedAt, dbCodingSeconds]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const init = async () => {
      const node = await productivityService.fetchTodayNode();
      if (node) {
        setNodeId(node.id);
        setDbCodingSeconds(node.coding_seconds);
        setDbStartedAt(node.coding_started_at ?? null);
        setIsTimerRunning(node.is_coding);
        setReading(node.book_reading);
        setUkulele(node.ukulele_practice);
        setTraining(node.workout);
        
        unsubscribe = productivityService.subscribeToNodes((payload) => {
          if (payload.new && payload.new.id === node.id) {
            const newNode = payload.new as ProductivityNode;
            setDbCodingSeconds(newNode.coding_seconds);
            setDbStartedAt(newNode.coding_started_at ?? null);
            setIsTimerRunning(newNode.is_coding);
            setReading(newNode.book_reading);
            setUkulele(newNode.ukulele_practice);
            setTraining(newNode.workout);
          }
        });
      }
    };
    
    init();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSetIsTimerRunning = (val: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof val === 'function' ? val(isTimerRunning) : val;
    
    if (next === isTimerRunning) return;
    
    setIsTimerRunning(next);
    
    if (nodeId) {
      if (next) {
        // Start: set is_coding = true and record start time
        const startedAt = new Date().toISOString();
        setDbStartedAt(startedAt);
        productivityService.updateNode(nodeId, { 
          is_coding: true,
          coding_started_at: startedAt
        });
      } else {
        // Pause: calculate elapsed, add to total, clear start time
        let additionalSeconds = 0;
        if (dbStartedAt) {
          const startTime = new Date(dbStartedAt).getTime();
          additionalSeconds = Math.floor((Date.now() - startTime) / 1000);
        }
        
        const nextTotal = dbCodingSeconds + additionalSeconds;
        setDbCodingSeconds(nextTotal);
        setDbStartedAt(null);
        
        productivityService.updateNode(nodeId, { 
          is_coding: false,
          coding_started_at: null,
          coding_seconds: nextTotal
        });
      }
    }
  };

  const handleSetReading = (val: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof val === 'function' ? val(reading) : val;
    setReading(next);
    if (nodeId) productivityService.updateNode(nodeId, { book_reading: next });
  };

  const handleSetUkulele = (val: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof val === 'function' ? val(ukulele) : val;
    setUkulele(next);
    if (nodeId) productivityService.updateNode(nodeId, { ukulele_practice: next });
  };

  const handleSetTraining = (val: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof val === 'function' ? val(training) : val;
    setTraining(next);
    if (nodeId) productivityService.updateNode(nodeId, { workout: next });
  };

  const addTime = (seconds: number) => {
    const nextTotal = dbCodingSeconds + seconds;
    setDbCodingSeconds(nextTotal);
    if (nodeId) {
      productivityService.updateNode(nodeId, { coding_seconds: nextTotal });
    }
  };

  const resetProductivity = () => {
    setDbCodingSeconds(0);
    setDbStartedAt(null);
    setIsTimerRunning(false);
    setReading(false);
    setUkulele(false);
    setTraining(false);
    if (nodeId) {
      productivityService.updateNode(nodeId, {
        coding_seconds: 0,
        coding_started_at: null,
        is_coding: false,
        book_reading: false,
        ukulele_practice: false,
        workout: false
      });
    }
  };

  return {
    timerSeconds,
    isTimerRunning,
    setIsTimerRunning: handleSetIsTimerRunning as React.Dispatch<React.SetStateAction<boolean>>,
    reading,
    setReading: handleSetReading as React.Dispatch<React.SetStateAction<boolean>>,
    ukulele,
    setUkulele: handleSetUkulele as React.Dispatch<React.SetStateAction<boolean>>,
    training,
    setTraining: handleSetTraining as React.Dispatch<React.SetStateAction<boolean>>,
    addTime,
    resetProductivity,
  };
}
