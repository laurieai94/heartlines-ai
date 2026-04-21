
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ConflictStylesProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateField: (field: string, value: string) => void;
}

const ConflictStyles = ({ profileType, formData, updateField }: ConflictStylesProps) => {
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

  const agreementOptions = [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly Agree' }
  ];

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-800 mb-4">Conflict & Stress Patterns</h4>
      
      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          When there's tension or conflict, {pronoun} typically:
        </Label>
        <RadioGroup 
          value={formData.conflictResponse} 
          onValueChange={(value) => updateField('conflictResponse', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Address it directly and quickly" id="conflict-direct" />
            <Label htmlFor="conflict-direct" className="text-sm">Address it directly and quickly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Need time to process first" id="conflict-process" />
            <Label htmlFor="conflict-process" className="text-sm">Need time to process first</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Try to avoid or minimize it" id="conflict-avoid" />
            <Label htmlFor="conflict-avoid" className="text-sm">Try to avoid or minimize it</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Get emotional or overwhelmed" id="conflict-emotional" />
            <Label htmlFor="conflict-emotional" className="text-sm">Get emotional or overwhelmed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Shut down or withdraw" id="conflict-withdraw" />
            <Label htmlFor="conflict-withdraw" className="text-sm">Shut down or withdraw</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          How often {pronoun === 'you' ? 'do you' : 'do they'} need space when stressed?
        </Label>
        <RadioGroup 
          value={formData.stressSpaceNeed} 
          onValueChange={(value) => updateField('stressSpaceNeed', value)}
          className="grid grid-cols-5 gap-2"
        >
          {scaleOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`stress-space-${option.value}`} />
              <Label htmlFor={`stress-space-${option.value}`} className="text-center text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          How often {pronoun === 'you' ? 'do you' : 'do they'} want extra support when stressed?
        </Label>
        <RadioGroup 
          value={formData.stressSupportNeed} 
          onValueChange={(value) => updateField('stressSupportNeed', value)}
          className="grid grid-cols-5 gap-2"
        >
          {scaleOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`stress-support-${option.value}`} />
              <Label htmlFor={`stress-support-${option.value}`} className="text-center text-sm">
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
            <span className="text-sm">Want to dive deeper into conflict and stress patterns? (Optional)</span>
            {expandedSections.deepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t border-gray-200">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              When upset, {pronoun} tend to go silent rather than express feelings
            </Label>
            <RadioGroup 
              value={formData.goSilentWhenUpset} 
              onValueChange={(value) => updateField('goSilentWhenUpset', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`silent-${option.value}`} />
                  <Label htmlFor={`silent-${option.value}`} className="text-center text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You need' : 'They need'} to talk through conflicts immediately, not wait
            </Label>
            <RadioGroup 
              value={formData.needToTalkImmediately} 
              onValueChange={(value) => updateField('needToTalkImmediately', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`immediate-${option.value}`} />
                  <Label htmlFor={`immediate-${option.value}`} className="text-center text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              Being rushed during stressful conversations makes things worse for {pronoun}
            </Label>
            <RadioGroup 
              value={formData.beingRushedMakesWorse} 
              onValueChange={(value) => updateField('beingRushedMakesWorse', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`rushed-${option.value}`} />
                  <Label htmlFor={`rushed-${option.value}`} className="text-center text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block">
              {isPersonal ? 'You feel' : 'They feel'} heard and understood when {isPersonal ? 'your' : 'their'} feelings are validated first
            </Label>
            <RadioGroup 
              value={formData.feelHeardWithValidation} 
              onValueChange={(value) => updateField('feelHeardWithValidation', value)}
              className="grid grid-cols-5 gap-2"
            >
              {agreementOptions.map((option) => (
                <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`validation-${option.value}`} />
                  <Label htmlFor={`validation-${option.value}`} className="text-center text-sm">
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

export default ConflictStyles;
