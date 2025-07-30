
import { Card } from "@/components/ui/card";
import { Heart, Lightbulb } from "lucide-react";

const KaiIntroCard = () => {
  return (
    <Card className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm animate-fade-in transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-orange-300" />
            Meet Kai
          </h3>
        </div>
      </div>
      <p className="text-xs text-pink-200/60 leading-relaxed">
        Your AI relationship coach, trained on 15+ years of PhD-level clinical psychology and grounded in evidence-based practices. Built to help you grow, communicate, and connect in the moments that matter most.
      </p>
    </Card>
  );
};

export default KaiIntroCard;
