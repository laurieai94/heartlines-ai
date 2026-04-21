
import { ReactNode } from "react";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BRAND } from "@/branding";
import { Button } from "@/components/ui/button";

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
  const { accessLevel, checkInteractionPermission } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();

  // For full access, allow unrestricted access
  if (accessLevel === 'full-access') {
    return <>{children}</>;
  }

  // For chat actions with profile required, let the chat component handle the nudge
  if (accessLevel === 'profile-required' && user && action === 'chat') {
    return <>{children}</>;
  }

  // For signup required or other access levels with interactions
  const handleInteraction = (e: React.MouseEvent) => {
    if (!action) return;

    if (!checkInteractionPermission(action)) {
      e.preventDefault();
      e.stopPropagation();

      if (accessLevel === 'signup-required') {
        toast.info("Sign in to access all features");
      }
    }
  };

  // For non-chat actions or other access levels, use click blocking
  return (
    <div 
      className={`relative ${className}`}
      onClick={handleInteraction}
    >
      {children}
      {action && !checkInteractionPermission(action) && (
        <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />
      )}
    </div>
  );
};

export default ProgressiveAccessWrapper;
