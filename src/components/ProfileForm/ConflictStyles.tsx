
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ConflictStylesProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateField: (field: string, value: string) => void;
}

const ConflictStyles = ({ profileType, formData, updateField }: ConflictStylesProps) => {
  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';

  const scaleOptions = [
    { value: '1', label: 'Never' },
    { value: '2', label: 'Rarely' },
    { value: '3', label: 'Sometimes' },
    { value: '4', label: 'Often' },
    { value: '5', label: 'Always' }
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
            <Label htmlFor="conflict-direct">Address it directly and quickly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Need time to process first" id="conflict-process" />
            <Label htmlFor="conflict-process">Need time to process first</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Try to avoid or minimize it" id="conflict-avoid" />
            <Label htmlFor="conflict-avoid">Try to avoid or minimize it</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Get emotional or overwhelmed" id="conflict-emotional" />
            <Label htmlFor="conflict-emotional">Get emotional or overwhelmed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Shut down or withdraw" id="conflict-withdraw" />
            <Label htmlFor="conflict-withdraw">Shut down or withdraw</Label>
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
    </div>
  );
};

export default ConflictStyles;
