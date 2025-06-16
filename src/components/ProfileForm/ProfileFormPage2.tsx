
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ConflictStyles from "./ConflictStyles";

interface ProfileFormPage2Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const ProfileFormPage2 = ({ profileType, onComplete, onBack, initialData }: ProfileFormPage2Props) => {
  const [formData, setFormData] = useState({
    // Conflict and stress patterns (core required fields only)
    conflictResponse: initialData.conflictResponse || '',
    stressSpaceNeed: initialData.stressSpaceNeed || '',
    stressSupportNeed: initialData.stressSupportNeed || '',
    
    // Deep dive questions (optional - should NOT be validated)
    goSilentWhenUpset: initialData.goSilentWhenUpset || '',
    needToTalkImmediately: initialData.needToTalkImmediately || '',
    beingRushedMakesWorse: initialData.beingRushedMakesWorse || '',
    feelHeardWithValidation: initialData.feelHeardWithValidation || '',
    
    // Include ALL initial data to preserve everything from previous pages
    ...initialData
  });

  const isPersonal = profileType === 'your';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For partner profiles, skip validation entirely
    if (profileType === 'partner') {
      console.log('Partner profile - skipping validation');
      onComplete(formData);
      return;
    }
    
    // Validate ONLY core required fields for 'your' profile - exclude deep dive questions
    if (!validateRequired()) return;
    
    console.log('Page 2 form data being submitted:', formData);
    onComplete(formData);
  };

  const validateRequired = () => {
    // ONLY validate core conflict and stress questions - deep dive questions are optional
    const required = ['conflictResponse', 'stressSpaceNeed', 'stressSupportNeed'];
    const missing = required.filter(field => !formData[field] || formData[field] === '');
    
    console.log('Page 2 validation - missing required fields:', missing);
    console.log('Page 2 current form data:', formData);
    
    if (missing.length > 0) {
      const fieldNames = missing.map(field => {
        switch (field) {
          case 'conflictResponse': return 'Conflict Response';
          case 'stressSpaceNeed': return 'Need for Space When Stressed';
          case 'stressSupportNeed': return 'Need for Support When Stressed';
          default: return field;
        }
      });
      toast.error(`Please answer these required questions: ${fieldNames.join(', ')}`);
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
            {profileType === 'partner' ? (
              'All partner profile questions are optional. Fill out what you know.'
            ) : (
              <>
                <span className="text-red-500">*</span> Only core questions are required. Deep dive questions are completely optional.
              </>
            )}
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
