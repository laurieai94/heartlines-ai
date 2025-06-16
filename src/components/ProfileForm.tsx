
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ProfileFormPage1 from "./ProfileForm/ProfileFormPage1";
import ProfileFormPage2 from "./ProfileForm/ProfileFormPage2";
import ProfileFormPage3 from "./ProfileForm/ProfileFormPage3";

interface ProfileFormProps {
  profileType: 'your' | 'partner';
  onComplete: (profileData: any) => void;
  onClose: () => void;
}

const ProfileForm = ({ profileType, onComplete, onClose }: ProfileFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page1Data, setPage1Data] = useState({});
  const [page2Data, setPage2Data] = useState({});
  const [page3Data, setPage3Data] = useState({});

  const totalPages = 3;
  const isPersonal = profileType === 'your';
  
  const handlePage1Complete = (data: any) => {
    setPage1Data(data);
    setCurrentPage(2);
  };

  const handlePage2Complete = (data: any) => {
    setPage2Data(data);
    setCurrentPage(3);
  };

  const handlePage3Complete = (data: any) => {
    setPage3Data(data);
    const combinedData = { ...page1Data, ...page2Data, ...data };
    onComplete(combinedData);
    toast.success(`${isPersonal ? 'Your' : 'Partner'} profile completed successfully!`);
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <ProfileFormPage1 
            profileType={profileType}
            onComplete={handlePage1Complete}
            initialData={page1Data}
          />
        );
      case 2:
        return (
          <ProfileFormPage2 
            profileType={profileType}
            onComplete={handlePage2Complete}
            onBack={handleBack}
            initialData={page2Data}
          />
        );
      case 3:
        return (
          <ProfileFormPage3 
            profileType={profileType}
            onComplete={handlePage3Complete}
            onBack={handleBack}
            initialData={page3Data}
          />
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 1:
        return 'Communication & Love Languages';
      case 2:
        return 'Conflict & Stress Patterns';
      case 3:
        return 'Attachment & Growth Areas';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isPersonal ? 'Your' : 'Partner'} Relationship Profile
              </h2>
              <p className="text-gray-600">
                Help Dr. Sam understand {isPersonal ? 'your' : 'their'} patterns and preferences
              </p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
              <span className="text-sm text-gray-500">{getPageTitle()}</span>
            </div>
            <Progress value={(currentPage / totalPages) * 100} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderCurrentPage()}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 === currentPage ? 'bg-purple-500' : 
                  i + 1 < currentPage ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
