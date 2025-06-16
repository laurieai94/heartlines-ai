
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Heart, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import DemographicsPage1 from "@/components/Demographics/DemographicsPage1";
import DemographicsPage2 from "@/components/Demographics/DemographicsPage2";
import AvatarUpload from "@/components/AvatarUpload";
import { useUserProfile } from "@/hooks/useUserProfile";

interface DemographicsProps {
  profileType: 'your' | 'partner';
  onComplete: (demographics: any) => void;
  onClose: () => void;
}

const Demographics = ({ profileType, onComplete, onClose }: DemographicsProps) => {
  const [currentPage, setCurrentPage] = useState(profileType === 'your' ? 0 : 1); // Start with avatar page for 'your' profile
  const [page1Data, setPage1Data] = useState({});
  const [page2Data, setPage2Data] = useState({});
  const { profile, updateProfile } = useUserProfile();

  const isPersonal = profileType === 'your';
  const totalPages = isPersonal ? 3 : 2; // Add avatar page for personal profile
  
  const handleAvatarComplete = () => {
    setCurrentPage(1);
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    try {
      await updateProfile({ avatar_url: avatarUrl });
      toast.success('Avatar uploaded successfully!');
      handleAvatarComplete();
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  const handlePage1Complete = (data: any) => {
    setPage1Data(data);
    setCurrentPage(isPersonal ? 2 : 2);
  };

  const handlePage2Complete = (data: any) => {
    setPage2Data(data);
    const combinedData = { ...page1Data, ...data };
    onComplete(combinedData);
    toast.success(`${isPersonal ? 'Your' : 'Partner'} demographics saved successfully!`);
  };

  const handleSkipToProfile = () => {
    const combinedData = { ...page1Data, ...page2Data };
    onComplete(combinedData);
  };

  const renderCurrentPage = () => {
    if (isPersonal && currentPage === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Let's add your profile photo
            </h3>
            <p className="text-gray-600 mb-6">
              This helps personalize your chat experience (optional)
            </p>
          </div>
          
          <div className="flex justify-center">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url || undefined}
              onAvatarUpdate={handleAvatarUpdate}
              userName={profile?.name || undefined}
            />
          </div>

          <div className="flex justify-center gap-3 pt-6">
            <Button variant="outline" onClick={handleAvatarComplete}>
              Skip for now
            </Button>
          </div>
        </div>
      );
    }

    const pageNumber = isPersonal ? currentPage : currentPage;
    
    if (pageNumber === 1 || (!isPersonal && pageNumber === 1)) {
      return (
        <DemographicsPage1 
          profileType={profileType}
          onComplete={handlePage1Complete}
          initialData={page1Data}
        />
      );
    } else {
      return (
        <DemographicsPage2 
          profileType={profileType}
          onComplete={handlePage2Complete}
          onBack={() => setCurrentPage(isPersonal ? 1 : 1)}
          onSkip={handleSkipToProfile}
          initialData={page2Data}
        />
      );
    }
  };

  const getPageTitle = () => {
    if (isPersonal && currentPage === 0) return 'Profile Photo';
    if (currentPage === 1 || (!isPersonal && currentPage === 1)) return 'Basic Info';
    return 'Family Background';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-pink-50 to-fuchsia-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPersonal 
                  ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500' 
                  : 'bg-gradient-to-r from-rose-400 to-pink-400'
              }`}>
                {isPersonal ? <User className="w-6 h-6 text-white" /> : <Heart className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  A Few Quick Details About {isPersonal ? 'You' : 'Your Partner'}
                </h2>
                <p className="text-gray-600">
                  {isPersonal 
                    ? "Help us personalize your RealTalk experience (2 minutes)"
                    : "Help us understand your partner for better insights (2 minutes)"
                  }
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Step {currentPage + 1} of {totalPages}</span>
              <span className="text-sm text-gray-500">{getPageTitle()}</span>
            </div>
            <Progress value={((currentPage + 1) / totalPages) * 100} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default Demographics;
