
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, User, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuestionnaireSection1Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection1 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection1Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUnderageModal, setShowUnderageModal] = useState(false);

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
    'Under 18', '18-24', '25-29', '30-34', '35-39', '40-49', '50+'
  ];

  const handleAgeSelect = (age: string) => {
    if (age === 'Under 18') {
      setShowUnderageModal(true);
      return;
    }
    updateField('age', age);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG or PNG image');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateField('profilePhoto', result);
        setIsUploading(false);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast.error('Failed to upload image');
    }
  };

  const generateAvatar = (name: string) => {
    if (!name) return null;
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 font-medium text-sm">
          💡 Why we ask: These basics help RealTalk give you advice that fits your identity and life stage
        </p>
      </div>

      {/* Underage Modal */}
      {showUnderageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-3xl mb-3">👋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hey there!</h3>
              <p className="text-gray-600 mb-4">
                We love that you're thinking about healthy relationships. RealTalk is designed for adults 18+, 
                but there are amazing age-appropriate resources waiting for you.
              </p>
              <p className="text-gray-600 mb-6">
                Check out Love is Respect for support that's perfect for where you are right now.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                >
                  Visit Love is Respect
                </Button>
                <Button
                  onClick={() => setShowUnderageModal(false)}
                  variant="outline"
                >
                  I'm actually 18+
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Photo Upload Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Add profile photo <span className="text-gray-500 font-normal">(Optional)</span>
          </Label>
          
          <div className="flex items-center gap-4">
            {profileData.profilePhoto ? (
              <img 
                src={profileData.profilePhoto} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : profileData.name ? (
              generateAvatar(profileData.name)
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm transition-colors"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </>
                )}
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG • Max 5MB</p>
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            What should we call you? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={profileData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Your name"
            className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          />
          <p className="text-xs text-gray-500">Used throughout app for personalization</p>
        </div>
      </div>

      {/* Age Selection - Compact Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What's your age? <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {ageOptions.map((age) => (
            <button
              key={age}
              onClick={() => handleAgeSelect(age)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
                profileData.age === age
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Gender - Compact Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          How do you identify your gender? <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {genderOptions.map((gender) => (
            <button
              key={gender}
              onClick={() => handleMultiSelect('gender', gender)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.gender || []).includes(gender)
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
        
        {/* Self-describe text box for gender */}
        {(profileData.gender || []).includes('Prefer to self-describe') && (
          <div className="mt-3">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Please describe your gender identity:
            </Label>
            <Textarea
              value={profileData.genderSelfDescribe || ''}
              onChange={(e) => updateField('genderSelfDescribe', e.target.value)}
              placeholder="How do you identify?"
              className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Sexual Orientation - Compact Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What's your sexual orientation? <span className="text-red-500">*</span>
          <span className="text-rose-600 font-medium text-xs ml-2">✨ Check all that apply</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {orientationOptions.map((orientation) => (
            <button
              key={orientation}
              onClick={() => handleMultiSelect('orientation', orientation)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                (profileData.orientation || []).includes(orientation)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {orientation}
            </button>
          ))}
        </div>
        
        {/* Self-describe text box for orientation */}
        {(profileData.orientation || []).includes('Prefer to self-describe') && (
          <div className="mt-3">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Please describe your sexual orientation:
            </Label>
            <Textarea
              value={profileData.orientationSelfDescribe || ''}
              onChange={(e) => updateField('orientationSelfDescribe', e.target.value)}
              placeholder="How do you identify?"
              className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Progress Message */}
      <div className="text-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
        <p className="text-sm font-medium text-rose-900">
          Great start! 🌟 This helps RealTalk personalize your experience
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection1;
