
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
    // Core attachment questions (required)
    comfortableClosenessIndependence: initialData.comfortableClosenessIndependence || '',
    worryRelationshipSecurity: initialData.worryRelationshipSecurity || '',
    wantClosenessButFearHurt: initialData.wantClosenessButFearHurt || '',
    relationshipLength: initialData.relationshipLength || '',
    relationshipType: initialData.relationshipType || '',
    
    // Optional fields - these should NOT be required for validation
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
    
    // Validate ONLY required fields
    if (!validateRequired()) return;
    
    console.log('Page 3 form data being submitted:', formData);
    onComplete(formData);
  };

  const validateRequired = () => {
    // ONLY core attachment and relationship context questions are required
    // Optional sections should NOT block progression
    const required = ['comfortableClosenessIndependence', 'worryRelationshipSecurity', 'wantClosenessButFearHurt', 'relationshipLength', 'relationshipType'];
    const missing = required.filter(field => !formData[field] || formData[field] === '');
    
    console.log('Page 3 validation - missing required fields:', missing);
    console.log('Page 3 current form data:', formData);
    
    if (missing.length > 0) {
      const fieldNames = missing.map(field => {
        switch (field) {
          case 'comfortableClosenessIndependence': return 'Comfortable with Closeness/Independence';
          case 'worryRelationshipSecurity': return 'Worry about Relationship Security';
          case 'wantClosenessButFearHurt': return 'Want Closeness but Fear Hurt';
          case 'relationshipLength': return 'Relationship Length';
          case 'relationshipType': return 'Relationship Type';
          default: return field;
        }
      });
      toast.error(`Please answer these required questions: ${fieldNames.join(', ')}`);
      return false;
    }
    return true;
  };

  const updateField = (field: string, value: string) => {
    console.log(`Page 3 updating field ${field} with value:`, value);
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
            <span className="text-red-500">*</span> indicates required questions. All other sections are completely optional.
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
