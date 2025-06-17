
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, User, MessageCircle, Lightbulb, ArrowRight, Search } from "lucide-react";
import ProfileBuilder from "@/components/ProfileBuilder";
import AIInsights from "@/components/AIInsights";
import ConversationPractice from "@/components/ConversationPractice";
import ThoughtfulActions from "@/components/ThoughtfulActions";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("insights");
  
  // Profile state management
  const [profiles, setProfiles] = useState<{your: any[], partner: any[]}>({
    your: [],
    partner: []
  });
  
  const [demographicsData, setDemographicsData] = useState<{your: any, partner: any}>({
    your: null,
    partner: null
  });

  // Function to handle profile updates from ProfileBuilder
  const handleProfileUpdate = (newProfiles: any, newDemographics: any) => {
    setProfiles(newProfiles);
    setDemographicsData(newDemographics);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RealTalk</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-6 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl">
              <TabsTrigger value="profile" className="flex items-center gap-2 rounded-xl">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 rounded-xl">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Coach</span>
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex items-center gap-2 rounded-xl">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Practice</span>
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2 rounded-xl">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Actions</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="px-6">
            <ProfileBuilder 
              onProfileUpdate={handleProfileUpdate}
              initialProfiles={profiles}
              initialDemographics={demographicsData}
            />
          </TabsContent>

          <TabsContent value="insights" className="h-[calc(100vh-140px)]">
            <AIInsights 
              profiles={profiles}
              demographicsData={demographicsData}
            />
          </TabsContent>

          <TabsContent value="conversation" className="px-6">
            <ConversationPractice 
              profiles={profiles}
              demographicsData={demographicsData}
            />
          </TabsContent>

          <TabsContent value="actions" className="px-6">
            <ThoughtfulActions 
              profiles={profiles}
              demographicsData={demographicsData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
