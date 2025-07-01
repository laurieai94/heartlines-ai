import { Label } from "@/components/ui/label";
import { Heart, Users, MessageSquare, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QuestionnaireSection2Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection2 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection2Props) => {
  const [showAllRelationshipOptions, setShowAllRelationshipOptions] = useState(false);
  const [showAllDatingChallenges, setShowAllDatingChallenges] = useState(false);
  const [showAllDatingGoals, setShowAllDatingGoals] = useState(false);
  const [showAllWorkingWell, setShowAllWorkingWell] = useState(false);
  const [showAllDifficult, setShowAllDifficult] = useState(false);

  if (!isReady) return null;

  const relationshipStatusOptions = [
    'Single, actively dating', 'Single, not dating', 'Casually dating/seeing people', 
    'Exclusive but not official', 'In a relationship', 'Engaged', 
    'Married', 'It\'s complicated'
  ];

  const relationshipLengthOptions = [
    'Less than 3 months', '3-6 months', '6 months - 1 year', 
    '1-2 years', '2-5 years', '5+ years'
  ];

  const workingWellOptions = [
    'Great communication', 'Strong physical connection', 'Shared values/goals',
    'Fun and laughter together', 'Good conflict resolution', 'Emotional support',
    'Trust and honesty', 'Respect for differences'
  ];

  const feelsDifficultOptions = [
    'Communication breakdowns', 'Different conflict styles', 'Intimacy challenges',
    'Time management/priorities', 'Family/friend dynamics', 'Financial stress',
    'Trust issues', 'Future planning disagreements'
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

  const datingGoalsOptions = [
    'A serious, long-term partnership leading to marriage/commitment',
    'Better understanding of what I want and need in a partner',
    'Confidence and skills in dating and relationships',
    'Healing from past relationships before getting serious again',
    'Learning to be vulnerable and authentic in dating',
    'A partner who truly gets me and accepts me as I am',
    'Someone who shares my values and life vision'
  ];

  // Check if user is in some form of relationship (not single not dating)
  const isInRelationship = profileData.relationshipStatus && 
    !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
  
  // Check if user is in a defined relationship that has a length (not casual/complicated)
  const hasRelationshipLength = profileData.relationshipStatus && 
    !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people', 'It\'s complicated'].includes(profileData.relationshipStatus);

  // Check if user is single/dating (trigger for additional questions)
  const isSingleOrDating = profileData.relationshipStatus && 
    ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);

  return (
    <div className="space-y-8">
      {/* Relationship Status - Main Question */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold text-white mb-2 block">
              What is your current relationship status? <span className="text-red-400">*</span>
            </Label>
            <div className="flex items-center gap-2 text-[13px] text-white/80 mb-4 font-normal">
              <Heart className="w-4 h-4 text-pink-300" />
              <span>From 'it's complicated' to married - we meet you where you are</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relationshipStatusOptions.slice(0, showAllRelationshipOptions ? relationshipStatusOptions.length : 6).map((status) => (
              <button
                key={status}
                onClick={() => updateField('relationshipStatus', status)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] text-xs font-medium ${
                  profileData.relationshipStatus === status
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {status}
              </button>
            ))}
            
            {relationshipStatusOptions.length > 6 && (
              <button
                onClick={() => setShowAllRelationshipOptions(!showAllRelationshipOptions)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {showAllRelationshipOptions ? (
                  <>Show less <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Show more options <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Dating Questions for Single/Dating Users */}
      {isSingleOrDating && (
        <>
          {/* Dating Challenges */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-2 block">
                What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <MessageSquare className="w-4 h-4 text-blue-300" />
                <span>Understanding your specific dating struggles helps RealTalk provide targeted guidance</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Select up to 3 that resonate most</p>
            </div>
            
            <div className="space-y-3">
              {datingChallengesOptions.slice(0, showAllDatingChallenges ? datingChallengesOptions.length : 5).map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => handleMultiSelect('datingChallenges', challenge)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                    (profileData.datingChallenges || []).includes(challenge)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {challenge}
                </button>
              ))}
              
              {datingChallengesOptions.length > 5 && (
                <button
                  onClick={() => setShowAllDatingChallenges(!showAllDatingChallenges)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllDatingChallenges ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show more challenges <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Dating Goals */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-2 block">
                What are you hoping to find or create in your dating life? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>Knowing what you're hoping to create helps RealTalk coach you toward your actual desires</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Select up to 3 that feel most important</p>
            </div>
            
            <div className="space-y-3">
              {datingGoalsOptions.slice(0, showAllDatingGoals ? datingGoalsOptions.length : 5).map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect('datingGoals', goal)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                    (profileData.datingGoals || []).includes(goal)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {goal}
                </button>
              ))}
              
              {datingGoalsOptions.length > 5 && (
                <button
                  onClick={() => setShowAllDatingGoals(!showAllDatingGoals)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllDatingGoals ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show more goals <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Conditional Relationship Length */}
      {hasRelationshipLength && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-6">
          <div>
            <Label className="text-base font-semibold text-white mb-2 block">
              How long have you been together? <span className="text-red-400">*</span>
            </Label>
            <div className="flex items-center gap-2 text-[13px] text-white/80 mb-4 font-normal">
              <Clock className="w-4 h-4 text-green-300" />
              <span>Different relationship stages have different needs and challenges</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {relationshipLengthOptions.map((length) => (
              <button
                key={length}
                onClick={() => updateField('relationshipLength', length)}
                className={`p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] text-xs font-medium ${
                  profileData.relationshipLength === length
                    ? 'questionnaire-button-selected'
                    : 'questionnaire-button-secondary'
                }`}
              >
                {length}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Relationship Details */}
      {isInRelationship && (
        <>
          {/* What's Working Well */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-2 block">
                What's working well in your relationship? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <Heart className="w-4 h-4 text-pink-300" />
                <span>We'll build on what's already good instead of fixing everything</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Check all that apply</p>
            </div>
            
            <div className="space-y-3">
              {workingWellOptions.slice(0, showAllWorkingWell ? workingWellOptions.length : 6).map((item) => (
                <button
                  key={item}
                  onClick={() => handleMultiSelect('workingWell', item)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                    (profileData.workingWell || []).includes(item)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {item}
                </button>
              ))}
              
              {workingWellOptions.length > 6 && (
                <button
                  onClick={() => setShowAllWorkingWell(!showAllWorkingWell)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllWorkingWell ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show more <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* What Feels Difficult */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-6 space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-2 block">
                What feels difficult or challenging? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-[13px] text-white/80 mb-1 font-normal">
                <MessageSquare className="w-4 h-4 text-blue-300" />
                <span>Let's tackle the stuff that's actually driving you crazy</span>
              </div>
              <p className="text-orange-300 font-medium text-xs mb-4">Check all that apply</p>
            </div>
            
            <div className="space-y-3">
              {feelsDifficultOptions.slice(0, showAllDifficult ? feelsDifficultOptions.length : 6).map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => handleMultiSelect('feelsDifficult', challenge)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                    (profileData.feelsDifficult || []).includes(challenge)
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {challenge}
                </button>
              ))}
              
              {feelsDifficultOptions.length > 6 && (
                <button
                  onClick={() => setShowAllDifficult(!showAllDifficult)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {showAllDifficult ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show more challenges <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionnaireSection2;
