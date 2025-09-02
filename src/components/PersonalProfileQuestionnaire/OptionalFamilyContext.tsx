
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import FamilyConflictQuestion from "./FamilyConflictQuestion";
import FamilyLoveQuestion from "./FamilyLoveQuestion";
import FamilySituationQuestion from "./FamilySituationQuestion";

interface OptionalFamilyContextProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}

const OptionalFamilyContext = ({ profileData, updateField, handleMultiSelect }: OptionalFamilyContextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (expanded && (window as any).reliableScroll) {
      (window as any).reliableScroll.toElement('family-context');
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={handleToggle}>
      <div className="bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 p-2.5 space-y-1.5 transition-all duration-200" data-scroll-id="family-context">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 text-xs font-medium bg-white/10 text-white rounded-md border border-white/30 flex-shrink-0">
                  Optional
                </span>
                <span className="inline text-xs text-emerald-300">+Better insights</span>
              </div>
              <span className="sm:hidden text-sm font-medium text-white/90 text-left">
                Want to share more family context?
              </span>
            </div>
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
