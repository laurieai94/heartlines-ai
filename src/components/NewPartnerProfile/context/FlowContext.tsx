import { createContext, useContext, useRef } from 'react';
import { PartnerProfileData } from '../types';

interface PartnerFlowContextType {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  onComplete: () => void;
  goToNext: (currentQuestionId: string) => void;
  scrollHelper: (elementId: string) => void;
}

const PartnerFlowContext = createContext<PartnerFlowContextType | null>(null);

interface PartnerFlowProviderProps {
  children: React.ReactNode;
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  onComplete: () => void;
}

export const PartnerFlowProvider = ({
  children,
  profileData,
  updateField,
  handleMultiSelect,
  onComplete
}: PartnerFlowProviderProps) => {
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
        behavior: 'smooth'
      });
    }, 100);
  };

  // Simplified navigation for partner profile - just scroll without section changes  
  const goToNext = (currentQuestionId: string) => {
    import('../utils/next-map').then(({ getNextPartnerQuestion }) => {
      const nextQuestionId = getNextPartnerQuestion(currentQuestionId, profileData);
      
      if (nextQuestionId === 'COMPLETE') {
        onComplete();
        return;
      }
      
      if (nextQuestionId) {
        // Simple scroll without triggering section navigation events
        scrollHelper(nextQuestionId);
      }
      // Remove fallback completion to prevent premature questionnaire ending
    }).catch((error) => {
      console.error('Error loading partner next-map:', error);
      // Remove automatic completion on error to prevent data loss
    });
  };

  const value: PartnerFlowContextType = {
    profileData,
    updateField,
    handleMultiSelect,
    onComplete,
    goToNext,
    scrollHelper
  };

  return (
    <PartnerFlowContext.Provider value={value}>
      {children}
    </PartnerFlowContext.Provider>
  );
};

export const usePartnerFlow = () => {
  const context = useContext(PartnerFlowContext);
  if (!context) {
    throw new Error('usePartnerFlow must be used within a PartnerFlowProvider');
  }
  return context;
};