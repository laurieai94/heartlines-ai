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
        Your AI relationship coach, trained in <span className="bg-coral-400/30 text-white px-2 py-0.5 rounded">PhD-level psychology</span> and real-world clinical care. Grounded in <span className="bg-peach-400/30 text-white px-2 py-0.5 rounded">evidence-based</span> and <span className="bg-coral-400/30 text-white px-2 py-0.5 rounded">trauma-informed</span> practices, Kai helps you build healthier relationships — whether you're solo, partnered, or somewhere in between. LGBTQ+ inclusive and designed for real life, Kai meets you where you are.
      </p>
    </Card>
  );
};

export default KaiIntroCard;