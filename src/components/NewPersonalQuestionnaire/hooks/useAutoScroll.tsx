
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
    console.log('🟡 useAutoScroll: scrollToElement called with elementId:', elementId, 'delay:', delay);
    clearScrollTimeout();
    
    timeoutRef.current = setTimeout(() => {
      console.log('🟡 useAutoScroll: setTimeout triggered, looking for element:', elementId);
      
      const element = document.getElementById(elementId) || 
                     document.querySelector(`[data-question-card][id="${elementId}"]`) ||
                     document.querySelector(`[data-question-card*="${elementId}"]`);
      
      console.log('🟡 useAutoScroll: Found element:', !!element, element?.id);
      
      if (element) {
        console.log('🟡 useAutoScroll: Scrolling to element:', element.id);
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      } else {
        console.warn('🔴 useAutoScroll: Element not found:', elementId);
      }
    }, delay);
  }, [clearScrollTimeout]);

  const scrollToNextQuestion = useCallback((currentQuestionId: string) => {
    console.log('🟡 useAutoScroll: scrollToNextQuestion called with:', currentQuestionId);
    
    const currentElement = document.getElementById(currentQuestionId);
    if (!currentElement) {
      console.warn('🔴 useAutoScroll: Current element not found:', currentQuestionId);
      return;
    }

    // First try to find the next question card as a sibling
    let nextElement = currentElement.nextElementSibling;
    while (nextElement && !nextElement.hasAttribute('data-question-card')) {
      nextElement = nextElement.nextElementSibling;
    }

    // If no sibling found, look more broadly in the document
    if (!nextElement) {
      console.log('🟡 useAutoScroll: No next sibling found, searching all question cards');
      const allQuestionCards = document.querySelectorAll('[data-question-card]');
      console.log('🟡 useAutoScroll: Found', allQuestionCards.length, 'question cards total');
      
      const currentIndex = Array.from(allQuestionCards).findIndex(el => el.id === currentQuestionId);
      console.log('🟡 useAutoScroll: Current question index:', currentIndex);
      
      if (currentIndex !== -1 && currentIndex < allQuestionCards.length - 1) {
        nextElement = allQuestionCards[currentIndex + 1] as Element;
        console.log('🟡 useAutoScroll: Found next element by index:', nextElement?.id);
      }
    }

    if (nextElement) {
      const nextId = nextElement.id;
      if (nextId) {
        console.log('🟡 useAutoScroll: Scrolling to next question:', nextId);
        scrollToElement(nextId, 300); // Shorter delay for better UX
      }
    } else {
      console.log('🟡 useAutoScroll: No next question found, looking for next section');
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
            console.log('🟡 useAutoScroll: Scrolling to first question in next section:', firstQuestionInNext.id);
            scrollToElement(firstQuestionInNext.id, 300);
          } else {
            console.log('🟡 useAutoScroll: Scrolling to next section:', `section-${sectionNumber + 1}`);
            scrollToElement(`section-${sectionNumber + 1}`, 300);
          }
        }
      }
    }
  }, [scrollToElement]);

  const scrollToNextSection = useCallback((currentSection: number) => {
    const nextSection = currentSection + 1;
    console.log('🟡 useAutoScroll: scrollToNextSection called, current:', currentSection, 'next:', nextSection);
    const sectionElement = document.getElementById(`section-${nextSection}`);
    
    if (sectionElement) {
      console.log('🟡 useAutoScroll: Found next section element, scrolling');
      scrollToElement(`section-${nextSection}`);
    } else {
      console.warn('🔴 useAutoScroll: Next section element not found:', `section-${nextSection}`);
    }
  }, [scrollToElement]);

  return {
    scrollToNextQuestion,
    scrollToNextSection,
    clearScrollTimeout
  };
};
