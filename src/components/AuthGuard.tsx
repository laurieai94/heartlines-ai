import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

const AuthGuard = ({ children, fallbackPath = '/auth' }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen questionnaire-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;