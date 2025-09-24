// Ultra-fast skeleton loader for profile cards
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSkeletonProps {
  count?: number;
}

export const ProfileSkeleton = ({ count = 2 }: ProfileSkeletonProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-2 md:gap-6 lg:gap-8 max-w-none mx-2 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl md:mx-auto lg:px-4 xl:px-8">
      {Array.from({ length: count }).map((_, index) => (
        <Card 
          key={index}
          className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/30 shadow-2xl min-h-[280px] md:min-h-[320px] lg:min-h-[360px]"
        >
          <div className="space-y-3 md:space-y-4 lg:space-y-6 h-full flex flex-col">
            <div className="flex items-center gap-3 md:gap-4">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 md:h-7 lg:h-8 w-3/4 bg-white/20" />
                <Skeleton className="h-4 md:h-5 lg:h-6 w-full bg-white/15" />
                <div className="flex items-center gap-2 mt-2 md:mt-3 lg:mt-4">
                  <Skeleton className="h-2 md:h-3 lg:h-4 flex-1 bg-white/20" />
                  <Skeleton className="h-4 md:h-5 lg:h-6 w-12 bg-white/20" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3 md:p-4 lg:p-6 border border-white/20 flex-1">
              <div className="space-y-2 md:space-y-3 lg:space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3">
                    <Skeleton className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full bg-white/20 mt-0.5 md:mt-1 flex-shrink-0" />
                    <Skeleton className="h-4 md:h-5 lg:h-6 w-full bg-white/15" />
                  </div>
                ))}
              </div>
            </div>

            <Skeleton className="h-10 md:h-12 lg:h-14 w-full rounded-xl bg-gradient-to-r from-orange-400/30 to-pink-500/30" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProfileSkeleton;