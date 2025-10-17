import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavAvatarProps {
  icon?: LucideIcon;
  className?: string;
}

const NavAvatar = ({ icon: Icon, className }: NavAvatarProps) => {
  return (
    <div className={cn("w-16 h-16 sm:w-18 sm:h-18 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ffc0cb] drop-shadow-md text-white", className)}>
      {Icon && <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />}
    </div>
  );
};

export default NavAvatar;
