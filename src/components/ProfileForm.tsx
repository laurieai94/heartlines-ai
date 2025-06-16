import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, User, Heart, Info } from "lucide-react";

interface ProfileFormProps {
  profileType: 'your' | 'partner';
  onClose: () => void;
  onComplete: (profileData: any) => void;
  demographicsData?: any;
}

const ProfileForm = ({ profileType, onClose, onComplete, demographicsData }: ProfileFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    relationshipLength: "",
    relationshipStatus: "",
    age: "",
    communicationStyle: "",
    loveLanguages: [] as string[],
    attachmentStyle: "",
    conflictResolution: "",
    emotionalNeeds: "",
    // Page 2 - Values & Beliefs
    coreValues: [] as string[],
    spiritualBeliefs: "",
    politicalViews: "",
    lifeGoals: "",
    personalPriorities: "",
    // Page 3 - Lifestyle & Interests
    hobbies: "",
    socialActivities: "",
    travelPreferences: "",
    dailyRoutine: "",
    futurePlans: "",
    // Page 4 - Challenges & Support
    stressTriggers: "",
    copingMechanisms: "",
    supportSystem: "",
    personalGrowth: "",
    relationshipChallenges: ""
  });

  // Auto-populate name from demographics data
  useEffect(() => {
    if (demographicsData?.name) {
      setFormData(prev => ({
        ...prev,
        name: demographicsData.name
      }));
    }
  }, [demographicsData]);

  const isPartner = profileType === 'partner';
  const totalPages = 4;
  const progressValue = (currentPage / totalPages) * 100;

  const RELATIONSHIP_LENGTH_OPTIONS = [
    "Less than 6 months",
    "6 months - 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ];

  const RELATIONSHIP_STATUS_OPTIONS = [
    "Dating",
    "In a relationship",
    "Engaged",
    "Married",
    "Complicated",
    "Open relationship"
  ];

  const COMMUNICATION_STYLE_OPTIONS = [
    "Direct and honest",
    "Supportive and empathetic",
    "Logical and rational",
    "Passionate and expressive",
    "Reserved and thoughtful",
    "Other"
  ];

  const LOVE_LANGUAGES_OPTIONS = [
    "Words of Affirmation",
    "Acts of Service",
    "Receiving Gifts",
    "Quality Time",
    "Physical Touch"
  ];

  const ATTACHMENT_STYLE_OPTIONS = [
    "Secure",
    "Anxious",
    "Avoidant",
    "Fearful-avoidant"
  ];

  const CONFLICT_RESOLUTION_OPTIONS = [
    "Compromise",
    "Collaboration",
    "Avoidance",
    "Competition",
    "Accommodation"
  ];

  const EMOTIONAL_NEEDS_OPTIONS = [
    "Affection",
    "Appreciation",
    "Acceptance",
    "Security",
    "Autonomy"
  ];

  const CORE_VALUES_OPTIONS = [
    "Honesty",
    "Loyalty",
    "Kindness",
    "Respect",
    "Responsibility",
    "Compassion",
    "Courage",
    "Creativity",
    "Faithfulness",
    "Friendship"
  ];

  const SPIRITUAL_BELIEFS_OPTIONS = [
    "Agnostic",
    "Atheist",
    "Buddhist",
    "Christian",
    "Hindu",
    "Jewish",
    "Muslim",
    "Spiritual but not religious",
    "Other"
  ];

  const POLITICAL_VIEWS_OPTIONS = [
    "Liberal",
    "Conservative",
    "Moderate",
    "Libertarian",
    "Socialist",
    "Green Party",
    "Other"
  ];

  const LIFE_GOALS_OPTIONS = [
    "Career success",
    "Family and relationships",
    "Personal growth",
    "Financial security",
    "Making a difference in the world",
    "Creative expression",
    "Travel and adventure",
    "Health and wellness",
    "Lifelong learning",
    "Spiritual fulfillment"
  ];

  const PERSONAL_PRIORITIES_OPTIONS = [
    "Work-life balance",
    "Health and fitness",
    "Relationships with family and friends",
    "Personal development",
    "Financial stability",
    "Community involvement",
    "Creative pursuits",
    "Travel and exploration",
    "Spiritual practice",
    "Social justice"
  ];

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  {isPartner ? <Heart className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Create {isPartner ? 'Your Partner\'s' : 'Your'} Profile
                  </h1>
                  <p className="text-gray-600">
                    Build a comprehensive relationship profile (5-7 minutes)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={progressValue} className="w-32" />
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {currentPage === 1 && (
            <>
              {/* Basic Information */}
              <Card className="p-6 bg-blue-50 border-blue-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Let's Start with the Basics</h3>
                <p className="text-gray-700">
                  {demographicsData?.name ? 
                    `We've pre-filled ${demographicsData.name}'s name from the previous step. You can update any information as needed.` :
                    `Tell us about ${isPartner ? 'your partner' : 'yourself'} to get started.`
                  }
                </p>
              </Card>

              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {isPartner ? "Partner's Name" : "Your Name"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={`Enter ${isPartner ? 'their' : 'your'} name`}
                    required
                  />
                  {demographicsData?.name && (
                    <p className="text-sm text-green-600">
                      ✓ Pre-filled from demographics
                    </p>
                  )}
                </div>

                {/* Relationship Length */}
                <div className="space-y-3">
                  <Label>Relationship Length <span className="text-red-500">*</span></Label>
                  <Select value={formData.relationshipLength} onValueChange={(value) => setFormData({...formData, relationshipLength: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_LENGTH_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Relationship Status */}
                <div className="space-y-3">
                  <Label>Relationship Status <span className="text-red-500">*</span></Label>
                  <Select value={formData.relationshipStatus} onValueChange={(value) => setFormData({...formData, relationshipStatus: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_STATUS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button 
                  onClick={() => setCurrentPage(2)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!formData.name || !formData.relationshipLength || !formData.relationshipStatus}
                >
                  Continue to Communication
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Save Progress & Close
                </Button>
              </div>
            </>
          )}

          {currentPage === 2 && (
            <>
              {/* Communication Style */}
              <Card className="p-6 bg-green-50 border-green-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication Preferences</h3>
                <p className="text-gray-700">
                  How does {isPartner ? 'your partner' : 'yourself'} prefer to communicate?
                </p>
              </Card>

              <div className="space-y-6">
                {/* Communication Style */}
                <div className="space-y-3">
                  <Label>Communication Style</Label>
                  <Select value={formData.communicationStyle} onValueChange={(value) => setFormData({...formData, communicationStyle: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNICATION_STYLE_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Love Languages */}
                <div className="space-y-4">
                  <Label>Love Languages</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                    {LOVE_LANGUAGES_OPTIONS.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`love-${option}`}
                          checked={formData.loveLanguages.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('loveLanguages', option, checked as boolean)}
                        />
                        <Label htmlFor={`love-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachment Style */}
                <div className="space-y-3">
                  <Label>Attachment Style</Label>
                  <Select value={formData.attachmentStyle} onValueChange={(value) => setFormData({...formData, attachmentStyle: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTACHMENT_STYLE_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Conflict Resolution */}
                <div className="space-y-3">
                  <Label>Conflict Resolution Style</Label>
                  <Select value={formData.conflictResolution} onValueChange={(value) => setFormData({...formData, conflictResolution: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONFLICT_RESOLUTION_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Emotional Needs */}
                <div className="space-y-3">
                  <Label>Emotional Needs</Label>
                  <Select value={formData.emotionalNeeds} onValueChange={(value) => setFormData({...formData, emotionalNeeds: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select needs" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMOTIONAL_NEEDS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setCurrentPage(1)} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Page
                </Button>
                <Button onClick={() => setCurrentPage(3)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  Continue to Values & Beliefs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Save Progress & Close
                </Button>
              </div>
            </>
          )}

          {currentPage === 3 && (
            <>
              {/* Values & Beliefs */}
              <Card className="p-6 bg-yellow-50 border-yellow-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Values & Beliefs</h3>
                <p className="text-gray-700">
                  What values and beliefs are important to {isPartner ? 'your partner' : 'yourself'}?
                </p>
              </Card>

              <div className="space-y-6">
                {/* Core Values */}
                <div className="space-y-4">
                  <Label>Core Values</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                    {CORE_VALUES_OPTIONS.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`value-${option}`}
                          checked={formData.coreValues.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange('coreValues', option, checked as boolean)}
                        />
                        <Label htmlFor={`value-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spiritual Beliefs */}
                <div className="space-y-3">
                  <Label>Spiritual Beliefs</Label>
                  <Select value={formData.spiritualBeliefs} onValueChange={(value) => setFormData({...formData, spiritualBeliefs: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select belief" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPIRITUAL_BELIEFS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Political Views */}
                <div className="space-y-3">
                  <Label>Political Views</Label>
                  <Select value={formData.politicalViews} onValueChange={(value) => setFormData({...formData, politicalViews: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      {POLITICAL_VIEWS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Life Goals */}
                <div className="space-y-3">
                  <Label>Life Goals</Label>
                  <Select value={formData.lifeGoals} onValueChange={(value) => setFormData({...formData, lifeGoals: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIFE_GOALS_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Priorities */}
                <div className="space-y-3">
                  <Label>Personal Priorities</Label>
                  <Select value={formData.personalPriorities} onValueChange={(value) => setFormData({...formData, personalPriorities: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERSONAL_PRIORITIES_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setCurrentPage(2)} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Page
                </Button>
                <Button onClick={() => setCurrentPage(4)} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Continue to Lifestyle
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Save Progress & Close
                </Button>
              </div>
            </>
          )}

          {currentPage === 4 && (
            <>
              {/* Lifestyle & Interests */}
              <Card className="p-6 bg-purple-50 border-purple-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lifestyle & Interests</h3>
                <p className="text-gray-700">
                  What does {isPartner ? 'your partner' : 'yourself'} enjoy doing in their free time?
                </p>
              </Card>

              <div className="space-y-6">
                {/* Hobbies */}
                <div className="space-y-2">
                  <Label htmlFor="hobbies">Hobbies</Label>
                  <Textarea
                    id="hobbies"
                    placeholder={`Enter ${isPartner ? 'their' : 'your'} hobbies`}
                    value={formData.hobbies}
                    onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
                  />
                </div>

                {/* Social Activities */}
                <div className="space-y-2">
                  <Label htmlFor="social">Social Activities</Label>
                  <Input
                    id="social"
                    placeholder={`Enter ${isPartner ? 'their' : 'your'} social activities`}
                    value={formData.socialActivities}
                    onChange={(e) => setFormData({...formData, socialActivities: e.target.value})}
                  />
                </div>

                {/* Travel Preferences */}
                <div className="space-y-2">
                  <Label htmlFor="travel">Travel Preferences</Label>
                  <Input
                    id="travel"
                    placeholder={`Enter ${isPartner ? 'their' : 'your'} travel preferences`}
                    value={formData.travelPreferences}
                    onChange={(e) => setFormData({...formData, travelPreferences: e.target.value})}
                  />
                </div>

                {/* Daily Routine */}
                <div className="space-y-2">
                  <Label htmlFor="routine">Daily Routine</Label>
                  <Textarea
                    id="routine"
                    placeholder={`Describe ${isPartner ? 'their' : 'your'} typical daily routine`}
                    value={formData.dailyRoutine}
                    onChange={(e) => setFormData({...formData, dailyRoutine: e.target.value})}
                  />
                </div>

                {/* Future Plans */}
                <div className="space-y-2">
                  <Label htmlFor="future">Future Plans</Label>
                  <Textarea
                    id="future"
                    placeholder={`Enter ${isPartner ? 'their' : 'your'} future plans and aspirations`}
                    value={formData.futurePlans}
                    onChange={(e) => setFormData({...formData, futurePlans: e.target.value})}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setCurrentPage(3)} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Page
                </Button>
                <Button onClick={() => onComplete(formData)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Complete Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Save Progress & Close
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileForm;
