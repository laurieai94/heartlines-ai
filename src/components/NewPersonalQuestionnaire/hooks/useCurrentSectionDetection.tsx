import { useEffect, useState, useRef } from 'react';

export const useCurrentSectionDetection = (onSectionChange: (section: number) => void, prefix = 'section-') => {
  const [currentSection, setCurrentSection] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionVisibility = useRef<Record<number, number>>({});
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Skip updates during programmatic scrolling to prevent conflicts
        if (isProgrammaticScrollRef.current) {
          console.log('🟡 useCurrentSectionDetection: Skipping intersection updates during programmatic scroll');
          return;
        }
        
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const parts = sectionId.split('-');
          const sectionNumber = parseInt(parts[parts.length - 1]);
          
          if (!isNaN(sectionNumber)) {
            sectionVisibility.current[sectionNumber] = entry.intersectionRatio;
          }
        });

        // Find the section with the highest visibility ratio
        const mostVisibleSection = Object.entries(sectionVisibility.current)
          .filter(([_, ratio]) => ratio > 0)
          .reduce((max, [section, ratio]) => {
            return ratio > max.ratio ? { section: parseInt(section), ratio } : max;
          }, { section: 1, ratio: 0 });

        if (mostVisibleSection.section !== currentSection) {
          setCurrentSection(mostVisibleSection.section);
          onSectionChange(mostVisibleSection.section);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all section elements with the given prefix
    const sections = document.querySelectorAll(`[id^="${prefix}"]`);
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    // Listen for programmatic scroll events from useAutoScroll
    const checkProgrammaticScroll = () => {
      // Try to access the isProgrammaticScrollRef from useAutoScroll if available
      const scrollContainer = document.querySelector('[data-scroll-container]');
      if (scrollContainer) {
        // Check if any scroll is happening programmatically
        const autoScrollElement = document.querySelector('[data-auto-scroll="true"]');
        isProgrammaticScrollRef.current = !!autoScrollElement;
      }
    };
    
    const intervalId = setInterval(checkProgrammaticScroll, 100);

    return () => {
      observerRef.current?.disconnect();
      clearInterval(intervalId);
    };
  }, [currentSection, onSectionChange, prefix]);

  return currentSection;
};