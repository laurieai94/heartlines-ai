
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OptionalGroupProps {
  children: React.ReactNode;
  title?: string;
}

const OptionalGroup = ({ children, title = "Share more so we can show up better" }: OptionalGroupProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-open on mobile for better discoverability
  useEffect(() => {
    if (isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

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
            <CollapsibleTrigger className={`flex items-center justify-between w-full transition-all duration-200 focus-visible:ring-1 focus-visible:ring-white/20 group touch-manipulation active:scale-98 ${
              isMobile && isOpen 
                ? 'p-2 rounded-lg bg-white/10 border border-white/20' 
                : 'p-3 rounded-lg bg-white/20 hover:bg-white/25 border border-white/30 hover:border-white/40 shadow-sm'
            } sm:p-3 sm:bg-transparent sm:hover:bg-white/5 sm:border-white/10 sm:hover:border-white/20 sm:shadow-none`}>
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-emerald-400/15 sm:bg-emerald-400/10 text-emerald-100 sm:text-emerald-200 rounded-md border border-emerald-400/40 sm:border-emerald-400/30 flex-shrink-0">
                    Optional
                  </span>
                  <span className="hidden sm:inline text-xs text-emerald-200/70">+Better insights</span>
                </div>
                <span className="sm:hidden text-sm font-medium text-white/90 group-hover:text-white text-left">
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
