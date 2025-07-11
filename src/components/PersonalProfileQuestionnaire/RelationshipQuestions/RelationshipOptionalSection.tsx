
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
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-2.5 hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-white/90">
                Want to share more context? (Optional)
              </Label>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/60" />
            )}
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
