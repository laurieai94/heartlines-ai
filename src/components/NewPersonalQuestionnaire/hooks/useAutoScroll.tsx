
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

  const scrollToNextQuestion = useCallback((currentQuestionId: string, retryCount: number = 0) => {
    console.log('🟡 useAutoScroll: scrollToNextQuestion called with:', currentQuestionId, 'retry:', retryCount);
    
    const currentElement = document.getElementById(currentQuestionId);
    if (!currentElement) {
      console.warn('🔴 useAutoScroll: Current element not found:', currentQuestionId);
      return;
    }

    const findNextVisibleQuestion = () => {
      // Strategy 1: Look within the same OptionalGroup first (group-aware prioritization)
      const currentOptionalGroup = currentElement.closest('[data-optional-content]');
      if (currentOptionalGroup) {
        console.log('🟡 useAutoScroll: Current question is in optional group, looking for next within group');
        const questionsInGroup = currentOptionalGroup.querySelectorAll('[data-question-card]');
        const currentIndex = Array.from(questionsInGroup).findIndex(el => el.id === currentQuestionId);
        
        if (currentIndex !== -1 && currentIndex < questionsInGroup.length - 1) {
          const nextInGroup = questionsInGroup[currentIndex + 1] as Element;
          // Check if the next question in group is visible and has proper height
          if (nextInGroup && isElementVisible(nextInGroup)) {
            console.log('🟡 useAutoScroll: Found next question within same optional group:', nextInGroup.id);
            return nextInGroup;
          }
        }
      }

      // Strategy 2: Look for immediate sibling question cards
      let nextElement = currentElement.nextElementSibling;
      while (nextElement && !nextElement.hasAttribute('data-question-card')) {
        nextElement = nextElement.nextElementSibling;
      }
      
      if (nextElement && isElementVisible(nextElement)) {
        console.log('🟡 useAutoScroll: Found next sibling question:', nextElement.id);
        return nextElement;
      }

      // Strategy 3: Search globally but prioritize visible questions
      console.log('🟡 useAutoScroll: No next sibling found, searching all question cards');
      const allQuestionCards = document.querySelectorAll('[data-question-card]');
      const currentIndex = Array.from(allQuestionCards).findIndex(el => el.id === currentQuestionId);
      
      if (currentIndex !== -1 && currentIndex < allQuestionCards.length - 1) {
        for (let i = currentIndex + 1; i < allQuestionCards.length; i++) {
          const candidateElement = allQuestionCards[i] as Element;
          
          // Skip questions in collapsed optional groups
          const optionalContent = candidateElement.closest('[data-optional-content]');
          if (optionalContent) {
            const isOpen = optionalContent.getAttribute('data-optional-open') === 'true';
            if (!isOpen) {
              console.log('🟡 useAutoScroll: Skipping question in collapsed optional group:', candidateElement.id);
              continue;
            }
          }
          
          // Check if element is visible and properly rendered
          if (isElementVisible(candidateElement)) {
            console.log('🟡 useAutoScroll: Found next visible question globally:', candidateElement.id);
            return candidateElement;
          }
        }
      }

      return null;
    };

    // Helper function to check if element is visible and has proper dimensions
    const isElementVisible = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return rect.height > 0 && rect.width > 0 && !element.closest('[style*="display: none"]');
    };

    const nextElement = findNextVisibleQuestion();

    if (nextElement) {
      const nextId = nextElement.id;
      if (nextId) {
        console.log('🟡 useAutoScroll: Scrolling to next question:', nextId);
        scrollToElement(nextId, 300);
      }
    } else if (retryCount < 3) {
      // Retry mechanism for conditionally rendered content
      console.log('🟡 useAutoScroll: No visible next question found, retrying in 200ms...');
      setTimeout(() => {
        scrollToNextQuestion(currentQuestionId, retryCount + 1);
      }, 200);
    } else {
      console.log('🟡 useAutoScroll: No next question found after retries, looking for next section');
      // If no next question found after retries, look for next section
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
