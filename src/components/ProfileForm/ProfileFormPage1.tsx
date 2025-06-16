
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CommunicationStyles from "./CommunicationStyles";
import LoveLanguages from "./LoveLanguages";

interface ProfileFormPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const ProfileFormPage1 = ({ profileType, onComplete, initialData }: ProfileFormPage1Props) => {
  const [formData, setFormData] = useState({
    // Communication preferences
    importantTalkPreference: initialData.importantTalkPreference || '',
    emotionExpression: initialData.emotionExpression || '',
    
    // Love languages
    loveLanguages: initialData.loveLanguages || [],
    
    ...initialData
  });

  const isPersonal = profileType === 'your';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
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

  // Basic validation - at least one field from each main section
  const isFormValid = formData.importantTalkPreference && 
                     formData.emotionExpression && 
                     formData.loveLanguages?.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Communication & Love Languages
        </h3>
        
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
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          disabled={!isFormValid}
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
