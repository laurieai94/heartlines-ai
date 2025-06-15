import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart, Sparkles, Calendar, Coffee, Gift, MessageSquare, Bell, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures", icon: Coffee },
  { value: "special", label: "Special Occasions", icon: Gift },
  { value: "support", label: "Emotional Support", icon: Heart },
  { value: "quality-time", label: "Quality Time", icon: Calendar },
  { value: "communication", label: "Communication", icon: MessageSquare }
];

const RELATIONSHIP_ALERTS = [
  {
    id: 1,
    title: "Daily Check-in",
    message: "Ask your partner how they're feeling today",
    frequency: "Daily",
    icon: Heart,
    completed: false
  },
  {
    id: 2,
    title: "Express Gratitude",
    message: "Tell your partner one thing you appreciate about them",
    frequency: "Daily",
    icon: Sparkles,
    completed: false
  },
  {
    id: 3,
    title: "Quality Time",
    message: "Plan 15 minutes of phone-free time together",
    frequency: "Daily",
    icon: Calendar,
    completed: false
  },
  {
    id: 4,
    title: "Physical Affection",
    message: "Give your partner a hug or kiss without expecting anything in return",
    frequency: "Daily",
    icon: Heart,
    completed: false
  },
  {
    id: 5,
    title: "Active Listening",
    message: "Ask your partner about their day and really listen to their response",
    frequency: "Daily",
    icon: MessageSquare,
    completed: false
  }
];

const ThoughtfulActions = () => {
  const [partnerMood, setPartnerMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [alerts, setAlerts] = useState(RELATIONSHIP_ALERTS);

  const toggleAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, completed: !alert.completed }
        : alert
    ));
    
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.completed) {
      toast.success(`Great job! You completed: ${alert.title}`);
    }
  };

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
      const newSuggestion = {
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

  const getCategoryIcon = (categoryValue) => {
    const category = ACTION_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.icon : Heart;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thoughtful Actions</h2>
        <p className="text-gray-600">Get personalized suggestions for meaningful gestures based on your partner's current needs and mood</p>
      </div>

      {/* Daily Relationship Alerts */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200/50">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Relationship Reminders</h3>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <Alert key={alert.id} className={`transition-all duration-200 ${
                alert.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-pink-200 hover:border-pink-300'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.completed 
                      ? 'bg-green-100' 
                      : 'bg-pink-100'
                  }`}>
                    {alert.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <IconComponent className="w-4 h-4 text-pink-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <AlertTitle className={alert.completed ? 'text-green-900 line-through' : 'text-gray-900'}>
                      {alert.title}
                    </AlertTitle>
                    <AlertDescription className={alert.completed ? 'text-green-700 line-through' : 'text-gray-600'}>
                      {alert.message}
                    </AlertDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlert(alert.id)}
                    className={alert.completed ? 'text-green-600 hover:text-green-700' : 'text-pink-600 hover:text-pink-700'}
                  >
                    {alert.completed ? 'Undo' : 'Done'}
                  </Button>
                </div>
              </Alert>
            );
          })}
        </div>
      </Card>

      {/* Input Form */}
      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Action Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="What kind of gesture?" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="partnerMood">Partner's Current Mood/State</Label>
              <Input
                id="partnerMood"
                value={partnerMood}
                onChange={(e) => setPartnerMood(e.target.value)}
                placeholder="e.g., stressed, excited, tired, celebrating"
              />
            </div>

            <div>
              <Label htmlFor="occasion">Occasion (Optional)</Label>
              <Input
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g., birthday, anniversary, bad day at work"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Any other details about your partner's preferences, current situation, or what you're hoping to achieve..."
                rows={4}
              />
            </div>

            <Button 
              onClick={generateSuggestions}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 w-full"
            >
              {loading ? "Generating Ideas..." : "Get Thoughtful Suggestions"}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-fuchsia-50 border-pink-200/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Inspiration</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACTION_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Button
                key={cat.value}
                variant="outline"
                onClick={() => {
                  setCategory(cat.value);
                  setPartnerMood("having a regular day");
                  setOccasion("");
                  setContext("Looking for simple ways to show I care");
                }}
                className="flex items-center gap-2 h-auto py-3 px-4 justify-start"
              >
                <IconComponent className="w-4 h-4 text-pink-600" />
                <span className="text-sm">{cat.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Generated Suggestions */}
      {suggestions.length > 0 && (
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
      )}
    </div>
  );
};

export default ThoughtfulActions;
