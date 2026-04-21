import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, MessageSquare, Shield } from "lucide-react";
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
      'home': '/',
      'profile': '/profile',
      'insights': '/coach',
      'privacy': '/privacy-and-security'
    };
    
    navigate(pathMap[value] || '/');
    onValueChange(value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <nav role="navigation" aria-label="Primary" className={`flex justify-start ${compact ? 'pb-2' : 'pb-4'}`}>
          <TabsList 
            className={`w-full max-w-4xl ${compact ? 'h-10' : 'h-12'} flex md:grid md:grid-cols-4 overflow-x-auto no-scrollbar p-1 gap-2`}
          >
            <TabsTrigger 
              value="home" 
              title="Home"
              className="flex items-center justify-start py-2 px-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:text-primary text-foreground/70 hover:text-foreground"
            >
              <Home className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              title="Profile"
              className="flex items-center justify-start py-2 px-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:text-primary text-foreground/70 hover:text-foreground"
            >
              <User className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              title="Coach"
              className="flex items-center justify-start py-2 px-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:text-primary text-foreground/70 hover:text-foreground"
            >
              <MessageSquare className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              title="Privacy"
              className="flex items-center justify-start py-2 px-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 data-[state=active]:text-primary text-foreground/70 hover:text-foreground"
            >
              <Shield className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </nav>
      </Tabs>
    </div>
  );
};

export default DashboardNavigation;
