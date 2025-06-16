
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
    stressResponse: initialData.stressResponse || '',
    
    // Additional conflict-related fields
    conflictResolution: initialData.conflictResolution || '',
    apologyStyle: initialData.apologyStyle || '',
    
    ...initialData
  });

  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation for required fields
  const isFormValid = formData.conflictResponse && formData.stressResponse;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Conflict & Stress Patterns
        </h3>
        
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
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Page 1
        </Button>
        
        <Button 
          type="submit" 
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          Continue to Page 3
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage2;
