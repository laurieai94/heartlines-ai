
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
      <Card className="p-8 text-center bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl">
        <Heart className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No suggestions yet</h3>
        <p className="text-slate-300">
          Create custom actions to get personalized suggestions based on your profiles.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Your Personalized Suggestions</h3>
      {suggestions.map((suggestion) => {
        const IconComponent = getCategoryIcon(suggestion.category);
        return (
          <Card key={suggestion.id} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">
                      {ACTION_CATEGORIES.find(cat => cat.value === suggestion.category)?.label}
                    </h4>
                    {suggestion.partnerMood && (
                      <p className="text-sm text-slate-300">For when they're: {suggestion.partnerMood}</p>
                    )}
                  </div>
                  <span className="text-sm text-slate-400">{suggestion.timestamp}</span>
                </div>
                
                {(suggestion.occasion || suggestion.context) && (
                  <div className="bg-white/5 p-3 rounded-lg mb-4 text-sm border border-white/10">
                    {suggestion.occasion && <p className="text-slate-300"><strong className="text-white">Occasion:</strong> {suggestion.occasion}</p>}
                    {suggestion.context && <p className="text-slate-300"><strong className="text-white">Context:</strong> {suggestion.context}</p>}
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none text-slate-300">
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
