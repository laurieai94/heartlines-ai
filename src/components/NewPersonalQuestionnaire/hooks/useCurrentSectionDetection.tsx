import { useEffect, useState, useRef } from 'react';

export const useCurrentSectionDetection = (onSectionChange: (section: number) => void) => {
  const [currentSection, setCurrentSection] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionVisibility = useRef<Record<number, number>>({});

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const sectionNumber = parseInt(sectionId.split('-')[1]);
          
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

    // Observe all section elements
    const sections = document.querySelectorAll('[id^="section-"]');
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [currentSection, onSectionChange]);

  return currentSection;
};