import { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import LoadingState from '@/components/loading/LoadingState';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

const AuthGuard = ({ children, fallbackPath = '/signin' }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  useEffect(() => {
    if (loading) {
      // Extended timeout for mobile devices
      const isMobile = window.innerWidth < 768;
      const timeoutDuration = isMobile ? 12000 : 10000; // 12s for mobile, 10s for desktop
      
      // Progressive loading messages
      const message5s = setTimeout(() => {
        setProgressMessage('Still loading, please wait...');
      }, 5000);
      
      const message8s = setTimeout(() => {
        setProgressMessage('Taking longer than usual...');
        setShowTimeout(true); // Show retry button at 8s
      }, 8000);
      
      const timeoutId = setTimeout(() => {
        console.warn(`[AuthGuard] Loading timeout after ${timeoutDuration/1000}s`);
        setShowTimeout(true);
      }, timeoutDuration);
      
      return () => {
        clearTimeout(message5s);
        clearTimeout(message8s);
        clearTimeout(timeoutId);
      };
    } else {
      setProgressMessage('');
      setShowTimeout(false);
    }
  }, [loading]);

  // Show timeout error if loading too long
  if (loading && showTimeout) {
    return (
      <div className="min-h-screen bg-burgundy-800 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <p className="text-white/90 text-lg">Connection is taking longer than expected</p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              variant="secondary"
              className="w-full"
            >
              Retry
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline"
              className="w-full"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while auth state is being determined
  if (loading && !showTimeout) {
    return <LoadingState variant="spinner" message={progressMessage || "Loading..."} fullScreen />;
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;