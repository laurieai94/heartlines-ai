import { useCallback, useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';

interface ResizeSubscription {
  callback: () => void;
  id: string;
}

// Global resize manager - single event listener for entire app
class GlobalResizeManager {
  private subscriptions = new Map<string, ResizeSubscription>();
  private isListening = false;
  private throttledHandler: (() => void) | null = null;

  private handleResize = () => {
    this.subscriptions.forEach(({ callback }) => {
      try {
        callback();
      } catch (error) {
        console.error('Error in resize callback:', error);
      }
    });
  };

  subscribe(id: string, callback: () => void) {
    this.subscriptions.set(id, { callback, id });
    
    // Initialize listener on first subscription
    if (!this.isListening && typeof window !== 'undefined') {
      this.throttledHandler = throttle(this.handleResize, 100);
      window.addEventListener('resize', this.throttledHandler, { passive: true });
      this.isListening = true;
    }
  }

  unsubscribe(id: string) {
    this.subscriptions.delete(id);
    
    // Remove listener when no subscriptions remain
    if (this.subscriptions.size === 0 && this.isListening && this.throttledHandler) {
      window.removeEventListener('resize', this.throttledHandler);
      this.isListening = false;
      this.throttledHandler = null;
    }
  }

  getActiveSubscriptions() {
    return this.subscriptions.size;
  }
}

const globalResizeManager = new GlobalResizeManager();

// Hook for components to subscribe to global resize events
export function useGlobalResize(callback: () => void, dependencies: any[] = []) {
  const idRef = useRef<string>();
  const callbackRef = useRef(callback);

  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, dependencies);

  useEffect(() => {
    // Generate unique ID for this subscription
    const id = `resize-${Math.random().toString(36).substr(2, 9)}`;
    idRef.current = id;

    // Subscribe with current callback
    globalResizeManager.subscribe(id, () => callbackRef.current());

    return () => {
      globalResizeManager.unsubscribe(id);
    };
  }, []); // Only run once per component mount

  return {
    activeSubscriptions: globalResizeManager.getActiveSubscriptions()
  };
}

// Utility to get resize manager stats (for debugging)
export function getResizeManagerStats() {
  return {
    activeSubscriptions: globalResizeManager.getActiveSubscriptions()
  };
}