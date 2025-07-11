
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import FamilyConflictQuestion from "./FamilyConflictQuestion";
import FamilyEmotionsQuestion from "./FamilyEmotionsQuestion";
import FamilyLoveQuestion from "./FamilyLoveQuestion";
import FamilySituationQuestion from "./FamilySituationQuestion";

interface OptionalFamilyContextProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}

const OptionalFamilyContext = ({ profileData, updateField, handleMultiSelect }: OptionalFamilyContextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-white">
              Want to share more context?
              <span className="text-orange-300 font-medium text-xs ml-2">(Optional)</span>
            </Label>
            <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-3">
          <FamilySituationQuestion
            selectedValue={profileData.familySituation || ''}
            otherText={profileData.familySituationOther || ''}
            onSelect={(situation) => updateField('familySituation', situation)}
            onOtherTextChange={(text) => updateField('familySituationOther', text)}
          />

          <FamilyConflictQuestion
            selectedValues={profileData.familyConflict || []}
            otherText={profileData.familyConflictOther || ''}
            onToggle={(style) => handleMultiSelect('familyConflict', style)}
            onOtherTextChange={(text) => updateField('familyConflictOther', text)}
          />

          <FamilyEmotionsQuestion
            selectedValues={profileData.familyEmotions || []}
            otherText={profileData.familyEmotionsOther || ''}
            onToggle={(emotion) => handleMultiSelect('familyEmotions', emotion)}
            onOtherTextChange={(text) => updateField('familyEmotionsOther', text)}
          />

          <FamilyLoveQuestion
            selectedValues={profileData.familyLove || []}
            otherText={profileData.familyLoveOther || ''}
            onToggle={(language) => handleMultiSelect('familyLove', language)}
            onOtherTextChange={(text) => updateField('familyLoveOther', text)}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default OptionalFamilyContext;
