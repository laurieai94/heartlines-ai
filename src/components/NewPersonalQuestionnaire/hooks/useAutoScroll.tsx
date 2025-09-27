import { useCallback, useRef } from 'react';

// Optimized auto-scroll hook - performance-focused version
export const useAutoScroll = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  const clearScrollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Simplified scroll function using CSS scroll-behavior
  const scrollToElement = useCallback((elementId: string, delay: number = 100) => {
    clearScrollTimeout();
    
    timeoutRef.current = setTimeout(() => {
      const element = document.getElementById(elementId) || 
                     document.querySelector(`[data-question-card][id="${elementId}"]`);
      
      if (!element) {
        return;
      }

      // Mark as programmatic scroll
      isProgrammaticScrollRef.current = true;
      document.documentElement.setAttribute('data-programmatic-scroll', 'true');

      // Find scroll container
      const container = element.closest('[data-scroll-container]') as HTMLElement ||
                       document.querySelector('[data-scroll-container]') as HTMLElement;

      if (!container) {
        // Fallback to native scrollIntoView with CSS smooth scrolling
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Clear flag after scroll
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
          document.documentElement.removeAttribute('data-programmatic-scroll');
        }, 300);
        return;
      }

      // Simple scroll calculation without complex verification
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const headerHeight = container.querySelector('[data-sticky-header]')?.getBoundingClientRect().height || 0;
      
      const targetScroll = container.scrollTop + elementRect.top - containerRect.top - headerHeight - 20;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));

      // Use CSS smooth scrolling
      container.style.scrollBehavior = 'smooth';
      container.scrollTop = finalScroll;
      
      // Clear flag and reset scroll-behavior
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        document.documentElement.removeAttribute('data-programmatic-scroll');
        container.style.scrollBehavior = '';
      }, 300);
      
    }, delay);
  }, [clearScrollTimeout]);

  const scrollToNextQuestion = useCallback((currentQuestionId: string) => {
    const currentElement = document.getElementById(currentQuestionId);
    if (!currentElement) return;

    // Simple next question logic
    const allQuestions = document.querySelectorAll('[data-question-card]');
    const currentIndex = Array.from(allQuestions).findIndex(el => el.id === currentQuestionId);
    
    if (currentIndex !== -1 && currentIndex < allQuestions.length - 1) {
      const nextElement = allQuestions[currentIndex + 1] as HTMLElement;
      if (nextElement && nextElement.offsetHeight > 0) {
        scrollToElement(nextElement.id);
      }
    }
  }, [scrollToElement]);

  const scrollToNextSection = useCallback((currentSection: number) => {
    const nextSection = currentSection + 1;
    scrollToElement(`section-${nextSection}`);
  }, [scrollToElement]);

  const scrollToNextRequiredQuestion = useCallback((currentQuestionId: string) => {
    // Simplified required question flow
    const requiredQuestionMap: Record<string, string> = {
      'question-name': 'question-pronouns',
      'question-pronouns': 'question-age',
      'question-age': 'question-gender',
      'question-gender': 'question-orientation',
      'question-orientation': 'section-2',
    };

    const nextQuestionId = requiredQuestionMap[currentQuestionId];
    if (nextQuestionId) {
      scrollToElement(nextQuestionId);
    }
  }, [scrollToElement]);

  return {
    scrollToElement,
    scrollToNextQuestion,
    scrollToNextSection,
    scrollToNextRequiredQuestion,
    clearScrollTimeout,
    isProgrammaticScrollRef
  };
};