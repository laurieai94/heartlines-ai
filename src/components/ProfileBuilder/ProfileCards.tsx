
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, ArrowRight, Target, Star } from "lucide-react";

interface ProfileCardsProps {
  yourProfileCompletion: number;
  partnerProfileCompletion: number;
  onStartPersonalProfile: () => void;
  onStartPartnerProfile: () => void;
}

const ProfileCards = ({ 
  yourProfileCompletion, 
  partnerProfileCompletion, 
  onStartPersonalProfile, 
  onStartPartnerProfile 
}: ProfileCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {/* Card 1: Your Personal Profile */}
      <Card className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/15">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-electric-blue to-electric-purple rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                Your Personal Profile
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1">
                  <Progress value={yourProfileCompletion} className="h-2 bg-black/40" />
                </div>
                <span className="text-sm font-semibold text-electric-blue">
                  {yourProfileCompletion}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-100 text-sm leading-relaxed">
            Complete our comprehensive questionnaire to unlock personalized relationship insights from Kai, your AI coach.
          </p>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 text-electric-blue mb-2">
              <Target className="w-4 h-4" />
              <span className="font-semibold text-sm">What You'll Get:</span>
            </div>
            <ul className="space-y-1 text-gray-100 text-xs">
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3 text-electric-blue" />
                Personalized coaching tailored to your patterns
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3 text-electric-blue" />
                Deep insights into your relationship style
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3 text-electric-blue" />
                Custom advice that actually gets you
              </li>
            </ul>
          </div>

          <Button 
            onClick={onStartPersonalProfile}
            className="w-full bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/80 hover:to-electric-purple/80 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
          >
            {yourProfileCompletion > 0 ? 'Continue Your Profile' : 'Start Your Profile'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Card 2: Partner Profile */}
      <Card className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/15">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-electric-purple to-electric-blue rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Partner Profile</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1">
                  <Progress value={partnerProfileCompletion} className="h-2 bg-black/40" />
                </div>
                <span className="text-sm font-semibold text-electric-purple">
                  {partnerProfileCompletion}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-100 text-sm leading-relaxed">
            Share what you know about your partner's communication style and preferences for even better insights.
          </p>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 text-electric-purple mb-2">
              <Target className="w-4 h-4" />
              <span className="font-semibold text-sm">What You'll Unlock:</span>
            </div>
            <ul className="space-y-1 text-gray-100 text-xs">
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3 text-electric-purple" />
                Dual-perspective relationship insights
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3 text-electric-purple" />
                Bridge-building communication tips
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3 text-electric-purple" />
                Advice that considers both of you
              </li>
            </ul>
          </div>

          <Button 
            onClick={onStartPartnerProfile}
            className="w-full bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/80 hover:to-electric-purple/80 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
          >
            {partnerProfileCompletion > 0 ? 'Continue Partner Profile' : 'Add Partner Profile'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCards;
