
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface CommunicationStylesProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateField: (field: string, value: string) => void;
}

const CommunicationStyles = ({ profileType, formData, updateField }: CommunicationStylesProps) => {
  const [expandedSections, setExpandedSections] = useState({
    deepDive: false
  });

  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const scaleOptions = [
    { value: '1', label: 'Never' },
    { value: '2', label: 'Rarely' },
    { value: '3', label: 'Sometimes' },
    { value: '4', label: 'Often' },
    { value: '5', label: 'Always' }
  ];

  const directnessOptions = [
    { value: '1', label: 'Very indirect' },
    { value: '2', label: 'Somewhat indirect' },
    { value: '3', label: 'Balanced' },
    { value: '4', label: 'Somewhat direct' },
    { value: '5', label: 'Very direct' }
  ];

  const agreementOptions = [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly Agree' }
  ];

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-800 mb-4">Communication Styles</h4>
      
      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          When {pronoun} need to talk about something important, {pronoun} prefer to:
        </Label>
        <RadioGroup 
          value={formData.importantTalkPreference} 
          onValueChange={(value) => updateField('importantTalkPreference', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Talk right away when it comes up" id="talk-immediate" />
            <Label htmlFor="talk-immediate" className="text-sm">Talk right away when it comes up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Think about it first, then bring it up" id="talk-planned" />
            <Label htmlFor="talk-planned" className="text-sm">Think about it first, then bring it up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Wait for the right moment" id="talk-timing" />
            <Label htmlFor="talk-timing" className="text-sm">Wait for the right moment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Hope it resolves itself" id="talk-avoid" />
            <Label htmlFor="talk-avoid" className="text-sm">Hope it resolves itself</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          How directly does {pronoun === 'you' ? 'do you' : 'do they'} communicate?
        </Label>
        <RadioGroup 
          value={formData.communicationDirectness} 
          onValueChange={(value) => updateField('communicationDirectness', value)}
          className="grid grid-cols-5 gap-2"
        >
          {directnessOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`directness-${option.value}`} />
              <Label htmlFor={`directness-${option.value}`} className="text-center text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          How often {pronoun === 'you' ? 'do you' : 'do they'} express emotions openly?
        </Label>
        <RadioGroup 
          value={formData.emotionExpression} 
          onValueChange={(value) => updateField('emotionExpression', value)}
          className="grid grid-cols-5 gap-2"
        >
          {scaleOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`emotion-${option.value}`} />
              <Label htmlFor={`emotion-${option.value}`} className="text-center text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Deep Dive Optional Questions */}
      <Collapsible open={expandedSections.deepDive} onOpenChange={() => toggleSection('deepDive')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal text-gray-600 hover:text-gray-800">
            <span className="text-sm">Want to dive deeper into communication patterns? (Optional)</span>
            {expandedSections.deepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t border-gray-200">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You need' : 'They need'} time to process thoughts before discussing important topics
            </Label>
            <RadioGroup 
              value={formData.needTimeToProcessDeep} 
              onValueChange={(value) => updateField('needTimeToProcessDeep', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`process-${option.value}`} />
                  <Label htmlFor={`process-${option.value}`} className="text-center text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You prefer' : 'They prefer'} direct, straightforward communication even if it might be uncomfortable
            </Label>
            <RadioGroup 
              value={formData.directCommunicationDeep} 
              onValueChange={(value) => updateField('directCommunicationDeep', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`direct-${option.value}`} />
                  <Label htmlFor={`direct-${option.value}`} className="text-center text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You respond' : 'They respond'} better to gentle approaches rather than direct confrontation
            </Label>
            <RadioGroup 
              value={formData.gentleApproachDeep} 
              onValueChange={(value) => updateField('gentleApproachDeep', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`gentle-${option.value}`} />
                  <Label htmlFor={`gentle-${option.value}`} className="text-center text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CommunicationStyles;
