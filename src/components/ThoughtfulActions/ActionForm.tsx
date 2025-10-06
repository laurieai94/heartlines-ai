
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";

const ACTION_CATEGORIES = [
  { value: "daily", label: "Daily Gestures" },
  { value: "special", label: "Special Occasions" },
  { value: "support", label: "Emotional Support" },
  { value: "quality-time", label: "Quality Time" },
  { value: "communication", label: "Communication" }
];

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface ActionFormProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  onClose: () => void;
  onSubmit: (actionData: any) => void;
}

const ActionForm = ({ profiles, demographicsData, onClose, onSubmit }: ActionFormProps) => {
  const [partnerMood, setPartnerMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  const partnerName = demographicsData.partner?.name || 'your partner';

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    
    // Create action data
    const actionData = {
      category,
      partnerMood,
      occasion,
      context,
      profiles,
      demographicsData
    };

    // Simulate API call
    setTimeout(() => {
      onSubmit(actionData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-sleek bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Custom Action</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

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
                  placeholder={`Any other details about ${partnerName}'s preferences, current situation, or what you're hoping to achieve...`}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleGenerateSuggestions}
                disabled={loading || !category}
                className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 w-full"
              >
                {loading ? "Generating Ideas..." : "Get Thoughtful Suggestions"}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActionForm;
