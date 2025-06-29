
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import ConflictStyles from "./ConflictStyles";

interface ProfileFormPage2Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const ProfileFormPage2 = ({ profileType, onComplete, onBack, initialData }: ProfileFormPage2Props) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  
  // Load existing data from temporary storage
  const getExistingProfileData = () => {
    const existingProfile = temporaryProfiles[profileType]?.[0] || {};
    const existingDemographics = temporaryDemographics[profileType] || {};
    return { ...existingProfile, ...existingDemographics, ...initialData };
  };

  const [formData, setFormData] = useState(() => {
    const existingData = getExistingProfileData();
    return {
      // Conflict and stress patterns (all required)
      conflictResponse: existingData.conflictResponse || '',
      stressSpaceNeed: existingData.stressSpaceNeed || '',
      stressSupportNeed: existingData.stressSupportNeed || '',
      goSilentWhenUpset: existingData.goSilentWhenUpset || '',
      needToTalkImmediately: existingData.needToTalkImmediately || '',
      beingRushedMakesWorse: existingData.beingRushedMakesWorse || '',
      feelHeardWithValidation: existingData.feelHeardWithValidation || '',
      
      ...existingData
    };
  });

  // Auto-save data whenever formData changes
  useEffect(() => {
    const saveData = () => {
      const currentProfile = temporaryProfiles[profileType]?.[0] || {};
      const currentDemographics = temporaryDemographics[profileType] || {};
      
      const updatedProfile = { ...currentProfile, ...formData };
      const updatedDemographics = { ...currentDemographics, ...formData };
      
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

    // Debounce the save to avoid too frequent updates
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, profileType, temporaryProfiles, temporaryDemographics, updateTemporaryProfile]);

  const isPersonal = profileType === 'your';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!validateRequired()) return;
    
    console.log('Page 2 form data being submitted:', formData);
    onComplete(formData);
  };

  const validateRequired = () => {
    const required = ['conflictResponse', 'stressSpaceNeed', 'stressSupportNeed', 'goSilentWhenUpset', 'needToTalkImmediately', 'beingRushedMakesWorse', 'feelHeardWithValidation'];
    const missing = required.filter(field => !formData[field] || formData[field] === '');
    
    console.log('Page 2 validation - missing required fields:', missing);
    console.log('Page 2 current form data:', formData);
    
    if (missing.length > 0) {
      toast.error('Please answer all required questions before continuing');
      return false;
    }
    return true;
  };

  const updateField = (field: string, value: string) => {
    console.log(`Page 2 updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
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
