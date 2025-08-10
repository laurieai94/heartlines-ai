
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, MessageCircle, Lightbulb, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  compact?: boolean;
}

const DashboardNavigation = ({ activeTab, onValueChange, compact = false }: DashboardNavigationProps) => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    // Map tab values to URL paths
    const pathMap: Record<string, string> = {
      'home': '/dashboard/home',
      'profile': '/dashboard/profile',
      'insights': '/dashboard/coach',
      'actions': '/dashboard/actions'
    };
    
    navigate(pathMap[value] || '/dashboard/home');
    onValueChange(value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <nav role="navigation" aria-label="Primary" className={`flex justify-center ${compact ? 'pb-2' : 'pb-4'}`}>
          <TabsList 
            className={`w-full max-w-4xl ${compact ? 'h-10' : 'h-12'} flex md:grid md:grid-cols-4 overflow-x-auto no-scrollbar rounded-full p-1 gap-1 bg-background/60 backdrop-blur-md border border-border/60 shadow-sm`}
          >
            <TabsTrigger 
              value="home" 
              title="Home"
              className="flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              title="Profile"
              className="flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              title="Coach"
              className="flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              title="Actions"
              className="flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5"
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
