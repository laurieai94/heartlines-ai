import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileHeaderVisibilityProvider } from '@/contexts/MobileHeaderVisibilityContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignInClick = () => {
    navigate('/auth');
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'home':
        navigate('/');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'insights':
        navigate('/coach');
        break;
      case 'privacy':
        navigate('/privacy');
        break;
      case 'pricing':
        navigate('/pricing');
        break;
      case 'mission':
        navigate('/mission');
        break;
      case 'account':
        navigate('/account');
        break;
    }
  };

  // Determine active tab based on current location
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/profile') return 'profile';
    if (path === '/coach') return 'insights';
    if (path === '/privacy') return 'privacy';
    if (path === '/pricing') return 'pricing';
    if (path === '/mission') return 'mission';
    if (path === '/account') return 'account';
    return '';
  };

  return (
    <MobileHeaderVisibilityProvider>
      <div className="min-h-screen bg-burgundy-900">
        <DashboardHeader 
          accessLevel="free"
          profileCompletion={0}
          user={user}
          activeTab={getActiveTab()}
          onValueChange={handleTabChange}
          onSignInClick={handleSignInClick}
          currentPath={location.pathname}
        />
        {children}
      </div>
    </MobileHeaderVisibilityProvider>
  );
};

export default AppLayout;