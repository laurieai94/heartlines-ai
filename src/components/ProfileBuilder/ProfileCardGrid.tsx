
import { Brain, Heart, Lightbulb, Target, Star } from "lucide-react";
import ProfileCard from "./ProfileCard";

interface ProfileCardGridProps {
  yourProfileCompletion: number;
  partnerProfileCompletion: number;
  onStartPersonalProfile: () => void;
  onStartPartnerProfile: () => void;
}

const ProfileCardGrid = ({
  yourProfileCompletion,
  partnerProfileCompletion,
  onStartPersonalProfile,
  onStartPartnerProfile
}: ProfileCardGridProps) => {
  const yourProfileBenefits = [
    { icon: <Target className="w-4 h-4" />, text: "What you'll unlock:" },
    { icon: <Star className="w-3 h-3 text-orange-300" />, text: "Coaching that fits your personality" },
    { icon: <Star className="w-3 h-3 text-orange-300" />, text: "Insights into your relationship patterns" },
    { icon: <Star className="w-3 h-3 text-orange-300" />, text: "Advice that sounds like it was written for you" }
  ];

  const partnerProfileBenefits = [
    { icon: <Lightbulb className="w-4 h-4" />, text: "What you'll unlock:" },
    { icon: <Star className="w-3 h-3 text-pink-300" />, text: "See your dynamic from their perspective" },
    { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Communication tips that speak their language" },
    { icon: <Star className="w-3 h-3 text-pink-300" />, text: "Strategies that work for how you two are together" }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {/* Your Profile Card */}
      <ProfileCard
        title="Tell Me About You"
        completion={yourProfileCompletion}
        description="Answer some real questions about how you communicate, handle conflict, and connect so RealTalk can give you advice that doesn't suck."
        benefits={yourProfileBenefits}
        onStartProfile={onStartPersonalProfile}
        buttonText={yourProfileCompletion > 0 ? 'Continue Your Profile' : 'Start Your Profile'}
        iconElement={<Brain className="w-5 h-5 text-white" />}
        progressColor="text-orange-300"
        benefitColor="text-orange-300"
      />

      {/* Partner Profile Card */}
      <ProfileCard
        title="Add Your Partner's Side"
        completion={partnerProfileCompletion}
        description="Help me understand how they work too, so my advice works for both of you."
        benefits={partnerProfileBenefits}
        onStartProfile={onStartPartnerProfile}
        buttonText={partnerProfileCompletion > 0 ? 'Continue Partner Profile' : 'Add Partner Profile'}
        iconElement={<Heart className="w-5 h-5 text-white" />}
        progressColor="text-pink-300"
        benefitColor="text-pink-300"
      />
    </div>
  );
};

export default ProfileCardGrid;
