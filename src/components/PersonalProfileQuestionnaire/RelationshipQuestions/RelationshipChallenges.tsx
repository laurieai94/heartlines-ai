
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { challengeOptions } from "./relationshipConfig";

interface RelationshipChallengesProps {
  profileData: any;
  handleMultiSelect: (field: string, value: string) => void;
}

const RelationshipChallenges = ({ profileData, handleMultiSelect }: RelationshipChallengesProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4 space-y-3">
      <div>
        <Label className="text-sm font-semibold text-white">
          What's your biggest relationship challenges right now? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mt-2">
          <AlertTriangle className="w-3 h-3 text-yellow-300" />
          <span>The things actually driving you crazy</span>
        </div>
      </div>
      
      <div className="grid gap-2 w-full [grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]">
        {challengeOptions.map((challenge) => (
          <button
            key={challenge}
            onClick={() => handleMultiSelect('relationshipChallenges', challenge)}
            className={`w-full p-2 rounded-lg text-left break-words transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
              (profileData.relationshipChallenges || []).includes(challenge)
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {challenge}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelationshipChallenges;
