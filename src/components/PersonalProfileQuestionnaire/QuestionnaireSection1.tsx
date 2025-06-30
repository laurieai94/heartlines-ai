
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";

interface QuestionnaireSection1Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection1 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection1Props) => {
  if (!isReady) return null;

  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Trans woman', 'Trans man', 
    'Genderfluid', 'Questioning', 'Prefer to self-describe'
  ];

  const orientationOptions = [
    'Straight/Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 
    'Queer', 'Asexual', 'Questioning', 'Prefer to self-describe'
  ];

  const ageOptions = [
    '18-24', '25-29', '30-34', '35-39', '40-49', '50+'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Who You Are</h3>
        <p className="text-gray-600">Let's start with the basics so RealTalk can personalize your experience</p>
        <p className="text-xs text-green-600">✓ Your answers are automatically saved</p>
      </div>

      {/* Profile Photo */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Add profile photo (Optional)
        </Label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            {profileData.profilePhoto ? (
              <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Upload Photo
            </Button>
            <p className="text-xs text-gray-500">JPG, PNG, max 5MB</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          What should we call you? <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={profileData.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Enter your name"
          className="w-full"
        />
        <p className="text-xs text-gray-500">Used throughout the app for personalization</p>
      </div>

      {/* Age */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What's your age? <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ageOptions.map((age) => (
            <button
              key={age}
              onClick={() => updateField('age', age)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                profileData.age === age
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          How do you identify your gender? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {genderOptions.map((gender) => (
            <button
              key={gender}
              onClick={() => handleMultiSelect('gender', gender)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.gender || []).includes(gender)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Sexual Orientation */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What's your sexual orientation? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {orientationOptions.map((orientation) => (
            <button
              key={orientation}
              onClick={() => handleMultiSelect('sexualOrientation', orientation)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.sexualOrientation || []).includes(orientation)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {orientation}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection1;
