
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface PartnerNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PartnerNameInput = ({ value, onChange }: PartnerNameInputProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
      <div>
        <Label className="text-sm font-semibold text-white">
          What should we call them? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal">
          <User className="w-3 h-3 text-rose-400" />
          <span>Their name or whatever you call them</span>
        </div>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter their name..."
        className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-2.5"
      />
    </div>
  );
};

export default PartnerNameInput;
