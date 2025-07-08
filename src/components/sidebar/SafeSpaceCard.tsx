
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

const SafeSpaceCard = () => {
  return (
    <Card className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-slide-up hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-3 h-3 text-orange-300 animate-pulse" />
        <h3 className="text-sm font-medium text-white">Safe Space</h3>
      </div>
      <div className="text-xs text-pink-200/80 space-y-1">
        <p>• No judgment, just support</p>
        <p>• Your feelings are valid</p>
        <p>• Messy is normal</p>
      </div>
    </Card>
  );
};

export default SafeSpaceCard;
