import { Calendar, CheckCircle } from "lucide-react";
import { ProfileData } from "../NewPersonalQuestionnaire/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StepperAgeCardProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  isComplete: boolean;
  onSectionComplete?: () => void;
}

const StepperAgeCard = ({ profileData, updateField, isComplete }: StepperAgeCardProps) => {
  const ageOptions = [
    '18-22', '23-27', '28-32', '33-37', '38-42', '43-47', '48-52', '53-57', '58-62', '63-67', '68+'
  ];

  const handleAgeSelect = (age: string) => {
    updateField('age', age);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">What's your age range?</CardTitle>
        <p className="text-muted-foreground">This helps us understand your life stage and relationship context</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ageOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={profileData.age === option ? "default" : "outline"}
                onClick={() => handleAgeSelect(option)}
                className="text-sm"
              >
                {option}
              </Button>
            ))}
          </div>
          
          {profileData.age && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4" />
              <span>Age range selected: {profileData.age}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepperAgeCard;