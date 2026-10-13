import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false
}) => {
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const threshold = 70; // Pull threshold in px

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    const container = containerRef.current;
    if (container && container.scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY;
    } else {
      startYRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || startYRef.current === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      // Apply friction curve
      const distance = Math.min(threshold * 1.5, Math.pow(diff, 0.85));
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || startYRef.current === 0) return;
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.75);
      try {
        await Promise.resolve(onRefresh());
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
    startYRef.current = 0;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full min-h-[inherit]"
    >
      {/* Native-style Pull Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-40 transition-transform duration-100 flex items-center justify-center"
          style={{ 
            top: `${Math.max(10, pullDistance * 0.8)}px`,
            opacity: Math.min(1, pullDistance / (threshold * 0.5))
          }}
        >
          <div className="bg-slate-900/90 dark:bg-black/90 border border-cyan-500/60 text-cyan-400 p-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-mono">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 4}deg)` }} />
            <span className="hidden sm:inline font-bold">
              {isRefreshing ? 'Refreshing Telemetry...' : pullDistance >= threshold ? 'Release to Refresh' : 'Pull to Refresh'}
            </span>
          </div>
        </div>
      )}

      <div 
        style={{ 
          transform: pullDistance > 0 ? `translateY(${pullDistance * 0.4}px)` : 'none',
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.25s ease-out' : 'none' 
        }}
      >
        {children}
      </div>
    </div>
  );
};
