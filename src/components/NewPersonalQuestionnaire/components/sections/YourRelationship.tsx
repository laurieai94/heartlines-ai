
import { Label } from "@/components/ui/label";
import { Heart, Clock, MessageSquare } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import MultiSelect from "../shared/MultiSelect";
import SingleSelect from "../shared/SingleSelect";

interface YourRelationshipProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
}

const YourRelationship = ({ profileData, updateField, handleMultiSelect, isActive }: YourRelationshipProps) => {
  const relationshipStatusOptions = [
    'Single & actively dating',
    'Single & taking a break', 
    'Casually seeing people',
    'Talking to someone',
    'In a relationship',
    'Engaged',
    'Married',
    'Separated/Divorced',
    'It\'s complicated'
  ];

  const relationshipLengthOptions = [
    'Less than 3 months', '3-6 months', '6 months - 1 year', 
    '1-2 years', '2-5 years', '5+ years'
  ];

  const datingChallengesOptions = [
    'Finding people who want the same thing I do',
    'Getting past the first few dates into something deeper',
    'Setting boundaries and not settling for less than I deserve',
    'Dating anxiety and putting myself out there',
    'Getting over past relationship patterns that keep showing up',
    'Being authentic while still trying to make a good impression',
    'Online dating fatigue and app overwhelm'
  ];

  const relationshipChallengesOptions = [
    'Communication and really hearing each other',
    'Managing conflict without it getting ugly',
    'Balancing independence with togetherness',
    'Intimacy and staying connected',
    'Different life goals or timelines',
    'Trust and past relationship baggage',
    'Family or external pressures',
    'Money and financial stress',
    'Managing expectations vs reality'
  ];

  const relationshipWorkingOptions = [
    'We communicate really well',
    'Great physical and emotional intimacy',
    'We support each other\'s goals',
    'Similar values and life vision',
    'We have fun together and laugh a lot',
    'Good at working through disagreements',
    'We give each other space to be individuals',
    'Strong friendship foundation',
    'We\'re building something meaningful together'
  ];

  const isSingle = ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);
  const hasRelationship = ['Talking to someone', 'In a relationship', 'Engaged', 'Married'].includes(profileData.relationshipStatus);

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Relationship</h3>
      </div>

      {/* Relationship Status */}
      <QuestionCard>
        <Label className="text-sm font-semibold text-white mb-2 block">
          What is your current relationship status? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>From 'it's complicated' to married - we meet you where you are</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {relationshipStatusOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateField('relationshipStatus', status)}
              className={`w-full p-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                profileData.relationshipStatus === status
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </QuestionCard>

      {/* Dating Challenges - for single people */}
      {isSingle && (
        <>
          <QuestionCard>
            <Label className="text-sm font-semibold text-white mb-2 block">
              What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
              <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-white/70 mb-3 font-normal">
              <MessageSquare className="w-3 h-3 text-blue-300" />
              <span>Understanding your specific dating struggles helps RealTalk provide targeted guidance</span>
            </div>
            <MultiSelect
              options={datingChallengesOptions}
              selectedValues={profileData.datingChallenges || []}
              onToggle={(value) => handleMultiSelect('datingChallenges', value)}
            />
          </QuestionCard>
        </>
      )}

      {/* Relationship Length - for people in relationships */}
      {hasRelationship && (
        <QuestionCard>
          <Label className="text-sm font-semibold text-white mb-2 block">
            How long have you been together? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Clock className="w-3 h-3 text-green-300" />
            <span>Different relationship stages have different needs and challenges</span>
          </div>
          <SingleSelect
            options={relationshipLengthOptions}
            selectedValue={profileData.relationshipLength || ''}
            onSelect={(value) => updateField('relationshipLength', value)}
          />
        </QuestionCard>
      )}

      {/* Relationship Challenges - for people in relationships */}
      {hasRelationship && (
        <QuestionCard>
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging in your relationship right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <MultiSelect
            options={relationshipChallengesOptions}
            selectedValues={profileData.relationshipChallenges || []}
            onToggle={(value) => handleMultiSelect('relationshipChallenges', value)}
          />
        </QuestionCard>
      )}

      {/* What's Working Well - for people in relationships */}
      {hasRelationship && (
        <QuestionCard>
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's working really well in your relationship? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="text-xs text-white/70 font-normal mb-3">
            Let's celebrate your strengths and build on what's already working
          </div>
          <MultiSelect
            options={relationshipWorkingOptions}
            selectedValues={profileData.relationshipWorking || []}
            onToggle={(value) => handleMultiSelect('relationshipWorking', value)}
          />
        </QuestionCard>
      )}
    </div>
  );
};

export default YourRelationship;
