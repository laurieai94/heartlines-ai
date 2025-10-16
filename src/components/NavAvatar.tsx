import { cn } from "@/lib/utils";

interface NavAvatarProps {
  children?: React.ReactNode;
  className?: string;
}

const NavAvatar = ({ children, className }: NavAvatarProps) => {
  return (
    <div className={cn("w-16 h-16 sm:w-18 sm:h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ffc0cb] drop-shadow-md text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl", className)}>
      {children}
    </div>
  );
};

export default NavAvatar;
