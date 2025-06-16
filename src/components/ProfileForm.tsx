
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
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

  const handleBackToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
            onBack={() => handleBackToPage(1)}
            initialData={page2Data}
          />
        );
      case 3:
        return (
          <ProfileFormPage3 
            profileType={profileType}
            onComplete={handlePage3Complete}
            onBack={() => handleBackToPage(2)}
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
                Help Kai understand {isPersonal ? 'your' : 'their'} patterns and preferences
              </p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
              <span className="text-sm text-gray-500">{getPageTitle()}</span>
            </div>
            <Progress value={(currentPage / totalPages) * 100} className="h-3" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderCurrentPage()}
        </div>

        {/* Enhanced Navigation Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => handleBackToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentPage > 1 ? `Back to Page ${currentPage - 1}` : 'Back'}
            </Button>
            
            {/* Page Indicators */}
            <div className="flex gap-3 items-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleBackToPage(i + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    i + 1 === currentPage 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : i + 1 < currentPage 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  disabled={i + 1 > currentPage}
                >
                  {i + 1 < currentPage ? <Check className="w-4 h-4" /> : i + 1}
                </button>
              ))}
            </div>

            {/* Next/Complete Button Placeholder */}
            <div className="w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
