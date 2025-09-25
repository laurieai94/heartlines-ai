
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronRight } from "lucide-react";
import RelationshipLength from "./RelationshipLength";
import RelationshipWorkingWell from "./RelationshipWorkingWell";

interface RelationshipOptionalSectionProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  relationshipLengthConfig: any;
  workingWellConfig: any;
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}

const RelationshipOptionalSection = ({
  isExpanded,
  setIsExpanded,
  relationshipLengthConfig,
  workingWellConfig,
  profileData,
  updateField,
  handleMultiSelect
}: RelationshipOptionalSectionProps) => {
  return (
    <TooltipProvider>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Tooltip>
          <TooltipTrigger asChild>
            <CollapsibleTrigger className="w-full animate-optional-glow">
              <div className="bg-white/5 hover:bg-white/10 sm:bg-transparent sm:hover:bg-white/5 rounded-xl border border-white/10 hover:border-white/20 sm:border-white/10 sm:hover:border-white/20 focus-visible:ring-1 focus-visible:ring-white/20 p-2.5 sm:p-3 transition-all duration-200 shadow-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 flex-wrap">
                     <div className="flex items-center gap-1.5 flex-wrap">
                       <span className="px-2 py-0.5 text-xs font-medium bg-white/20 text-white border border-white/40 flex-shrink-0 rounded-full shadow-sm">
                         Optional
                       </span>
                       <span className="inline text-xs font-semibold text-green-400 drop-shadow-sm">+Better insights</span>
                     </div>
                    <Label className="sm:hidden text-sm font-medium text-white/80">
                      Want to share more context?
                    </Label>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white transition-all ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="hidden sm:block">
            <p className="text-sm">Want to share more context?</p>
          </TooltipContent>
        </Tooltip>
      
      <CollapsibleContent className="space-y-1.5 mt-1.5">
        {/* Conditional Relationship Length */}
        {relationshipLengthConfig && (
          <RelationshipLength
            config={relationshipLengthConfig}
            profileData={profileData}
            updateField={updateField}
          />
        )}

        {/* Status-specific Working Well Question */}
        <RelationshipWorkingWell
          config={workingWellConfig}
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
        />
      </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};

export default RelationshipOptionalSection;
