
import { useCallback, useRef } from 'react';

export const useAutoScroll = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearScrollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scrollToElement = useCallback((elementId: string, delay: number = 150) => {
    console.log('🟡 useAutoScroll: scrollToElement called with elementId:', elementId, 'delay:', delay);
    clearScrollTimeout();
    
    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        console.log('🟡 useAutoScroll: setTimeout triggered, looking for element:', elementId);
        
        const element = document.getElementById(elementId) || 
                       document.querySelector(`[data-question-card][id="${elementId}"]`) ||
                       document.querySelector(`[data-question-card*="${elementId}"]`);
        
        console.log('🟡 useAutoScroll: Found element:', !!element, element?.id);
        
        if (!element) {
          console.warn('🔴 useAutoScroll: Element not found:', elementId);
          return;
        }

        // Find scroll container by walking up from element or fallback to document search
        let container = element.closest('[data-scroll-container]') as HTMLElement;
        if (!container) {
          container = document.querySelector('[data-scroll-container]') as HTMLElement;
        }

        if (!container) {
          console.warn('🔴 useAutoScroll: No scroll container found, falling back to scrollIntoView');
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          return;
        }

        // Get header height from sticky header
        const stickyHeader = container.querySelector('[data-sticky-header]') as HTMLElement;
        const headerHeight = stickyHeader?.offsetHeight || 0;
        
        // Calculate precise scroll position
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
        const finalTop = Math.max(0, relativeTop - (headerHeight + 12)); // 12px breathing room
        
        console.log('🟡 useAutoScroll: Scrolling to element with container scroll', {
          elementId,
          headerHeight,
          finalTop
        });

        container.scrollTo({
          top: finalTop,
          behavior: 'smooth'
        });
      });
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

    // If no sibling found, look more broadly in the document but skip collapsed optional content
    if (!nextElement) {
      console.log('🟡 useAutoScroll: No next sibling found, searching all question cards');
      const allQuestionCards = document.querySelectorAll('[data-question-card]');
      console.log('🟡 useAutoScroll: Found', allQuestionCards.length, 'question cards total');
      
      const currentIndex = Array.from(allQuestionCards).findIndex(el => el.id === currentQuestionId);
      console.log('🟡 useAutoScroll: Current question index:', currentIndex);
      
      if (currentIndex !== -1 && currentIndex < allQuestionCards.length - 1) {
        // Look for next visible question (not in collapsed optional group)
        for (let i = currentIndex + 1; i < allQuestionCards.length; i++) {
          const candidateElement = allQuestionCards[i] as Element;
          const optionalContent = candidateElement.closest('[data-optional-content]');
          
          if (optionalContent) {
            // Check if this optional group is open
            const isOpen = optionalContent.getAttribute('data-optional-open') === 'true';
            if (!isOpen) {
              console.log('🟡 useAutoScroll: Skipping question in collapsed optional group:', candidateElement.id);
              continue; // Skip this question, it's in a collapsed optional group
            }
          }
          
          nextElement = candidateElement;
          console.log('🟡 useAutoScroll: Found next visible element:', nextElement?.id);
          break;
        }
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

  const scrollToNextRequiredQuestion = useCallback((currentQuestionId: string) => {
    console.log('🟡 useAutoScroll: scrollToNextRequiredQuestion called with:', currentQuestionId);
    
    // Define the order of required questions based on requirements.ts
    const requiredQuestionFlow = [
      'question-name-pronouns',     // Section 1: name, pronouns
      'question-relationship-status', // Section 2: relationshipStatus  
      'question-love-language',     // Section 3: loveLanguage
      'question-attachment-style'   // Section 4: attachmentStyle
    ];
    
    const currentIndex = requiredQuestionFlow.indexOf(currentQuestionId);
    console.log('🟡 useAutoScroll: Current question index:', currentIndex);
    
    if (currentIndex !== -1 && currentIndex < requiredQuestionFlow.length - 1) {
      const nextQuestionId = requiredQuestionFlow[currentIndex + 1];
      console.log('🟡 useAutoScroll: Scrolling to next required question:', nextQuestionId);
      scrollToElement(nextQuestionId, 300);
    } else {
      console.log('🟡 useAutoScroll: No more required questions, looking for next section');
      // If no more required questions, try to scroll to next section
      const currentElement = document.getElementById(currentQuestionId);
      if (currentElement) {
        const currentSection = currentElement.closest('[id^="section-"]');
        if (currentSection) {
          const currentSectionId = currentSection.id;
          const sectionNumber = parseInt(currentSectionId.replace('section-', ''));
          scrollToNextSection(sectionNumber);
        }
      }
    }
  }, [scrollToElement, scrollToNextSection]);

  return {
    scrollToNextQuestion,
    scrollToNextSection,
    scrollToNextRequiredQuestion,
    clearScrollTimeout
  };
};
