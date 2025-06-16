
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CommunicationStylesProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateField: (field: string, value: string) => void;
}

const CommunicationStyles = ({ profileType, formData, updateField }: CommunicationStylesProps) => {
  const isPersonal = profileType === 'your';
  const pronoun = isPersonal ? 'you' : 'they';
  const possessive = isPersonal ? 'your' : 'their';

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
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Talk right away when it comes up" id="talk-immediate" />
            <Label htmlFor="talk-immediate">Talk right away when it comes up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Think about it first, then bring it up" id="talk-planned" />
            <Label htmlFor="talk-planned">Think about it first, then bring it up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Wait for the right moment" id="talk-timing" />
            <Label htmlFor="talk-timing">Wait for the right moment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Hope it resolves itself" id="talk-avoid" />
            <Label htmlFor="talk-avoid">Hope it resolves itself</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          {isPersonal ? 'You' : 'They'} tend to express emotions by:
        </Label>
        <RadioGroup 
          value={formData.emotionExpression} 
          onValueChange={(value) => updateField('emotionExpression', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Talking about them directly" id="emotion-direct" />
            <Label htmlFor="emotion-direct">Talking about them directly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Showing through actions" id="emotion-actions" />
            <Label htmlFor="emotion-actions">Showing through actions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Writing or texting" id="emotion-writing" />
            <Label htmlFor="emotion-writing">Writing or texting</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Keeping them private mostly" id="emotion-private" />
            <Label htmlFor="emotion-private">Keeping them private mostly</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default CommunicationStyles;
