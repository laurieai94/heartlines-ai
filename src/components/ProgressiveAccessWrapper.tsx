
import { ReactNode } from "react";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useNavigation } from "@/contexts/NavigationContext";
import { toast } from "sonner";

interface ProgressiveAccessWrapperProps {
  children: ReactNode;
  action?: string;
  fallbackTab?: string;
  className?: string;
}

const ProgressiveAccessWrapper = ({ 
  children, 
  action, 
  fallbackTab = "profile",
  className = ""
}: ProgressiveAccessWrapperProps) => {
  const { accessLevel, checkInteractionPermission, personalProfileReady } = useProgressiveAccess();
  const { goToProfile } = useNavigation();

  const handleInteraction = (e: React.MouseEvent) => {
    // Only prevent default if we have an action to check
    if (!action) return;

    e.preventDefault();
    e.stopPropagation();

    const canProceed = checkInteractionPermission(action);
    
    if (!canProceed) {
      // For chat/insights actions, if personal profile isn't ready, guide to profile
      if ((action === 'chat' || action === 'insights') && !personalProfileReady) {
        const handleProfileClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Use navigation context to switch to profile
          goToProfile();
          
          // Small delay to ensure tab switch completes
          setTimeout(() => {
            toast.dismiss();
          }, 100);
        };

        // Show clickable toast message to go to profile
        toast.info(
          <div className="text-sm">
            Complete your personal profile first to unlock Kai.{' '}
            <button 
              onClick={handleProfileClick}
              className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
            >
              Let's finish your profile.
            </button>
          </div>,
          {
            duration: 6000,
          }
        );
      } else if (accessLevel === 'profile-required') {
        const handleProfileClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Use navigation context to switch to profile
          goToProfile();
          
          // Small delay to ensure tab switch completes
          setTimeout(() => {
            toast.dismiss();
          }, 100);
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
    }
  };

  // Allow full access if personal profile is ready (for chat) or full access level
  if (accessLevel === 'full-access' || (personalProfileReady && (action === 'chat' || action === 'insights'))) {
    return <>{children}</>;
  }

  // For non-full-access users, wrap interactive elements
  return (
    <div 
      className={`relative ${className}`}
      onClick={handleInteraction}
    >
      {children}
      {/* Invisible overlay to catch clicks only if we have an action */}
      {action && <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />}
    </div>
  );
};

export default ProgressiveAccessWrapper;
