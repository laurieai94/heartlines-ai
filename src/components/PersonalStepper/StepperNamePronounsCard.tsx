import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare } from "lucide-react";
import { ProfileData } from "../NewPersonalQuestionnaire/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface StepperNamePronounsCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onSectionComplete?: () => void;
}

const StepperNamePronounsCard = ({ profileData, updateField, isComplete, onSectionComplete }: StepperNamePronounsCardProps) => {
  const [customPronoun, setCustomPronoun] = useState('');

  const primaryPronounOptions = [
    'She/her', 'He/him', 'They/them', 'She/they', 'He/they', 'Other'
  ];

  // Initialize custom pronoun if it exists and isn't a standard option
  useEffect(() => {
    if (profileData.pronouns && !primaryPronounOptions.includes(profileData.pronouns)) {
      setCustomPronoun(profileData.pronouns);
    }
  }, [profileData.pronouns]);

  const handlePronounSelect = (pronoun: string) => {
    if (pronoun === 'Other') {
      // Keep the field empty when "Other" is selected, let user input custom
      updateField('pronouns', '');
      setCustomPronoun('');
    } else {
      updateField('pronouns', pronoun);
      setCustomPronoun('');
    }
  };

  const handleCustomPronounChange = (value: string) => {
    setCustomPronoun(value);
    updateField('pronouns', value);
  };

  // Generate avatar based on name
  const generateAvatar = () => {
    if (profileData.name && profileData.name.trim()) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
          {profileData.name.charAt(0).toUpperCase()}
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shadow-lg">
        <User className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Let's start with the basics</CardTitle>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {generateAvatar()}
            <div className="flex-1 space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                What's your name?
              </Label>
              <Input
                id="name"
                value={profileData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your name"
                className="text-lg py-3"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">What are your pronouns?</Label>
            <div className="flex flex-wrap gap-2">
              {primaryPronounOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={
                    (primaryPronounOptions.includes(profileData.pronouns || '') ? profileData.pronouns : 'Other') === option
                      ? "default" 
                      : "outline"
                  }
                  onClick={() => handlePronounSelect(option)}
                  className="text-sm"
                >
                  {option}
                </Button>
              ))}
            </div>
            
            {(profileData.pronouns === '' || !primaryPronounOptions.includes(profileData.pronouns || '')) && (
              <div className="space-y-2">
                <Label htmlFor="custom-pronoun" className="text-sm text-muted-foreground">
                  Please specify your pronouns
                </Label>
                <Input
                  id="custom-pronoun"
                  value={customPronoun}
                  onChange={(e) => handleCustomPronounChange(e.target.value)}
                  placeholder="e.g., ze/zir, xe/xem"
                  className="max-w-xs"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepperNamePronounsCard;
