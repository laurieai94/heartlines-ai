
import { useState } from "react";
import { toast } from "sonner";
import RelationshipAlerts from "./ThoughtfulActions/RelationshipAlerts";
import ActionForm from "./ThoughtfulActions/ActionForm";
import QuickActions from "./ThoughtfulActions/QuickActions";
import SuggestionsList from "./ThoughtfulActions/SuggestionsList";

interface Suggestion {
  id: number;
  category: string;
  partnerMood: string;
  occasion: string;
  context: string;
  suggestions: string;
  timestamp: string;
}

const ThoughtfulActions = () => {
  const [partnerMood, setPartnerMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const generateSuggestions = async () => {
    if (!apiKey) {
      toast.error("Please enter your Anthropic API key in the AI Insights section first");
      return;
    }

    if (!category) {
      toast.error("Please select an action category");
      return;
    }

    setLoading(true);

    try {
      const prompt = `Generate 5 thoughtful, personalized action suggestions for a relationship partner.

Category: ${category}
${partnerMood ? `Partner's current mood/state: ${partnerMood}` : ''}
${occasion ? `Occasion/Context: ${occasion}` : ''}
${context ? `Additional context: ${context}` : ''}

Please provide:
1. Specific, actionable suggestions
2. Brief explanation of why each suggestion would be meaningful
3. Tips for execution
4. Estimated time/effort required

Format each suggestion as:
**Action**: [Brief title]
**Why it matters**: [Explanation]
**How to do it**: [Practical steps]
**Time needed**: [Estimate]

Keep suggestions realistic, thoughtful, and personalized to the context provided.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1200,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      const newSuggestion: Suggestion = {
        id: Date.now(),
        category,
        partnerMood,
        occasion,
        context,
        suggestions: data.content[0].text,
        timestamp: new Date().toLocaleString()
      };

      setSuggestions([newSuggestion, ...suggestions]);
      toast.success("Thoughtful actions generated!");
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error("Failed to generate suggestions. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (categoryValue: string) => {
    setCategory(categoryValue);
    setPartnerMood("having a regular day");
    setOccasion("");
    setContext("Looking for simple ways to show I care");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thoughtful Actions</h2>
        <p className="text-gray-600">Get personalized suggestions for meaningful gestures based on your partner's current needs and mood</p>
      </div>

      <RelationshipAlerts />

      <ActionForm
        partnerMood={partnerMood}
        setPartnerMood={setPartnerMood}
        occasion={occasion}
        setOccasion={setOccasion}
        category={category}
        setCategory={setCategory}
        context={context}
        setContext={setContext}
        loading={loading}
        onGenerateSuggestions={generateSuggestions}
      />

      <QuickActions onQuickAction={handleQuickAction} />

      <SuggestionsList suggestions={suggestions} />
    </div>
  );
};

export default ThoughtfulActions;
