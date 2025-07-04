
import { Card } from "@/components/ui/card";
import { Coffee, Gift, Heart, Calendar, MessageSquare } from "lucide-react";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures", icon: Coffee },
  { value: "special", label: "Special Occasions", icon: Gift },
  { value: "support", label: "Emotional Support", icon: Heart },
  { value: "quality-time", label: "Quality Time", icon: Calendar },
  { value: "communication", label: "Communication", icon: MessageSquare }
];

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface Suggestion {
  id: number;
  category: string;
  partnerMood: string;
  occasion: string;
  context: string;
  suggestions: string;
  timestamp: string;
}

interface SuggestionsListProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
}

const SuggestionsList = ({ profiles, demographicsData }: SuggestionsListProps) => {
  const getCategoryIcon = (categoryValue: string) => {
    const category = ACTION_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.icon : Heart;
  };

  // For now, return empty state - this would be populated with actual suggestions
  const suggestions: Suggestion[] = [];

  if (suggestions.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl">
        <Heart className="w-16 h-16 text-orange-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-white mb-3">No suggestions yet</h3>
        <p className="text-pink-200/80 text-lg">
          Create custom actions to get personalized suggestions based on your profiles.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Your Personalized Suggestions</h3>
      {suggestions.map((suggestion) => {
        const IconComponent = getCategoryIcon(suggestion.category);
        return (
          <Card key={suggestion.id} className="p-8 bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-white text-xl">
                      {ACTION_CATEGORIES.find(cat => cat.value === suggestion.category)?.label}
                    </h4>
                    {suggestion.partnerMood && (
                      <p className="text-sm text-pink-200/80">For when they're: {suggestion.partnerMood}</p>
                    )}
                  </div>
                  <span className="text-sm text-pink-200/70">{suggestion.timestamp}</span>
                </div>
                
                {(suggestion.occasion || suggestion.context) && (
                  <div className="bg-white/5 p-4 rounded-xl mb-6 text-sm">
                    {suggestion.occasion && <p className="text-pink-200/90"><strong>Occasion:</strong> {suggestion.occasion}</p>}
                    {suggestion.context && <p className="text-pink-200/90"><strong>Context:</strong> {suggestion.context}</p>}
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none text-pink-200/90">
                  <pre className="whitespace-pre-wrap font-sans">{suggestion.suggestions}</pre>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SuggestionsList;
