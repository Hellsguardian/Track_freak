import { useState, useEffect } from 'react';

export function useTheme() {
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trackfreak-theme") === "light";
    }
    return false;
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem("trackfreak-theme", isLightMode ? "light" : "dark");
  }, [isLightMode]);

  return {
    isLightMode,
    setIsLightMode,
  };
}
