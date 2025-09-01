
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";

interface OptionalGroupProps {
  children: React.ReactNode;
  title?: string;
}

const OptionalGroup = ({ children, title = "Share more so we can show up better" }: OptionalGroupProps) => {
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
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2.5 sm:p-3 rounded-xl bg-white/40 hover:bg-white/50 sm:bg-transparent sm:hover:bg-white/5 transition-all duration-200 border border-white/50 hover:border-white/60 sm:border-white/10 sm:hover:border-white/20 ring-1 ring-white/20 sm:ring-0 focus-visible:ring-2 focus-visible:ring-white/30 group shadow-sm sm:shadow-none">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <span className="px-2 py-0.5 text-xs font-medium bg-white/30 sm:bg-white/10 text-white/90 rounded-full border border-white/50 sm:border-white/30 flex-shrink-0">
                  Optional
                </span>
                <span className="sm:hidden text-sm font-medium text-white/80 group-hover:text-white text-left">
                  {title}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/90 transition-all ml-2 flex-shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
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
