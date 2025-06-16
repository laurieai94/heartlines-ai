import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures" },
  { value: "special", label: "Special Occasions" },
  { value: "support", label: "Emotional Support" },
  { value: "quality-time", label: "Quality Time" },
  { value: "communication", label: "Communication" }
];

interface ActionFormProps {
  partnerMood: string;
  setPartnerMood: (value: string) => void;
  occasion: string;
  setOccasion: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  context: string;
  setContext: (value: string) => void;
  loading: boolean;
  onGenerateSuggestions: () => void;
  partnerName?: string;
  partnerProfile?: any;
}

const ActionForm = ({
  partnerMood,
  setPartnerMood,
  occasion,
  setOccasion,
  category,
  setCategory,
  context,
  setContext,
  loading,
  onGenerateSuggestions,
  partnerName,
  partnerProfile
}: ActionFormProps) => {
  return (
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
            onClick={onGenerateSuggestions}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 w-full"
          >
            {loading ? "Generating Ideas..." : "Get Thoughtful Suggestions"}
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActionForm;
