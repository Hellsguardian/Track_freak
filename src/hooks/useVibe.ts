import { useState } from 'react';

export function useVibe() {
  const [mood, setMood] = useState(4);
  const [stress, setStress] = useState(2);

  const resetVibe = () => {
    setMood(3);
    setStress(1);
  };

  return {
    mood,
    setMood,
    stress,
    setStress,
    resetVibe,
  };
}
