import { cn } from "@/lib/utils";

interface NavAvatarProps {
  children?: React.ReactNode;
  className?: string;
}

const NavAvatar = ({ children, className }: NavAvatarProps) => {
  const gradientId = `heart-gradient-${crypto.randomUUID()}`;
  
  return (
    <div className={cn("relative w-16 h-16 sm:w-18 sm:h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28", className)}>
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b9d" />
            <stop offset="100%" stopColor="#ffc0cb" />
          </linearGradient>
        </defs>
        <path 
          d="M50,85 C50,85 20,60 20,40 C20,25 30,20 40,25 C45,27.5 50,32 50,32 C50,32 55,27.5 60,25 C70,20 80,25 80,40 C80,60 50,85 50,85 Z" 
          fill={`url(#${gradientId})`}
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center h-full text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
        {children}
      </div>
    </div>
  );
};

export default NavAvatar;
