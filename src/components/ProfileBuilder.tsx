import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, User, Plus } from "lucide-react";
import { toast } from "sonner";

const LOVE_LANGUAGES = [
  "Words of Affirmation",
  "Quality Time", 
  "Physical Touch",
  "Acts of Service",
  "Receiving Gifts"
];

const COMMUNICATION_STYLES = [
  "Direct and straightforward",
  "Gentle and diplomatic",
  "Analytical and detailed",
  "Emotional and expressive",
  "Humor and lighthearted"
];

const ProfileBuilder = () => {
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: "",
    relationship: "",
    loveLanguage: "",
    communicationStyle: "",
    stressTriggers: "",
    supportNeeds: "",
    values: [],
    interests: "",
    currentChallenges: ""
  });

  const handleSaveProfile = () => {
    if (!currentProfile.name || !currentProfile.loveLanguage) {
      toast.error("Please fill in at least name and love language");
      return;
    }

    setProfiles([...profiles, { ...currentProfile, id: Date.now() }]);
    setCurrentProfile({
      name: "",
      relationship: "",
      loveLanguage: "",
      communicationStyle: "",
      stressTriggers: "",
      supportNeeds: "",
      values: [],
      interests: "",
      currentChallenges: ""
    });
    setShowForm(false);
    toast.success("Profile created successfully!");
  };

  const handleValueChange = (value, checked) => {
    if (checked) {
      setCurrentProfile({
        ...currentProfile,
        values: [...currentProfile.values, value]
      });
    } else {
      setCurrentProfile({
        ...currentProfile,
        values: currentProfile.values.filter(v => v !== value)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Relationship Profiles</h2>
          <p className="text-gray-600">Create detailed profiles to help AI understand your unique relationship dynamics</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Existing Profiles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id} className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.relationship}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Love Language:</span> {profile.loveLanguage}</p>
              <p><span className="font-medium">Communication:</span> {profile.communicationStyle}</p>
              {profile.values.length > 0 && (
                <p><span className="font-medium">Values:</span> {profile.values.join(", ")}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Form */}
      {showForm && (
        <Card className="p-8 bg-white/80 backdrop-blur-md border-0 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Profile</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={currentProfile.relationship}
                  onChange={(e) => setCurrentProfile({...currentProfile, relationship: e.target.value})}
                  placeholder="e.g., Partner, Spouse, Friend"
                />
              </div>

              <div>
                <Label>Love Language *</Label>
                <RadioGroup 
                  value={currentProfile.loveLanguage}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, loveLanguage: value})}
                >
                  {LOVE_LANGUAGES.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <RadioGroupItem value={language} id={language} />
                      <Label htmlFor={language}>{language}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Communication Style</Label>
                <RadioGroup 
                  value={currentProfile.communicationStyle}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, communicationStyle: value})}
                >
                  {COMMUNICATION_STYLES.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style}>{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="stressTriggers">Stress Triggers</Label>
                <Textarea
                  id="stressTriggers"
                  value={currentProfile.stressTriggers}
                  onChange={(e) => setCurrentProfile({...currentProfile, stressTriggers: e.target.value})}
                  placeholder="What causes stress or overwhelm?"
                />
              </div>

              <div>
                <Label htmlFor="supportNeeds">How They Feel Most Supported</Label>
                <Textarea
                  id="supportNeeds"
                  value={currentProfile.supportNeeds}
                  onChange={(e) => setCurrentProfile({...currentProfile, supportNeeds: e.target.value})}
                  placeholder="What makes them feel loved and supported?"
                />
              </div>

              <div>
                <Label>Core Values</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Family", "Career", "Adventure", "Security", "Creativity", "Health", "Freedom", "Growth"].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={value}
                        checked={currentProfile.values.includes(value)}
                        onCheckedChange={(checked) => handleValueChange(value, checked)}
                      />
                      <Label htmlFor={value}>{value}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="interests">Interests & Hobbies</Label>
                <Textarea
                  id="interests"
                  value={currentProfile.interests}
                  onChange={(e) => setCurrentProfile({...currentProfile, interests: e.target.value})}
                  placeholder="What do they enjoy doing?"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-pink-500 to-fuchsia-500">
              Save Profile
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfileBuilder;
