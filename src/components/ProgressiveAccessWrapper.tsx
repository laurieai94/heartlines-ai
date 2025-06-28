
import { ReactNode } from "react";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProgressiveAccessWrapperProps {
  children: ReactNode;
  action: string;
  fallbackTab?: string;
  className?: string;
}

const ProgressiveAccessWrapper = ({ 
  children, 
  action, 
  fallbackTab = "profile",
  className = ""
}: ProgressiveAccessWrapperProps) => {
  const { accessLevel, checkInteractionPermission } = useProgressiveAccess();
  const navigate = useNavigate();

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const canProceed = checkInteractionPermission(action);
    
    if (!canProceed && accessLevel === 'profile-required') {
      const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Direct tab switching without URL manipulation
        const profileTab = document.querySelector('[data-state="inactive"][value="profile"]') as HTMLButtonElement;
        if (profileTab) {
          profileTab.click();
        } else {
          // Fallback: try to find any profile tab
          const allTabs = document.querySelectorAll('[value="profile"]') as NodeListOf<HTMLButtonElement>;
          if (allTabs.length > 0) {
            allTabs[0].click();
          }
        }
        
        toast.dismiss();
      };

      // Show clickable toast message to go to profile
      toast.info(
        <div className="text-sm">
          RealTalk works best when it knows you.{' '}
          <button 
            onClick={handleProfileClick}
            className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
          >
            Let's build your profile first.
          </button>
        </div>,
        {
          duration: 6000,
        }
      );
    }
  };

  if (accessLevel === 'full-access') {
    return <>{children}</>;
  }

  // For non-full-access users, wrap interactive elements
  return (
    <div 
      className={`relative ${className}`}
      onClick={handleInteraction}
    >
      {children}
      {/* Invisible overlay to catch clicks */}
      <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />
    </div>
  );
};

export default ProgressiveAccessWrapper;
