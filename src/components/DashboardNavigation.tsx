
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MessageCircle, Lightbulb, Heart } from "lucide-react";

interface DashboardNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const DashboardNavigation = ({ activeTab, onValueChange }: DashboardNavigationProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-full">
        <div className="flex justify-center pb-12">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl h-12 bg-black/15 backdrop-blur-sm border border-white/15 rounded-xl p-1.5 gap-1">
            <TabsTrigger 
              value="profile" 
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conversation" 
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <Heart className="w-4 h-4" />
              <span>Actions</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardNavigation;
