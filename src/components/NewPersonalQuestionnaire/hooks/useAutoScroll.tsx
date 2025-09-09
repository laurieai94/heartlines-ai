
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

  // Helper to wait for layout stability before scrolling
  const waitForLayoutStability = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      let stableCount = 0;
      let lastHeight = document.body.scrollHeight;
      
      const checkStability = () => {
        const currentHeight = document.body.scrollHeight;
        if (currentHeight === lastHeight) {
          stableCount++;
          if (stableCount >= 3) { // 3 consecutive stable measurements
            resolve();
            return;
          }
        } else {
          stableCount = 0;
          lastHeight = currentHeight;
        }
        
        setTimeout(checkStability, 50);
      };
      
      // Start checking
      setTimeout(checkStability, 50);
      
      // Safety timeout - don't wait forever
      setTimeout(() => resolve(), 500);
    });
  }, []);

  const scrollToElement = useCallback((elementId: string, delay: number = 150) => {
    console.log('🟡 useAutoScroll: scrollToElement called with elementId:', elementId, 'delay:', delay);
    clearScrollTimeout();
    
    timeoutRef.current = setTimeout(async () => {
      // Wait for layout stability first
      await waitForLayoutStability();
      
      requestAnimationFrame(() => {
        // Blur active element to prevent focus conflicts during scrolling
        if (document.activeElement && document.activeElement !== document.body) {
          (document.activeElement as HTMLElement)?.blur();
        }
        
        // Mark as programmatic scroll to ignore intersection observer updates
        isProgrammaticScrollRef.current = true;
        
        // Set programmatic scroll attribute for intersection observer coordination
        document.documentElement.setAttribute('data-programmatic-scroll', 'true');
        
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

        // Get header height from sticky header with enhanced detection
        const stickyHeader = container.querySelector('[data-sticky-header]') as HTMLElement;
        const headerHeight = stickyHeader?.offsetHeight || 0;
        
        // Increase margins for better mobile scrolling, especially for cross-section navigation
        const isMobile = window.innerWidth < 640;
        const topMargin = isMobile ? 32 : 20; // More generous top margin on mobile
        const bottomMargin = isMobile ? 20 : 24; // Reduced bottom margin on mobile to prevent overshoot
        const containerPadding = isMobile ? 16 : 32; // Account for container padding
        
        console.log('📱 useAutoScroll: Mobile scroll adjustments:', {
          elementId,
          isMobile,
          headerHeight,
          topMargin,
          bottomMargin,
          containerPadding
        });
        
        // Calculate element and container positions for COMPLETE visibility
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Enhanced viewport calculation ensuring complete visibility with container padding
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        const availableViewTop = containerTop + headerHeight + topMargin + containerPadding;
        const availableViewBottom = containerTop + containerHeight - bottomMargin - containerPadding;
        const availableViewHeight = availableViewBottom - availableViewTop;
        
        // Element positions and dimensions
        const elementTop = elementRect.top;
        const elementBottom = elementRect.bottom;
        const elementHeight = elementRect.height;
        
        let targetScrollTop = container.scrollTop;
        let needsScroll = false;
        
        // GUARANTEE: Entire element must be completely visible
        const isFullyVisible = elementTop >= availableViewTop && elementBottom <= availableViewBottom;
        
        if (!isFullyVisible) {
          needsScroll = true;
          
          if (elementHeight > availableViewHeight) {
            // Element is taller than viewport - position top under header with container padding
            const relativeElementTop = elementRect.top - containerRect.top + container.scrollTop;
            targetScrollTop = relativeElementTop - headerHeight - topMargin - containerPadding;
          } else if (elementTop < availableViewTop) {
            // Element is hidden under header - scroll up with container padding
            const relativeElementTop = elementRect.top - containerRect.top + container.scrollTop;
            targetScrollTop = relativeElementTop - headerHeight - topMargin - containerPadding;
          } else if (elementBottom > availableViewBottom) {
            // Element extends below viewport - scroll down to show bottom with container padding
            const relativeElementBottom = elementRect.bottom - containerRect.top + container.scrollTop;
            targetScrollTop = relativeElementBottom - containerHeight + bottomMargin + containerPadding;
          }
        }
        
        // Clamp scroll position to valid range
        const maxScroll = container.scrollHeight - container.clientHeight;
        const finalTop = Math.max(0, Math.min(targetScrollTop, maxScroll));
        
        // Only scroll if needed and position changed significantly
        if (needsScroll && Math.abs(targetScrollTop - container.scrollTop) > 3) {
          console.log('🟡 useAutoScroll: Scrolling to ensure COMPLETE visibility', {
            elementId,
            headerHeight,
            elementHeight,
            availableViewHeight,
            isFullyVisible,
            currentScroll: container.scrollTop,
            targetScroll: targetScrollTop,
            elementTop,
            elementBottom,
            availableViewTop,
            availableViewBottom
          });

          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
          
          // Simplified post-scroll behavior - disable verification loop on mobile to prevent bounce
          if (isMobile) {
            // On mobile, just release the programmatic scroll flag after a short delay
            setTimeout(() => {
              isProgrammaticScrollRef.current = false;
              document.documentElement.removeAttribute('data-programmatic-scroll');
            }, 300);
          } else {
            // Enhanced post-scroll verification with retry loop for desktop
            const verifyAndCorrect = (attemptCount = 0) => {
              if (attemptCount >= 3) {
                console.log('🟡 useAutoScroll: Max verification attempts reached');
                isProgrammaticScrollRef.current = false;
                return;
              }
              
              setTimeout(() => {
                requestAnimationFrame(() => {
                  const updatedElementRect = element.getBoundingClientRect();
                  const updatedContainerRect = container.getBoundingClientRect();
                  const updatedAvailableTop = updatedContainerRect.top + headerHeight + topMargin;
                  const updatedAvailableBottom = updatedContainerRect.top + updatedContainerRect.height - bottomMargin;
                  
                  const isNowFullyVisible = updatedElementRect.top >= updatedAvailableTop && 
                                          updatedElementRect.bottom <= updatedAvailableBottom;
                  
                  if (!isNowFullyVisible) {
                    console.log(`🟡 useAutoScroll: Verification ${attemptCount + 1} - still not fully visible, correcting`);
                    
                    let correctedTop = container.scrollTop;
                    
                    if (updatedElementRect.top < updatedAvailableTop) {
                      // Still hidden under header
                      correctedTop = updatedElementRect.top - updatedContainerRect.top + container.scrollTop - headerHeight - topMargin;
                    } else if (updatedElementRect.bottom > updatedAvailableBottom) {
                      // Still extends below viewport
                      correctedTop = updatedElementRect.bottom - updatedContainerRect.top + container.scrollTop - updatedContainerRect.height + bottomMargin;
                    }
                    
                    const clampedTop = Math.max(0, Math.min(correctedTop, container.scrollHeight - container.clientHeight));
                    
                    container.scrollTo({
                      top: clampedTop,
                      behavior: 'smooth'
                    });
                    
                    // Try again
                    verifyAndCorrect(attemptCount + 1);
                  } else {
                    console.log('🟡 useAutoScroll: Element is now fully visible');
                    // Release programmatic scroll flag after successful verification
                    setTimeout(() => {
                      isProgrammaticScrollRef.current = false;
                      document.documentElement.removeAttribute('data-programmatic-scroll');
                    }, 150);
                  }
                });
              }, 600); // Allow more time for smooth scroll to complete
            };
            
            // Start verification only on desktop
            verifyAndCorrect();
          }
        } else {
          console.log('🟡 useAutoScroll: Element already completely visible, no scroll needed');
          // Still release programmatic scroll flag even if we don't scroll
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
            document.documentElement.removeAttribute('data-programmatic-scroll');
          }, 100);
        }
      });
    }, delay);
  }, [clearScrollTimeout, waitForLayoutStability]);

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
          
          // Skip questions in collapsed optional groups (don't auto-expand)
          const optionalContent = candidateElement.closest('[data-optional-content]');
          if (optionalContent) {
            const isOpen = optionalContent.getAttribute('data-optional-open') === 'true';
            if (!isOpen) {
              console.log('🟡 useAutoScroll: Skipping question in collapsed optional group:', candidateElement.id);
              continue;
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
      console.log('🟡 useAutoScroll: No next question found after retries, dispatching goToSection event');
      // If no next question found after retries, dispatch event to advance section
      // Support both personal (section-) and partner (partner-section-) prefixes
      const currentSection = currentElement.closest('[id^="section-"], [id^="partner-section-"]');
      if (currentSection) {
        const currentSectionId = currentSection.id;
        let sectionNumber: number;
        
        if (currentSectionId.startsWith('partner-section-')) {
          sectionNumber = parseInt(currentSectionId.replace('partner-section-', ''));
        } else {
          sectionNumber = parseInt(currentSectionId.replace('section-', ''));
        }
        
        const nextSection = sectionNumber + 1;
        
        console.log('🟡 useAutoScroll: Dispatching questionnaire:goToSection event for section:', nextSection, 'from:', currentSectionId);
        window.dispatchEvent(new CustomEvent('questionnaire:goToSection', { 
          detail: { 
            fromSection: sectionNumber,
            toSection: nextSection,
            reason: 'no-more-questions',
            sectionType: currentSectionId.startsWith('partner-section-') ? 'partner' : 'personal'
          } 
        }));
      } else {
        console.warn('🔴 useAutoScroll: Could not determine current section for advancement');
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

  const scrollToNextRequiredQuestion = useCallback((currentQuestionId: string, retryCount: number = 0) => {
    console.log('🔵 DEBUG: scrollToNextRequiredQuestion called with:', currentQuestionId, 'retry:', retryCount);
    
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
      console.log('🟡 useAutoScroll: Looking for next required question:', nextQuestionId);
      
      // Check if target element exists and is visible (lazy loading coordination)
      const targetElement = document.getElementById(nextQuestionId);
      
      if (!targetElement && retryCount < 3) {
        // Element doesn't exist yet - likely lazy loading, retry
        console.log('🟡 useAutoScroll: Target element not found, retrying in 300ms (lazy loading)');
        setTimeout(() => {
          scrollToNextRequiredQuestion(currentQuestionId, retryCount + 1);
        }, 300);
        return;
      }
      
      if (targetElement) {
        // Check if element is in a collapsed section that needs expansion
        const targetSection = targetElement.closest('[id^="section-"]');
        if (targetSection) {
          // Check if this is a cross-section transition requiring special handling
          const currentElement = document.getElementById(currentQuestionId);
          const currentSection = currentElement?.closest('[id^="section-"]');
          
          if (currentSection && targetSection && currentSection !== targetSection) {
            console.log('🟡 useAutoScroll: Cross-section transition detected, adding delay for lazy loading');
            // Add extra delay for cross-section transitions with lazy loading
            setTimeout(() => {
              scrollToElement(nextQuestionId, 100);
            }, 200);
            return;
          }
        }
        
        console.log('🟡 useAutoScroll: Scrolling to next required question:', nextQuestionId);
        scrollToElement(nextQuestionId, 300);
      } else {
        console.warn('🔴 useAutoScroll: Target element still not found after retries:', nextQuestionId);
        // Fallback to next section
        const currentElement = document.getElementById(currentQuestionId);
        if (currentElement) {
          const currentSection = currentElement.closest('[id^="section-"]');
          if (currentSection) {
            const currentSectionId = currentSection.id;
            const sectionNumber = parseInt(currentSectionId.replace('section-', ''));
            console.log('🟡 useAutoScroll: Falling back to next section:', sectionNumber + 1);
            scrollToNextSection(sectionNumber);
          }
        }
      }
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
