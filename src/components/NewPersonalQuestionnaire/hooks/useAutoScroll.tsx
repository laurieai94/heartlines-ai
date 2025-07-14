import { useCallback, useRef } from 'react';

export const useAutoScroll = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearScrollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scrollToElement = useCallback((elementId: string, delay: number = 500) => {
    clearScrollTimeout();
    
    timeoutRef.current = setTimeout(() => {
      const element = document.getElementById(elementId) || 
                     document.querySelector(`[data-question-card][id="${elementId}"]`) ||
                     document.querySelector(`[data-question-card*="${elementId}"]`);
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, delay);
  }, [clearScrollTimeout]);

  const scrollToNextQuestion = useCallback((currentQuestionId: string) => {
    const currentElement = document.getElementById(currentQuestionId);
    if (!currentElement) return;

    // Find the next question card in the DOM
    let nextElement = currentElement.nextElementSibling;
    while (nextElement && !nextElement.hasAttribute('data-question-card')) {
      nextElement = nextElement.nextElementSibling;
    }

    if (nextElement) {
      const nextId = nextElement.id;
      if (nextId) {
        scrollToElement(nextId);
      }
    } else {
      // If no next question in current section, look for next section
      const currentSection = currentElement.closest('[id^="section-"]');
      if (currentSection) {
        const currentSectionId = currentSection.id;
        const sectionNumber = parseInt(currentSectionId.replace('section-', ''));
        const nextSectionElement = document.getElementById(`section-${sectionNumber + 1}`);
        if (nextSectionElement) {
          scrollToElement(`section-${sectionNumber + 1}`);
        }
      }
    }
  }, [scrollToElement]);

  const scrollToNextSection = useCallback((currentSection: number) => {
    const nextSection = currentSection + 1;
    const sectionElement = document.getElementById(`section-${nextSection}`);
    
    if (sectionElement) {
      scrollToElement(`section-${nextSection}`);
    }
  }, [scrollToElement]);

  return {
    scrollToNextQuestion,
    scrollToNextSection,
    clearScrollTimeout
  };
};