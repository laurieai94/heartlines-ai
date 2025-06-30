
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPG or PNG).');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB.');
      }

      // Create a local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      updateField('profilePhoto', localUrl);
      
      toast.success('Photo uploaded successfully! 📸');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error.message || 'Error uploading photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    updateField('profilePhoto', null);
    toast.success('Photo removed');
  };

  const getInitialAvatar = () => {
    if (profileData.name) {
      return profileData.name.charAt(0).toUpperCase();
    }
    return '';
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Who You Are</h3>
          <p className="text-gray-600 text-lg">Let's start with the basics so RealTalk can personalize your experience</p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-full px-4 py-2 mx-auto w-fit">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Your answers are automatically saved
          </div>
        </div>

        {/* Profile Photo */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700">
            Add profile photo <span className="text-gray-500 font-normal">(Optional)</span>
          </Label>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-purple-100 transition-all duration-300 group-hover:ring-purple-200">
                {profileData.profilePhoto ? (
                  <img 
                    src={profileData.profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {getInitialAvatar() || <User className="w-8 h-8" />}
                  </span>
                )}
              </div>
              {profileData.profilePhoto && (
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 relative pointer-events-none bg-white hover:bg-gray-50 border-2 border-purple-200 hover:border-purple-300 text-purple-700 font-medium"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">JPG, PNG, max 5MB</p>
              <p className="text-xs text-gray-400">
                💡 <strong>Why we ask:</strong> Helps personalize your experience and makes coaching feel more connected
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-base font-semibold text-gray-700">
            What should we call you? <span className="text-red-500 text-lg">*</span>
          </Label>
          <Input
            id="name"
            value={profileData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter your name"
            className="text-lg p-4 border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all duration-200"
          />
          <p className="text-sm text-gray-500">Used throughout the app for personalization</p>
          <p className="text-xs text-gray-400">
            💡 <strong>Why we ask:</strong> Makes your coaching experience personal and helps build connection with Kai
          </p>
        </div>

        {/* Age */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700">
            What's your age? <span className="text-red-500 text-lg">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ageOptions.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeSelect(age)}
                className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 hover:scale-105 ${
                  profileData.age === age
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            💡 <strong>Why we ask:</strong> Age influences relationship patterns and helps provide age-appropriate guidance
          </p>
        </div>

        {/* Gender */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700">
            How do you identify your gender? <span className="text-red-500 text-lg">*</span>
          </Label>
          <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {genderOptions.map((gender) => (
              <button
                key={gender}
                onClick={() => handleMultiSelect('gender', gender)}
                className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                  (profileData.gender || []).includes(gender)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            💡 <strong>Why we ask:</strong> Helps us understand your perspective and provide inclusive, relevant guidance
          </p>
        </div>

        {/* Sexual Orientation */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700">
            What's your sexual orientation? <span className="text-red-500 text-lg">*</span>
          </Label>
          <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {orientationOptions.map((orientation) => (
              <button
                key={orientation}
                onClick={() => handleMultiSelect('sexualOrientation', orientation)}
                className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                  (profileData.sexualOrientation || []).includes(orientation)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
                }`}
              >
                {orientation}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            💡 <strong>Why we ask:</strong> Ensures coaching advice is relevant to your relationship experiences and identity
          </p>
        </div>

        {/* Encouraging Progress Message */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-100">
          <div className="text-2xl mb-2">🌟</div>
          <p className="text-lg font-semibold text-purple-900 mb-2">
            You're doing great!
          </p>
          <p className="text-purple-700">
            These details help RealTalk understand how to support you better
          </p>
        </div>
      </div>

      {/* Underage Modal */}
      {showUnderageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-4xl mb-4">👋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Hey there!
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We love that you're thinking about healthy relationships. 
              RealTalk is designed for adults 18+, but there are amazing 
              age-appropriate resources waiting for you.
            </p>
            <p className="text-gray-600 mb-8">
              Check out <strong>Love is Respect</strong> for support that's perfect for where you are right now.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg"
              >
                Visit Love is Respect
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUnderageModal(false)}
                className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 py-3 rounded-xl font-semibold"
              >
                I'm actually 18+
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionnaireSection1;
