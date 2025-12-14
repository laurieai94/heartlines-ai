
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Star } from "lucide-react";
import CardAvatar from "./CardAvatar";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useRef, useEffect } from "react";

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
  motivationText = "the more real you are, the more real kai gets"
}: ProfileCardProps) => {
  const [firstBenefit, ...remainingBenefits] = benefits;
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isMobile } = useOptimizedMobile();
  
  // Handle mobile touch feedback - now CSS-only
  const handleButtonTouch = () => {
    // CSS handles the visual feedback now
  };
  
  const handleCardTouch = () => {
    // CSS handles the visual feedback now
  };
  
  // Enhanced mobile button press handling
  const handleButtonClick = () => {
    onStartProfile();
  };

  return (
    <Card 
      ref={cardRef}
      data-profile-card
      className={`questionnaire-card group p-4 md:p-5 lg:p-6 pb-3 md:pb-4 lg:pb-4
        hover:scale-[1.02] transition-transform duration-300 ${
        isMobile ? 'active:scale-[0.98] touch-action-manipulation' : ''
      }`}
      onTouchStart={isMobile ? handleCardTouch : undefined}
    >
      <div className="space-y-2 md:space-y-2.5 lg:space-y-3">
        <div className="flex items-start gap-3 md:gap-4">
          <CardAvatar>
            {iconElement}
          </CardAvatar>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 flex-nowrap whitespace-nowrap">
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

        <div className="pt-2 md:pt-3 lg:pt-4 space-y-3 md:space-y-3.5 lg:space-y-4">
          <div className="bg-white/10 rounded-lg p-3 md:p-3.5 lg:p-4 border border-white/20 ring-1 ring-white/10 shadow-inner">
            <ul className="space-y-1.5 md:space-y-2 lg:space-y-2 text-pink-200/80 text-xs md:text-sm lg:text-base font-normal leading-relaxed">
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
            className={`w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 hover:scale-[1.02] text-white py-2 md:py-2.5 lg:py-3 rounded-xl font-semibold text-sm md:text-base lg:text-lg glass-cta-gradient shadow-lg transition-all duration-400 border-0 ${
              isMobile ? 'min-h-[44px] touch-action-manipulation active:scale-95' : 'md:min-h-[48px] lg:min-h-[52px]'
            }`}
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 ml-1.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
