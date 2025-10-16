import { cn } from "@/lib/utils";

interface NavAvatarProps {
  children?: React.ReactNode;
  className?: string;
}

const NavAvatar = ({ children, className }: NavAvatarProps) => {
  const gradientId = `nav-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn(
      "relative w-16 h-16 sm:w-18 sm:h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28",
      className
    )}>
      {/* Heart SVG Background */}
      <svg 
        viewBox="0 0 200 200" 
        className="absolute inset-0 w-full h-full drop-shadow-md"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b9d" />
            <stop offset="100%" stopColor="#ffc0cb" />
          </linearGradient>
        </defs>
        <path
          d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
      
      {/* User Initial on Top */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
        {children}
      </div>
    </div>
  );
};

export default NavAvatar;
