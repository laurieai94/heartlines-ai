import { Card } from "@/components/ui/card";
import { Heart, Lightbulb } from "lucide-react";

const KaiIntroCard = () => {
  return (
    <Card className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-sm animate-fade-in transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-burgundy-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-orange-300" />
            meet kai
          </h3>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-pink-200/60 leading-relaxed">
          built for the way we love — through texts, apps, across time zones, in moments that can't wait for therapy hours.
        </p>
        
        <p className="text-xs text-white font-semibold leading-relaxed">
          rooted in science. guided by empathy. designed for real life.
        </p>
        
        <p className="text-xs text-pink-200/60 leading-relaxed">
          with phd-level psychology at her core, kai helps you make sense of what you feel and build closeness that lasts — one honest chat at a time.
        </p>
        
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] bg-white/10 text-pink-200/80 px-2 py-1 rounded-full">
            🌈 inclusive for all
          </span>
          <span className="text-[10px] bg-white/10 text-pink-200/80 px-2 py-1 rounded-full">
            🧠 evidence-based care
          </span>
          <span className="text-[10px] bg-white/10 text-pink-200/80 px-2 py-1 rounded-full">
            🔒 private by design
          </span>
          <span className="text-[10px] bg-white/10 text-pink-200/80 px-2 py-1 rounded-full">
            💗 trauma-aware
          </span>
          <span className="text-[10px] bg-white/10 text-pink-200/80 px-2 py-1 rounded-full">
            ⏱ instant support
          </span>
        </div>
      </div>
    </Card>
  );
};

export default KaiIntroCard;