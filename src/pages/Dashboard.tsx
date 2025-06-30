
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIInsights from "@/components/AIInsights";
import ConversationPractice from "@/components/ConversationPractice";
import ThoughtfulActions from "@/components/ThoughtfulActions";
import ProfileBuilder from "@/components/ProfileBuilder";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import BubbleBackground from "@/components/BubbleBackground";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab') || 'coach';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== tabFromUrl) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, tabFromUrl, setSearchParams]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        <BubbleBackground />
        
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              RealTalk Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Your relationship growth toolkit
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl">
              <TabsTrigger 
                value="coach" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                AI Coach
              </TabsTrigger>
              <TabsTrigger 
                value="practice" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                Practice
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                Actions
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                Profile
              </TabsTrigger>
            </TabsList>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <TabsContent value="coach" className="p-0 m-0 h-[calc(100vh-280px)]">
                <AIInsights />
              </TabsContent>

              <TabsContent value="practice" className="p-6 m-0 h-[calc(100vh-280px)] overflow-y-auto">
                <ConversationPractice />
              </TabsContent>

              <TabsContent value="actions" className="p-6 m-0 h-[calc(100vh-280px)] overflow-y-auto">
                <ThoughtfulActions />
              </TabsContent>

              <TabsContent value="profile" className="p-6 m-0 h-[calc(100vh-280px)] overflow-y-auto">
                <ProfileBuilder />
              </TabsContent>
            </div>
          </div>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default Dashboard;
