
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock } from "lucide-react";

const ValueProposition = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Why This Works Section */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-white">Why This Works</h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Simple Process Column */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white">Simple process:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">5 minutes of honesty for personalized coaching insights</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Chat with Kai for advice that gets your situation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Take action with tools that work in your real life</span>
                </div>
              </div>
            </div>
            
            {/* You'll Master Column */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white">You'll master:</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Having tough conversations without the drama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Turning disagreements into understanding</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm">Connecting when life gets crazy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Your Privacy Matters</h3>
          <p className="text-base text-pink-200/80 max-w-3xl mx-auto leading-relaxed">
            Everything you share with RealTalk is completely secure and private. We use bank-level encryption to protect your data, 
            and we never sell, share, or use your personal information for anything other than giving you better relationship advice.
          </p>
          
          <div className="text-left space-y-3 max-w-3xl mx-auto">
            <h4 className="text-base font-semibold text-white">What this means:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm">Your conversations with Kai stay between you and our AI coach</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm">We don't share your data with advertisers, dating apps, or anyone else</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm">Your relationship details are encrypted and stored securely</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm">You can delete your data anytime, no questions asked</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm">We're not tracking you across the internet or building profiles to sell</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-base text-pink-200/80 max-w-3xl mx-auto leading-relaxed font-medium">
              Our promise: Your most personal thoughts about your relationship deserve the highest level of protection. 
              That's exactly what you get with RealTalk.
            </p>
            
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
            >
              View Full Privacy Policy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ValueProposition;
