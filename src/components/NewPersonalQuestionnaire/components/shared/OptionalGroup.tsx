
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
    
    if (isOpen && contentRef.current) {
      // Find first question card within this optional group
      const firstQuestionCard = contentRef.current.querySelector('[data-question-card]');
      if (firstQuestionCard?.id) {
        scrollToNextQuestion(firstQuestionCard.id);
      }
    } else {
      // If closed, try to find any question card after this optional group
      const optionalGroup = document.getElementById(id || '');
      if (optionalGroup) {
        let nextElement = optionalGroup.nextElementSibling;
        while (nextElement && !nextElement.hasAttribute('data-question-card')) {
          nextElement = nextElement.nextElementSibling;
        }
        if (nextElement?.id) {
          scrollToElement(nextElement.id, 300);
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
      <div className="w-full" data-optional-group data-optional-open={isOpen}>
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
        
        {/* Quick Navigation Arrow */}
        <div className="flex justify-center mt-2 mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleQuickNavigate}
                className="group/arrow p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-white/30 hover:scale-105 active:scale-95"
                aria-label="Jump to next question"
              >
                <ArrowDown className="w-4 h-4 text-white/70 group-hover/arrow:text-white transition-all duration-200 animate-pulse group-hover/arrow:animate-none" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-sm">
              <p>Jump to next question</p>
            </TooltipContent>
          </Tooltip>
        </div>
      
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
      </div>
    </TooltipProvider>
  );
};

export default OptionalGroup;
