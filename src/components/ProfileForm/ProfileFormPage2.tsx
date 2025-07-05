
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useFormState } from "@/hooks/useFormState";
import { useAutoSave } from "@/hooks/useAutoSave";
import { validatePage2Required } from "@/utils/formValidation";
import ConflictStyles from "./ConflictStyles";

interface ProfileFormPage2Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const ProfileFormPage2 = ({ profileType, onComplete, onBack, initialData }: ProfileFormPage2Props) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  
  // Get existing data from temporary storage
  const getExistingProfileData = () => {
    const existingProfile = temporaryProfiles[profileType]?.[0] || {};
    const existingDemographics = temporaryDemographics[profileType] || {};
    return { ...existingProfile, ...existingDemographics, ...initialData };
  };

  // Initialize form data with default values
  const getInitialFormData = () => {
    const existingData = getExistingProfileData();
    return {
      conflictResponse: existingData.conflictResponse || '',
      stressSpaceNeed: existingData.stressSpaceNeed || '',
      stressSupportNeed: existingData.stressSupportNeed || '',
      goSilentWhenUpset: existingData.goSilentWhenUpset || '',
      needToTalkImmediately: existingData.needToTalkImmediately || '',
      beingRushedMakesWorse: existingData.beingRushedMakesWorse || '',
      feelHeardWithValidation: existingData.feelHeardWithValidation || '',
      ...existingData
    };
  };

  // Auto-save handler
  const handleAutoSave = (data: any) => {
    const currentProfile = temporaryProfiles[profileType]?.[0] || {};
    const currentDemographics = temporaryDemographics[profileType] || {};
    
    const updatedProfile = { ...currentProfile, ...data };
    const updatedDemographics = { ...currentDemographics, ...data };
    
    const newProfiles = {
      ...temporaryProfiles,
      [profileType]: [updatedProfile]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      [profileType]: updatedDemographics
    };
    
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  const { formData, updateField, resetFormData } = useFormState(
    getInitialFormData(),
    handleAutoSave
  );

  // Auto-save functionality
  useAutoSave(formData, handleAutoSave);

  // Reload data when temporary profiles change
  useEffect(() => {
    const existingData = getExistingProfileData();
    resetFormData({
      conflictResponse: existingData.conflictResponse || '',
      stressSpaceNeed: existingData.stressSpaceNeed || '',
      stressSupportNeed: existingData.stressSupportNeed || '',
      goSilentWhenUpset: existingData.goSilentWhenUpset || '',
      needToTalkImmediately: existingData.needToTalkImmediately || '',
      beingRushedMakesWorse: existingData.beingRushedMakesWorse || '',
      feelHeardWithValidation: existingData.feelHeardWithValidation || '',
      ...existingData
    });
  }, [temporaryProfiles, temporaryDemographics, profileType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePage2Required(formData);
    if (!validation.isValid) {
      toast.error('Please answer all required questions before continuing');
      return;
    }
    
    console.log('Page 2 form data being submitted:', formData);
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Conflict & Stress Patterns
          </h3>
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> All questions in this section are required
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✓ Your answers are automatically saved as you type
          </p>
        </div>
        
        <ConflictStyles 
          profileType={profileType}
          formData={formData}
          updateField={updateField}
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Communication
        </Button>
        
        <Button 
          type="submit" 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
        >
          Continue to Attachment
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage2;
