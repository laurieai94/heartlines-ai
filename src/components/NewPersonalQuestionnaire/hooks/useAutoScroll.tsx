
import { useCallback, useRef } from 'react';

interface UseAutoScrollProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  delay?: number;
}

export const useAutoScroll = ({ scrollContainerRef, delay = 400 }: UseAutoScrollProps) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToNextQuestion = useCallback((currentQuestionId: string) => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a delay to allow UI to update before scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Find all question cards in the current section
      const currentQuestion = document.getElementById(currentQuestionId);
      if (!currentQuestion) return;

      const section = currentQuestion.closest('[data-section]');
      if (!section) return;

      const questionCards = section.querySelectorAll('[data-question-card]');
      const currentIndex = Array.from(questionCards).findIndex(card => 
        card.contains(currentQuestion)
      );

      // Find the next question card
      const nextQuestion = questionCards[currentIndex + 1] as HTMLElement;
      if (nextQuestion) {
        const containerRect = container.getBoundingClientRect();
        const nextQuestionRect = nextQuestion.getBoundingClientRect();
        const relativeTop = nextQuestionRect.top - containerRect.top + container.scrollTop;

        container.scrollTo({
          top: relativeTop - 32, // 32px offset for better spacing
          behavior: 'smooth'
        });
      }
    }, delay);
  }, [scrollContainerRef, delay]);

  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  }, []);

  return { scrollToNextQuestion, clearScrollTimeout };
};
