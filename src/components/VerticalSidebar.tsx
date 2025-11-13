import { Home, User, MessageSquare, CreditCard, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FlipPhoneIcon from './icons/FlipPhoneIcon';

const VerticalSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/coach', icon: MessageSquare, label: 'Coach' },
    { path: '/plans', icon: CreditCard, label: 'Plans' },
    { path: '/account', icon: Settings, label: 'Account' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center w-20 bg-burgundy-900/90 backdrop-blur-xl rounded-[2rem] border border-coral-400/20 shadow-2xl shadow-burgundy-950/50"
      aria-label="Main navigation"
    >
      {/* Flip Phone Icon */}
      <Link
        to="/"
        className="pt-6 pb-4 transition-transform duration-200 hover:scale-105"
        aria-label="Home"
      >
        <FlipPhoneIcon size={48} className="drop-shadow-lg" />
      </Link>

      {/* Divider */}
      <div className="w-12 border-t border-white/10 mb-2" />

      {/* Navigation Icons */}
      <div className="flex flex-col items-center gap-1 pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default VerticalSidebar;
