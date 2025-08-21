import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AccountLayout from '@/components/account/AccountLayout';

const Account = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen questionnaire-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <AccountLayout />;
};

export default Account;