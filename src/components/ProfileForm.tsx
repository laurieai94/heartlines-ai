import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X, Sparkles, Heart, User } from "lucide-react";
import { toast } from "sonner";
import ProfileFormPage1 from "./ProfileForm/ProfileFormPage1";
import ProfileFormPage2 from "./ProfileForm/ProfileFormPage2";
import ProfileFormPage3 from "./ProfileForm/ProfileFormPage3";

interface ProfileFormProps {
  profileType: 'your' | 'partner';
  onComplete: (profileData: any) => void;
  onClose: () => void;
  onBackToDemographics?: () => void;
  initialProfiles?: {your: any[], partner: any[]};
  initialDemographics?: {your: any, partner: any};
}

const ProfileForm = ({ 
  profileType, 
  onComplete, 
  onClose, 
  onBackToDemographics,
  initialProfiles = { your: [], partner: [] }, 
  initialDemographics = { your: null, partner: null } 
}: ProfileFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize form data with existing profile data if available
  const existingProfile = initialProfiles[profileType]?.[0] || {};
  const existingDemographics = initialDemographics[profileType] || {};
  
  // Single state object to maintain all form data across pages
  const [formData, setFormData] = useState({
    ...existingProfile,
    ...existingDemographics
  });
  
  // Allow navigation to any page once we have existing data or user has visited
  const hasExistingData = Object.keys(existingProfile).length > 0;
  const [hasVisited, setHasVisited] = useState({ 
    page1: true, 
    page2: hasExistingData, 
    page3: hasExistingData 
  });

  const totalPages = 3;
  const isPersonal = profileType === 'your';
  
  const handlePage1Complete = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    setHasVisited(prev => ({ ...prev, page2: true }));
    setCurrentPage(2);
  };

  const handlePage2Complete = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    setHasVisited(prev => ({ ...prev, page3: true }));
    setCurrentPage(3);
  };

  const handlePage3Complete = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    onComplete(updatedData);
    toast.success(`${isPersonal ? 'Your' : 'Partner'} profile completed successfully!`);
  };

  const handleNavigateToPage = (pageNumber: number) => {
    // Allow navigation to any visited page
    if (hasVisited[`page${pageNumber}` as keyof typeof hasVisited]) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBackToDemographics = () => {
    if (onBackToDemographics) {
      onBackToDemographics();
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <ProfileFormPage1 
            profileType={profileType}
            onComplete={handlePage1Complete}
            initialData={formData}
          />
        );
      case 2:
        return (
          <ProfileFormPage2 
            profileType={profileType}
            onComplete={handlePage2Complete}
            onBack={handlePrevPage}
            initialData={formData}
          />
        );
      case 3:
        return (
          <ProfileFormPage3 
            profileType={profileType}
            onComplete={handlePage3Complete}
            onBack={handlePrevPage}
            initialData={formData}
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

  const getPageIcon = () => {
    switch (currentPage) {
      case 1:
        return <Heart className="w-4 h-4" />;
      case 2:
        return <Sparkles className="w-4 h-4" />;
      case 3:
        return <Check className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-sleek">
        {/* Enhanced Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {getPageIcon()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isPersonal ? 'Your' : 'Partner'} Relationship Profile
                  </h2>
                  <p className="text-gray-600">
                    Building a complete picture for personalized insights
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Enhanced Progress */}
            <div className="bg-white/70 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Step {currentPage} of {totalPages}</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  {getPageTitle()}
                </span>
              </div>
              <Progress value={(currentPage / totalPages) * 100} className="h-3 bg-gray-200" />
              <div className="text-xs text-gray-500 mt-2 text-center">
                {Math.round((currentPage / totalPages) * 100)}% complete
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-br from-gray-50/50 to-white">
          {renderCurrentPage()}
        </div>

        {/* Enhanced Navigation Footer */}
        <div className="p-6 border-t bg-gray-50/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            {/* Back Button */}
            <div className="flex gap-2">
              {/* Back to Demographics Button - only show if onBackToDemographics is provided */}
              {onBackToDemographics && (
                <Button
                  variant="outline"
                  onClick={handleBackToDemographics}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <User className="w-4 h-4" />
                  Demographics
                </Button>
              )}
              
              {/* Previous Page Button */}
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-2 rounded-xl border-gray-300 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            </div>
            
            {/* Enhanced Page Indicators */}
            <div className="flex gap-2 items-center">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isVisited = hasVisited[`page${pageNum}` as keyof typeof hasVisited];
                const isCurrent = pageNum === currentPage;
                const isCompleted = pageNum < currentPage;
                
                return (
                  <button
                    key={i}
                    onClick={() => handleNavigateToPage(pageNum)}
                    disabled={!isVisited}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
                        : isCompleted 
                          ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:scale-105 shadow-md' 
                          : isVisited
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer hover:scale-105 shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : pageNum}
                  </button>
                );
              })}
            </div>

            {/* Placeholder for symmetry */}
            <div className="w-[100px]"></div>
          </div>
          
          {/* Help text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 bg-white/60 rounded-full px-4 py-2 inline-block">
              💡 You can navigate between completed sections using the indicators above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
