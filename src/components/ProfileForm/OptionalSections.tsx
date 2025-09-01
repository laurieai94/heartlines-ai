
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OptionalSectionsProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateField: (field: string, value: string) => void;
  expandedSections: any;
  toggleSection: (section: string) => void;
}

const OptionalSections = ({ profileType, formData, updateField, expandedSections, toggleSection }: OptionalSectionsProps) => {
  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';
  const possessive = isPersonal ? 'your' : 'their';

  const radioOptions = [
    'Strongly Agree',
    'Agree', 
    'Neutral',
    'Disagree',
    'Strongly Disagree'
  ];

  return (
    <div className="space-y-8">
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
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`family-${option.replace(' ', '-').toLowerCase()}`} />
                  <Label htmlFor={`family-${option.replace(' ', '-').toLowerCase()}`} className="text-sm">{option}</Label>
                </div>
              ))}
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
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`social-${option.replace(' ', '-').toLowerCase()}`} />
                  <Label htmlFor={`social-${option.replace(' ', '-').toLowerCase()}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Optional Growth Areas */}
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
              {isPersonal ? 'You are' : 'They are'} actively focused on improving communication skills (Optional)
            </Label>
            <RadioGroup 
              value={formData.improvingCommunicationFocus} 
              onValueChange={(value) => updateField('improvingCommunicationFocus', value)}
            >
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`communication-${option.replace(' ', '-').toLowerCase()}`} />
                  <Label htmlFor={`communication-${option.replace(' ', '-').toLowerCase()}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You are' : 'They are'} committed to personal development and growth (Optional)
            </Label>
            <RadioGroup 
              value={formData.workingOnPersonalDevelopment} 
              onValueChange={(value) => updateField('workingOnPersonalDevelopment', value)}
            >
              {radioOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`development-${option.replace(' ', '-').toLowerCase()}`} />
                  <Label htmlFor={`development-${option.replace(' ', '-').toLowerCase()}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default OptionalSections;
