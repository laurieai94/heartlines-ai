import { useState, Suspense, useEffect, lazy, useCallback } from 'react';
import { User, CreditCard, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import '@/styles/account-mobile.css';

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
  const { isMobile, simulateHapticFeedback } = useOptimizedMobile();

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
    <div className={`bg-burgundy-900 ${isMobile ? 'account-mobile' : ''}`}>
      {/* Animated background elements - deferred for performance */}
      {showBackgroundEffects && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-xl md:blur-3xl animate-gradient-shift"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-xl md:blur-3xl animate-gradient-shift-reverse"></div>
        </div>
      )}

      <div className={`relative z-10 container mx-auto ${
        isMobile ? 'px-3 py-2' : 'px-4 py-4'
      } max-w-3xl scroll-container`}>

        <div className={`questionnaire-card ${
          isMobile ? 'mobile-card mobile-pad-sm' : 'p-3 md:p-4'
        } animate-fade-in touch-manipulation`}>
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-5'}`}>
            <h1 className={`font-brand text-white ${
              isMobile ? 'text-3xl' : 'text-4xl mb-1'
            }`}>My Account</h1>
            <p className={`text-white/70 ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}>Manage your profile, subscription, and security settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-3 ${
              isMobile ? 'mb-2 h-9' : 'mb-3 h-10 md:h-11'
            } bg-white/10 backdrop-blur-sm border border-white/20 gap-0.5 p-0.5`}>
              <TabsTrigger 
                value="profile"
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 ${
                  isMobile 
                    ? 'px-2 py-2 flex items-center justify-center' 
                    : 'px-3 py-1.5 text-sm'
                } transition-all duration-200 touch-manipulation`}
                onClick={(e) => {
                  if (isMobile && e.currentTarget) {
                    simulateHapticFeedback(e.currentTarget, 'light');
                  }
                }}
              >
                <User className={isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
                <span className={isMobile ? 'sr-only' : 'inline text-sm'}>
                  Profile
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 ${
                  isMobile 
                    ? 'px-2 py-2 flex items-center justify-center' 
                    : 'px-3 py-1.5 text-sm'
                } transition-all duration-200 touch-manipulation`}
                onClick={(e) => {
                  if (isMobile && e.currentTarget) {
                    simulateHapticFeedback(e.currentTarget, 'light');
                  }
                }}
              >
                <CreditCard className={isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
                <span className={isMobile ? 'sr-only' : 'inline text-sm'}>
                  Plans
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70 ${
                  isMobile 
                    ? 'px-2 py-2 flex items-center justify-center' 
                    : 'px-3 py-1.5 text-sm'
                } transition-all duration-200 touch-manipulation`}
                onClick={(e) => {
                  if (isMobile && e.currentTarget) {
                    simulateHapticFeedback(e.currentTarget, 'light');
                  }
                }}
              >
                <Shield className={isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
                <span className={isMobile ? 'sr-only' : 'inline text-sm'}>
                  Security
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent 
              value="profile" 
              className={`${isMobile ? 'safe-bottom' : 'space-y-2.5'} focus:outline-none`}
            >
              <Suspense fallback={<TabSkeleton />}>
                <AccountProfile />
              </Suspense>
            </TabsContent>

            <TabsContent 
              value="subscription" 
              className={`${isMobile ? 'safe-bottom' : 'space-y-2.5'} focus:outline-none`}
            >
              <Suspense fallback={<TabSkeleton />}>
                <AccountSubscription />
              </Suspense>
            </TabsContent>

            <TabsContent 
              value="security" 
              className={`${isMobile ? 'safe-bottom' : 'space-y-2.5'} focus:outline-none`}
            >
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