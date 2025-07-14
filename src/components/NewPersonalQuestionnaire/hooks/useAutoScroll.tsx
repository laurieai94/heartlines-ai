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

    // First try to find the next question card as a sibling
    let nextElement = currentElement.nextElementSibling;
    while (nextElement && !nextElement.hasAttribute('data-question-card')) {
      nextElement = nextElement.nextElementSibling;
    }

    // If no sibling found, look more broadly in the document
    if (!nextElement) {
      const allQuestionCards = document.querySelectorAll('[data-question-card]');
      const currentIndex = Array.from(allQuestionCards).findIndex(el => el.id === currentQuestionId);
      
      if (currentIndex !== -1 && currentIndex < allQuestionCards.length - 1) {
        nextElement = allQuestionCards[currentIndex + 1] as Element;
      }
    }

    if (nextElement) {
      const nextId = nextElement.id;
      if (nextId) {
        scrollToElement(nextId, 300); // Shorter delay for better UX
      }
    } else {
      // If no next question in current section, look for next section
      const currentSection = currentElement.closest('[id^="section-"]');
      if (currentSection) {
        const currentSectionId = currentSection.id;
        const sectionNumber = parseInt(currentSectionId.replace('section-', ''));
        const nextSectionElement = document.getElementById(`section-${sectionNumber + 1}`);
        if (nextSectionElement) {
          // Find first question in next section
          const firstQuestionInNext = nextSectionElement.querySelector('[data-question-card]');
          if (firstQuestionInNext && firstQuestionInNext.id) {
            scrollToElement(firstQuestionInNext.id, 300);
          } else {
            scrollToElement(`section-${sectionNumber + 1}`, 300);
          }
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