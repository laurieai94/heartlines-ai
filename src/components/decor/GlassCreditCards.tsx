import { CreditCard, Shield, Zap } from "lucide-react";

const GlassCreditCards = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
      {/* Floating Glass Card 1 - Top Right */}
      <div className="absolute top-[15%] right-[8%] w-72 h-44 glass-strong rounded-2xl glass-sheen animate-float transform rotate-12">
        <div className="p-6 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-400 to-pink-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <Shield className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Relationship Health</div>
            <div className="text-sm font-medium text-white">**** **** **** 2024</div>
          </div>
        </div>
      </div>

      {/* Floating Glass Card 2 - Bottom Left */}
      <div className="absolute bottom-[20%] left-[5%] w-64 h-40 glass-soft rounded-xl glass-sheen animate-float transform -rotate-6" style={{animationDelay: '1.5s'}}>
        <div className="p-5 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Zap className="w-6 h-6 text-orange-400" />
            <div className="text-xs text-white/40">Premium</div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Connection Score</div>
            <div className="text-lg font-semibold text-white">94%</div>
          </div>
        </div>
      </div>

      {/* Floating Glass Card 3 - Middle Right */}
      <div className="absolute top-[55%] right-[15%] w-56 h-36 glass-border-gradient rounded-lg glass-sheen animate-float transform rotate-3" style={{animationDelay: '3s'}}>
        <div className="p-4 h-full flex flex-col justify-between bg-gradient-to-br from-white/5 to-transparent rounded-lg">
          <div className="text-xs text-white/60">Kai Assistant</div>
          <div>
            <div className="text-sm text-white/80 mb-2">Active Session</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-white/60">Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassCreditCards;