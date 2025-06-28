
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
      // Redirect to profile tab with friendly message
      toast.info("Let's build your profile first—RealTalk works best when it knows you.", {
        duration: 4000,
      });
      
      // If we're on dashboard, switch to profile tab
      if (window.location.pathname === '/dashboard') {
        const tabsElement = document.querySelector('[data-state="active"]')?.closest('[role="tablist"]');
        const profileTab = tabsElement?.querySelector('[value="profile"]') as HTMLButtonElement;
        profileTab?.click();
      } else {
        // Navigate to dashboard with profile tab
        navigate('/dashboard');
      }
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
