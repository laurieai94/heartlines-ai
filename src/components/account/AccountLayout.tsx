import { useState, Suspense, useEffect, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, CreditCard, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import '@/styles/account-mobile.css';

// Lazy load account components for progressive loading on mobile
const AccountProfile = lazy(() => import('./AccountProfile'));
const AccountSubscription = lazy(() => import('./AccountSubscription'));
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
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'profile');
  const [showBackgroundEffects, setShowBackgroundEffects] = useState(false);
  const { isMobile } = useOptimizedMobile();

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['profile', 'subscription', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Performance tracking (development only)
  useEffect(() => {
    if (!import.meta.env.PROD) {
      performance.mark('account-layout-start');
    }
  }, []);

  // Defer background effects to improve perceived loading speed
  useEffect(() => {
    const deferEffect = () => {
      setShowBackgroundEffects(true);
      if (!import.meta.env.PROD) {
        performance.mark('account-background-loaded');
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(deferEffect, { timeout: 200 });
    } else {
      setTimeout(deferEffect, 100);
    }
  }, []);

  return (
    <div className={`bg-burgundy-800 ${isMobile ? 'account-mobile' : ''}`}>
      {/* Animated background elements - desktop only for performance */}
      {showBackgroundEffects && !isMobile && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-md animate-gradient-shift"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-md animate-gradient-shift-reverse"></div>
        </div>
      )}

      <div className={`relative z-10 container mx-auto pb-40 ${
        isMobile ? 'px-4 pt-24' : 'px-4 pt-20 lg:pt-24'
      } ${isMobile ? 'max-w-3xl' : 'max-w-4xl'}`}>

        <div className={`questionnaire-card ${
          isMobile ? 'mobile-card p-4' : 'p-3 md:p-4'
        } animate-fade-in touch-manipulation`}>
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-4'}`}>
            <h1 
              className={`font-brand bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider ${
                isMobile ? 'text-3xl mb-1' : 'text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl mb-4'
              }`}
              style={{
                textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
              }}
            >
              my account
            </h1>
            <p className={`text-white/70 ${
              isMobile ? 'text-xs leading-snug' : 'text-xs'
            }`}>manage your profile, subscription, and security settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-3 ${
              isMobile ? 'mb-3 h-11' : 'mb-3 h-10 md:h-11'
            } bg-white/10 backdrop-blur-sm border border-white/20 gap-0.5 p-0.5 overflow-hidden`}>
              <TabsTrigger 
                value="profile"
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400/90 data-[state=active]:to-coral-400/90 data-[state=active]:text-white text-white/70 ${
                  isMobile 
                    ? 'h-full px-2 flex items-center justify-center rounded-sm' 
                    : 'px-3 py-1.5 text-sm'
                } transition-all duration-200 touch-manipulation`}
              >
                <User className={isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
                <span className={isMobile ? 'sr-only' : 'inline text-sm'}>
                  profile
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400/90 data-[state=active]:to-coral-400/90 data-[state=active]:text-white text-white/70 ${
                  isMobile 
                    ? 'h-full px-2 flex items-center justify-center rounded-sm' 
                    : 'px-3 py-1.5 text-sm'
                } transition-all duration-200 touch-manipulation`}
              >
                <CreditCard className={isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
                <span className={isMobile ? 'sr-only' : 'inline text-sm'}>
                  plans
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400/90 data-[state=active]:to-coral-400/90 data-[state=active]:text-white text-white/70 ${
                  isMobile 
                    ? 'h-full px-2 flex items-center justify-center rounded-sm' 
                    : 'px-3 py-1.5 text-sm'
                } transition-all duration-200 touch-manipulation`}
              >
                <Shield className={isMobile ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
                <span className={isMobile ? 'sr-only' : 'inline text-sm'}>
                  security
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent 
              value="profile" 
              className={`${isMobile ? 'safe-bottom' : 'space-y-2'} focus:outline-none`}
            >
              <Suspense fallback={<TabSkeleton />}>
                <AccountProfile />
              </Suspense>
            </TabsContent>

            <TabsContent 
              value="subscription" 
              className={`${isMobile ? 'safe-bottom' : 'space-y-2'} focus:outline-none`}
            >
              <Suspense fallback={<TabSkeleton />}>
                <AccountSubscription />
              </Suspense>
            </TabsContent>

            <TabsContent 
              value="security" 
              className={`${isMobile ? 'safe-bottom' : 'space-y-2'} focus:outline-none`}
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