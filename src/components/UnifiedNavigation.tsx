import { Home, User, MessageSquare, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface UnifiedNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  onClose?: () => void;
  className?: string;
}

const navigationItems = [
  {
    value: 'home',
    icon: Home,
    label: 'Home',
    path: '/'
  },
  {
    value: 'profile',
    icon: User,
    label: 'Profile',
    path: '/profile'
  },
  {
    value: 'insights',
    icon: MessageSquare,
    label: 'Coach',
    path: '/coach'
  },
  {
    value: 'privacy',
    icon: Shield,
    label: 'Privacy',
    path: '/privacy'
  }
];

const UnifiedNavigation = ({ activeTab, onValueChange, onClose, className = '' }: UnifiedNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item: typeof navigationItems[0]) => {
    navigate(item.path);
    onValueChange(item.value);
    onClose?.();
  };

  return (
    <nav 
      className={`flex flex-col bg-burgundy-900 rounded-lg p-1 gap-1 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.value || location.pathname === item.path;
        
        return (
          <button
            key={item.value}
            onClick={() => handleNavigation(item)}
            className={`
              flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200
              text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20
              ${isActive ? 'bg-white/15' : ''}
            `}
            title={item.label}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </nav>
  );
};

export default UnifiedNavigation;