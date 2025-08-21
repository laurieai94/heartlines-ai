import { useState } from 'react';
import { ArrowLeft, User, CreditCard, Shield, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountOverview from './AccountOverview';
import AccountSubscription from './AccountSubscription';
import AccountProfile from './AccountProfile';
import AccountSecurity from './AccountSecurity';

const AccountLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen questionnaire-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-3xl animate-gradient-shift"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-3xl animate-gradient-shift-reverse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/home')}
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="questionnaire-card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
            <p className="text-white/70">Manage your profile, subscription, and security settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-coral-500 data-[state=active]:text-white text-white/70"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AccountOverview />
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <AccountSubscription />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <AccountProfile />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <AccountSecurity />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;