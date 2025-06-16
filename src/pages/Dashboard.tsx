
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
  const [activeTab, setActiveTab] = useState("profile");
  
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RealTalk</h1>
              <p className="text-gray-600">Your relationship support system</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/60 backdrop-blur-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Building
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileBuilder 
              onProfileUpdate={handleProfileUpdate}
              initialProfiles={profiles}
              initialDemographics={demographicsData}
            />
          </TabsContent>

          <TabsContent value="insights">
            <AIInsights 
              profiles={profiles}
              demographicsData={demographicsData}
            />
          </TabsContent>

          <TabsContent value="conversation">
            <ConversationPractice 
              profiles={profiles}
              demographicsData={demographicsData}
            />
          </TabsContent>

          <TabsContent value="actions">
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
