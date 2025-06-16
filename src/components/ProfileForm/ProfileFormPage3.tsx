
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import AttachmentQuestions from "./AttachmentQuestions";
import RelationshipContext from "./RelationshipContext";
import OptionalSections from "./OptionalSections";

interface ProfileFormPage3Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const ProfileFormPage3 = ({ profileType, onComplete, onBack, initialData }: ProfileFormPage3Props) => {
  const [formData, setFormData] = useState({
    // Core attachment questions
    comfortableClosenessIndependence: initialData.comfortableClosenessIndependence || '',
    worryRelationshipSecurity: initialData.worryRelationshipSecurity || '',
    wantClosenessButFearHurt: initialData.wantClosenessButFearHurt || '',
    
    // Core relationship questions  
    relationshipLength: initialData.relationshipLength || '',
    relationshipType: initialData.relationshipType || '',
    
    // Optional deeper questions
    improvingCommunicationFocus: initialData.improvingCommunicationFocus || '',
    workingOnPersonalDevelopment: initialData.workingOnPersonalDevelopment || '',
    learnedHealthyFromFamily: initialData.learnedHealthyFromFamily || '',
    socialSituationsAnxious: initialData.socialSituationsAnxious || '',
    
    ...initialData
  });

  const [expandedSections, setExpandedSections] = useState({
    attachment: false,
    growth: false,
    background: false
  });

  const isPersonal = profileType === 'your';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Core required fields for form validation
  const isFormValid = formData.comfortableClosenessIndependence && 
                     formData.worryRelationshipSecurity && 
                     formData.wantClosenessButFearHurt && 
                     formData.relationshipLength && 
                     formData.relationshipType;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Attachment Style & Growth Areas
        </h3>
        
        {/* Core Attachment Style Questions */}
        <AttachmentQuestions 
          profileType={profileType}
          formData={formData}
          updateField={updateField}
        />

        {/* Core Relationship Context */}
        <div className="mt-8">
          <RelationshipContext 
            formData={formData}
            updateField={updateField}
          />
        </div>

        {/* Optional Growth Areas */}
        <div className="mt-8">
          <OptionalSections 
            profileType={profileType}
            formData={formData}
            updateField={updateField}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Conflict & Stress
        </Button>
        
        <Button 
          type="submit" 
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
        >
          <Check className="w-5 h-5" />
          Complete Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage3;
