
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";

interface OptionalGroupProps {
  children: React.ReactNode;
  title?: string;
}

const OptionalGroup = ({ children, title = "" }: OptionalGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to first question when opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Small delay to ensure the content is fully expanded
      setTimeout(() => {
        // Find the first question card within this specific collapsible content
        const firstQuestionCard = contentRef.current?.querySelector('[data-question-card]');
        if (firstQuestionCard) {
          console.log('🟡 OptionalGroup: Scrolling to first question in expanded section');
          firstQuestionCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300); // Allow time for expansion animation
    }
  }, [isOpen]);

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 sm:bg-transparent sm:hover:bg-white/5 transition-all duration-200 border border-white/10 hover:border-white/20 sm:border-white/10 sm:hover:border-white/20 focus-visible:ring-1 focus-visible:ring-white/20 group shadow-none touch-manipulation active:scale-98">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 flex-wrap min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-transparent text-white border-2 border-white flex-shrink-0 rounded-md drop-shadow">
                      Optional
                    </span>
                    <span className="inline text-xs font-semibold text-green-400 drop-shadow-sm">+Better insights</span>
                  </div>
                  <span className="sm:hidden text-sm font-medium text-white/90 group-hover:text-white text-left truncate">
                    {title}
                  </span>
              </div>
              <ChevronDown className="w-4 h-4 sm:w-4 sm:h-4 text-white/60 group-hover:text-white transition-all transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="hidden sm:block">
            <p className="text-sm">{title}</p>
          </TooltipContent>
        </Tooltip>
      
      <CollapsibleContent ref={contentRef} className="pt-3">
        <div className="space-y-3">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
    </TooltipProvider>
  );
};

export default OptionalGroup;
