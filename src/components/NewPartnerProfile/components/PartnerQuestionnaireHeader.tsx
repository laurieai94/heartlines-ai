import { X, RotateCcw, Trash2 } from "lucide-react";
import { PartnerProfileData } from "../types";
import { refreshPartnerProfile } from "@/utils/globalRefresh";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PartnerQuestionnaireHeaderProps {
  overallProgress: number;
  onClose: () => void;
  profileData: PartnerProfileData;
  onDelete?: () => void;
  canDelete?: boolean;
}

const getInitial = (profileData: PartnerProfileData): string | null => {
  if (profileData.partnerName && profileData.partnerName.trim()) {
    return profileData.partnerName.trim()[0].toLowerCase();
  }
  return null;
};

const PartnerQuestionnaireHeader = ({ overallProgress, onClose, profileData, onDelete, canDelete = true }: PartnerQuestionnaireHeaderProps) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const hasName = profileData.partnerName && profileData.partnerName.trim();
  
  const getProfileTitle = () => {
    if (hasName) {
      return `${profileData.partnerName.trim()}'s profile`;
    }
    return "partner profile";
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPartnerProfile();
      toast({
        title: "Profile refreshed",
        description: "Partner profile data has been updated."
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh profile data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border-b border-white/[0.06] px-3 py-0.5 sm:px-4 sm:py-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-0.5 sm:mb-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white truncate">{getProfileTitle()}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-2 flex-shrink-0">
          <span className="text-sm sm:text-sm text-white/60 font-medium">{overallProgress}%</span>
          
          {/* Delete button with confirmation dialog */}
          {onDelete && canDelete && (
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <button
                  className="text-white/60 hover:text-red-400 w-6 h-6 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                  aria-label="Delete profile"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-burgundy-800 border-white/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete this partner profile?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    This action cannot be undone. All data for this partner profile will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white/60 hover:text-white w-6 h-6 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation disabled:opacity-50"
            aria-label="Refresh profile"
          >
            <RotateCcw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 transition-all duration-200 hover:scale-105 touch-manipulation"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar - larger on desktop/tablet */}
      <div className="w-full h-1 sm:h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;