import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import LoadingState from '@/components/loading/LoadingState';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

const AuthGuard = ({ children, fallbackPath = '/auth' }: AuthGuardProps) => {
  const { user, loading } = useAuth();

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