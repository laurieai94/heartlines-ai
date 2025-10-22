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
      <p className="text-xs text-pink-200/60 leading-relaxed">
        your ai relationship coach, trained in <span className="bg-coral-400/30 text-white px-2 py-0.5 rounded">phd-level psychology</span> and real-world clinical care. grounded in <span className="bg-orange-400/30 text-white px-2 py-0.5 rounded">evidence-based</span> and <span className="bg-pink-400/30 text-white px-2 py-0.5 rounded">trauma-informed</span> practices, kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between. lgbtq+ inclusive and designed for real life, kai meets you where you are.
      </p>
    </Card>
  );
};

export default KaiIntroCard;