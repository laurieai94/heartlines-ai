
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
          When stressed, {pronoun} tend to:
        </Label>
        <RadioGroup 
          value={formData.stressResponse} 
          onValueChange={(value) => updateField('stressResponse', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Want extra support and closeness" id="stress-support" />
            <Label htmlFor="stress-support">Want extra support and closeness</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Need space to handle it alone" id="stress-space" />
            <Label htmlFor="stress-space">Need space to handle it alone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Get more irritable or sensitive" id="stress-irritable" />
            <Label htmlFor="stress-irritable">Get more irritable or sensitive</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Become very focused on solutions" id="stress-solutions" />
            <Label htmlFor="stress-solutions">Become very focused on solutions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Shut down emotionally" id="stress-shutdown" />
            <Label htmlFor="stress-shutdown">Shut down emotionally</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ConflictStyles;
