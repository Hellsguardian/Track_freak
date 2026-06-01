import { useState } from 'react';

export function useDigitalBehavior() {
  const [consoleLogHours, setConsoleLogHours] = useState(4);
  const [hyperSocialMinutes, setHyperSocialMinutes] = useState(45);

  const incrementConsoleLog = () => {
    setConsoleLogHours(prev => Math.min(20, prev + 1));
  };

  const incrementHyperSocial = () => {
    setHyperSocialMinutes(prev => Math.min(360, prev + 30));
  };

  const resetDigitalBehavior = () => {
    setConsoleLogHours(0);
    setHyperSocialMinutes(0);
  };

  return {
    consoleLogHours,
    hyperSocialMinutes,
    incrementConsoleLog,
    incrementHyperSocial,
    resetDigitalBehavior,
  };
}
