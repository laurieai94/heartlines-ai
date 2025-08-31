

import { ChevronDown, Star } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20 group">
        <div className="flex items-center gap-3">
          <Star className="w-4 h-4 text-yellow-400/70" />
          <span className="text-sm font-medium text-white/70 group-hover:text-white/90">
            {title}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent ref={contentRef} className="pt-3">
        <div className="space-y-3">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OptionalGroup;

