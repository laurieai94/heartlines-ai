
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartnerNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PartnerNameInput = ({ value, onChange }: PartnerNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-white">
        What should we call them? <span className="text-red-400">*</span>
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Their name or nickname..."
        className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-2 h-9 font-medium"
      />
      <p className="text-xs text-white/60">Their name or whatever you call them</p>
    </div>
  );
};

export default PartnerNameInput;
