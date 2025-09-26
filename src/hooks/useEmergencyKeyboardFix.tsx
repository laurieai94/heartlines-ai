import { useEffect, useState, useRef } from 'react';

/**
 * Emergency keyboard detection hook as fallback when ViewportContext fails
 * Uses multiple detection methods for maximum reliability
 */
export const useEmergencyKeyboardFix = (inputRef?: React.RefObject<HTMLElement>) => {
  const [keyboardData, setKeyboardData] = useState({
    isVisible: false,
    height: 0,
    method: 'none' as 'focus' | 'resize' | 'viewport' | 'none'
  });
  
  const initialHeight = useRef<number>(0);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Store initial height
    initialHeight.current = window.innerHeight;
    
    // Method 1: Input focus/blur detection
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        console.log('🚨 Emergency: Input focused, forcing keyboard detection');
        
        // Clear any existing timeout
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
        
        // Wait for keyboard animation, then check height
        focusTimeoutRef.current = setTimeout(() => {
          const currentHeight = window.visualViewport?.height || window.innerHeight;
          const heightDiff = initialHeight.current - currentHeight;
          
          console.log('🚨 Emergency Focus Detection:', {
            initialHeight: initialHeight.current,
            currentHeight,
            heightDiff,
            isKeyboard: heightDiff > 50
          });
          
          if (heightDiff > 50) {
            setKeyboardData({
              isVisible: true,
              height: heightDiff,
              method: 'focus'
            });
          }
        }, 300);
      }
    };

    const handleFocusOut = () => {
      console.log('🚨 Emergency: Input unfocused');
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      
      setTimeout(() => {
        setKeyboardData({
          isVisible: false,
          height: 0,
          method: 'focus'
        });
      }, 100);
    };

    // Method 2: Window resize detection
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const visualHeight = window.visualViewport?.height || currentHeight;
      const heightDiff = currentHeight - visualHeight;
      
      console.log('🚨 Emergency Resize Detection:', {
        currentHeight,
        visualHeight,
        heightDiff,
        isKeyboard: heightDiff > 50
      });
      
      if (heightDiff > 50) {
        setKeyboardData({
          isVisible: true,
          height: heightDiff,
          method: 'resize'
        });
      } else if (heightDiff < 20) {
        setKeyboardData({
          isVisible: false,
          height: 0,
          method: 'resize'
        });
      }
    };

    // Method 3: Visual viewport API
    const handleVisualViewportResize = () => {
      if (!window.visualViewport) return;
      
      const windowHeight = window.innerHeight;
      const visualHeight = window.visualViewport.height;
      const heightDiff = windowHeight - visualHeight;
      
      console.log('🚨 Emergency Visual Viewport Detection:', {
        windowHeight,
        visualHeight,
        heightDiff,
        isKeyboard: heightDiff > 30
      });
      
      if (heightDiff > 30) {
        setKeyboardData({
          isVisible: true,
          height: heightDiff,
          method: 'viewport'
        });
      } else {
        setKeyboardData({
          isVisible: false,
          height: 0,
          method: 'viewport'
        });
      }
    };

    // Add all event listeners
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }

    // Cleanup
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', handleResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
      
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  return keyboardData;
};