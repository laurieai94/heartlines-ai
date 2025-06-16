
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Heart, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import DemographicsPage1 from "@/components/Demographics/DemographicsPage1";
import DemographicsPage2 from "@/components/Demographics/DemographicsPage2";

interface DemographicsProps {
  profileType: 'your' | 'partner';
  onComplete: (demographics: any) => void;
  onClose: () => void;
}

const Demographics = ({ profileType, onComplete, onClose }: DemographicsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page1Data, setPage1Data] = useState({});
  const [page2Data, setPage2Data] = useState({});

  const isPersonal = profileType === 'your';
  
  const handlePage1Complete = (data: any) => {
    setPage1Data(data);
    setCurrentPage(2);
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
              <span className="text-sm font-medium text-gray-700">Step {currentPage} of 2</span>
              <span className="text-sm text-gray-500">{currentPage === 1 ? 'Basic Info' : 'Family Background'}</span>
            </div>
            <Progress value={currentPage === 1 ? 50 : 100} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentPage === 1 ? (
            <DemographicsPage1 
              profileType={profileType}
              onComplete={handlePage1Complete}
              initialData={page1Data}
            />
          ) : (
            <DemographicsPage2 
              profileType={profileType}
              onComplete={handlePage2Complete}
              onBack={() => setCurrentPage(1)}
              onSkip={handleSkipToProfile}
              initialData={page2Data}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Demographics;
