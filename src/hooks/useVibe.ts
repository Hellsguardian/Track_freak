import React, { useState, useEffect } from 'react';
import { vibeService } from '../services/vibeService';
import { VibeNode } from '../types';

export function useVibe() {
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const init = async () => {
      const node = await vibeService.fetchTodayNode();
      if (node) {
        setNodeId(node.id);
        setMood(node.mood);
        setStress(node.stress_level);
        
        unsubscribe = vibeService.subscribeToNodes((payload) => {
          if (payload.new && payload.new.id === node.id) {
            const newNode = payload.new as VibeNode;
            setMood(newNode.mood);
            setStress(newNode.stress_level);
          }
        });
      }
    };
    
    init();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSetMood = (val: number | null | ((prev: number | null) => number | null)) => {
    const next = typeof val === 'function' ? val(mood) : val;
    setMood(next);
    if (nodeId) {
      vibeService.updateNode(nodeId, { mood: next });
    }
  };

  const handleSetStress = (val: number | null | ((prev: number | null) => number | null)) => {
    const next = typeof val === 'function' ? val(stress) : val;
    setStress(next);
    if (nodeId) {
      vibeService.updateNode(nodeId, { stress_level: next });
    }
  };

  const resetVibe = () => {
    setMood(null);
    setStress(null);
    if (nodeId) {
      vibeService.updateNode(nodeId, {
        mood: null,
        stress_level: null
      });
    }
  };

  return {
    mood,
    setMood: handleSetMood as React.Dispatch<React.SetStateAction<number | null>>,
    stress,
    setStress: handleSetStress as React.Dispatch<React.SetStateAction<number | null>>,
    resetVibe,
  };
}
