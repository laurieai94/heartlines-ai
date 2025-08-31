
import { User } from "lucide-react";
import { ProfileData } from "../../../types";
import OptionalGroup from "../../shared/OptionalGroup";

import NamePronounsCard from "./NamePronounsCard";
import AgeSelectionCard from "./AgeSelectionCard";
import OrientationSelectionCard from "./OrientationSelectionCard";
import GenderSelectionCard from "./GenderSelectionCard";

interface WhoYouAreProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const WhoYouAre = ({ profileData, updateField, handleMultiSelect, isActive, onSectionComplete }: WhoYouAreProps) => {
  // Helper function to check if pronouns are complete (duplicated here to avoid complex prop passing)
  const isPronounsComplete = () => {
    if (!profileData.pronouns) return false;
    // If "Other" is selected but no custom value entered yet, it's incomplete
    if (profileData.pronouns === 'Other') return false;
    // Any other value (including custom pronouns) means it's complete
    return true;
  };

  // Helper function to safely handle orientation field - handle both string and array formats
  const getOrientationValue = () => {
    if (!profileData.orientation) return '';
    // If it's an array (from legacy data), take the first value or empty string
    if (Array.isArray(profileData.orientation)) {
      return profileData.orientation.length > 0 ? profileData.orientation[0] : '';
    }
    // If it's a string, return as is
    return profileData.orientation;
  };

  // Helper function to safely handle gender field - handle both string and array formats
  const getGenderValue = () => {
    if (!profileData.gender) return '';
    // If it's an array, take the first value or empty string
    if (Array.isArray(profileData.gender)) {
      return profileData.gender.length > 0 ? profileData.gender[0] : '';
    }
    // If it's a string, return as is
    return profileData.gender;
  };

  // Question completion checks
  const isNamePronounsComplete = profileData.name && isPronounsComplete();
  const isAgeComplete = !!profileData.age;
  const orientationValue = getOrientationValue();
  const isOrientationComplete = !!(orientationValue && orientationValue.trim() !== '');
  const genderValue = getGenderValue();
  const isGenderComplete = !!(genderValue && genderValue.trim() !== '');

  return (
    <div className={`space-y-3 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      {/* Sticky Section Header */}
      <div className="sticky top-0 z-20 py-2 bg-transparent">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <User className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">The Basics</h3>
          </div>
          <p className="text-white/70">stuff you'd put in a dating app</p>
        </div>
      </div>

      {/* Required Fields */}
      <NamePronounsCard
        profileData={profileData}
        updateField={updateField}
        isComplete={isNamePronounsComplete}
      />

      {/* Optional Fields */}
      <OptionalGroup>
        <AgeSelectionCard
          profileData={profileData}
          updateField={updateField}
          isComplete={isAgeComplete}
        />

        <OrientationSelectionCard
          profileData={profileData}
          updateField={updateField}
          isComplete={isOrientationComplete}
        />

        <GenderSelectionCard
          profileData={profileData}
          updateField={updateField}
          isComplete={isGenderComplete}
        />
      </OptionalGroup>
    </div>
  );
};

export default WhoYouAre;
