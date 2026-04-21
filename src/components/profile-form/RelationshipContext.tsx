
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RelationshipContextProps {
  formData: any;
  updateField: (field: string, value: string) => void;
}

const RelationshipContext = ({ formData, updateField }: RelationshipContextProps) => {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-800 mb-4">Relationship Context</h4>
      
      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          How long have you been together?
        </Label>
        <RadioGroup 
          value={formData.relationshipLength} 
          onValueChange={(value) => updateField('relationshipLength', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Less than 6 months" id="length-1" />
            <Label htmlFor="length-1" className="text-sm">Less than 6 months</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6 months - 1 year" id="length-2" />
            <Label htmlFor="length-2" className="text-sm">6 months - 1 year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1-2 years" id="length-3" />
            <Label htmlFor="length-3" className="text-sm">1-2 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2-5 years" id="length-4" />
            <Label htmlFor="length-4" className="text-sm">2-5 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5+ years" id="length-5" />
            <Label htmlFor="length-5" className="text-sm">5+ years</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium text-gray-700 mb-3 block">
          What best describes your relationship status?
        </Label>
        <RadioGroup 
          value={formData.relationshipType} 
          onValueChange={(value) => updateField('relationshipType', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Dating" id="type-1" />
            <Label htmlFor="type-1" className="text-sm">Dating</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="In a relationship (official)" id="type-2" />
            <Label htmlFor="type-2" className="text-sm">In a relationship (official)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Living together" id="type-3" />
            <Label htmlFor="type-3" className="text-sm">Living together</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Engaged" id="type-4" />
            <Label htmlFor="type-4" className="text-sm">Engaged</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Married" id="type-5" />
            <Label htmlFor="type-5" className="text-sm">Married</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Domestic partnership" id="type-6" />
            <Label htmlFor="type-6" className="text-sm">Domestic partnership</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RelationshipContext;
