
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
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
      // Core attachment questions (required)
      comfortableClosenessIndependence: existingData.comfortableClosenessIndependence || '',
      worryRelationshipSecurity: existingData.worryRelationshipSecurity || '',
      wantClosenessButFearHurt: existingData.wantClosenessButFearHurt || '',
      relationshipLength: existingData.relationshipLength || '',
      relationshipType: existingData.relationshipType || '',
      
      // Optional fields - these should NOT be required for validation
      improvingCommunicationFocus: existingData.improvingCommunicationFocus || '',
      workingOnPersonalDevelopment: existingData.workingOnPersonalDevelopment || '',
      learnedHealthyFromFamily: existingData.learnedHealthyFromFamily || '',
      socialSituationsAnxious: existingData.socialSituationsAnxious || '',
      
      ...existingData
    };
  });

  const [expandedSections, setExpandedSections] = useState({
    attachment: false,
    growth: false,
    background: false
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
    
    // Validate required fields only
    if (!validateRequired()) return;
    
    onComplete(formData);
  };

  const validateRequired = () => {
    // Only core attachment and relationship context questions are required
    const required = ['comfortableClosenessIndependence', 'worryRelationshipSecurity', 'wantClosenessButFearHurt', 'relationshipLength', 'relationshipType'];
    const missing = required.filter(field => !formData[field] || formData[field] === '');
    
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
      toast.error(`Please answer all required questions: ${fieldNames.join(', ')}`);
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
          <p className="text-xs text-green-600 mt-1">
            ✓ Your answers are automatically saved as you type
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
