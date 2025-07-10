
import { Card } from "@/components/ui/card";
import { Check, Shield, Lock } from "lucide-react";

const ValueProposition = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Why This Works Section */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-white">Why This Works</h3>
          
          <div className="space-y-3">
            <div className="text-left space-y-2">
              <h4 className="text-base font-semibold text-white">How it works:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">5 minutes of honesty → Get advice that feels personally crafted</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Chat with Kai → AI coaching that gets your situation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Take action → Tools that work in your real life</span>
                </div>
              </div>
            </div>
            
            <div className="text-left space-y-2">
              <h4 className="text-base font-semibold text-white">You'll master:</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Having tough conversations without drama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Turning disagreements into understanding</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Connecting when life gets busy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* The Questions That Actually Matter Section */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-white">The Questions That Actually Matter</h3>
          <p className="text-base text-pink-200/80 max-w-3xl mx-auto leading-relaxed">
            How do you really act when you're stressed? What makes you feel most loved? 
            The more honest you are, the less we'll sound like a generic self-help book.
          </p>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-white">Your Privacy Matters</h3>
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <Lock className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
            <p className="text-base text-pink-200/80 leading-relaxed text-left">
              Everything you share is completely secure and private. We never sell your data or use your personal information for anything other than giving you better relationship advice.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ValueProposition;
