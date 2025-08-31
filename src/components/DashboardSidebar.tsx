import { Home, User, Lightbulb, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const navigationItems = [
  { title: "Home", value: "home", url: "/", icon: Home },
  { title: "Profile", value: "profile", url: "/profile", icon: User },
  { title: "Coach", value: "insights", url: "/coach", icon: Lightbulb },
  { title: "Privacy", value: "privacy", url: "/privacy", icon: Shield },
];

const DashboardSidebar = ({ activeTab, onValueChange }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const { state } = useSidebar();

  const handleNavigation = (value: string, url: string) => {
    navigate(url);
    onValueChange(value);
  };

  const isActive = (value: string) => activeTab === value;

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <div className="p-2">
        <SidebarTrigger className="w-full justify-center" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.value, item.url)}
                    className={`
                      ${isActive(item.value) 
                        ? 'bg-primary/15 text-primary font-medium' 
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }
                      transition-all duration-200
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    {state !== "collapsed" && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;