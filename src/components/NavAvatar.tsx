import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavAvatarProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const NavAvatar = ({ children, icon: Icon, className }: NavAvatarProps) => {
  return (
    <div className={cn(
      "w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24",
      "flex items-center justify-center rounded-full",
      "bg-gradient-to-br from-rose-500 to-pink-400",
      "ring-[0.5px] ring-white/40 shadow-md shadow-inner",
      "text-white font-brand uppercase",
      "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl",
      "transition-all duration-300",
      className
    )}>
      {children}
      {Icon && <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />}
    </div>
  );
};

export default NavAvatar;
