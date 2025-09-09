
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Star } from "lucide-react";
import CardAvatar from "./CardAvatar";

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
  optionalPillImage
}: ProfileCardProps) => {
  const [firstBenefit, ...remainingBenefits] = benefits;

  return (
    <Card className="group p-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/30 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.03] hover:border-white/60 hover:from-white/30 hover:to-white/20 ring-1 ring-white/20 hover:ring-2 hover:ring-white/40 hover:backdrop-blur-lg">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <CardAvatar>
            {iconElement}
          </CardAvatar>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {title}
              {optionalPillImage && optionalPillImage}
            </h3>
            {subheader && (
              <p className="text-sm text-white/70 font-medium mt-1">
                {subheader}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1">
                <Progress value={completion} className="h-2 bg-black/40" />
              </div>
              <span className={`text-sm font-semibold ${progressColor}`}>
                {completion}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 border border-white/20 ring-1 ring-white/10 shadow-inner">
          <ul className="space-y-2 text-pink-200/80 text-sm font-normal leading-relaxed">
            {benefits.map((benefit, index) => (
              <li key={`benefit-${index}`} className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">
                  {benefit.icon || <Star className="w-3 h-3 text-pink-200/80" />}
                </span>
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={onStartProfile}
          className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
