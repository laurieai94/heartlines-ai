import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, Shield, User, Heart, Info } from "lucide-react";

interface DemographicsProps {
  profileType: 'your' | 'partner';
  onClose: () => void;
  onComplete: (demographicsData: any) => void;
}

const Demographics = ({ profileType, onClose, onComplete }: DemographicsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1 - Basic Demographics
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
    householdIncome: "",
    // Page 2 - Family Background
    familyStructure: "",
    parentConflictStyle: "",
    familyRelationship: "",
    familyInfluence: [] as string[],
    familyPriorities: "",
    majorExperiences: [] as string[]
  });

  const isPartner = profileType === 'partner';
  const totalPages = 2;
  const progressValue = (currentPage / totalPages) * 100;

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

  const FAMILY_STRUCTURE_OPTIONS = [
    "Two parents together",
    "Single parent household",
    "Divorced parents",
    "Stepfamily/blended family",
    "Raised by grandparents/relatives",
    "Other family structure",
    "Prefer not to share"
  ];

  const PARENT_CONFLICT_OPTIONS = [
    "Talked through problems openly",
    "Avoided conflict, kept things peaceful",
    "Argued frequently but worked it out",
    "Argued frequently, never really resolved things",
    "One parent withdrew, one got emotional",
    "Parents weren't together",
    "Prefer not to share"
  ];

  const FAMILY_RELATIONSHIP_OPTIONS = [
    "Very close, talk regularly",
    "Close but with healthy boundaries",
    "Cordial but not particularly close",
    "It's complicated",
    "Distant or no contact",
    "Prefer not to share"
  ];

  const FAMILY_INFLUENCE_OPTIONS = [
    "I want a relationship like my parents had",
    "I want the opposite of what my parents had",
    "I'm working to unlearn unhealthy patterns",
    "I tend to be very independent",
    "I have trust issues from family experiences",
    "My family made me value communication highly",
    "I'm still figuring this out",
    "Prefer not to share"
  ];

  const FAMILY_PRIORITIES_OPTIONS = [
    "Achievement and success",
    "Family closeness and loyalty",
    "Financial security",
    "Independence and self-reliance",
    "Religious/traditional values",
    "Personal happiness and expression",
    "Mix of different priorities",
    "Prefer not to share"
  ];

  const MAJOR_EXPERIENCES_OPTIONS = [
    "Parents' divorce",
    "Loss of a family member",
    "Financial struggles",
    "Mental health challenges in family",
    "Family wasn't emotionally expressive",
    "High-conflict household",
    "Very supportive, stable upbringing",
    "I've worked through family issues in therapy",
    "None of these apply",
    "Prefer not to share"
  ];

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const handleSkip = () => {
    onComplete({});
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
                  {currentPage === 1 ? (
                    <p className="text-gray-600">
                      Help us personalize {isPartner ? 'their' : 'your'} RealTalk experience (2 minutes)
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Family Background - Help us understand {isPartner ? 'their' : 'your'} relationship patterns (1-2 minutes)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={progressValue} className="w-32" />
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {currentPage === 1 && (
            <>
              {/* Introduction */}
              <Card className="p-6 bg-blue-50 border-blue-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Let's Get the Basics</h3>
                <p className="text-gray-700 mb-4">
                  We ask for demographics to give {isPartner ? 'them' : 'you'} more relevant insights and ensure our AI works well for people like {isPartner ? 'them' : 'you'}. 
                  All information stays private and is optional—skip anything {isPartner ? "you're" : "you're"} not comfortable sharing.
                </p>
                {isPartner && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mb-3">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Just met this person? No worries! All questions are totally optional if you don't know the answers yet.</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">This information helps personalize the experience and never leaves the private profile.</span>
                </div>
              </Card>

              <div className="space-y-8">
                {/* Personal Identity Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    About {isPartner ? 'Them' : 'You'} <span className="text-sm font-normal text-gray-500">(All Optional)</span>
                  </h3>
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">What should we call {isPartner ? 'them' : 'you'}? <span className="text-gray-500">(Optional)</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={`Enter ${isPartner ? 'their' : 'your'} name or preferred name`}
                    />
                  </div>

                  {/* Pronouns */}
                  <div className="space-y-3">
                    <Label>Pronouns <span className="text-gray-500">(Optional)</span></Label>
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
                    <Label>Age <span className="text-gray-500">(Optional)</span></Label>
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
                    Relationship Context <span className="text-sm font-normal text-gray-500">(All Optional)</span>
                  </h3>

                  {/* Sexual Orientation */}
                  <div className="space-y-4">
                    <Label>Sexual Orientation <span className="text-gray-500">(Optional)</span></Label>
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
                    <Label>Gender Identity <span className="text-gray-500">(Optional)</span></Label>
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
                    Background & Lifestyle <span className="text-sm font-normal text-gray-500">(All Optional)</span>
                  </h3>

                  {/* Education */}
                  <div className="space-y-3">
                    <Label>Education Level <span className="text-gray-500">(Optional)</span></Label>
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
                    <Label>Work Situation <span className="text-gray-500">(Optional)</span></Label>
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
                  onClick={handleNextPage}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Continue to Family Background
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={handleSkip}>
                  Skip Demographics
                </Button>
              </div>
            </>
          )}

          {currentPage === 2 && (
            <>
              {/* Family Background Introduction */}
              <Card className="p-6 bg-green-50 border-green-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Background</h3>
                <p className="text-gray-700 mb-4">
                  {isPartner ? 'Their' : 'Your'} family background shapes how {isPartner ? 'they approach' : 'you approach'} relationships. 
                  These insights help our AI give {isPartner ? 'them' : 'you'} more relevant advice about communication, conflict, and connection patterns.
                </p>
                {isPartner && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mb-3">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Don't know much about their family yet? That's totally normal! Skip anything you're unsure about.</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">All answers are optional and completely private. You can update these anytime.</span>
                </div>
              </Card>

              <div className="space-y-8">
                {/* Growing Up Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Growing Up <span className="text-sm font-normal text-gray-500">(All Optional)</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        {isPartner ? 'Their' : 'Your'} family growing up <span className="text-gray-500">(Optional)</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-3">This helps us understand {isPartner ? 'their' : 'your'} relationship patterns</p>
                    </div>
                    <RadioGroup 
                      value={formData.familyStructure} 
                      onValueChange={(value) => setFormData({...formData, familyStructure: value})}
                      className="grid grid-cols-1 gap-3"
                    >
                      {FAMILY_STRUCTURE_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`family-${option}`} />
                          <Label htmlFor={`family-${option}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        How {isPartner ? 'their' : 'your'} parents handled conflict <span className="text-gray-500">(Optional)</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-3">This helps us understand how {isPartner ? 'they might' : 'you might'} handle disagreements</p>
                    </div>
                    <RadioGroup 
                      value={formData.parentConflictStyle} 
                      onValueChange={(value) => setFormData({...formData, parentConflictStyle: value})}
                      className="grid grid-cols-1 gap-3"
                    >
                      {PARENT_CONFLICT_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`conflict-${option}`} />
                          <Label htmlFor={`conflict-${option}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Family Influence Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Family Influence <span className="text-sm font-normal text-gray-500">(All Optional)</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        {isPartner ? 'Their' : 'Your'} current relationship with family <span className="text-gray-500">(Optional)</span>
                      </Label>
                    </div>
                    <RadioGroup 
                      value={formData.familyRelationship} 
                      onValueChange={(value) => setFormData({...formData, familyRelationship: value})}
                      className="grid grid-cols-1 gap-3"
                    >
                      {FAMILY_RELATIONSHIP_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`relationship-${option}`} />
                          <Label htmlFor={`relationship-${option}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        How has {isPartner ? 'their' : 'your'} family influenced {isPartner ? 'them' : 'you'}? <span className="text-gray-500">(Optional)</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-3">Choose up to 2 - knowing {isPartner ? 'their' : 'your'} family patterns helps us give better relationship advice</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
                      {FAMILY_INFLUENCE_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`influence-${option}`}
                            checked={formData.familyInfluence.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked && formData.familyInfluence.length < 2) {
                                handleCheckboxChange('familyInfluence', option, checked as boolean);
                              } else if (!checked) {
                                handleCheckboxChange('familyInfluence', option, checked as boolean);
                              }
                            }}
                            disabled={!formData.familyInfluence.includes(option) && formData.familyInfluence.length >= 2}
                          />
                          <Label htmlFor={`influence-${option}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background Context Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Background Context <span className="text-sm font-normal text-gray-500">(All Optional)</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        What did {isPartner ? 'their' : 'your'} family prioritize most? <span className="text-gray-500">(Optional)</span>
                      </Label>
                    </div>
                    <RadioGroup 
                      value={formData.familyPriorities} 
                      onValueChange={(value) => setFormData({...formData, familyPriorities: value})}
                      className="grid grid-cols-1 gap-3"
                    >
                      {FAMILY_PRIORITIES_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`priorities-${option}`} />
                          <Label htmlFor={`priorities-${option}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        Any major family experiences that shaped {isPartner ? 'them' : 'you'}? <span className="text-gray-500">(Optional)</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-3">Understanding {isPartner ? 'their' : 'your'} background helps us provide more thoughtful guidance</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
                      {MAJOR_EXPERIENCES_OPTIONS.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`experience-${option}`}
                            checked={formData.majorExperiences.includes(option)}
                            onCheckedChange={(checked) => handleCheckboxChange('majorExperiences', option, checked as boolean)}
                          />
                          <Label htmlFor={`experience-${option}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={handlePrevPage} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Page
                </Button>
                <Button 
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Complete Demographics & Start Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={handleSkip}>
                  Skip and Start Profile
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Demographics;
