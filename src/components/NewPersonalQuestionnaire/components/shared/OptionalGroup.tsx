
import { ChevronDown, ArrowDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";

interface OptionalGroupProps {
  children: React.ReactNode;
  title?: string;
  id?: string;
}

const OptionalGroup = ({ children, title = "", id }: OptionalGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollToElement, scrollToNextQuestion } = useAutoScroll();

  // Simple scroll down to show questions below viewport
  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen) {
      // If closed, open the group and scroll to first question
      setIsOpen(true);
      setTimeout(() => {
        const firstQuestionCard = contentRef.current?.querySelector('[data-question-card]');
        if (firstQuestionCard?.id) {
          scrollToElement(firstQuestionCard.id, 100);
        }
      }, 250);
    } else {
      // If open, scroll down to show more content
      const currentScrollTop = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const currentBottom = currentScrollTop + viewportHeight;
      
      // Find questions below the current viewport
      const allQuestions = document.querySelectorAll('[data-question-card]');
      const questionsBelow = Array.from(allQuestions).filter(q => {
        const rect = q.getBoundingClientRect();
        const elementTop = rect.top + currentScrollTop;
        return elementTop > currentBottom - 100; // 100px buffer
      });
      
      if (questionsBelow.length > 0) {
        const nextQuestion = questionsBelow[0] as HTMLElement;
        if (nextQuestion.id) {
          scrollToElement(nextQuestion.id, 100);
        }
      } else {
        // Scroll down by viewport height to reveal more content
        window.scrollBy({ top: viewportHeight * 0.8, behavior: 'smooth' });
      }
    }
  };

  // Open on global event (targeted by id if provided)
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ id?: string }>;
        if (!ce.detail?.id || ce.detail.id === id) {
          setIsOpen(true);
        }
      } catch {}
    };
    window.addEventListener('optional-group:open', handler as EventListener);
    return () => window.removeEventListener('optional-group:open', handler as EventListener);
  }, [id]);

  // Auto-scroll when expanded to show content
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Wait for collapsible animation to complete (200ms) then scroll
      setTimeout(() => {
        const firstQuestionCard = contentRef.current?.querySelector('[data-question-card]');
        if (firstQuestionCard) {
          const questionId = firstQuestionCard.id;
          if (questionId) {
            scrollToElement(questionId, 0);
          }
        }
      }, 250);
    }
  }, [isOpen, scrollToElement]);

  return (
    <TooltipProvider>
      <div className="w-full relative" data-optional-group data-optional-open={isOpen}>
        <Collapsible id={id} open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger data-optional-trigger aria-label={title || "Optional section"} aria-expanded={isOpen} className="flex items-center justify-between w-full p-3 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 sm:bg-transparent sm:hover:bg-white/5 transition-all duration-200 border border-white/10 hover:border-white/20 sm:border-white/10 sm:hover:border-white/20 focus-visible:ring-1 focus-visible:ring-white/30 group shadow-none touch-manipulation active:scale-98">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 flex-wrap min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-transparent text-white border-2 border-white flex-shrink-0 rounded-md drop-shadow">
                        Optional
                      </span>
                      <span className="inline text-xs font-semibold text-green-400 drop-shadow-sm">+Better insights</span>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 sm:w-4 sm:h-4 text-white/60 group-hover:text-white transition-all transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="hidden sm:block">
              <p className="text-sm">{title}</p>
            </TooltipContent>
          </Tooltip>
      
        <CollapsibleContent 
          ref={contentRef} 
          className="pt-3" 
          data-optional-content 
          data-optional-open={isOpen}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            {isOpen ? children : null}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Scroll Down Arrow - Fixed in Lower Right Corner */}
      <div className="absolute -bottom-1 -right-1 z-20">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleScrollDown}
              className="group/arrow p-3 rounded-full bg-primary/90 hover:bg-primary border-2 border-white/20 hover:border-white/40 transition-all duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-white/60 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-sm"
              aria-label={isOpen ? "Scroll to see more questions" : "Open and see questions"}
            >
              <ArrowDown className="w-6 h-6 text-white transition-all duration-200 animate-bounce group-hover/arrow:animate-none" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-sm">
            <p>{isOpen ? "Scroll down to see more questions" : "Open and see questions"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default OptionalGroup;
