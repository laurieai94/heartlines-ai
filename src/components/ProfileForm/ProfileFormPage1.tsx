
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { logInfo, logWarn } from '@/utils/productionLogger';
import CommunicationStyles from "./CommunicationStyles";
import LoveLanguages from "./LoveLanguages";

interface ProfileFormPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const ProfileFormPage1 = ({ profileType, onComplete, initialData }: ProfileFormPage1Props) => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  
  // Load existing data from temporary storage - this is the key fix
  const getExistingProfileData = () => {
    const existingProfile = temporaryProfiles[profileType]?.[0] || {};
    const existingDemographics = temporaryDemographics[profileType] || {};
    // Merge all data sources with proper precedence
    return { ...existingProfile, ...existingDemographics, ...initialData };
  };

  const [formData, setFormData] = useState(() => {
    const existingData = getExistingProfileData();
    return {
      // Communication preferences (required)
      importantTalkPreference: existingData.importantTalkPreference || '',
      communicationDirectness: existingData.communicationDirectness || '',
      emotionExpression: existingData.emotionExpression || '',
      
      // Love languages (required)
      loveLanguages: existingData.loveLanguages || [],
      
      // Deep dive love language questions (optional)
      wordsOfAffirmationDeep: existingData.wordsOfAffirmationDeep || '',
      qualityTimeDeep: existingData.qualityTimeDeep || '',
      physicalTouchDeep: existingData.physicalTouchDeep || '',
      giftsDeep: existingData.giftsDeep || '',
      actsOfServiceDeep: existingData.actsOfServiceDeep || '',
      needTimeToProcessDeep: existingData.needTimeToProcessDeep || '',
      directCommunicationDeep: existingData.directCommunicationDeep || '',
      gentleApproachDeep: existingData.gentleApproachDeep || '',
      
      ...existingData
    };
  });

  // Reload data when temporary profiles change (important for persistence)
  useEffect(() => {
    const existingData = getExistingProfileData();
    setFormData(prev => ({
      ...prev,
      ...existingData
    }));
  }, [temporaryProfiles, temporaryDemographics, profileType]);

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

    // Debounce the save to avoid too frequent updates - increased delay for performance
    const timeoutId = setTimeout(saveData, 2000);
    return () => clearTimeout(timeoutId);
  }, [formData, profileType, temporaryProfiles, temporaryDemographics, updateTemporaryProfile]);

  const isPersonal = profileType === 'your';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate required fields - deep dive questions are optional
    if (!validateRequired()) return;
    
    logInfo('Page 1 form data being submitted', formData);
    onComplete(formData);
  };

  const validateRequired = () => {
    // Only check core required fields, not deep dive questions
    const required = ['importantTalkPreference', 'communicationDirectness', 'emotionExpression'];
    const missing = required.filter(field => !formData[field] || formData[field] === '');
    
    // Check for love languages (at least one selection) - this is required
    if (!formData.loveLanguages || formData.loveLanguages.length === 0) {
      missing.push('loveLanguages');
    }
    
    logWarn('Validation check - missing required fields', missing);
    logInfo('Current form data', formData);
    
    if (missing.length > 0) {
      const fieldNames = missing.map(field => {
        switch (field) {
          case 'importantTalkPreference': return 'Important Talk Preference';
          case 'communicationDirectness': return 'Communication Directness';
          case 'emotionExpression': return 'Emotion Expression';
          case 'loveLanguages': return 'Love Languages';
          default: return field;
        }
      });
      toast.error(`Please answer all required questions: ${fieldNames.join(', ')}`);
      return false;
    }
    return true;
  };

  const updateField = (field: string, value: string) => {
    logInfo(`Updating field ${field} with value`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    const current = formData[field] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    logInfo(`Multi-select update for ${field}`, updated);
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Communication & Love Languages
          </h3>
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> indicates required questions. Deep dive questions are optional and help provide more personalized insights.
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✓ Your answers are automatically saved as you type
          </p>
        </div>
        
        <CommunicationStyles 
          profileType={profileType}
          formData={formData}
          updateField={updateField}
        />
        
        <div className="mt-8">
          <LoveLanguages 
            profileType={profileType}
            formData={formData}
            handleMultiSelect={handleMultiSelect}
            updateField={updateField}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
        >
          Continue to Conflict & Stress
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage1;
