import { createContext, useContext, useRef } from 'react';
import { ProfileData } from '../types';

interface FlowContextType {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onComplete: () => void;
  goToNext: (currentQuestionId: string) => void;
  scrollHelper: (elementId: string) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

interface FlowProviderProps {
  children: React.ReactNode;
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onComplete: () => void;
}

export const FlowProvider = ({
  children,
  profileData,
  updateField,
  handleMultiSelect,
  onComplete
}: FlowProviderProps) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollHelper = (elementId: string) => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      // Find scroll container
      let container = element.closest('[data-scroll-container]') as HTMLElement;
      if (!container) {
        container = document.querySelector('[data-scroll-container]') as HTMLElement;
      }

      if (!container) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Get header height
      const stickyHeader = container.querySelector('[data-sticky-header]') as HTMLElement;
      const headerHeight = stickyHeader?.offsetHeight || 0;
      
      // Calculate scroll position to show element just below header
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      const targetScroll = relativeTop - headerHeight - 20; // 20px margin

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'auto' // Use 'auto' for iOS compatibility
      });
    }, 100);
  };

  // Simple deterministic navigation - import next map
  const goToNext = (currentQuestionId: string) => {
    import('../utils/next-map').then(({ getNextQuestion }) => {
      const nextQuestionId = getNextQuestion(currentQuestionId, profileData);
      
      if (nextQuestionId === 'COMPLETE') {
        onComplete();
        return;
      }
      
      if (nextQuestionId) {
        scrollHelper(nextQuestionId);
      } else {
        // Fallback - if no next question found, try to complete
        console.warn('No next question found for:', currentQuestionId);
        onComplete();
      }
    }).catch((error) => {
      console.error('Error loading next-map:', error);
      // Fallback on error - just complete the questionnaire
      onComplete();
    });
  };

  const value: FlowContextType = {
    profileData,
    updateField,
    handleMultiSelect,
    onComplete,
    goToNext,
    scrollHelper
  };

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};