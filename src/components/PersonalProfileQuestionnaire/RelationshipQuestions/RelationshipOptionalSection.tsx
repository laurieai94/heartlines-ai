
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="w-full">
        <div className="bg-white/20 hover:bg-white/25 sm:bg-white/15 sm:hover:bg-white/20 rounded-xl border border-white/30 hover:border-white/40 sm:border-white/25 sm:hover:border-white/35 ring-1 ring-white/15 sm:ring-white/10 focus-visible:ring-2 focus-visible:ring-white/30 p-2.5 transition-all duration-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-white/15 text-white/90 rounded-full border border-white/30 flex-shrink-0">
                Optional
              </span>
              <Label className="hidden sm:block text-sm font-medium text-white/85">
                Want to share more context?
              </Label>
            </div>
            <ChevronDown className={`w-4 h-4 text-white transition-all ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CollapsibleTrigger>
      
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
  );
};

export default RelationshipOptionalSection;
