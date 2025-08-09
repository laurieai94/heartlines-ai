
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MessageCircle, Lightbulb, Heart } from "lucide-react";

interface DashboardNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  compact?: boolean;
}

const DashboardNavigation = ({ activeTab, onValueChange, compact = false }: DashboardNavigationProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-30 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-full">
        <nav role="navigation" aria-label="Primary" className={`flex justify-center ${compact ? 'pb-2' : 'pb-4'}`}>
          <TabsList 
            className={`w-full max-w-3xl ${compact ? 'h-10' : 'h-12'} flex md:grid md:grid-cols-4 overflow-x-auto rounded-2xl p-1.5 gap-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-sm`}
          >
            <TabsTrigger 
              value="profile" 
              title="Profile"
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              title="Coach"
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conversation" 
              title="Practice"
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              title="Actions"
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-pink-200/80 hover:text-white hover:bg-white/10"
            >
              <Heart className="w-4 h-4" />
              <span>Actions</span>
            </TabsTrigger>
          </TabsList>
        </nav>
      </Tabs>
    </div>
  );
};

export default DashboardNavigation;
