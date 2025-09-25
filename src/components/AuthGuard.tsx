import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/SplashScreen';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

const AuthGuard = ({ children, fallbackPath = '/auth' }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const [forceTimeout, setForceTimeout] = useState(false);

  // Emergency timeout for mobile - if loading takes too long, show content anyway
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('AuthGuard: Loading timeout reached, forcing authentication check');
        setForceTimeout(true);
      }
    }, 8000); // 8 second timeout for mobile

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Show loading while auth state is being determined (with timeout protection)
  if (loading && !forceTimeout) {
    return <SplashScreen titleText="heartlines loading..." />;
  }

  // If we have a user or forced timeout with cached session, render children
  if (user || (forceTimeout && localStorage.getItem('sb-relqmhrzyqckoaebscgx-auth-token'))) {
    return <>{children}</>;
  }

  // Redirect to auth if not authenticated
  return <Navigate to={fallbackPath} replace />;
};

export default AuthGuard;