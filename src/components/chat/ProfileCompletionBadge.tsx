import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useOptimizedProfileCompletion } from "@/hooks/useOptimizedProfileCompletion";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";

export const ProfileCompletionBadge = () => {
  const { accessLevel } = useProgressiveAccess();
  const { calculateYourCompletion } = useOptimizedProfileCompletion();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();
  
  // Stable completion with debouncing
  const [stableCompletion, setStableCompletion] = useState(0);
  const completionDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if profile was ever completed
  const [profileEverCompleted, setProfileEverCompleted] = useState(() => {
    return localStorage.getItem('profile_completed') === 'true';
  });
  
  const profileCompletion = useMemo(() => {
    if (accessLevel !== 'profile-required') return 0;
    return calculateYourCompletion();
  }, [accessLevel, calculateYourCompletion]);
  
  // Debounce completion changes
  useEffect(() => {
    if (completionDebounceRef.current) {
      clearTimeout(completionDebounceRef.current);
    }
    
    if (profileCompletion >= stableCompletion) {
      setStableCompletion(profileCompletion);
      
      if (profileCompletion >= 100) {
        setProfileEverCompleted(true);
        localStorage.setItem('profile_completed', 'true');
      }
    } else {
      completionDebounceRef.current = setTimeout(() => {
        setStableCompletion(profileCompletion);
      }, 5000);
    }
    
    return () => {
      if (completionDebounceRef.current) {
        clearTimeout(completionDebounceRef.current);
      }
    };
  }, [profileCompletion, stableCompletion]);
  
  // Only show if profile is incomplete and user is authenticated
  if (accessLevel !== 'profile-required' || !user || stableCompletion >= 100 || profileEverCompleted) {
    return null;
  }
  
  return (
    <button
      onClick={() => goToProfile('chat')}
      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={`Profile ${stableCompletion}% complete - Click to finish`}
    >
      <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
      <span className="text-xs font-semibold text-amber-200">
        {stableCompletion}%
      </span>
      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
          style={{ width: `${stableCompletion}%` }}
        />
      </div>
    </button>
  );
};