import { cn } from "@/lib/utils";

interface NavAvatarProps {
  children?: React.ReactNode;
  className?: string;
}

const NavAvatar = ({ children, className }: NavAvatarProps) => {
  const uniqueId = `nav-heart-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn("relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b9d" />
            <stop offset="100%" stopColor="#ffc0cb" />
          </linearGradient>
        </defs>
        <path
          d="M50,90 C50,90 10,60 10,40 C10,25 20,15 32,15 C40,15 46,20 50,27 C54,20 60,15 68,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z"
          fill={`url(#${uniqueId})`}
          className="transition-all duration-300"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl">
        {children}
      </div>
    </div>
  );
};

export default NavAvatar;
