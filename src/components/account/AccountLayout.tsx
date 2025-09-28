import { useState, Suspense, useEffect, lazy } from 'react';
import { User, CreditCard, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load account components for better performance
const AccountSubscription = lazy(() => import('./AccountSubscription'));
const AccountProfile = lazy(() => import('./AccountProfile'));
const AccountSecurity = lazy(() => import('./AccountSecurity'));

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
  const [activeTab, setActiveTab] = useState('profile');
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);

  // Performance tracking
  useEffect(() => {
    performance.mark('account-layout-start');
  }, []);

  // Defer background effects to improve perceived loading speed
  useEffect(() => {
    const deferEffect = () => {
      setShowBackgroundEffects(true);
      performance.mark('account-background-loaded');
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(deferEffect, { timeout: 200 });
    } else {
      setTimeout(deferEffect, 100);
    }
  }, []);

  return (
    <div className="bg-burgundy-900">
      {/* Animated background elements - deferred for performance */}
      {showBackgroundEffects && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-xl md:blur-3xl animate-gradient-shift"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-xl md:blur-3xl animate-gradient-shift-reverse"></div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-4 max-w-3xl">`

        <div className="questionnaire-card p-3 md:p-4 animate-fade-in">
          <div className="text-center mb-3">
            <h1 className="text-lg font-bold text-white mb-1">My Account</h1>
            <p className="text-white/70 text-xs">Manage your profile, subscription, and security settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-3 bg-white/10 backdrop-blur-sm border border-white/20 h-7 gap-0.5 p-0.5">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-1.5 py-0.5 text-[11px] sm:text-xs"
              >
                <User className="h-[14px] w-[14px] mr-1" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-1.5 py-0.5 text-[11px] sm:text-xs"
              >
                <CreditCard className="h-[14px] w-[14px] mr-1" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 px-1.5 py-0.5 text-[11px] sm:text-xs"
              >
                <Shield className="h-[14px] w-[14px] mr-1" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-2.5">
              <Suspense fallback={<TabSkeleton />}>
                <AccountProfile />
              </Suspense>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-2.5">
              <Suspense fallback={<TabSkeleton />}>
                <AccountSubscription />
              </Suspense>
            </TabsContent>

            <TabsContent value="security" className="space-y-2.5">
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