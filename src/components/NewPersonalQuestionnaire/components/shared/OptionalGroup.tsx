
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
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 sm:p-3 rounded-xl bg-white/40 hover:bg-white/50 sm:bg-transparent sm:hover:bg-white/5 transition-all duration-200 border border-white/50 hover:border-white/60 sm:border-white/10 sm:hover:border-white/20 ring-1 ring-white/20 sm:ring-0 focus-visible:ring-2 focus-visible:ring-white/30 group shadow-sm sm:shadow-none touch-manipulation active:scale-98">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 sm:bg-emerald-400/10 text-emerald-100 sm:text-emerald-200 rounded-full border border-emerald-400/50 sm:border-emerald-400/30 flex-shrink-0">
                    Optional
                  </span>
                  <span className="hidden sm:inline text-xs text-emerald-200/80">+Better insights</span>
                </div>
                <span className="sm:hidden text-base font-semibold text-white/95 group-hover:text-white text-left">
                  {title}
                </span>
              </div>
              <ChevronDown className="w-5 h-5 sm:w-4 sm:h-4 text-white/70 group-hover:text-white transition-all transform group-data-[state=open]:rotate-180" />
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
