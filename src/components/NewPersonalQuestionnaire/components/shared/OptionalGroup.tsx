
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

  // Handle quick navigation to next question
  const handleQuickNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen) {
      // If closed, open the group first and then scroll to first question
      setIsOpen(true);
      // Wait for animation to complete, then scroll to first question
      setTimeout(() => {
        const firstQuestionCard = contentRef.current?.querySelector('[data-question-card]');
        if (firstQuestionCard?.id) {
          scrollToElement(firstQuestionCard.id, 0);
        }
      }, 250);
    } else if (contentRef.current) {
      // If open, find the first incomplete question within this group
      const questionCards = contentRef.current.querySelectorAll('[data-question-card]');
      if (questionCards.length > 0) {
        // Use the first question card to trigger scrollToNextQuestion logic
        const firstCard = questionCards[0] as HTMLElement;
        if (firstCard.id) {
          scrollToNextQuestion(firstCard.id);
        }
      } else {
        // If no questions in this group, find next question after this group
        const optionalGroup = document.getElementById(id || '');
        if (optionalGroup) {
          let nextElement = optionalGroup.nextElementSibling;
          while (nextElement && !nextElement.hasAttribute('data-question-card')) {
            nextElement = nextElement.nextElementSibling;
          }
          if (nextElement?.id) {
            scrollToElement(nextElement.id, 0);
          }
        }
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

      {/* Quick Navigation Arrow - Positioned in Lower Right */}
      <div className="absolute bottom-2 right-2 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleQuickNavigate}
              className="group/arrow p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 transition-all duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-white/40 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
              aria-label={isOpen ? "Jump to next question" : "Open and jump to questions"}
            >
              <ArrowDown className="w-5 h-5 text-white/80 group-hover/arrow:text-white transition-all duration-200 animate-pulse group-hover/arrow:animate-none" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-sm">
            <p>{isOpen ? "Jump to next question" : "Open and jump to questions"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default OptionalGroup;
