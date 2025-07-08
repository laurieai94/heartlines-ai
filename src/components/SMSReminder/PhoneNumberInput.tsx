
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";

interface PhoneNumberInputProps {
  phoneNumber: string;
  isPhoneValid: boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumberInput = ({ phoneNumber, isPhoneValid, onPhoneChange }: PhoneNumberInputProps) => {
  return (
    <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Phone Number</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={phoneNumber}
          onChange={onPhoneChange}
          className={`${isPhoneValid ? 'border-green-500' : ''}`}
        />
        {isPhoneValid && (
          <p className="text-sm text-green-600">✓ Valid phone number</p>
        )}
      </div>
    </Card>
  );
};

export default PhoneNumberInput;
