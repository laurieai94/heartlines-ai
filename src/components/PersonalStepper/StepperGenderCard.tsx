import { User, CheckCircle } from "lucide-react";
import { ProfileData } from "../NewPersonalQuestionnaire/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface StepperGenderCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onSectionComplete?: () => void;
}

const StepperGenderCard = ({ profileData, updateField, isComplete }: StepperGenderCardProps) => {
  const [customGender, setCustomGender] = useState('');

  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Genderfluid', 'Genderqueer', 'Agender', 'Other'
  ];

  // Initialize custom gender if it exists and isn't a standard option
  useEffect(() => {
    const currentGender = Array.isArray(profileData.gender) ? profileData.gender[0] : profileData.gender;
    if (currentGender && !genderOptions.includes(currentGender)) {
      setCustomGender(currentGender);
    }
  }, [profileData.gender]);

  const handleGenderSelect = (gender: string) => {
    if (gender === 'Other') {
      updateField('gender', []);
      setCustomGender('');
    } else {
      updateField('gender', [gender]);
      setCustomGender('');
    }
  };

  const handleCustomGenderChange = (value: string) => {
    setCustomGender(value);
    updateField('gender', [value]);
  };

  const currentGender = Array.isArray(profileData.gender) ? profileData.gender[0] : profileData.gender;
  const isCustom = currentGender && !genderOptions.includes(currentGender);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">How do you identify in terms of gender?</CardTitle>
        <p className="text-muted-foreground">Understanding your gender identity helps us provide more personalized guidance</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {genderOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  (genderOptions.includes(currentGender || '') ? currentGender : 'Other') === option
                    ? "default" 
                    : "outline"
                }
                onClick={() => handleGenderSelect(option)}
                className="text-sm"
              >
                {option}
              </Button>
            ))}
          </div>
          
          {(!currentGender || isCustom) && (
            <div className="space-y-2">
              <Label htmlFor="custom-gender" className="text-sm text-muted-foreground">
                Please specify your gender identity
              </Label>
              <Input
                id="custom-gender"
                value={customGender}
                onChange={(e) => handleCustomGenderChange(e.target.value)}
                placeholder="Enter your gender identity"
                className="max-w-xs"
              />
            </div>
          )}

          {currentGender && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4" />
              <span>Gender identity: {currentGender}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepperGenderCard;