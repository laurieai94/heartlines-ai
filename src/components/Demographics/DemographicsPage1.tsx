
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import PersonalIdentity from "./PersonalIdentity";
import BackgroundLifestyle from "./BackgroundLifestyle";

interface DemographicsPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const DemographicsPage1 = ({ profileType, onComplete, initialData }: DemographicsPage1Props) => {
  const { temporaryDemographics, updateTemporaryProfile, temporaryProfiles } = useTemporaryProfile();
  const { personalProfileData, savePersonalProfileData, isLoaded } = usePersonalProfileData();
  const isPersonal = profileType === 'your';
  
  // Get existing data - for personal profiles, use the unified data
  const getExistingData = () => {
    if (isPersonal && isLoaded) {
      // For personal profiles, use the merged data from usePersonalProfileData
      return { ...personalProfileData, ...initialData };
    } else {
      // For partner profiles, use the existing logic
      const existingDemographics = temporaryDemographics[profileType] || {};
      return { ...existingDemographics, ...initialData };
    }
  };
  
  const [formData, setFormData] = useState(() => {
    const existingData = getExistingData();
    return {
      name: existingData.name || '',
      pronouns: existingData.pronouns || '',
      age: existingData.age || '',
      sexualOrientation: existingData.sexualOrientation || [],
      genderIdentity: existingData.genderIdentity || [],
      education: existingData.education || '',
      workSituation: existingData.workSituation || '',
      income: existingData.income || '',
      ...existingData
    };
  });

  // Reload data when profile data changes
  useEffect(() => {
    const existingData = getExistingData();
    console.log('DemographicsPage1: Reloading data for', profileType, existingData);
    
    setFormData(prev => {
      const newData = { ...prev, ...existingData };
      console.log('DemographicsPage1: Updated form data:', newData);
      return newData;
    });
  }, [isPersonal, isLoaded, personalProfileData, temporaryDemographics, profileType]);

  // Auto-save data whenever formData changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const saveData = () => {
      console.log('DemographicsPage1: Auto-saving data for', profileType, formData);
      
      if (isPersonal) {
        // For personal profiles, use the unified save function
        const { newProfiles, newDemographics } = savePersonalProfileData(formData);
        updateTemporaryProfile(newProfiles, newDemographics);
      } else {
        // For partner profiles, use existing logic
        const newDemographics = {
          ...temporaryDemographics,
          [profileType]: { ...temporaryDemographics[profileType], ...formData }
        };
        updateTemporaryProfile(temporaryProfiles, newDemographics);
      }
    };

    // Debounce the save to avoid too frequent updates
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
  }, [formData, profileType, isLoaded, isPersonal, savePersonalProfileData, temporaryDemographics, temporaryProfiles, updateTemporaryProfile]);

  const updateFormData = (field: string, value: any) => {
    console.log('DemographicsPage1: Updating field', field, 'with value:', value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    const current = formData[field] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData(field, updated);
  };

  const validateRequired = () => {
    if (isPersonal) {
      const required = ['name', 'pronouns', 'age', 'education', 'workSituation'];
      const missing = required.filter(field => !formData[field]);
      
      // Check for required multi-select fields
      if (!formData.sexualOrientation || formData.sexualOrientation.length === 0) {
        missing.push('sexualOrientation');
      }
      if (!formData.genderIdentity || formData.genderIdentity.length === 0) {
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
      // For partner, only name is required
      if (!formData.name) {
        toast.error('Please provide your partner\'s name');
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateRequired()) return;
    
    console.log('DemographicsPage1: Completing with data:', formData);
    onComplete(formData);
  };

  // Calculate progress for engagement - updated to include new required fields
  const requiredFields = isPersonal ? ['name', 'pronouns', 'age', 'education', 'workSituation'] : ['name'];
  const completedFields = requiredFields.filter(field => formData[field]);
  
  // Add progress for multi-select required fields for personal profiles
  if (isPersonal) {
    if (formData.sexualOrientation && formData.sexualOrientation.length > 0) {
      completedFields.push('sexualOrientation');
    }
    if (formData.genderIdentity && formData.genderIdentity.length > 0) {
      completedFields.push('genderIdentity');
    }
  }
  
  const totalRequiredFields = isPersonal ? requiredFields.length + 2 : requiredFields.length; // +2 for the multi-select fields
  const progressPercentage = (completedFields.length / totalRequiredFields) * 100;

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
                This helps Kai understand {isPersonal ? 'your' : 'their'} background and give more personalized insights. 
                {!isPersonal && ' Don\'t worry if you don\'t know everything—just fill in what you can!'}
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
                <span className="font-medium">Private & secure—this information stays with you</span>
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
                <strong>New relationship?</strong> No problem! Just share what you know and skip the rest. You can always come back later.
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
          <p className="text-gray-600 text-sm">Basic information to personalize the experience</p>
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
          <p className="text-gray-600 text-sm">Context that helps understand {isPersonal ? 'your' : 'their'} perspective</p>
        </div>
        <BackgroundLifestyle 
          profileType={profileType}
          formData={formData}
          updateFormData={updateFormData}
        />
      </Card>

      {/* Enhanced Continue Button */}
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
