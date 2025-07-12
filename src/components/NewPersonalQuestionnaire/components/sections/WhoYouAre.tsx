
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar, Compass, MessageSquare } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import MultiSelect from "../shared/MultiSelect";
import SingleSelect from "../shared/SingleSelect";

interface WhoYouAreProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
}

const WhoYouAre = ({ profileData, updateField, handleMultiSelect, isActive }: WhoYouAreProps) => {
  const [customPronoun, setCustomPronoun] = useState("");

  // Initialize custom pronoun from saved data
  useEffect(() => {
    const standardPronouns = ['She/her', 'He/him', 'They/them', 'Other'];
    if (profileData.pronouns && !standardPronouns.includes(profileData.pronouns)) {
      // This is a custom pronoun value
      setCustomPronoun(profileData.pronouns);
    }
  }, [profileData.pronouns]);

  const ageOptions = [
    'Under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50-60', '65+'
  ];

  const orientationOptions = [
    'Straight/Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Queer', 'Asexual', 'Questioning', 'Prefer to self-describe'
  ];

  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Prefer to self-describe'
  ];

  const primaryPronounOptions = [
    'She/her', 'He/him', 'They/them', 'Other'
  ];

  // Helper function to check if pronouns are complete
  const isPronounsComplete = () => {
    if (!profileData.pronouns) return false;
    if (profileData.pronouns === 'Other') {
      return customPronoun.trim().length > 0;
    }
    return true;
  };

  // Question completion checks
  const isNamePronounsComplete = profileData.name && isPronounsComplete();
  const isAgeComplete = profileData.age;
  const isOrientationComplete = profileData.orientation && profileData.orientation.trim() !== '';
  const isGenderComplete = profileData.gender && profileData.gender.trim() !== '';

  // Navigation functions
  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle custom pronoun blur event
  const handleCustomPronounBlur = () => {
    if (customPronoun.trim().length > 0) {
      updateField('pronouns', customPronoun.trim());
    } else {
      updateField('pronouns', null);
    }
  };

  const handlePronounSelect = (pronoun: string) => {
    if (pronoun === 'Other') {
      updateField('pronouns', 'Other');
      setCustomPronoun("");
    } else {
      updateField('pronouns', pronoun);
      setCustomPronoun("");
    }
  };

  const handleCustomPronounChange = (value: string) => {
    setCustomPronoun(value);
    // Don't update profileData.pronouns while typing
  };

  const generateAvatar = (name: string) => {
    if (!name) {
      return (
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
          <User className="w-6 h-6 text-white/60" />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Who You Are</h3>
      </div>

      {/* Name and Pronouns Combined */}
      <QuestionCard 
        questionId="question-name-pronouns"
        showContinue={isNamePronounsComplete && !isAgeComplete}
        onContinue={() => scrollToQuestion('question-age')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left side: Name and Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {generateAvatar(profileData.name || '')}
            </div>
            <div className="flex-1 min-w-0">
              <Label htmlFor="name" className="text-sm font-semibold text-white mb-2 block">
                What should we call you? <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={profileData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your name"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-3 h-auto font-medium w-full"
              />
            </div>
          </div>

          {/* Right side: Pronouns */}
          <div className="flex flex-col">
            <Label className="text-sm font-semibold text-white mb-2 block">
              What pronouns do you use? <span className="text-red-400">*</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
              <MessageSquare className="w-3 h-3 text-blue-300" />
              <span>So we can refer to you correctly</span>
            </div>
            
            {/* Pronoun buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {primaryPronounOptions.map((pronouns) => (
                <button
                  key={pronouns}
                  onClick={() => handlePronounSelect(pronouns)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                    profileData.pronouns === pronouns
                      ? 'questionnaire-button-selected'
                      : 'questionnaire-button-secondary'
                  }`}
                >
                  {pronouns}
                </button>
              ))}
            </div>

            {/* Custom pronoun input */}
            {(profileData.pronouns === 'Other' || (!['She/her', 'He/him', 'They/them'].includes(profileData.pronouns || '') && profileData.pronouns)) && (
              <div className="mt-3 animate-fade-in">
                <Input
                  type="text"
                  value={customPronoun}
                  onChange={(e) => handleCustomPronounChange(e.target.value)}
                  onBlur={handleCustomPronounBlur}
                  placeholder="Enter your pronouns"
                  className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-2 h-auto font-medium"
                />
              </div>
            )}
          </div>
        </div>
      </QuestionCard>

      {/* Age */}
      <QuestionCard 
        questionId="question-age"
        showContinue={isAgeComplete && !isOrientationComplete}
        onContinue={() => scrollToQuestion('question-orientation')}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your age? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Calendar className="w-3 h-3 text-orange-300" />
          <span>Different life stages = different relationship challenges</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ageOptions.map((age) => (
            <button
              key={age}
              onClick={() => updateField('age', age)}
              className={`p-2 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                profileData.age === age
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </QuestionCard>

      {/* Sexual Orientation */}
      <QuestionCard 
        questionId="question-orientation"
        showContinue={isOrientationComplete && !isGenderComplete}
        onContinue={() => scrollToQuestion('question-gender')}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your sexual orientation? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Compass className="w-3 h-3 text-pink-300" />
          <span>Because straight dating advice doesn't work for everyone</span>
        </div>
        <SingleSelect
          options={orientationOptions}
          selectedValue={profileData.orientation || ''}
          onSelect={(value) => updateField('orientation', value)}
        />
      </QuestionCard>

      {/* Gender Identity */}
      <QuestionCard questionId="question-gender">
        <Label className="text-sm font-semibold text-white mb-2 block">
          Gender identity? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <User className="w-3 h-3 text-purple-300" />
          <span>We get that gender is complex and personal</span>
        </div>
        <SingleSelect
          options={genderOptions}
          selectedValue={profileData.gender || ''}
          onSelect={(value) => updateField('gender', value)}
        />
      </QuestionCard>
    </div>
  );
};

export default WhoYouAre;
