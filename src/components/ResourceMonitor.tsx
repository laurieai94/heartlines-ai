import React, { useEffect, useState } from 'react';
import { MemoryManager } from '@/utils/memoryManager';
import { getResizeManagerStats } from '@/hooks/useGlobalResize';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResourceStats {
  memoryStats: {
    intervals: number;
    timeouts: number;
    listeners: number;
    totalResources: number;
  } | null;
  resizeStats: {
    activeSubscriptions: number;
  };
}

// Development-only resource monitoring component
export function ResourceMonitor() {
  const [stats, setStats] = useState<ResourceStats>({
    memoryStats: null,
    resizeStats: { activeSubscriptions: 0 }
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.PROD) return;

    const updateStats = () => {
      setStats({
        memoryStats: MemoryManager.getStats(),
        resizeStats: getResizeManagerStats()
      });
    };

    // Update stats every 2 seconds
    const interval = setInterval(updateStats, 2000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/80 text-white px-3 py-1 rounded text-xs font-mono border border-gray-600 hover:bg-black/90"
      >
        Resources {stats.memoryStats?.totalResources || 0}
      </button>
      
      {isVisible && (
        <Card className="mt-2 w-64 bg-black/90 text-white border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono">Resource Monitor</CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-mono space-y-2">
            {stats.memoryStats && (
              <div>
                <div className="font-semibold">Memory Manager:</div>
                <div>Intervals: {stats.memoryStats.intervals}</div>
                <div>Timeouts: {stats.memoryStats.timeouts}</div>
                <div>Listeners: {stats.memoryStats.listeners}</div>
                <div className="font-semibold">Total: {stats.memoryStats.totalResources}</div>
              </div>
            )}
            
            <div>
              <div className="font-semibold">Resize Manager:</div>
              <div>Subscriptions: {stats.resizeStats.activeSubscriptions}</div>
            </div>
            
            <div className="pt-2 border-t border-gray-600">
              <div className="text-green-400">
                {stats.memoryStats?.totalResources === 0 ? '✓ Clean' : '⚠ Active'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}