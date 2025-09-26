import { Home, User, MessageSquare, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const DashboardSidebar = ({ activeTab, onValueChange }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { value: 'home', label: 'Home', icon: Home, path: '/' },
    { value: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { value: 'insights', label: 'Coach', icon: MessageSquare, path: '/coach' },
    { value: 'privacy', label: 'Privacy', icon: Shield, path: '/privacy' }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    navigate(item.path);
    onValueChange(item.value);
  };

  const isActive = (value: string) => activeTab === value;

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        className="border-r border-white/10 bg-burgundy-950/50 backdrop-blur-sm"
        style={{ "--sidebar-width": "3rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}
      >
        <SidebarContent className="gap-0">
          <SidebarMenu className="gap-1 pt-4">
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item)}
                      className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/10 ${
                        isActive(item.value)
                          ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20'
                          : 'text-white/70 hover:text-white'
                      }`}
                      size="sm"
                    >
                      <item.icon className="w-5 h-5" />
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <span className="text-sm font-medium">{item.label}</span>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
};

export default DashboardSidebar;