
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Lock, HelpCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface DemographicsPage1Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  initialData: any;
}

const DemographicsPage1 = ({ profileType, onComplete, initialData }: DemographicsPage1Props) => {
  const isPersonal = profileType === 'your';
  const form = useForm({
    defaultValues: initialData
  });

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

  const pronounOptions = [
    'she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'ze/zir', 'Other', 'Prefer not to share'
  ];

  const ageOptions = [
    '18-22', '23-27', '28-32', '33-37', '38-42', '43-47', '48-52', '53-57', '58-62', '63+', 'Prefer not to share'
  ];

  const orientationOptions = [
    'Straight/Heterosexual', 'Gay/Lesbian', 'Bisexual', 'Pansexual', 'Queer', 'Asexual', 'Demisexual', 'Questioning/Exploring', 'Other', 'Prefer not to share'
  ];

  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Genderfluid', 'Transgender woman', 'Transgender man', 'Agender', 'Two-Spirit', 'Other', 'Prefer not to share'
  ];

  const educationOptions = [
    'High school or equivalent', 'Some college/university', "Associate's degree", "Bachelor's degree", "Master's degree", 'Doctoral degree', 'Trade/vocational training', 'Other', 'Prefer not to share'
  ];

  const workOptions = [
    'Student', 'Working full-time', 'Working part-time', 'Freelance/Contract work', 'Entrepreneur/Business owner', 'Stay-at-home parent', 'Between jobs', 'Retired', 'Unable to work', 'Other', 'Prefer not to share'
  ];

  const incomeOptions = [
    'Under $30,000', '$30,000 - $50,000', '$50,000 - $75,000', '$75,000 - $100,000', '$100,000 - $150,000', '$150,000 - $250,000', 'Over $250,000', 'Prefer not to share'
  ];

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
      const required = ['name', 'pronouns', 'age'];
      const missing = required.filter(field => !formData[field]);
      if (missing.length > 0) {
        toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
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
              <strong>Just met this person?</strong> No worries! All questions are optional. Answer what you know and skip the rest.
            </p>
          </div>
        </Card>
      )}

      {/* Personal Identity Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          About {isPersonal ? 'You' : 'Your Partner'}
          {isPersonal && <span className="text-red-500 text-sm">*Required</span>}
        </h3>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-base font-medium">
              What should we call {isPersonal ? 'you' : 'them'}? {isPersonal && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Enter name or preferred name"
              className="mt-1"
            />
          </div>

          {/* Pronouns */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Pronouns {isPersonal && <span className="text-red-500">*</span>}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pronounOptions.map((pronoun) => (
                <div key={pronoun} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`pronoun-${pronoun}`}
                    name="pronouns"
                    value={pronoun}
                    checked={formData.pronouns === pronoun}
                    onChange={(e) => updateFormData('pronouns', e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <Label htmlFor={`pronoun-${pronoun}`} className="text-sm">
                    {pronoun}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Age Range {isPersonal && <span className="text-red-500">*</span>}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ageOptions.map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`age-${age}`}
                    name="age"
                    value={age}
                    checked={formData.age === age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <Label htmlFor={`age-${age}`} className="text-sm">
                    {age}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Relationship & Orientation Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Relationship Context</h3>

        <div className="space-y-6">
          {/* Sexual Orientation */}
          <div>
            <Label className="text-base font-medium mb-3 block">Sexual Orientation</Label>
            <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {orientationOptions.map((orientation) => (
                <div key={orientation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`orientation-${orientation}`}
                    checked={formData.sexualOrientation?.includes(orientation)}
                    onCheckedChange={() => handleMultiSelect('sexualOrientation', orientation)}
                  />
                  <Label htmlFor={`orientation-${orientation}`} className="text-sm">
                    {orientation}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Identity */}
          <div>
            <Label className="text-base font-medium mb-3 block">Gender Identity</Label>
            <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {genderOptions.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={formData.genderIdentity?.includes(gender)}
                    onCheckedChange={() => handleMultiSelect('genderIdentity', gender)}
                  />
                  <Label htmlFor={`gender-${gender}`} className="text-sm">
                    {gender}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Background & Lifestyle Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Background & Lifestyle</h3>

        <div className="space-y-6">
          {/* Education */}
          <div>
            <Label className="text-base font-medium mb-3 block">Education Level</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {educationOptions.map((education) => (
                <div key={education} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`education-${education}`}
                    name="education"
                    value={education}
                    checked={formData.education === education}
                    onChange={(e) => updateFormData('education', e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <Label htmlFor={`education-${education}`} className="text-sm">
                    {education}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Work Situation */}
          <div>
            <Label className="text-base font-medium mb-3 block">Work Situation</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workOptions.map((work) => (
                <div key={work} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`work-${work}`}
                    name="work"
                    value={work}
                    checked={formData.workSituation === work}
                    onChange={(e) => updateFormData('workSituation', e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <Label htmlFor={`work-${work}`} className="text-sm">
                    {work}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Income */}
          <div>
            <Label className="text-base font-medium mb-3 block">Household Income (Optional)</Label>
            <p className="text-sm text-gray-600 mb-3">Help us understand your financial context for relevant advice</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {incomeOptions.map((income) => (
                <div key={income} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`income-${income}`}
                    name="income"
                    value={income}
                    checked={formData.income === income}
                    onChange={(e) => updateFormData('income', e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <Label htmlFor={`income-${income}`} className="text-sm">
                    {income}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
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
