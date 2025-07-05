
import { Heart, AlertCircle, MessageSquare, Star } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PartnerQuestionnaireSection3Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const PartnerQuestionnaireSection3 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerQuestionnaireSection3Props) => {
  if (!isReady) return null;

  const stressorOptions = ["Work/career pressure", "Family drama and dynamics", "Money and financial stuff", "Health and body stuff", "Our relationship issues", "Social situations and people", "Daily life chaos", "Future planning and uncertainty", "Honestly not sure yet"];
  const relationshipNeedsOptions = ["Deep communication and emotional connection", "Independence and personal space", "Physical intimacy and touch", "Stability and security", "Fun adventures and spontaneity", "Emotional support and validation", "Shared future planning", "Respect and appreciation", "Still trying to figure this out"];
  const conflictStyleOptions = ["Want to hash it out immediately", "Need time to think before talking", "Try to smooth things over quickly", "Get defensive or shut down", "Stay logical and calm", "Get emotional but work through it", "Avoid conflict at all costs", "We haven't really disagreed yet"];
  const superpowerOptions = ["Communication and emotional intelligence", "Being caring and supportive", "Keeping things fun and light", "Loyalty and commitment", "Problem-solving and practical help", "Emotional stability and calm energy", "Physical affection and intimacy", "Respecting boundaries and independence", "Still discovering their strengths"];

  return (
    <div className="space-y-1.5">
      {/* Stressors */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What stresses them out the most?
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <AlertCircle className="w-3 h-3 text-yellow-300" />
            <span>Their biggest anxiety triggers</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stressorOptions.map((stressor) => (
            <button
              key={stressor}
              onClick={() => updateField('partnerStressors', stressor)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                profileData.partnerStressors === stressor
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {stressor}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Needs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What do they seem to need most from relationships?
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that apply</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>Based on what you've observed</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {relationshipNeedsOptions.map((need) => {
            const isSelected = profileData.partnerRelationshipNeeds?.includes(need);
            return (
              <button
                key={need}
                onClick={() => handleMultiSelect('partnerRelationshipNeeds', need)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                  isSelected
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {need}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict Style */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            When you disagree, how do they handle it?
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>Their conflict personality</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {conflictStyleOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('partnerConflictStyle', style)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                profileData.partnerConflictStyle === style
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Superpower */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div>
          <Label className="text-sm font-semibold text-white">
            What's their biggest relationship superpower?
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
            <Star className="w-3 h-3 text-yellow-300" />
            <span>What they're naturally good at in love</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {superpowerOptions.map((power) => (
            <button
              key={power}
              onClick={() => updateField('partnerSuperpower', power)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all text-left hover:scale-[1.01] ${
                profileData.partnerSuperpower === power
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {power}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSection3;
