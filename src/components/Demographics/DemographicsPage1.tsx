
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { usePersonalProfilePersistence } from "@/hooks/usePersonalProfilePersistence";
import PersonalIdentity from "./PersonalIdentity";
import BackgroundLifestyle from "./BackgroundLifestyle";

interface DemographicsPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const DemographicsPage1 = ({ profileType, onComplete, initialData }: DemographicsPage1Props) => {
  const { temporaryDemographics, updateTemporaryProfile, temporaryProfiles } = useTemporaryProfile();
  const { profileData, isReady, updateField, isLoading } = usePersonalProfilePersistence();
  const isPersonal = profileType === 'your';
  
  // Initialize form data based on profile type
  const [formData, setFormData] = useState(() => {
    if (isPersonal) {
      return {}; // Personal data is handled by usePersonalProfilePersistence
    } else {
      const existingData = temporaryDemographics[profileType] || {};
      return {
        name: existingData.name || '',
        pronouns: existingData.pronouns || '',
        age: existingData.age || '',
        sexualOrientation: existingData.sexualOrientation || [],
        genderIdentity: existingData.genderIdentity || [],
        education: existingData.education || '',
        workSituation: existingData.workSituation || '',
        income: existingData.income || '',
        ...existingData,
        ...initialData
      };
    }
  });

  // Auto-save for partner profiles
  useEffect(() => {
    if (!isPersonal && formData && Object.keys(formData).length > 0) {
      console.log('Auto-saving partner data:', formData);
      
      const newDemographics = {
        ...temporaryDemographics,
        [profileType]: { ...temporaryDemographics[profileType], ...formData }
      };
      updateTemporaryProfile(temporaryProfiles, newDemographics);
    }
  }, [formData, profileType, isPersonal, temporaryDemographics, temporaryProfiles, updateTemporaryProfile]);

  const updateFormData = (field: string, value: any) => {
    console.log('Updating field', field, 'with value:', value);
    if (isPersonal) {
      updateField(field, value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMultiSelect = (field: string, value: string) => {
    if (isPersonal) {
      // This is handled by the PersonalIdentity component
      return;
    }
    
    const current = formData[field] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData(field, updated);
  };

  const validateRequired = () => {
    const currentData = isPersonal ? profileData : formData;
    
    if (isPersonal) {
      const required = ['name', 'pronouns', 'age', 'education', 'workSituation'];
      const missing = required.filter(field => !currentData[field]);
      
      if (!currentData.sexualOrientation || currentData.sexualOrientation.length === 0) {
        missing.push('sexualOrientation');
      }
      if (!currentData.genderIdentity || currentData.genderIdentity.length === 0) {
        missing.push('genderIdentity');
      }
      
      if (missing.length > 0) {
        const fieldNames = missing.map(field => {
          switch (field) {
            case 'sexualOrientation': return 'Sexual Orientation';
            case 'genderIdentity': return 'Gender Identity';
            case 'workSituation': return 'Work Situation';
            default: return field;
          }
        });
        toast.error(`Please fill in all required fields: ${fieldNames.join(', ')}`);
        return false;
      }
    } else {
      if (!currentData.name) {
        toast.error('Please provide your partner\'s name');
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateRequired()) return;
    
    const dataToComplete = isPersonal ? profileData : formData;
    console.log('Completing with data:', dataToComplete);
    onComplete(dataToComplete);
  };

  // Calculate progress
  const currentData = isPersonal ? profileData : formData;
  const requiredFields = isPersonal ? ['name', 'pronouns', 'age', 'education', 'workSituation'] : ['name'];
  const completedFields = requiredFields.filter(field => currentData[field]);
  
  if (isPersonal) {
    if (currentData.sexualOrientation && currentData.sexualOrientation.length > 0) {
      completedFields.push('sexualOrientation');
    }
    if (currentData.genderIdentity && currentData.genderIdentity.length > 0) {
      completedFields.push('genderIdentity');
    }
  }
  
  const totalRequiredFields = isPersonal ? requiredFields.length + 2 : requiredFields.length;
  const progressPercentage = (completedFields.length / totalRequiredFields) * 100;

  // Show loading for personal profiles until ready
  if (isPersonal && (isLoading || !isReady)) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Engaging Introduction with Progress */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border-purple-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Let's get to know {isPersonal ? 'you' : 'your partner'} better!</h3>
              <p className="text-gray-700 mb-4">
                Quick info to personalize your experience. 
                {!isPersonal && ' Don\'t stress if you don\'t know everything—just fill in what you can!'}
              </p>
              
              {/* Progress Indicator */}
              <div className="bg-white/70 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-purple-600 font-semibold">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Private & secure—this stays with you</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {!isPersonal && (
        <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-800">
                <strong>New relationship?</strong> No worries! Share what you know, skip the rest.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Personal Identity Section */}
      <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600">1</span>
            </div>
            Personal Identity
          </h4>
          <p className="text-gray-600 text-sm">The basics to personalize your experience</p>
        </div>
        <PersonalIdentity 
          profileType={profileType}
          formData={formData}
          updateFormData={updateFormData}
          handleMultiSelect={handleMultiSelect}
        />
      </Card>

      {/* Background & Lifestyle Section */}
      <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            Background & Lifestyle
          </h4>
          <p className="text-gray-600 text-sm">Context that helps us understand {isPersonal ? 'your' : 'their'} perspective</p>
        </div>
        <BackgroundLifestyle 
          profileType={profileType}
          formData={isPersonal ? profileData : formData}
          updateFormData={updateFormData}
        />
      </Card>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          {completedFields.length} of {totalRequiredFields} required fields completed
        </div>
        <Button
          onClick={handleContinue}
          disabled={progressPercentage < 100}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Family Background
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DemographicsPage1;
