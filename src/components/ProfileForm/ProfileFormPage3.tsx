
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    
    // Core relationship questions  
    relationshipLength: initialData.relationshipLength || '',
    relationshipType: initialData.relationshipType || '',
    
    // Optional deeper questions
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
  const pronoun = isPersonal ? 'you' : 'they';
  const possessive = isPersonal ? 'your' : 'their';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Core required fields for form validation
  const isFormValid = formData.comfortableClosenessIndependence && 
                     formData.worryRelationshipSecurity && 
                     formData.wantClosenessButFearHurt && 
                     formData.relationshipLength && 
                     formData.relationshipType;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Attachment Style & Growth Areas
        </h3>
        
        {/* Core Attachment Style Questions */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Attachment Patterns</h4>
          
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You are' : 'They are'} comfortable with both closeness and independence in relationships
            </Label>
            <RadioGroup 
              value={formData.comfortableClosenessIndependence} 
              onValueChange={(value) => updateField('comfortableClosenessIndependence', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="closeness-sa" />
                <Label htmlFor="closeness-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="closeness-a" />
                <Label htmlFor="closeness-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="closeness-n" />
                <Label htmlFor="closeness-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="closeness-d" />
                <Label htmlFor="closeness-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="closeness-sd" />
                <Label htmlFor="closeness-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You' : 'They'} often worry about {possessive} relationship security
            </Label>
            <RadioGroup 
              value={formData.worryRelationshipSecurity} 
              onValueChange={(value) => updateField('worryRelationshipSecurity', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="worry-sa" />
                <Label htmlFor="worry-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="worry-a" />
                <Label htmlFor="worry-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="worry-n" />
                <Label htmlFor="worry-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="worry-d" />
                <Label htmlFor="worry-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="worry-sd" />
                <Label htmlFor="worry-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You' : 'They'} want closeness but fear getting hurt
            </Label>
            <RadioGroup 
              value={formData.wantClosenessButFearHurt} 
              onValueChange={(value) => updateField('wantClosenessButFearHurt', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Agree" id="fear-sa" />
                <Label htmlFor="fear-sa">Strongly Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agree" id="fear-a" />
                <Label htmlFor="fear-a">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Neutral" id="fear-n" />
                <Label htmlFor="fear-n">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disagree" id="fear-d" />
                <Label htmlFor="fear-d">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Strongly Disagree" id="fear-sd" />
                <Label htmlFor="fear-sd">Strongly Disagree</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Optional Deeper Attachment Questions */}
          <Collapsible open={expandedSections.attachment} onOpenChange={() => toggleSection('attachment')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal text-gray-600 hover:text-gray-800">
                <span className="text-sm">Want to dive deeper into attachment patterns? (Optional)</span>
                {expandedSections.attachment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t border-gray-200">
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  {isPersonal ? 'You' : 'They'} learned healthy relationship patterns from {possessive} family
                </Label>
                <RadioGroup 
                  value={formData.learnedHealthyFromFamily} 
                  onValueChange={(value) => updateField('learnedHealthyFromFamily', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Agree" id="family-sa" />
                    <Label htmlFor="family-sa">Strongly Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agree" id="family-a" />
                    <Label htmlFor="family-a">Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Neutral" id="family-n" />
                    <Label htmlFor="family-n">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disagree" id="family-d" />
                    <Label htmlFor="family-d">Disagree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Disagree" id="family-sd" />
                    <Label htmlFor="family-sd">Strongly Disagree</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  Social situations make {pronoun} feel anxious
                </Label>
                <RadioGroup 
                  value={formData.socialSituationsAnxious} 
                  onValueChange={(value) => updateField('socialSituationsAnxious', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Agree" id="social-sa" />
                    <Label htmlFor="social-sa">Strongly Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agree" id="social-a" />
                    <Label htmlFor="social-a">Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Neutral" id="social-n" />
                    <Label htmlFor="social-n">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disagree" id="social-d" />
                    <Label htmlFor="social-d">Disagree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Disagree" id="social-sd" />
                    <Label htmlFor="social-sd">Strongly Disagree</Label>
                  </div>
                </RadioGroup>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Core Relationship Context */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Relationship Context</h4>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                How long have you been together?
              </Label>
              <RadioGroup 
                value={formData.relationshipLength} 
                onValueChange={(value) => updateField('relationshipLength', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Less than 6 months" id="length-1" />
                  <Label htmlFor="length-1">Less than 6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6 months - 1 year" id="length-2" />
                  <Label htmlFor="length-2">6 months - 1 year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2 years" id="length-3" />
                  <Label htmlFor="length-3">1-2 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2-5 years" id="length-4" />
                  <Label htmlFor="length-4">2-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+ years" id="length-5" />
                  <Label htmlFor="length-5">5+ years</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                What best describes your relationship status?
              </Label>
              <RadioGroup 
                value={formData.relationshipType} 
                onValueChange={(value) => updateField('relationshipType', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Dating" id="type-1" />
                  <Label htmlFor="type-1">Dating</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="In a relationship" id="type-2" />
                  <Label htmlFor="type-2">In a relationship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Living together" id="type-3" />
                  <Label htmlFor="type-3">Living together</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Engaged" id="type-4" />
                  <Label htmlFor="type-4">Engaged</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Married" id="type-5" />
                  <Label htmlFor="type-5">Married</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Optional Growth Areas */}
        <div className="mt-8">
          <Collapsible open={expandedSections.growth} onOpenChange={() => toggleSection('growth')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal text-gray-600 hover:text-gray-800">
                <span className="text-sm">Tell us about growth and development focus? (Optional)</span>
                {expandedSections.growth ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-800">Strengths & Growth</h4>
              
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  {isPersonal ? 'You are' : 'They are'} actively focused on improving communication skills
                </Label>
                <RadioGroup 
                  value={formData.improvingCommunicationFocus} 
                  onValueChange={(value) => updateField('improvingCommunicationFocus', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Agree" id="communication-sa" />
                    <Label htmlFor="communication-sa">Strongly Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agree" id="communication-a" />
                    <Label htmlFor="communication-a">Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Neutral" id="communication-n" />
                    <Label htmlFor="communication-n">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disagree" id="communication-d" />
                    <Label htmlFor="communication-d">Disagree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Disagree" id="communication-sd" />
                    <Label htmlFor="communication-sd">Strongly Disagree</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  {isPersonal ? 'You are' : 'They are'} committed to personal development and growth
                </Label>
                <RadioGroup 
                  value={formData.workingOnPersonalDevelopment} 
                  onValueChange={(value) => updateField('workingOnPersonalDevelopment', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Agree" id="development-sa" />
                    <Label htmlFor="development-sa">Strongly Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agree" id="development-a" />
                    <Label htmlFor="development-a">Agree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Neutral" id="development-n" />
                    <Label htmlFor="development-n">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disagree" id="development-d" />
                    <Label htmlFor="development-d">Disagree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Strongly Disagree" id="development-sd" />
                    <Label htmlFor="development-sd">Strongly Disagree</Label>
                  </div>
                </RadioGroup>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Page 2
        </Button>
        
        <Button 
          type="submit" 
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4" />
          Complete Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormPage3;
