
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  optionalPillImage?: string;
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
  optionalPillImage
}: ProfileCardProps) => {
  const [firstBenefit, ...remainingBenefits] = benefits;

  return (
    <Card className="group p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/15">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            {iconElement}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {title}
              {optionalPillImage && (
                <img src={optionalPillImage} alt="Optional" className="h-5 w-auto" />
              )}
            </h3>
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

        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <ul className="space-y-2 text-pink-200/80 text-sm font-normal leading-relaxed">
            {description && description.split(". ").filter(sentence => sentence.trim()).map((sentence, index) => (
              <li key={`desc-${index}`} className="flex items-start gap-2">
                <Star className="w-3 h-3 text-pink-200/80 mt-0.5 flex-shrink-0" />
                {sentence.trim().endsWith(".") ? sentence.trim() : sentence.trim() + "."}
              </li>
            ))}
            {benefits.map((benefit, index) => (
              <li key={`benefit-${index}`} className="flex items-start gap-2">
                <Star className="w-3 h-3 text-pink-200/80 mt-0.5 flex-shrink-0" />
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
