
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
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
    relationshipLength: initialData.relationshipLength || '',
    relationshipType: initialData.relationshipType || '',
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
    
    // Validate required fields
    if (!validateRequired()) return;
    
    onComplete(formData);
  };

  const validateRequired = () => {
    const required = ['comfortableClosenessIndependence', 'worryRelationshipSecurity', 'wantClosenessButFearHurt', 'relationshipLength', 'relationshipType', 'improvingCommunicationFocus'];
    const missing = required.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      toast.error('Please answer all required questions before continuing');
      return false;
    }
    return true;
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Attachment Style & Growth Areas
          </h3>
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> indicates required questions. Optional sections are clearly marked.
          </p>
        </div>
        
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
