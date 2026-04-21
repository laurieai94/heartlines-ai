
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface LoveLanguagesProps {
  profileType: 'your' | 'partner';
  formData: any;
  handleMultiSelect: (field: string, value: string) => void;
  updateField?: (field: string, value: string) => void;
}

const LoveLanguages = ({ profileType, formData, handleMultiSelect, updateField }: LoveLanguagesProps) => {
  const [expandedSections, setExpandedSections] = useState({
    deepDive: false
  });

  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const loveLanguageOptions = [
    { value: 'Words of Affirmation', label: 'Words of Affirmation', desc: 'Compliments, "I love you," encouragement' },
    { value: 'Quality Time', label: 'Quality Time', desc: 'Focused attention, activities together' },
    { value: 'Physical Touch', label: 'Physical Touch', desc: 'Hugs, hand-holding, cuddling' },
    { value: 'Acts of Service', label: 'Acts of Service', desc: 'Helpful actions, doing things for each other' },
    { value: 'Gifts', label: 'Gifts', desc: 'Thoughtful presents, surprises' }
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
      <h4 className="text-lg font-medium text-gray-800 mb-4">Love Languages</h4>
      
      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          How does {pronoun} best feel loved? (Select up to 2)
        </Label>
        <div className="space-y-3">
          {loveLanguageOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox
                id={`love-${option.value}`}
                checked={formData.loveLanguages?.includes(option.value)}
                onCheckedChange={() => handleMultiSelect('loveLanguages', option.value)}
                disabled={formData.loveLanguages?.length >= 2 && !formData.loveLanguages?.includes(option.value)}
              />
              <div className="flex-1">
                <Label htmlFor={`love-${option.value}`} className="font-medium cursor-pointer text-sm">
                  {option.label}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Optional Questions */}
      {updateField && (
        <Collapsible open={expandedSections.deepDive} onOpenChange={() => toggleSection('deepDive')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal text-gray-600 hover:text-gray-800">
              <span className="text-sm">Want to dive deeper into love languages? (Optional)</span>
              {expandedSections.deepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t border-gray-200">
            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                {isPersonal ? 'You feel' : 'They feel'} most appreciated when receiving verbal compliments and encouragement
              </Label>
              <RadioGroup 
                value={formData.wordsOfAffirmationDeep} 
                onValueChange={(value) => updateField('wordsOfAffirmationDeep', value)}
                className="grid grid-cols-5 gap-2"
              >
                {agreementOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={`words-deep-${option.value}`} />
                    <Label htmlFor={`words-deep-${option.value}`} className="text-center text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                {isPersonal ? 'You prefer' : 'They prefer'} undivided attention over multitasking during quality time
              </Label>
              <RadioGroup 
                value={formData.qualityTimeDeep} 
                onValueChange={(value) => updateField('qualityTimeDeep', value)}
                className="grid grid-cols-5 gap-2"
              >
                {agreementOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={`quality-deep-${option.value}`} />
                    <Label htmlFor={`quality-deep-${option.value}`} className="text-center text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Casual physical touch throughout the day is important to {pronoun}
              </Label>
              <RadioGroup 
                value={formData.physicalTouchDeep} 
                onValueChange={(value) => updateField('physicalTouchDeep', value)}
                className="grid grid-cols-5 gap-2"
              >
                {agreementOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={`touch-deep-${option.value}`} />
                    <Label htmlFor={`touch-deep-${option.value}`} className="text-center text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                {isPersonal ? 'You value' : 'They value'} thoughtful gifts more than expensive ones
              </Label>
              <RadioGroup 
                value={formData.giftsDeep} 
                onValueChange={(value) => updateField('giftsDeep', value)}
                className="grid grid-cols-5 gap-2"
              >
                {agreementOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={`gifts-deep-${option.value}`} />
                    <Label htmlFor={`gifts-deep-${option.value}`} className="text-center text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                When someone helps {pronoun} with practical tasks, it makes {pronoun} feel deeply cared for
              </Label>
              <RadioGroup 
                value={formData.actsOfServiceDeep} 
                onValueChange={(value) => updateField('actsOfServiceDeep', value)}
                className="grid grid-cols-5 gap-2"
              >
                {agreementOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={`service-deep-${option.value}`} />
                    <Label htmlFor={`service-deep-${option.value}`} className="text-center text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default LoveLanguages;
