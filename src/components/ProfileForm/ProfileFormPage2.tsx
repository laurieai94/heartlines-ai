
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ConflictStyles from "./ConflictStyles";

interface ProfileFormPage2Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const ProfileFormPage2 = ({ profileType, onComplete, onBack, initialData }: ProfileFormPage2Props) => {
  const [formData, setFormData] = useState({
    // Conflict and stress patterns
    conflictResponse: initialData.conflictResponse || '',
    stressSpaceNeed: initialData.stressSpaceNeed || '',
    stressSupportNeed: initialData.stressSupportNeed || '',
    goSilentWhenUpset: initialData.goSilentWhenUpset || '',
    needToTalkImmediately: initialData.needToTalkImmediately || '',
    beingRushedMakesWorse: initialData.beingRushedMakesWorse || '',
    feelHeardWithValidation: initialData.feelHeardWithValidation || '',
    
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

  // Validation for required fields
  const isFormValid = formData.conflictResponse && 
                     formData.stressSpaceNeed && 
                     formData.stressSupportNeed;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Conflict & Stress Patterns
          </h3>
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> indicates required questions
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
          disabled={!isFormValid}
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
