
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LoveLanguagesProps {
  profileType: 'your' | 'partner';
  formData: any;
  handleMultiSelect: (field: string, value: string) => void;
}

const LoveLanguages = ({ profileType, formData, handleMultiSelect }: LoveLanguagesProps) => {
  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';

  const loveLanguageOptions = [
    { value: 'Words of Affirmation', label: 'Words of Affirmation', desc: 'Compliments, "I love you," encouragement' },
    { value: 'Quality Time', label: 'Quality Time', desc: 'Focused attention, activities together' },
    { value: 'Physical Touch', label: 'Physical Touch', desc: 'Hugs, hand-holding, cuddling' },
    { value: 'Acts of Service', label: 'Acts of Service', desc: 'Helpful actions, doing things for each other' },
    { value: 'Gifts', label: 'Gifts', desc: 'Thoughtful presents, surprises' }
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
                <Label htmlFor={`love-${option.value}`} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveLanguages;
