import { useState, useEffect, useRef } from 'react';
import { digitalService } from '../services/digitalService';
import { DigitalNode } from '../types';

export function useDigitalBehavior() {
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [screenTime, setScreenTime] = useState(0);
  const [instaTime, setInstaTime] = useState(0);

  // Derived values for the UI component
  const consoleLogHours = Math.floor(screenTime / 60);
  const hyperSocialMinutes = instaTime;

  // New day check
  const lastCheckedDate = useRef<string>(digitalService.getTodayDateString());

  useEffect(() => {
    let mounted = true;

    const loadTodayNode = async () => {
      const todayNode = await digitalService.fetchTodayNode();
      if (mounted && todayNode) {
        setNodeId(todayNode.id);
        setScreenTime(todayNode.scree_time);
        setInstaTime(todayNode.insta_time);
        lastCheckedDate.current = todayNode.log_date;
      }
    };

    loadTodayNode();

    // Check for new day every minute
    const interval = setInterval(() => {
      const today = digitalService.getTodayDateString();
      if (today !== lastCheckedDate.current) {
        loadTodayNode();
      }
    }, 60000);

    const unsubscribe = digitalService.subscribeToNodes((payload) => {
      if (!mounted) return;
      const updatedNode = payload.new as DigitalNode;
      const today = digitalService.getTodayDateString();
      
      if (updatedNode && updatedNode.log_date === today) {
        setNodeId(updatedNode.id);
        setScreenTime(updatedNode.scree_time);
        setInstaTime(updatedNode.insta_time);
      }
    });

    return () => {
      mounted = false;
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const incrementConsoleLog = () => {
    if (!nodeId) return;
    const next = Math.min(1200, screenTime + 60); // Max 20 hours (1200 mins)
    setScreenTime(next);
    digitalService.updateNode(nodeId, { scree_time: next });
  };

  const incrementHyperSocial = () => {
    if (!nodeId) return;
    const next = Math.min(360, instaTime + 30); // Max 360 mins
    setInstaTime(next);
    digitalService.updateNode(nodeId, { insta_time: next });
  };

  const resetDigitalBehavior = () => {
    if (!nodeId) return;
    setScreenTime(0);
    setInstaTime(0);
    digitalService.updateNode(nodeId, { scree_time: 0, insta_time: 0 });
  };

  return {
    consoleLogHours,
    hyperSocialMinutes,
    incrementConsoleLog,
    incrementHyperSocial,
    resetDigitalBehavior,
  };
}
