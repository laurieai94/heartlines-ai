
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Heart, Clock, MessageSquare, Target, AlertTriangle, Star } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import MultiSelect from "../shared/MultiSelect";
import SingleSelect from "../shared/SingleSelect";
import SectionContinueButton from "../shared/SectionContinueButton";
import { validateSection } from "../../utils/validation";

interface YourRelationshipProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const YourRelationship = ({ profileData, updateField, handleMultiSelect, isActive, onSectionComplete }: YourRelationshipProps) => {
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
    'Less than 3 months',
    '3-6 months',
    '6 months - 1 year',
    '1-2 years',
    '2-5 years',
    '5-10 years',
    '10+ years'
  ];

  const talkingDurationOptions = [
    'Brand new (less than a month)',
    'Getting to know each other (1-3 months)',
    'Been a minute (3-6 months)',
    'Okay this is long (6+ months)'
  ];

  const datingChallengesOptions = [
    'Finding my person in a sea of players',
    'Moving past surface-level conversations',
    'Dating anxiety is real',
    'Not settling but also not being too picky',
    'Being myself without scaring people off',
    'Apps are exhausting',
    'Repeating the same relationship mistakes',
    'Wanting love but also my own life',
    'Figuring out when someone\'s worth it'
  ];

  const relationshipChallengesOptions = [
    'Actually hearing each other when we talk',
    'Fighting without it turning into a disaster',
    'Being together but still being ourselves',
    'Staying connected and intimate',
    'We want different things or timelines',
    'Trust issues and past relationship baggage',
    'Dealing with family or outside pressure',
    'Money stress and financial decisions',
    'Reality vs. what we expected this to be'
  ];

  const relationshipWorkingOptions = [
    'We actually communicate well',
    'Great physical and emotional connection',
    'We support each other\'s dreams',
    'Similar values and life vision',
    'We laugh a lot and have genuine fun',
    'We work through problems without drama',
    'We give each other space to be individuals',
    'Solid friendship foundation',
    'We\'re building something real together'
  ];

  const separationSituationOptions = [
    'Recently separated (less than 6 months)',
    'Separated for a while (6+ months)',
    'Divorce in progress (paperwork and legal stuff)',
    'Divorce finalized (officially done)',
    'Dating again (putting myself out there)',
    'Taking time to heal (focusing on me right now)'
  ];

  const datingReadinessOptions = [
    'Not ready to date yet (working on myself first)',
    'Casually dating (seeing what\'s out there)',
    'Ready for something serious (want real partnership again)',
    'Taking it day by day (no rush, no pressure)',
    'Focused on co-parenting (kids are the priority)',
    'Want better relationship skills (learning for the future)'
  ];

  const talkingDescriptionOptions = [
    "We're just getting to know each other",
    "We're exclusive but not putting a label on it",
    "We're both seeing other people too",
    "The undefined thing is giving me anxiety",
    "We're intentionally taking it slow",
    "I literally have no clue what this is",
    "Good chemistry but haven't had the DTR talk",
    "One of us is way more invested than the other",
    "Started as friends, now there are feelings"
  ];

  const talkingChallengesOptions = [
    "Not knowing where I stand with them",
    "Wanting to text but trying not to seem thirsty",
    "Are they talking to other people or just me?",
    "When do I bring up the \"what are we\" conversation?",
    "Trying not to catch feelings too fast",
    "Playing it cool when I actually really like them",
    "Getting mixed signals and overthinking everything",
    "Being interested without coming off as clingy",
    "Wondering if I'm just wasting my time here"
  ];

  const isSingle = ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);
  const isTalking = profileData.relationshipStatus === 'Talking to someone';
  const hasRelationship = ['In a relationship', 'Engaged', 'Married'].includes(profileData.relationshipStatus);
  const isSeparatedDivorced = profileData.relationshipStatus === 'Separated/Divorced';

  // Question completion checks
  const isStatusComplete = profileData.relationshipStatus;
  const isDatingChallengesComplete = isSingle ? (profileData.datingChallenges && profileData.datingChallenges.length > 0) : true;
  const isTalkingDurationComplete = isTalking ? profileData.talkingDuration : true;
  const isTalkingDescriptionComplete = isTalking ? (profileData.talkingDescription && profileData.talkingDescription.length > 0) : true;
  const isTalkingChallengesComplete = isTalking ? (profileData.talkingChallenges && profileData.talkingChallenges.length > 0) : true;
  const isLengthComplete = hasRelationship ? profileData.relationshipLength : true;
  const isChallengesComplete = hasRelationship ? (profileData.relationshipChallenges && profileData.relationshipChallenges.length > 0) : true;
  const isWorkingComplete = hasRelationship ? (profileData.relationshipWorking && profileData.relationshipWorking.length > 0) : true;
  const isSeparationSituationComplete = isSeparatedDivorced ? (profileData.separationSituation && profileData.separationSituation.length > 0) : true;
  const isDatingReadinessComplete = isSeparatedDivorced ? (profileData.datingReadiness && profileData.datingReadiness.length > 0) : true;
  
  // Section completion check
  const isSectionComplete = validateSection(2, profileData);

  // Navigation functions
  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Situationship</h3>
      </div>

      {/* Relationship Status */}
      <QuestionCard 
        questionId="question-relationship-status"
        showContinue={isStatusComplete && (
          (isSingle && !isDatingChallengesComplete) ||
          (isTalking && !isTalkingDurationComplete) ||
          (hasRelationship && !isLengthComplete) ||
          (isSeparatedDivorced && !isSeparationSituationComplete)
        )}
        onContinue={() => {
          if (isSingle) {
            scrollToQuestion('question-dating-challenges');
          } else if (isTalking) {
            scrollToQuestion('question-talking-duration');
          } else if (hasRelationship) {
            scrollToQuestion('question-relationship-length');
          } else if (isSeparatedDivorced) {
            scrollToQuestion('question-separation-situation');
          }
        }}
      >
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
        <QuestionCard 
          questionId="question-dating-challenges"
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 mb-3 font-normal">
            <Target className="w-3 h-3 text-orange-300" />
            <span>This shapes how you navigate connection challenges</span>
          </div>
          <MultiSelect
            options={datingChallengesOptions}
            selectedValues={profileData.datingChallenges || []}
            onToggle={(value) => handleMultiSelect('datingChallenges', value)}
          />
        </QuestionCard>
      )}

      {/* Talking Duration - for people talking to someone */}
      {isTalking && (
        <QuestionCard 
          questionId="question-talking-duration"
          showContinue={isTalkingDurationComplete && !isTalkingDescriptionComplete}
          onContinue={() => scrollToQuestion('question-talking-description')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            How long have you been talking? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Clock className="w-3 h-3 text-green-300" />
            <span>Early stages have their own unique dynamics and challenges</span>
          </div>
          <SingleSelect
            options={talkingDurationOptions}
            selectedValue={profileData.talkingDuration || ''}
            onSelect={(value) => updateField('talkingDuration', value)}
          />
        </QuestionCard>
      )}

      {/* Talking Description - for people talking to someone */}
      {isTalking && isTalkingDurationComplete && (
        <QuestionCard 
          questionId="question-talking-description"
          showContinue={isTalkingDescriptionComplete && !isTalkingChallengesComplete}
          onContinue={() => scrollToQuestion('question-talking-challenges')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            How would you describe what you have right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>The talking stage has its own unique energy</span>
          </div>
          <MultiSelect
            options={talkingDescriptionOptions}
            selectedValues={profileData.talkingDescription || []}
            onToggle={(value) => handleMultiSelect('talkingDescription', value)}
            columns={1}
          />
        </QuestionCard>
      )}

      {/* Talking Challenges - for people talking to someone */}
      {isTalking && isTalkingDescriptionComplete && (
        <QuestionCard 
          questionId="question-talking-challenges"
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging about the talking stage? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate - we get that this stage is weird</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <AlertTriangle className="w-3 h-3 text-yellow-300" />
            <span>Navigating uncertainty is tough - we're here to help</span>
          </div>
          <MultiSelect
            options={talkingChallengesOptions}
            selectedValues={profileData.talkingChallenges || []}
            onToggle={(value) => handleMultiSelect('talkingChallenges', value)}
            columns={1}
          />
        </QuestionCard>
      )}

      {/* Relationship Length - for people in relationships */}
      {hasRelationship && (
        <QuestionCard 
          questionId="question-relationship-length"
          showContinue={isLengthComplete && !isChallengesComplete}
          onContinue={() => scrollToQuestion('question-relationship-challenges')}
        >
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
        <QuestionCard 
          questionId="question-relationship-challenges"
          showContinue={isChallengesComplete && !isWorkingComplete}
          onContinue={() => scrollToQuestion('question-relationship-working')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <AlertTriangle className="w-3 h-3 text-red-300" />
            <span>This helps us understand what to focus on</span>
          </div>
          <MultiSelect
            options={relationshipChallengesOptions}
            selectedValues={profileData.relationshipChallenges || []}
            onToggle={(value) => handleMultiSelect('relationshipChallenges', value)}
          />
        </QuestionCard>
      )}

      {/* What's Working Well - for people in relationships */}
      {hasRelationship && (
        <QuestionCard questionId="question-relationship-working">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's working really well between you two? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Star className="w-3 h-3 text-green-300" />
            <span>We want to build on your strengths</span>
          </div>
          <MultiSelect
            options={relationshipWorkingOptions}
            selectedValues={profileData.relationshipWorking || []}
            onToggle={(value) => handleMultiSelect('relationshipWorking', value)}
          />
        </QuestionCard>
      )}

      {/* Separated/Divorced specific questions */}
      {isSeparatedDivorced && (
        <QuestionCard 
          questionId="question-separation-situation"
          showContinue={isSeparationSituationComplete && !isDatingReadinessComplete}
          onContinue={() => scrollToQuestion('question-dating-readiness')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's your situation right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Heart className="w-3 h-3 text-blue-300" />
            <span>Help us understand your journey</span>
          </div>
          <MultiSelect
            options={separationSituationOptions}
            selectedValues={profileData.separationSituation || []}
            onToggle={(value) => handleMultiSelect('separationSituation', value)}
            columns={2}
          />
        </QuestionCard>
      )}

      {isSeparatedDivorced && (
        <QuestionCard questionId="question-dating-readiness">
          <Label className="text-sm font-semibold text-white mb-2 block">
            Where are you at with dating/relationships? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Heart className="w-3 h-3 text-purple-300" />
            <span>We want to support you wherever you are</span>
          </div>
          <MultiSelect
            options={datingReadinessOptions}
            selectedValues={profileData.datingReadiness || []}
            onToggle={(value) => handleMultiSelect('datingReadiness', value)}
            columns={2}
          />
        </QuestionCard>
      )}

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={2}
        onClick={() => {
          // Scroll to first question of next section
          setTimeout(() => {
            const nextSectionFirstQuestion = document.querySelector('[data-section="3"] [data-question-card]');
            if (nextSectionFirstQuestion) {
              nextSectionFirstQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          onSectionComplete?.();
        }}
      />
    </div>
  );
};

export default YourRelationship;
