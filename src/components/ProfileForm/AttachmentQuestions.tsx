
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AttachmentQuestionsProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateField: (field: string, value: string) => void;
}

const AttachmentQuestions = ({ profileType, formData, updateField }: AttachmentQuestionsProps) => {
  const isPersonal = profileType === 'your';
  const possessive = isPersonal ? 'your' : 'their';

  const radioOptions = [
    'Strongly Agree',
    'Agree', 
    'Neutral',
    'Disagree',
    'Strongly Disagree'
  ];

  return (
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
          {radioOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`closeness-${option.replace(' ', '-').toLowerCase()}`} />
              <Label htmlFor={`closeness-${option.replace(' ', '-').toLowerCase()}`}>{option}</Label>
            </div>
          ))}
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
          {radioOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`worry-${option.replace(' ', '-').toLowerCase()}`} />
              <Label htmlFor={`worry-${option.replace(' ', '-').toLowerCase()}`}>{option}</Label>
            </div>
          ))}
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
          {radioOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`fear-${option.replace(' ', '-').toLowerCase()}`} />
              <Label htmlFor={`fear-${option.replace(' ', '-').toLowerCase()}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default AttachmentQuestions;
