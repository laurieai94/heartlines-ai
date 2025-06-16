
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import CommunicationStyles from "./CommunicationStyles";
import LoveLanguages from "./LoveLanguages";

interface ProfileFormPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const ProfileFormPage1 = ({ profileType, onComplete, initialData }: ProfileFormPage1Props) => {
  const [formData, setFormData] = useState({
    // Communication preferences (required)
    importantTalkPreference: initialData.importantTalkPreference || '',
    communicationDirectness: initialData.communicationDirectness || '',
    emotionExpression: initialData.emotionExpression || '',
    
    // Love languages (required)
    loveLanguages: initialData.loveLanguages || [],
    
    // Deep dive love language questions (optional)
    wordsOfAffirmationDeep: initialData.wordsOfAffirmationDeep || '',
    qualityTimeDeep: initialData.qualityTimeDeep || '',
    physicalTouchDeep: initialData.physicalTouchDeep || '',
    giftsDeep: initialData.giftsDeep || '',
    actsOfServiceDeep: initialData.actsOfServiceDeep || '',
    needTimeToProcessDeep: initialData.needTimeToProcessDeep || '',
    directCommunicationDeep: initialData.directCommunicationDeep || '',
    gentleApproachDeep: initialData.gentleApproachDeep || '',
    
    ...initialData
  });

  const isPersonal = profileType === 'your';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate required fields - deep dive questions are optional
    if (!validateRequired()) return;
    
    onComplete(formData);
  };

  const validateRequired = () => {
    // Only check core required fields, not deep dive questions
    const required = ['importantTalkPreference', 'communicationDirectness', 'emotionExpression'];
    const missing = required.filter(field => !formData[field]);
    
    // Check for love languages (at least one selection)
    if (!formData.loveLanguages || formData.loveLanguages.length === 0) {
      missing.push('loveLanguages');
    }
    
    if (missing.length > 0) {
      toast.error('Please answer all required questions before continuing');
      return false;
    }
    return true;
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    const current = formData[field] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
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
