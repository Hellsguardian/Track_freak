import { useState, useEffect, useCallback } from 'react';

export function useResetAll(onReset: () => void) {
  const [isResetHolding, setIsResetHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const resetAll = useCallback(() => {
    onReset();
    setHoldProgress(0);
    setIsResetHolding(false);
  }, [onReset]);

  useEffect(() => {
    let interval: any;
    if (isResetHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            resetAll();
            return 100;
          }
          return next;
        });
      }, 20);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isResetHolding, resetAll]);

  return {
    isResetHolding,
    setIsResetHolding,
    holdProgress,
  };
}
