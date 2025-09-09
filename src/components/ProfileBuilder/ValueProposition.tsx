
import { Card } from "@/components/ui/card";
import { Play, Zap, Target, MessageSquare, Shield, Heart } from "lucide-react";

const ValueProposition = () => {
  return (
    <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg max-w-4xl mx-auto">
      <div className="text-center space-y-3">        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="text-left space-y-2">
            <h4 className="text-base font-semibold text-white">Simple Process:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Play className="w-4 h-4 text-green-300" />
                <span className="text-pink-200/80 text-sm">Build your profile to capture your unique relationship vibe</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-green-300" />
                <span className="text-pink-200/80 text-sm">Connect with Kai for AI-powered clarity that just gets it</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-green-300" />
                <span className="text-pink-200/80 text-sm">Take real action, leveling up your bond with smart advice</span>
              </div>
            </div>
          </div>
          
          <div className="text-left space-y-2">
            <h4 className="text-base font-semibold text-white">You Get:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-orange-300" />
                <span className="text-pink-200/80 text-sm">Mastering the 'We need to talk'</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-orange-300" />
                <span className="text-pink-200/80 text-sm">Turning arguments into wins</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-orange-300" />
                <span className="text-pink-200/80 text-sm">Making your actions actually count</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ValueProposition;
