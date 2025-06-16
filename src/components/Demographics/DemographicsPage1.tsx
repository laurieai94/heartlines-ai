
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, HelpCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import PersonalIdentity from "./PersonalIdentity";
import BackgroundLifestyle from "./BackgroundLifestyle";

interface DemographicsPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const DemographicsPage1 = ({ profileType, onComplete, initialData }: DemographicsPage1Props) => {
  const isPersonal = profileType === 'your';
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    pronouns: initialData.pronouns || '',
    age: initialData.age || '',
    sexualOrientation: initialData.sexualOrientation || [],
    genderIdentity: initialData.genderIdentity || [],
    education: initialData.education || '',
    workSituation: initialData.workSituation || '',
    income: initialData.income || '',
    ...initialData
  });

  const updateFormData = (field: string, value: any) => {
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
      if (missing.length > 0) {
        toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
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
    onComplete(formData);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Let's Get the Basics</h3>
            <p className="text-gray-700 mb-3">
              We ask for demographics to give you more relevant insights and ensure our AI works well for people like you. 
              All information stays private and is optional{isPersonal ? '' : '—skip anything you don\'t know about your partner'}.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Lock className="w-4 h-4" />
              <span className="font-medium">This information helps personalize your experience and never leaves your private profile.</span>
            </div>
          </div>
        </div>
      </Card>

      {!isPersonal && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Just met this person?</strong> No worries! Most questions are optional except name. Answer what you know and skip the rest.
            </p>
          </div>
        </Card>
      )}

      {/* Personal Identity Section */}
      <Card className="p-6">
        <PersonalIdentity 
          profileType={profileType}
          formData={formData}
          updateFormData={updateFormData}
          handleMultiSelect={handleMultiSelect}
        />
      </Card>

      {/* Background & Lifestyle Section */}
      <Card className="p-6">
        <BackgroundLifestyle 
          profileType={profileType}
          formData={formData}
          updateFormData={updateFormData}
        />
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-lg px-8 py-3"
        >
          Continue to Family Background
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DemographicsPage1;
