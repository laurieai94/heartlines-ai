
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">Relationship Dynamics</h3>
        </div>
        <p className="text-sm text-white/70">How they do love</p>
      </div>

      {/* Stressors */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <AlertCircle className="w-4 h-4 inline mr-2 text-rose-400" />
          What stresses them out the most?
        </Label>
        <p className="text-xs text-white/60 mb-3">Their biggest anxiety triggers</p>
        <div className="grid grid-cols-1 gap-2">
          {stressorOptions.map((stressor) => (
            <button
              key={stressor}
              onClick={() => updateField('partnerStressors', stressor)}
              className={`p-2 rounded-lg text-sm transition-all text-left ${
                profileData.partnerStressors === stressor
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              {stressor}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Needs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Heart className="w-4 h-4 inline mr-2 text-rose-400" />
          What do they seem to need most from relationships? Based on what you've seen
        </Label>
        <p className="text-xs text-white/60 mb-3">Their core relationship needs</p>
        <div className="grid grid-cols-1 gap-2">
          {relationshipNeedsOptions.map((need) => {
            const isSelected = profileData.partnerRelationshipNeeds?.includes(need);
            return (
              <button
                key={need}
                onClick={() => handleMultiSelect('partnerRelationshipNeeds', need)}
                className={`p-2 rounded-lg text-sm transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {need}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict Style */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <MessageSquare className="w-4 h-4 inline mr-2 text-rose-400" />
          When you disagree, how do they handle it?
        </Label>
        <p className="text-xs text-white/60 mb-3">Their conflict personality</p>
        <div className="grid grid-cols-1 gap-2">
          {conflictStyleOptions.map((style) => (
            <button
              key={style}
              onClick={() => updateField('partnerConflictStyle', style)}
              className={`p-2 rounded-lg text-sm transition-all text-left ${
                profileData.partnerConflictStyle === style
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Superpower */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-4">
        <Label className="text-white font-medium mb-2 block">
          <Star className="w-4 h-4 inline mr-2 text-rose-400" />
          What's their biggest relationship superpower?
        </Label>
        <p className="text-xs text-white/60 mb-3">What they're naturally good at in love</p>
        <div className="grid grid-cols-1 gap-2">
          {superpowerOptions.map((power) => (
            <button
              key={power}
              onClick={() => updateField('partnerSuperpower', power)}
              className={`p-2 rounded-lg text-sm transition-all text-left ${
                profileData.partnerSuperpower === power
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
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
