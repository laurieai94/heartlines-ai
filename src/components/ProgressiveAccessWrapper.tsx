
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

  // For signed-in users with incomplete profiles, show overlay
  if (accessLevel === 'profile-required' && user && action === 'chat') {
    return (
      <div className={`relative ${className}`}>
        {children}
        
        {/* Branded overlay for profile completion */}
        <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Let's get {BRAND.name} to know you first
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete your personal profile to unlock personalized insights and coaching from Kai.
              </p>
            </div>
            
            <Button 
              onClick={goToProfile}
              className="w-full"
              size="lg"
            >
              Complete Your Profile
            </Button>
          </div>
        </div>
      </div>
    );
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
