
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import DemographicsPage1 from './Demographics/DemographicsPage1';
import DemographicsPage2 from './Demographics/DemographicsPage2';

interface DemographicsProps {
  profileType: 'your' | 'partner';
  onComplete: (demographicsData: any) => void;
  onClose: () => void;
  initialData?: any;
}

const Demographics = ({ profileType, onComplete, onClose, initialData = {} }: DemographicsProps) => {
  const { temporaryDemographics } = useTemporaryProfile();
  
  // Load saved data from temporary storage
  const savedData = temporaryDemographics[profileType] || {};
  const combinedInitialData = { ...savedData, ...initialData };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [page1Data, setPage1Data] = useState(combinedInitialData);
  const [page2Data, setPage2Data] = useState(combinedInitialData);
  const [hasVisited, setHasVisited] = useState({ 
    page1: true, 
    page2: Object.keys(combinedInitialData).length > 0 
  });

  const totalPages = 2;
  const isPersonal = profileType === 'your';
  
  const handlePage1Complete = (data: any) => {
    const updatedData = { ...page1Data, ...data };
    setPage1Data(updatedData);
    setHasVisited(prev => ({ ...prev, page2: true }));
    setCurrentPage(2);
  };

  const handlePage2Complete = (data: any) => {
    const updatedData = { ...page2Data, ...data };
    setPage2Data(updatedData);
    const combinedData = { ...page1Data, ...updatedData };
    onComplete(combinedData);
    toast.success(`${isPersonal ? 'Your' : 'Partner'} demographics completed successfully!`);
  };

  const handleNavigateToPage = (pageNumber: number) => {
    if (hasVisited[`page${pageNumber}` as keyof typeof hasVisited]) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    // Handle skip functionality - for now just go to next page or complete
    if (currentPage === 2) {
      handlePage2Complete({});
    } else {
      setCurrentPage(currentPage + 1);
      setHasVisited(prev => ({ ...prev, page2: true }));
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <DemographicsPage1 
            profileType={profileType}
            onComplete={handlePage1Complete}
            initialData={page1Data}
          />
        );
      case 2:
        return (
          <DemographicsPage2 
            profileType={profileType}
            onComplete={handlePage2Complete}
            onBack={handlePrevPage}
            onSkip={handleSkip}
            initialData={page2Data}
          />
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 1:
        return 'Personal Identity';
      case 2:
        return 'Background & Lifestyle';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#8B2635] via-[#A0334A] to-[#B8405F] backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-sleek border border-white/20">
        {/* Header */}
        <div className="p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 via-pink-50 to-red-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isPersonal ? 'Your' : 'Partner'} Demographics
              </h2>
              <p className="text-gray-600">
                Help us understand {isPersonal ? 'your' : 'their'} background and context
              </p>
              <p className="text-xs text-orange-600 mt-1 font-medium">
                ✓ Your answers are automatically saved as you type
              </p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-white/50">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
              <span className="text-sm text-gray-500">{getPageTitle()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-400 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderCurrentPage()}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 border-t border-orange-100 bg-gradient-to-r from-orange-50/50 to-pink-50/50">
          <div className="flex justify-between items-center">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-2 border-orange-200 hover:bg-orange-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {/* Page Indicators */}
            <div className="flex gap-3 items-center">
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg' 
                        : isCompleted 
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 cursor-pointer' 
                          : isVisited
                            ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : pageNum}
                  </button>
                );
              })}
            </div>

            {/* Placeholder for symmetry */}
            <div className="w-[100px]"></div>
          </div>
          
          {/* Help text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              You can navigate between completed sections using the page indicators above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
