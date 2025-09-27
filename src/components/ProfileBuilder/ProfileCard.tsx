
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Star } from "lucide-react";
import CardAvatar from "./CardAvatar";
import { useLightMobileOptimizations } from "@/hooks/useLightMobileOptimizations";
import { useRef } from "react";

interface ProfileCardProps {
  title: string;
  subheader?: string;
  completion: number;
  description: string;
  benefits: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  onStartProfile: () => void;
  buttonText: string;
  iconElement: React.ReactNode;
  progressColor: string;
  benefitColor: string;
  optionalPillImage?: React.ReactNode;
  motivationText?: string;
}

const ProfileCard = ({
  title,
  subheader,
  completion,
  description,
  benefits,
  onStartProfile,
  buttonText,
  iconElement,
  progressColor,
  benefitColor,
  optionalPillImage,
  motivationText = "The more real you are, the more real Kai gets"
}: ProfileCardProps) => {
  const [firstBenefit, ...remainingBenefits] = benefits;
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isMobile, simulateHapticFeedback } = useLightMobileOptimizations();
  
  // Handle mobile touch feedback
  const handleButtonTouch = () => {
    if (buttonRef.current) {
      simulateHapticFeedback(buttonRef.current);
    }
  };
  
  const handleCardTouch = () => {
    if (cardRef.current) {
      simulateHapticFeedback(cardRef.current);
    }
  };
  
  // Enhanced mobile button press handling
  const handleButtonClick = () => {
    if (buttonRef.current) {
      simulateHapticFeedback(buttonRef.current);
    }
    onStartProfile();
  };

  return (
    <Card 
      ref={cardRef}
      data-profile-card
      className={`questionnaire-card group p-2 md:p-4 lg:p-5 
        transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-white/20
        min-h-[200px] md:min-h-[240px] lg:min-h-[280px] ${
        isMobile ? 'active:scale-[0.98] touch-action-manipulation' : ''
      }`}
      onTouchStart={isMobile ? handleCardTouch : undefined}
    >
      <div className="space-y-1 md:space-y-2 lg:space-y-3 h-full flex flex-col">
        <div className="flex items-center gap-3 md:gap-4">
          <CardAvatar>
            {iconElement}
          </CardAvatar>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
              {title}
              {optionalPillImage && optionalPillImage}
            </h3>
            <p className="text-xs md:text-sm lg:text-base text-white/70 font-medium mt-1 md:mt-2 lg:mt-3 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {motivationText}
            </p>
            <div className="flex items-center gap-2 mt-1 md:mt-2 lg:mt-3">
              <div className="flex-1">
                <Progress value={completion} className="h-2 md:h-3 lg:h-4 bg-black/40" />
              </div>
              <span className={`text-sm md:text-base lg:text-lg font-semibold ${progressColor}`}>
                {completion}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-2 md:p-2.5 lg:p-3 border border-white/20 ring-1 ring-white/10 shadow-inner flex-1">
          <ul className="space-y-1 md:space-y-1.5 lg:space-y-2 text-pink-200/80 text-xs md:text-sm lg:text-base font-normal leading-relaxed">
            {benefits.map((benefit, index) => (
              <li key={`benefit-${index}`} className="flex items-start gap-2 md:gap-3">
                <span className="mt-0.5 md:mt-1 flex-shrink-0">
                  {benefit.icon || <Star className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-pink-200/80" />}
                </span>
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          ref={buttonRef}
          onClick={handleButtonClick}
          onTouchStart={isMobile ? handleButtonTouch : undefined}
          className={`w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-1.5 md:py-2 lg:py-2 rounded-xl font-semibold text-sm md:text-sm lg:text-base glass-cta-gradient glass-sheen animate-profile-glow shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0 ${
            isMobile ? 'min-h-[40px] touch-action-manipulation active:scale-95' : 'md:min-h-[44px] lg:min-h-[48px]'
          }`}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
