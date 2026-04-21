
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, HelpCircle, Heart } from "lucide-react";
import { toast } from "sonner";

interface DemographicsPage2Props {
  profileType: 'your' | 'partner';
  onComplete: (data: any) => void;
  onBack: () => void;
  onSkip: () => void;
  initialData: any;
}

const DemographicsPage2 = ({ profileType, onComplete, onBack, onSkip, initialData }: DemographicsPage2Props) => {
  const isPersonal = profileType === 'your';
  
  const [formData, setFormData] = useState({
    familyStructure: initialData.familyStructure || '',
    conflictStyle: initialData.conflictStyle || '',
    familyRelationship: initialData.familyRelationship || '',
    familyInfluence: initialData.familyInfluence || [],
    familyPriorities: initialData.familyPriorities || '',
    majorExperiences: initialData.majorExperiences || [],
    ...initialData
  });

  const familyStructureOptions = [
    'Two parents together',
    'Single parent household',
    'Divorced parents',
    'Stepfamily/blended family',
    'Raised by grandparents/relatives',
    'Other family structure',
    'Prefer not to share'
  ];

  const conflictStyleOptions = [
    'Talked through problems openly',
    'Avoided conflict, kept things peaceful',
    'Argued frequently but worked it out',
    'Argued frequently, never really resolved things',
    'One parent withdrew, one got emotional',
    'Parents weren\'t together',
    'Prefer not to share'
  ];

  const familyRelationshipOptions = [
    'Very close, talk regularly',
    'Close but with healthy boundaries',
    'Cordial but not particularly close',
    'It\'s complicated',
    'Distant or no contact',
    'Prefer not to share'
  ];

  const familyInfluenceOptions = [
    'I want a relationship like my parents had',
    'I want the opposite of what my parents had',
    'I\'m working to unlearn unhealthy patterns',
    'I tend to be very independent',
    'I have trust issues from family experiences',
    'My family made me value communication highly',
    'I\'m still figuring this out',
    'Prefer not to share'
  ];

  const familyPrioritiesOptions = [
    'Achievement and success',
    'Family closeness and loyalty',
    'Financial security',
    'Independence and self-reliance',
    'Religious/traditional values',
    'Personal happiness and expression',
    'Mix of different priorities',
    'Prefer not to share'
  ];

  const majorExperiencesOptions = [
    'Parents\' divorce',
    'Loss of a family member',
    'Financial struggles',
    'Mental health challenges in family',
    'Family wasn\'t emotionally expressive',
    'High-conflict household',
    'Very supportive, stable upbringing',
    'I\'ve worked through family issues in therapy',
    'None of these apply',
    'Prefer not to share'
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
    const required = ['familyStructure', 'conflictStyle', 'familyRelationship', 'familyPriorities'];
    const missing = required.filter(field => !formData[field]);
    
    // Check for family influence (at least one selection)
    if (!formData.familyInfluence || formData.familyInfluence.length === 0) {
      missing.push('familyInfluence');
    }
    
    if (missing.length > 0) {
      toast.error('Please answer all required questions before continuing');
      return false;
    }
    return true;
  };

  const handleComplete = () => {
    if (!validateRequired()) return;
    onComplete(formData);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200 shadow-lg">
        <div className="flex items-start gap-4">
          <Heart className="w-6 h-6 text-orange-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isPersonal ? 'Your' : 'Your Partner\'s'} Family Background
            </h3>
            <p className="text-gray-700 mb-3">
              {isPersonal ? 'Your' : 'Your partner\'s'} family background shapes how {isPersonal ? 'you' : 'they'} approach relationships. 
              These insights help our AI give you more relevant advice about communication, conflict, and connection patterns.
            </p>
            <p className="text-sm text-red-600 font-medium">
              <span className="text-red-500">*</span> All questions in this section are required
            </p>
            {!isPersonal && (
              <div className="flex items-center gap-2 text-sm text-orange-700 mt-2">
                <HelpCircle className="w-4 h-4" />
                <span className="font-medium">Don't know much about their family? Choose "Prefer not to share" for questions you can't answer.</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Section 1: Growing Up */}
      <Card className="p-6 bg-white/95 backdrop-blur-sm border border-orange-100 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Growing Up</h3>

        <div className="space-y-6">
          {/* Family Structure */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              {isPersonal ? 'Your' : 'Their'} family growing up <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {familyStructureOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`family-${option}`}
                    name="familyStructure"
                    value={option}
                    checked={formData.familyStructure === option}
                    onChange={(e) => updateFormData('familyStructure', e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Label htmlFor={`family-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Style */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              How {isPersonal ? 'your' : 'their'} parents handled conflict <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mb-3">This helps us understand how {isPersonal ? 'you' : 'they'} might handle disagreements</p>
            <div className="grid grid-cols-1 gap-3">
              {conflictStyleOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`conflict-${option}`}
                    name="conflictStyle"
                    value={option}
                    checked={formData.conflictStyle === option}
                    onChange={(e) => updateFormData('conflictStyle', e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Label htmlFor={`conflict-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: Family Influence */}
      <Card className="p-6 bg-white/95 backdrop-blur-sm border border-orange-100 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Family Influence</h3>

        <div className="space-y-6">
          {/* Current Relationship */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              {isPersonal ? 'Your' : 'Their'} current relationship with family <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {familyRelationshipOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`relationship-${option}`}
                    name="familyRelationship"
                    value={option}
                    checked={formData.familyRelationship === option}
                    onChange={(e) => updateFormData('familyRelationship', e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Label htmlFor={`relationship-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Family Influence */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              How has {isPersonal ? 'your' : 'their'} family influenced relationships? <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mb-3">Knowing family patterns helps us give better relationship advice (choose at least 1)</p>
            <div className="grid grid-cols-1 gap-3">
              {familyInfluenceOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`influence-${option}`}
                    checked={formData.familyInfluence?.includes(option)}
                    onCheckedChange={() => handleMultiSelect('familyInfluence', option)}
                  />
                  <Label htmlFor={`influence-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3: Background Context */}
      <Card className="p-6 bg-white/95 backdrop-blur-sm border border-orange-100 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Background Context</h3>

        <div className="space-y-6">
          {/* Family Priorities */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              What did {isPersonal ? 'your' : 'their'} family prioritize most? <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {familyPrioritiesOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`priorities-${option}`}
                    name="familyPriorities"
                    value={option}
                    checked={formData.familyPriorities === option}
                    onChange={(e) => updateFormData('familyPriorities', e.target.value)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <Label htmlFor={`priorities-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Major Experiences */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Any major family experiences that shaped {isPersonal ? 'you' : 'them'}? (Optional)
            </Label>
            <p className="text-sm text-gray-600 mb-3">Understanding background helps us provide more thoughtful guidance</p>
            <div className="grid grid-cols-1 gap-3">
              {majorExperiencesOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`experience-${option}`}
                    checked={formData.majorExperiences?.includes(option)}
                    onCheckedChange={() => handleMultiSelect('majorExperiences', option)}
                  />
                  <Label htmlFor={`experience-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tips Section */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold">These questions help our AI understand relationship patterns</h4>
              <p>We use this to provide more personalized advice for your unique situation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold">All answers are completely private</h4>
              <p>This information stays in your profile and helps personalize your experience</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold">You can update these anytime</h4>
              <p>As you grow and change, you can always update your demographics</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-lg px-6 py-3 border-orange-200 hover:bg-orange-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous Page
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-lg px-8 py-3 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Complete Demographics & Start Profile
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemographicsPage2;
