import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import AccountLayout from '@/components/account/AccountLayout';

const Account = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Navigation handlers for account page
  const handleGoToProfile = (origin?: 'header' | 'chat') => {
    navigate('/?tab=profile');
  };

  const handleGoToCoach = () => {
    navigate('/?tab=insights');
  };

  const handleGoToPartner = () => {
    navigate('/?tab=profile');
    // Dispatch event to open partner questionnaire after navigation
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('dashboard:openPartnerQuestionnaire'));
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen questionnaire-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <NavigationProvider 
      goToProfile={handleGoToProfile} 
      goToCoach={handleGoToCoach} 
      goToPartner={handleGoToPartner}
    >
      <AccountLayout />
    </NavigationProvider>
  );
};

export default Account;