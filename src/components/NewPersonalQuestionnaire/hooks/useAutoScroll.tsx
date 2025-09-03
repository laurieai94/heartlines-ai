
import { useCallback, useRef } from 'react';

export const useAutoScroll = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollRef = useRef(false);

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
        // Blur active element to prevent focus conflicts during scrolling
        if (document.activeElement && document.activeElement !== document.body) {
          (document.activeElement as HTMLElement)?.blur();
        }
        
        // Mark as programmatic scroll to ignore intersection observer updates
        isProgrammaticScrollRef.current = true;
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
        const margin = 16; // Breathing room
        
        // Calculate element and container positions for full visibility
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Get current scroll position and viewport bounds
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;
        const viewTop = containerTop + headerHeight + margin;
        const viewBottom = containerBottom - margin;
        
        // Element positions relative to viewport
        const elementTop = elementRect.top;
        const elementBottom = elementRect.bottom;
        
        let targetScrollTop = container.scrollTop;
        
        // Check if element needs to be scrolled into view
        if (elementTop < viewTop) {
          // Element is hidden under header - scroll up to show it
          const relativeElementTop = elementRect.top - containerRect.top + container.scrollTop;
          targetScrollTop = relativeElementTop - headerHeight - margin;
        } else if (elementBottom > viewBottom) {
          // Element extends below viewport
          const availableViewHeight = viewBottom - viewTop;
          const elementHeight = elementRect.height;
          
          // If element is taller than viewport, position its top just under header
          if (elementHeight > availableViewHeight) {
            const relativeElementTop = elementRect.top - containerRect.top + container.scrollTop;
            targetScrollTop = relativeElementTop - headerHeight - margin;
          } else {
            // Otherwise, show it fully by scrolling down
            const relativeElementBottom = elementRect.bottom - containerRect.top + container.scrollTop;
            targetScrollTop = relativeElementBottom - container.clientHeight + margin;
          }
        }
        
        // Clamp scroll position to valid range
        const maxScroll = container.scrollHeight - container.clientHeight;
        const finalTop = Math.max(0, Math.min(targetScrollTop, maxScroll));
        
        // Only scroll if position changed significantly
        if (Math.abs(finalTop - container.scrollTop) > 5) {
          console.log('🟡 useAutoScroll: Scrolling to ensure full visibility', {
            elementId,
            headerHeight,
            currentScroll: container.scrollTop,
            targetScroll: finalTop,
            elementVisible: elementTop >= viewTop && elementBottom <= viewBottom
          });

          container.scrollTo({
            top: finalTop,
            behavior: 'smooth'
          });
          
          // Post-scroll verification - check once more after animation
          setTimeout(() => {
            requestAnimationFrame(() => {
              const updatedElementRect = element.getBoundingClientRect();
              const updatedContainerRect = container.getBoundingClientRect();
              const updatedViewTop = updatedContainerRect.top + headerHeight + margin;
              const updatedViewBottom = updatedContainerRect.bottom - margin;
              
              if (updatedElementRect.top < updatedViewTop || updatedElementRect.bottom > updatedViewBottom) {
                console.log('🟡 useAutoScroll: Re-adjusting scroll position after verification');
                const adjustedTop = updatedElementRect.top - updatedContainerRect.top + container.scrollTop - headerHeight - margin;
                const clampedTop = Math.max(0, Math.min(adjustedTop, container.scrollHeight - container.clientHeight));
                
                container.scrollTo({
                  top: clampedTop,
                  behavior: 'smooth'
                });
              }
              
              // Release programmatic scroll flag after verification
              setTimeout(() => {
                isProgrammaticScrollRef.current = false;
              }, 200);
            });
          }, 500);
        } else {
          console.log('🟡 useAutoScroll: Element already in optimal view, skipping scroll');
          // Still release programmatic scroll flag even if we don't scroll
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 100);
        }
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
          
          // Skip zero-height or hidden elements
          if (!isElementVisible(candidateElement)) {
            continue;
          }
          
          // Handle questions in collapsed optional groups
          const optionalContent = candidateElement.closest('[data-optional-content]');
          if (optionalContent) {
            const isOpen = optionalContent.getAttribute('data-optional-open') === 'true';
            if (!isOpen) {
              // Try to auto-open the collapsed optional group
              console.log('🟡 useAutoScroll: Found question in collapsed optional group, attempting to open:', candidateElement.id);
              const optionalGroup = optionalContent.closest('[data-optional-group]');
              const triggerElement = optionalGroup?.querySelector('[data-optional-trigger]') as HTMLElement;
              
              if (triggerElement) {
                console.log('🟡 useAutoScroll: Opening collapsed optional group');
                triggerElement.click();
                
                // Wait for the group to open, then retry scrolling
                setTimeout(() => {
                  if (candidateElement.id) {
                    scrollToElement(candidateElement.id, 100);
                  } else {
                    // Assign temporary ID if none exists
                    const tempId = `auto-expanded-${Date.now()}`;
                    candidateElement.id = tempId;
                    scrollToElement(tempId, 100);
                  }
                }, 350); // Allow time for expansion animation
                
                return candidateElement;
              } else {
                console.log('🟡 useAutoScroll: Could not find trigger to open optional group, skipping');
                continue;
              }
            }
          }
          
          console.log('🟡 useAutoScroll: Found next visible question globally:', candidateElement.id);
          return candidateElement;
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
      let nextId = nextElement.id;
      
      // If no ID exists, assign a temporary one for scrolling
      if (!nextId) {
        nextId = `auto-q-${Date.now()}`;
        nextElement.id = nextId;
        console.log('🟡 useAutoScroll: Assigned temporary ID to next question:', nextId);
      }
      
      console.log('🟡 useAutoScroll: Scrolling to next question:', nextId);
      scrollToElement(nextId, 300);
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
    scrollToElement,
    scrollToNextQuestion,
    scrollToNextSection,
    scrollToNextRequiredQuestion,
    clearScrollTimeout,
    isProgrammaticScrollRef
  };
};
