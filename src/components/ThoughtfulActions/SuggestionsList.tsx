
import { Card } from "@/components/ui/card";
import { Coffee, Gift, Heart, Calendar, MessageSquare } from "lucide-react";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures", icon: Coffee },
  { value: "special", label: "Special Occasions", icon: Gift },
  { value: "support", label: "Emotional Support", icon: Heart },
  { value: "quality-time", label: "Quality Time", icon: Calendar },
  { value: "communication", label: "Communication", icon: MessageSquare }
];

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
  suggestions: Suggestion[];
}

const SuggestionsList = ({ suggestions }: SuggestionsListProps) => {
  const getCategoryIcon = (categoryValue: string) => {
    const category = ACTION_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.icon : Heart;
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Your Personalized Suggestions</h3>
      {suggestions.map((suggestion) => {
        const IconComponent = getCategoryIcon(suggestion.category);
        return (
          <Card key={suggestion.id} className="p-6 bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {ACTION_CATEGORIES.find(cat => cat.value === suggestion.category)?.label}
                    </h4>
                    {suggestion.partnerMood && (
                      <p className="text-sm text-gray-600">For when they're: {suggestion.partnerMood}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{suggestion.timestamp}</span>
                </div>
                
                {(suggestion.occasion || suggestion.context) && (
                  <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 p-3 rounded-lg mb-4 text-sm">
                    {suggestion.occasion && <p><strong>Occasion:</strong> {suggestion.occasion}</p>}
                    {suggestion.context && <p><strong>Context:</strong> {suggestion.context}</p>}
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none text-gray-700">
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
