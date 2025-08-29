import { useState, Suspense, useEffect } from 'react';
import { ArrowLeft, User, CreditCard, Shield, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import AccountOverview from './AccountOverview';
import AccountSubscription from './AccountSubscription';
import AccountProfile from './AccountProfile';
import AccountSecurity from './AccountSecurity';

const TabSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Skeleton className="h-6 w-48 bg-white/10" />
      <Skeleton className="h-32 w-full bg-white/10" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-6 w-36 bg-white/10" />
      <Skeleton className="h-24 w-full bg-white/10" />
    </div>
  </div>
);

const AccountLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);

  // Defer background effects to improve perceived loading speed
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackgroundEffects(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen questionnaire-bg">
      {/* Animated background elements - deferred for performance */}
      {showBackgroundEffects && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-3xl animate-gradient-shift"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-3xl animate-gradient-shift-reverse"></div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="questionnaire-card p-4 md:p-5 animate-fade-in">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-white mb-1">My Account</h1>
            <p className="text-white/70 text-sm">Manage your profile, subscription, and security settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 bg-white/10 backdrop-blur-sm border border-white/20 h-8 gap-1 p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-2 py-1 text-xs sm:text-sm"
              >
                <Home className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-2 py-1 text-xs sm:text-sm"
              >
                <CreditCard className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-2 py-1 text-xs sm:text-sm"
              >
                <User className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-2 py-1 text-xs sm:text-sm"
              >
                <Shield className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3">
              <Suspense fallback={<TabSkeleton />}>
                <AccountOverview />
              </Suspense>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-3">
              <Suspense fallback={<TabSkeleton />}>
                <AccountSubscription />
              </Suspense>
            </TabsContent>

            <TabsContent value="profile" className="space-y-3">
              <Suspense fallback={<TabSkeleton />}>
                <AccountProfile />
              </Suspense>
            </TabsContent>

            <TabsContent value="security" className="space-y-3">
              <Suspense fallback={<TabSkeleton />}>
                <AccountSecurity />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;