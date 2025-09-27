import React from 'react';
import { Home, User, MessageSquare, Shield, Settings, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UnifiedNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  className?: string;
  variant?: 'dropdown' | 'vertical';
  onClose?: () => void;
}

const navigationItems = [
  { 
    value: 'home', 
    label: 'Home', 
    icon: Home, 
    path: '/' 
  },
  { 
    value: 'profile', 
    label: 'Profile', 
    icon: User, 
    path: '/profile' 
  },
  { 
    value: 'insights', 
    label: 'Coach', 
    icon: MessageSquare, 
    path: '/coach' 
  },
  { 
    value: 'privacy', 
    label: 'Privacy', 
    icon: Shield, 
    path: '/privacy' 
  },
  { 
    value: 'account', 
    label: 'Account', 
    icon: Settings, 
    path: '/account' 
  },
  { 
    value: 'pricing', 
    label: 'Pricing', 
    icon: CreditCard, 
    path: '/pricing' 
  },
];

const UnifiedNavigation = ({ 
  activeTab, 
  onValueChange, 
  className, 
  variant = 'vertical',
  onClose 
}: UnifiedNavigationProps) => {
  const navigate = useNavigate();

  const handleNavigation = (item: typeof navigationItems[0]) => {
    navigate(item.path);
    onValueChange(item.value);
    onClose?.();
  };

  const baseItemClasses = "flex items-center gap-3 w-full px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200";
  const activeItemClasses = "bg-white/15 text-white font-medium";

  return (
    <nav 
      className={cn(
        "bg-burgundy-900 rounded-lg shadow-lg overflow-hidden",
        variant === 'vertical' ? "p-2 space-y-1" : "p-1",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.value;
        
        return (
          <button
            key={item.value}
            onClick={() => handleNavigation(item)}
            className={cn(
              baseItemClasses,
              isActive && activeItemClasses,
              variant === 'dropdown' && "justify-start text-sm"
            )}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className={cn(
              "font-medium",
              variant === 'vertical' ? "block" : "block"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default UnifiedNavigation;