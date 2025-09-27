import { useEffect, useRef, useCallback } from 'react';
import { throttle, debounce } from '@/utils/throttle';

interface EventListenerOptions {
  passive?: boolean;
  capture?: boolean;
  once?: boolean;
  throttle?: number;
  debounce?: number;
}

// Centralized event listener management for optimal performance
export const useOptimizedEventListener = <T extends keyof (WindowEventMap & DocumentEventMap & HTMLElementEventMap)>(
  eventType: T,
  handler: (event: Event) => void,
  element?: Element | Window | Document | null,
  options: EventListenerOptions = {}
) => {
  const handlerRef = useRef(handler);
  const optimizedHandlerRef = useRef<(event: Event) => void>();
  const cleanupRef = useRef<() => void>();

  // Update handler ref without causing re-renders
  handlerRef.current = handler;

  // Create optimized handler with throttling/debouncing
  const createOptimizedHandler = useCallback(() => {
    const { throttle: throttleMs, debounce: debounceMs } = options;
    
    if (throttleMs) {
      return throttle((event: Event) => handlerRef.current(event), throttleMs);
    }
    
    if (debounceMs) {
      return debounce((event: Event) => handlerRef.current(event), debounceMs);
    }
    
    return (event: Event) => handlerRef.current(event);
  }, [options.throttle, options.debounce]);

  useEffect(() => {
    const targetElement = element || window;
    if (!targetElement) return;

    // Create optimized handler only once
    if (!optimizedHandlerRef.current) {
      optimizedHandlerRef.current = createOptimizedHandler();
    }

    const eventOptions = {
      passive: options.passive ?? true, // Default to passive for better performance
      capture: options.capture ?? false,
      once: options.once ?? false
    };

    // Add event listener
    targetElement.addEventListener(eventType, optimizedHandlerRef.current, eventOptions);

    // Store cleanup function
    cleanupRef.current = () => {
      targetElement.removeEventListener(eventType, optimizedHandlerRef.current!, eventOptions);
    };

    // Return cleanup function
    return cleanupRef.current;
  }, [eventType, element, options.passive, options.capture, options.once, createOptimizedHandler]);
};

// Batch event listener management for multiple events
export const useBatchedEventListeners = (
  listeners: Array<{
    eventType: keyof (WindowEventMap & DocumentEventMap & HTMLElementEventMap);
    handler: (event: Event) => void;
    element?: Element | Window | Document | null;
    options?: EventListenerOptions;
  }>
) => {
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    listeners.forEach(({ eventType, handler, element, options = {} }) => {
      const targetElement = element || window;
      if (!targetElement) return;

      const eventOptions = {
        passive: options.passive ?? true,
        capture: options.capture ?? false,
        once: options.once ?? false
      };

      // Create optimized handler
      let optimizedHandler = handler;
      if (options.throttle) {
        optimizedHandler = throttle(handler, options.throttle);
      } else if (options.debounce) {
        optimizedHandler = debounce(handler, options.debounce);
      }

      targetElement.addEventListener(eventType, optimizedHandler, eventOptions);
      
      cleanupFunctions.push(() => {
        targetElement.removeEventListener(eventType, optimizedHandler, eventOptions);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [listeners]);
};

// High-performance scroll listener with automatic optimizations
export const useOptimizedScrollListener = (
  handler: (event: Event) => void,
  element?: Element | Window | null,
  throttleMs: number = 16 // ~60fps
) => {
  useOptimizedEventListener('scroll', handler, element, {
    passive: true,
    throttle: throttleMs
  });
};

// High-performance resize listener
export const useOptimizedResizeListener = (
  handler: (event: Event) => void,
  debounceMs: number = 150
) => {
  useOptimizedEventListener('resize', handler, window, {
    passive: true,
    debounce: debounceMs
  });
};