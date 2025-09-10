import { useCallback, useRef } from 'react';

export const useSnapFlow = () => {
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearScrollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scrollToElement = useCallback((elementId: string, delay: number = 100) => {
    clearScrollTimeout();
    
    timeoutRef.current = setTimeout(() => {
      const element = document.getElementById(elementId) || 
                      document.querySelector(`[data-question-card][id="${elementId}"]`);
      
      if (!element) {
        console.warn('SnapFlow: Element not found:', elementId);
        return;
      }

      // Find scroll container
      const container = element.closest('[data-scroll-container]') as HTMLElement;
      if (!container) {
        // Fallback to native scrollIntoView
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        return;
      }

      // Use native scrollIntoView which respects scroll-snap
      isScrollingRef.current = true;
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      // Clear scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);

    }, delay);
  }, [clearScrollTimeout]);

  const scrollToNextQuestion = useCallback((currentQuestionId: string) => {
    const currentElement = document.getElementById(currentQuestionId);
    if (!currentElement) return;

    // Find next visible question card
    const allQuestionCards = document.querySelectorAll('[data-question-card]');
    const currentIndex = Array.from(allQuestionCards).findIndex(el => el.id === currentQuestionId);
    
    if (currentIndex === -1) return;

    // Look for next visible question
    for (let i = currentIndex + 1; i < allQuestionCards.length; i++) {
      const candidate = allQuestionCards[i] as HTMLElement;
      const rect = candidate.getBoundingClientRect();
      
      // Skip if element is hidden or collapsed
      if (rect.height === 0 || rect.width === 0) continue;
      
      // Skip if inside a collapsed optional group
      const optionalContent = candidate.closest('[data-optional-content]');
      if (optionalContent && optionalContent.getAttribute('data-optional-open') !== 'true') {
        continue;
      }

      scrollToElement(candidate.id, 200);
      return;
    }
  }, [scrollToElement]);

  const scrollToNextRequiredQuestion = useCallback((currentQuestionId: string) => {
    // For simplicity, use the same logic as scrollToNextQuestion
    scrollToNextQuestion(currentQuestionId);
  }, [scrollToNextQuestion]);

  return {
    scrollToElement,
    scrollToNextQuestion,
    scrollToNextRequiredQuestion,
    isScrolling: isScrollingRef.current
  };
};