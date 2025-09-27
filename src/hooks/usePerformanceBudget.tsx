import { useEffect, useRef, useCallback, useState } from 'react';

interface PerformanceBudget {
  maxExecutionTime: number; // ms
  maxMemoryUsage: number; // MB
  maxRenderTime: number; // ms
  frameDropThreshold: number; // consecutive dropped frames
}

interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  renderTime: number;
  droppedFrames: number;
  isOverBudget: boolean;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxExecutionTime: 16, // 60fps budget
  maxMemoryUsage: 50, // 50MB for mobile
  maxRenderTime: 16,
  frameDropThreshold: 3
};

// Performance budget monitoring for mobile optimization
export const usePerformanceBudget = (customBudget?: Partial<PerformanceBudget>) => {
  const budget = { ...DEFAULT_BUDGET, ...customBudget };
  const metricsRef = useRef<PerformanceMetrics>({
    executionTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    droppedFrames: 0,
    isOverBudget: false
  });
  
  const [shouldOptimize, setShouldOptimize] = useState(false);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  // Memory usage monitoring
  const checkMemoryUsage = useCallback(() => {
    if (!('memory' in performance)) return 0;
    
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
  }, []);

  // Frame drop detection
  const monitorFrameRate = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTimeRef.current;
    
    if (deltaTime > budget.maxRenderTime * 2) { // Dropped frame threshold
      metricsRef.current.droppedFrames++;
    } else {
      metricsRef.current.droppedFrames = Math.max(0, metricsRef.current.droppedFrames - 0.1);
    }
    
    lastFrameTimeRef.current = now;
    frameCountRef.current++;
    
    // Check if optimization is needed
    const isOverBudget = metricsRef.current.droppedFrames > budget.frameDropThreshold ||
                        metricsRef.current.memoryUsage > budget.maxMemoryUsage;
    
    if (isOverBudget !== metricsRef.current.isOverBudget) {
      metricsRef.current.isOverBudget = isOverBudget;
      setShouldOptimize(isOverBudget);
    }
    
    if (frameCountRef.current < 1000) {
      requestAnimationFrame(monitorFrameRate);
    }
  }, [budget.maxRenderTime, budget.frameDropThreshold, budget.maxMemoryUsage]);

  // Performance monitoring setup
  useEffect(() => {
    if (!import.meta.env.DEV) return; // Only monitor in development
    
    const monitorPerformance = () => {
      metricsRef.current.memoryUsage = checkMemoryUsage();
      
      // Start frame monitoring
      requestAnimationFrame(monitorFrameRate);
    };
    
    // Delayed monitoring to avoid affecting initial load
    const timeoutId = setTimeout(monitorPerformance, 2000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [checkMemoryUsage, monitorFrameRate]);

  // Performance measurement utilities
  const measureExecution = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T => {
    return ((...args: any[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      const executionTime = end - start;
      metricsRef.current.executionTime = executionTime;
      
      if (executionTime > budget.maxExecutionTime) {
        console.warn(`[Performance] ${name} exceeded budget: ${executionTime.toFixed(2)}ms`);
      }
      
      return result;
    }) as T;
  }, [budget.maxExecutionTime]);

  // Get current performance metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  // Feature flag for conditional rendering based on performance
  const shouldSkipExpensiveFeatures = useCallback(() => {
    return shouldOptimize || metricsRef.current.droppedFrames > budget.frameDropThreshold;
  }, [shouldOptimize, budget.frameDropThreshold]);

  // Adaptive quality control
  const getAdaptiveQuality = useCallback(() => {
    if (metricsRef.current.droppedFrames > budget.frameDropThreshold * 2) {
      return 'low'; // Lowest quality for severe performance issues
    }
    if (metricsRef.current.droppedFrames > budget.frameDropThreshold) {
      return 'medium'; // Medium quality for moderate issues
    }
    return 'high'; // High quality when performance is good
  }, [budget.frameDropThreshold]);

  return {
    shouldOptimize,
    measureExecution,
    getMetrics,
    shouldSkipExpensiveFeatures,
    getAdaptiveQuality,
    budget
  };
};