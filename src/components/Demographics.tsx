
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, Shield, User, Heart } from "lucide-react";

interface DemographicsProps {
  profileType: 'your' | 'partner';
  onClose: () => void;
  onComplete: (demographicsData: any) => void;
}

const Demographics = ({ profileType, onClose, onComplete }: DemographicsProps) => {
  const [formData, setFormData] = useState({
    name: "",
    pronouns: "",
    pronounsOther: "",
    age: "",
    sexualOrientation: [] as string[],
    sexualOrientationOther: "",
    genderIdentity: [] as string[],
    genderIdentityOther: "",
    education: "",
    educationOther: "",
    workSituation: "",
    workSituationOther: "",
    householdIncome: ""
  });

  const isPartner = profileType === 'partner';

  const PRONOUNS_OPTIONS = [
    "she/her",
    "he/him", 
    "they/them",
    "she/they",
    "he/they",
    "ze/zir",
    "Other",
    "Prefer not to share"
  ];

  const AGE_OPTIONS = [
    "18-22", "23-27", "28-32", "33-37", "38-42", 
    "43-47", "48-52", "53-57", "58-62", "63+", 
    "Prefer not to share"
  ];

  const SEXUAL_ORIENTATION_OPTIONS = [
    "Straight/Heterosexual",
    "Gay/Lesbian",
    "Bisexual",
    "Pansexual",
    "Queer",
    "Asexual",
    "Demisexual",
    "Questioning/Exploring",
    "Other",
    "Prefer not to share"
  ];

  const GENDER_IDENTITY_OPTIONS = [
    "Woman",
    "Man",
    "Non-binary",
    "Genderfluid",
    "Transgender woman",
    "Transgender man",
    "Agender",
    "Two-Spirit",
    "Other",
    "Prefer not to share"
  ];

  const EDUCATION_OPTIONS = [
    "High school or equivalent",
    "Some college/university",
    "Associate's degree",
    "Bachelor's degree",
    "Master's degree",
    "Doctoral degree",
    "Trade/vocational training",
    "Other",
    "Prefer not to share"
  ];

  const WORK_SITUATION_OPTIONS = [
    "Student",
    "Working full-time",
    "Working part-time",
    "Freelance/Contract work",
    "Entrepreneur/Business owner",
    "Stay-at-home parent",
    "Between jobs",
    "Retired",
    "Unable to work",
    "Other",
    "Prefer not to share"
  ];

  const INCOME_OPTIONS = [
    "Under $30,000",
    "$30,000 - $50,000",
    "$50,000 - $75,000",
    "$75,000 - $100,000",
    "$100,000 - $150,000",
    "$150,000 - $250,000",
    "Over $250,000",
    "Prefer not to share"
  ];

  const handleCheckboxChange = (field: 'sexualOrientation' | 'genderIdentity', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleContinue = () => {
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  {isPartner ? <Heart className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    A Few Quick Details About {isPartner ? 'Your Partner' : 'You'}
                  </h1>
                  <p className="text-gray-600">
                    Help us personalize {isPartner ? 'their' : 'your'} RealTalk experience (2 minutes)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={50} className="w-32" />
                <span className="text-sm text-gray-500">Step 1 of 2</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Introduction */}
          <Card className="p-6 bg-blue-50 border-blue-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Let's Get the Basics</h3>
            <p className="text-gray-700 mb-4">
              We ask for demographics to give {isPartner ? 'them' : 'you'} more relevant insights and ensure our AI works well for people like {isPartner ? 'them' : 'you'}. 
              All information stays private and is optional—skip anything {isPartner ? "you're" : "you're"} not comfortable sharing.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Shield className="w-4 h-4" />
              <span className="font-medium">This information helps personalize the experience and never leaves the private profile.</span>
            </div>
          </Card>

          <div className="space-y-8">
            {/* Personal Identity Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                About {isPartner ? 'Them' : 'You'}
              </h3>
              
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">What should we call {isPartner ? 'them' : 'you'}?</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={`Enter ${isPartner ? 'their' : 'your'} name or preferred name`}
                />
              </div>

              {/* Pronouns */}
              <div className="space-y-3">
                <Label>Pronouns</Label>
                <Select value={formData.pronouns} onValueChange={(value) => setFormData({...formData, pronouns: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pronouns" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRONOUNS_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.pronouns === "Other" && (
                  <Input
                    value={formData.pronounsOther}
                    onChange={(e) => setFormData({...formData, pronounsOther: e.target.value})}
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* Age */}
              <div className="space-y-3">
                <Label>Age</Label>
                <Select value={formData.age} onValueChange={(value) => setFormData({...formData, age: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Relationship & Orientation Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Relationship Context
              </h3>

              {/* Sexual Orientation */}
              <div className="space-y-4">
                <Label>Sexual Orientation</Label>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                  {SEXUAL_ORIENTATION_OPTIONS.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`orientation-${option}`}
                        checked={formData.sexualOrientation.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange('sexualOrientation', option, checked as boolean)}
                      />
                      <Label htmlFor={`orientation-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.sexualOrientation.includes("Other") && (
                  <Input
                    value={formData.sexualOrientationOther}
                    onChange={(e) => setFormData({...formData, sexualOrientationOther: e.target.value})}
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* Gender Identity */}
              <div className="space-y-4">
                <Label>Gender Identity</Label>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                  {GENDER_IDENTITY_OPTIONS.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender-${option}`}
                        checked={formData.genderIdentity.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange('genderIdentity', option, checked as boolean)}
                      />
                      <Label htmlFor={`gender-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.genderIdentity.includes("Other") && (
                  <Input
                    value={formData.genderIdentityOther}
                    onChange={(e) => setFormData({...formData, genderIdentityOther: e.target.value})}
                    placeholder="Please specify"
                  />
                )}
              </div>
            </div>

            {/* Background & Lifestyle Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Background & Lifestyle
              </h3>

              {/* Education */}
              <div className="space-y-3">
                <Label>Education Level</Label>
                <Select value={formData.education} onValueChange={(value) => setFormData({...formData, education: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.education === "Other" && (
                  <Input
                    value={formData.educationOther}
                    onChange={(e) => setFormData({...formData, educationOther: e.target.value})}
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* Work Situation */}
              <div className="space-y-3">
                <Label>Work Situation</Label>
                <Select value={formData.workSituation} onValueChange={(value) => setFormData({...formData, workSituation: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work situation" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_SITUATION_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.workSituation === "Other" && (
                  <Input
                    value={formData.workSituationOther}
                    onChange={(e) => setFormData({...formData, workSituationOther: e.target.value})}
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* Household Income */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Household Income (Optional)</Label>
                  <p className="text-sm text-gray-600">Help us understand {isPartner ? 'their' : 'your'} financial context for relevant advice</p>
                </div>
                <Select value={formData.householdIncome} onValueChange={(value) => setFormData({...formData, householdIncome: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button 
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Continue to {isPartner ? 'Partner' : 'Relationship'} Questions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              Skip for Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Demographics;
