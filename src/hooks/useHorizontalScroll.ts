import React, { useEffect } from 'react';

export function useHorizontalScroll(mounted: boolean) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let currentScrollLeft = el.scrollLeft;
    let velocity = 0;
    let animationFrameId: number;
    let snapBackTimeout: any;

    const updateScroll = () => {
      if (Math.abs(velocity) > 0.1) {
        currentScrollLeft += velocity;
        
        // Boundaries clamps
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (currentScrollLeft < 0) {
          currentScrollLeft = 0;
          velocity = 0;
        } else if (currentScrollLeft > maxScroll) {
          currentScrollLeft = maxScroll;
          velocity = 0;
        }
        
        el.scrollLeft = currentScrollLeft;
        velocity *= 0.94; // Smooth inertia friction decay
        animationFrameId = requestAnimationFrame(updateScroll);
      } else {
        velocity = 0;
        clearTimeout(snapBackTimeout);
        snapBackTimeout = setTimeout(() => {
          el.style.scrollSnapType = 'x mandatory';
        }, 150);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        
        // Remove snap properties temporarily so the scroll is free and buttery
        el.style.scrollSnapType = 'none';
        clearTimeout(snapBackTimeout);
        
        // Synchronize our tracker variable in case user manually dragged
        if (Math.abs(velocity) < 0.2) {
          currentScrollLeft = el.scrollLeft;
        }

        // Add soft impulse with dynamic scroll intensity
        velocity += e.deltaY * 0.16;
        
        // Dynamic clamping of velocity
        const maxV = 50;
        if (velocity > maxV) velocity = maxV;
        if (velocity < -maxV) velocity = -maxV;

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateScroll);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(snapBackTimeout);
    };
  }, [mounted]);

  return { scrollRef };
}
