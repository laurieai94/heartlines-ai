
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

interface ProfileCardProps {
  title: string;
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
  variant?: 'default' | 'muted';
}

const ProfileCard = ({
  title,
  completion,
  description,
  benefits,
  onStartProfile,
  buttonText,
  iconElement,
  progressColor,
  benefitColor,
  variant = 'default'
}: ProfileCardProps) => {
  const [firstBenefit, ...remainingBenefits] = benefits;

  const isMuted = variant === 'muted';
  const cardClasses = isMuted 
    ? "group p-4 bg-white/5 backdrop-blur-sm border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/10"
    : "group p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/15";

  const iconBgClasses = isMuted 
    ? "w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300"
    : "w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300";

  const titleClasses = isMuted ? "text-lg font-medium text-white/70" : "text-lg font-bold text-white";

  return (
    <Card className={cardClasses}>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={iconBgClasses}>
            {iconElement}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={titleClasses}>
                {title}
              </h3>
              {isMuted && (
                <Badge variant="outline" className="text-xs text-white/50 border-white/20 bg-white/5">
                  Optional
                </Badge>
              )}
            </div>
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

        <div className={isMuted ? "bg-white/5 rounded-lg p-3 border border-white/5" : "bg-white/5 rounded-lg p-3 border border-white/10"}>
          <ul className={`space-y-2 text-sm font-normal leading-relaxed ${isMuted ? "text-white/60" : "text-pink-200/80"}`}>
            {description.split(". ").filter(sentence => sentence.trim()).map((sentence, index) => (
              <li key={`desc-${index}`} className="flex items-start gap-2">
                <Star className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isMuted ? "text-white/40" : "text-pink-200/80"}`} />
                {sentence.trim().endsWith(".") ? sentence.trim() : sentence.trim() + "."}
              </li>
            ))}
            {benefits.map((benefit, index) => (
              <li key={`benefit-${index}`} className="flex items-start gap-2">
                <Star className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isMuted ? "text-white/40" : "text-pink-200/80"}`} />
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={onStartProfile}
          className={isMuted 
            ? "w-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-102 border border-white/20"
            : "w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0"
          }
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
