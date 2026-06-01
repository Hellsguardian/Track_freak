import { useState, useEffect } from 'react';

export function useProductivity() {
  const [timerSeconds, setTimerSeconds] = useState(5.2 * 3600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reading, setReading] = useState(true);
  const [ukulele, setUkulele] = useState(false);
  const [training, setTraining] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const addTime = (seconds: number) => {
    setTimerSeconds(prev => prev + seconds);
  };

  const resetProductivity = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setReading(false);
    setUkulele(false);
    setTraining(false);
  };

  return {
    timerSeconds,
    isTimerRunning,
    setIsTimerRunning,
    reading,
    setReading,
    ukulele,
    setUkulele,
    training,
    setTraining,
    addTime,
    resetProductivity,
  };
}
