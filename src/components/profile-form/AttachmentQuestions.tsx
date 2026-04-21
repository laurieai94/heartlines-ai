
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

  const agreementOptions = [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly Agree' }
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
          className="grid grid-cols-5 gap-2"
        >
          {agreementOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`closeness-${option.value}`} />
              <Label htmlFor={`closeness-${option.value}`} className="text-center text-sm">
                {option.label}
              </Label>
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
          className="grid grid-cols-5 gap-2"
        >
          {agreementOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`worry-${option.value}`} />
              <Label htmlFor={`worry-${option.value}`} className="text-center text-sm">
                {option.label}
              </Label>
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
          className="grid grid-cols-5 gap-2"
        >
          {agreementOptions.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2 p-2 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`fear-${option.value}`} />
              <Label htmlFor={`fear-${option.value}`} className="text-center text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default AttachmentQuestions;
