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

  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        console.warn('[AuthGuard] Loading timeout after 5s');
        setShowTimeout(true);
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading]);

  // Show timeout error if loading too long
  if (loading && showTimeout) {
    return (
      <div className="min-h-screen bg-burgundy-900 flex items-center justify-center p-6">
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
  if (loading) {
    return <LoadingState variant="spinner" message="Loading..." fullScreen />;
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;