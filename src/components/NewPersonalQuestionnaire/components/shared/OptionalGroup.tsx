
import { ChevronDown, ArrowDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";

interface OptionalGroupProps {
  children: React.ReactNode;
  title?: string;
  id?: string;
}

const OptionalGroup = ({ children, title = "", id }: OptionalGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Simple scroll down functionality
  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Just scroll down the page by a comfortable amount
    window.scrollBy({
      top: 400,
      behavior: 'smooth'
    });
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

      {/* Scroll Down Button - Bottom Center */}
      <div className="flex justify-center mt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleScrollDown}
              className="p-2 rounded-full bg-primary hover:bg-primary/80 border border-white/20 hover:border-white/40 transition-all duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-white/60 hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Scroll down to see more"
            >
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-sm">
            <p>Scroll down to see more</p>
          </TooltipContent>
        </Tooltip>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default OptionalGroup;
