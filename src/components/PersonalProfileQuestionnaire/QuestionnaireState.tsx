
import { useState, useRef, useEffect } from "react";

export const useQuestionnaireState = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [sectionReadiness, setSectionReadiness] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  // Auto-scroll to top when section changes
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Trigger scroll when section changes
  useEffect(() => {
    scrollToTop();
  }, [currentSection]);

  return {
    currentSection,
    setCurrentSection,
    showSuccess,
    setShowSuccess,
    contentRef,
    sectionReadiness,
    setSectionReadiness,
    scrollToTop
  };
};
