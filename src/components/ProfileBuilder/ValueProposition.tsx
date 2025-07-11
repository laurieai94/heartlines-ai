
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Lock, ChevronDown, Shield } from "lucide-react";
import { useState } from "react";

const ValueProposition = () => {
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Why This Works Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Why This Works</h3>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Simple Process Column */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-white">Simple process:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm leading-relaxed">5 minutes of honesty for personalized coaching insights</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm leading-relaxed">Chat with Kai for advice that gets your situation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm leading-relaxed">Take action with tools that work in your real life</span>
                </div>
              </div>
            </div>
            
            {/* You'll Master Column */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-white">You'll master:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm leading-relaxed">Having tough conversations without the drama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm leading-relaxed">Turning disagreements into understanding</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="text-pink-200/80 text-sm leading-relaxed">Connecting when life gets crazy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-green-300" />
            <h3 className="text-xl font-bold text-white">The RealTalk Privacy Promise</h3>
          </div>
          
          <p className="text-base text-pink-200/95 max-w-2xl mx-auto leading-relaxed font-medium">
            Your most personal thoughts deserve the highest protection. That's exactly what you get.
          </p>

          {/* Essential Privacy Points */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm leading-relaxed text-left">End-to-end encrypted - even we can't read your messages</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm leading-relaxed text-left">Never sold or shared - your data stays yours</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                <span className="text-pink-200/80 text-sm leading-relaxed text-left">Delete anytime - no questions asked</span>
              </div>
            </div>
          </div>

          {/* Collapsible "What This Means for You" Section */}
          <Collapsible open={isPrivacyExpanded} onOpenChange={setIsPrivacyExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 flex items-center gap-2 transition-all duration-200"
              >
                What This Means for You
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isPrivacyExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6 mt-6">
              <div className="text-left space-y-6 max-w-3xl mx-auto">
                
                {/* Detailed Privacy Practices */}
                <div className="space-y-4">
                  <h5 className="text-base font-semibold text-white text-center">How We Protect You</h5>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                      <span className="text-pink-200/80 text-sm leading-relaxed">No tracking across the internet or building profiles to sell</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                      <span className="text-pink-200/80 text-sm leading-relaxed">Your relationship details are encrypted and stored securely</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                      <span className="text-pink-200/80 text-sm leading-relaxed">Profile information is never used for marketing or other purposes</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                      <span className="text-pink-200/80 text-sm leading-relaxed">No sharing with advertisers, dating apps, or anyone else</span>
                    </div>
                  </div>
                </div>

                {/* Zero Access Policy - Special Section */}
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/10 rounded-xl p-6 border border-green-400/20">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Shield className="w-6 h-6 text-green-300" />
                    <h5 className="text-lg font-bold text-white">Zero Access Policy</h5>
                  </div>
                  <p className="text-pink-200/95 text-sm leading-relaxed text-center">
                    Your conversations and profiles are encrypted so securely that even RealTalk employees cannot read them. 
                    Only you and Kai have access to your relationship information.
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 font-medium"
              >
                View Full Privacy Policy
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    </div>
  );
};

export default ValueProposition;
