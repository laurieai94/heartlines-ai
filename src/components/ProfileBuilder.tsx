import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, User, Plus, ChevronDown, Check, Clock } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  communicationStyle: string;
  conflictApproach: string;
  loveLanguage: string;
  qualityTimeMeans: string;
  stressResponse: string;
  stressHelp: string;
  coreValues: string[];
  decisionMaking: string;
  attachmentStyle: string;
  growthArea: string;
  // Deep dive fields
  upsetBehavior?: string;
  howHeard?: string;
  apologyStyle?: string;
  overwhelmSigns?: string;
  communicationTriggers?: string;
  affirmationExamples?: string;
  touchPreferences?: string;
  serviceIdeas?: string;
  giftPreferences?: string;
  qualityTimeDetails?: string;
  stressTriggers?: string;
  warningSignsStress?: string;
  stressWorsen?: string;
  anxietyPatterns?: string;
  energyMoods?: string;
  moneyMindset?: string;
  workLife?: string;
  socialEnergy?: string;
  routinePrefs?: string;
  householdStyle?: string;
  pastPatterns?: string;
  familyInfluence?: string;
  therapyExperience?: string;
  relationshipTriggers?: string;
  intimacyPatterns?: string;
}

const RATING_SCALE = [
  "Strongly Agree",
  "Agree", 
  "Neutral",
  "Disagree",
  "Strongly Disagree"
];

const CORE_VALUES = [
  "Family/relationships", "Career", "Adventure", "Security", 
  "Creativity", "Health", "Freedom", "Growth", "Community", "Authenticity"
];

const ProfileBuilder = () => {
  const [profiles, setProfiles] = useState<{your: ProfileData[], partner: ProfileData[]}>({
    your: [],
    partner: []
  });
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("communication");
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  
  const [currentProfile, setCurrentProfile] = useState<ProfileData>({
    name: "",
    communicationStyle: "",
    conflictApproach: "",
    loveLanguage: "",
    qualityTimeMeans: "",
    stressResponse: "",
    stressHelp: "",
    coreValues: [],
    decisionMaking: "",
    attachmentStyle: "",
    growthArea: ""
  });

  const handleSaveProfile = () => {
    if (!currentProfile.name || !currentProfile.communicationStyle || !currentProfile.loveLanguage) {
      toast.error("Please complete the core questions for at least one section");
      return;
    }

    setProfiles(prev => ({
      ...prev,
      [activeProfileType]: [...prev[activeProfileType], { ...currentProfile, id: Date.now() }]
    }));
    
    setCurrentProfile({
      name: "",
      communicationStyle: "",
      conflictApproach: "",
      loveLanguage: "",
      qualityTimeMeans: "",
      stressResponse: "",
      stressHelp: "",
      coreValues: [],
      decisionMaking: "",
      attachmentStyle: "",
      growthArea: ""
    });
    setShowForm(false);
    setExpandedSections({});
    toast.success(`${activeProfileType === 'your' ? 'Your' : 'Partner'} profile created successfully!`);
  };

  const handleValueChange = (value: string, checked: boolean) => {
    if (checked) {
      setCurrentProfile(prev => ({
        ...prev,
        coreValues: [...prev.coreValues, value]
      }));
    } else {
      setCurrentProfile(prev => ({
        ...prev,
        coreValues: prev.coreValues.filter(v => v !== value)
      }));
    }
  };

  const toggleExpanded = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCoreCompletion = () => {
    const coreFields = ['communicationStyle', 'conflictApproach', 'loveLanguage', 'qualityTimeMeans', 'stressResponse', 'stressHelp', 'decisionMaking', 'attachmentStyle', 'growthArea'];
    const completed = coreFields.filter(field => currentProfile[field as keyof ProfileData]).length;
    return Math.round((completed / coreFields.length) * 100);
  };

  const RatingQuestion = ({ 
    label, 
    field, 
    description 
  }: { 
    label: string; 
    field: keyof ProfileData; 
    description: string;
  }) => (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <RadioGroup 
        value={currentProfile[field] as string || ''}
        onValueChange={(value) => setCurrentProfile({...currentProfile, [field]: value})}
        className="space-y-2"
      >
        {RATING_SCALE.map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <RadioGroupItem value={rating} id={`${field}-${rating}`} />
            <Label htmlFor={`${field}-${rating}`} className="text-sm">{rating}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Relationship Profiles</h2>
          <p className="text-gray-600">Complete the basics in 5 minutes, expand sections anytime for better insights</p>
        </div>
      </div>

      {/* Profile Type Selector */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`p-6 cursor-pointer transition-all ${activeProfileType === 'your' ? 'ring-2 ring-pink-500 bg-pink-50' : 'bg-white/60 hover:bg-white/80'}`}
          onClick={() => setActiveProfileType('your')}
        >
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-pink-600" />
            <div>
              <h3 className="font-bold">Your Profile</h3>
              <p className="text-sm text-gray-600">{profiles.your.length} profile(s)</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`p-6 cursor-pointer transition-all ${activeProfileType === 'partner' ? 'ring-2 ring-pink-500 bg-pink-50' : 'bg-white/60 hover:bg-white/80'}`}
          onClick={() => setActiveProfileType('partner')}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-600" />
            <div>
              <h3 className="font-bold">Partner Profile</h3>
              <p className="text-sm text-gray-600">{profiles.partner.length} profile(s)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Profile Button */}
      <div className="text-center">
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeProfileType === 'your' ? 'Your' : 'Partner'} Profile
        </Button>
      </div>

      {/* Existing Profiles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles[activeProfileType].map((profile: any) => (
          <Card key={profile.id} className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                {activeProfileType === 'your' ? <User className="w-6 h-6 text-pink-600" /> : <Heart className="w-6 h-6 text-pink-600" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-600">{activeProfileType === 'your' ? 'Your Profile' : 'Partner Profile'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Communication:</span> {profile.communicationStyle}</p>
              <p><span className="font-medium">Love Language:</span> {profile.loveLanguage}</p>
              <p><span className="font-medium">Growth Focus:</span> {profile.growthArea}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Form */}
      {showForm && (
        <Card className="p-8 bg-white/90 backdrop-blur-md border-0 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Create {activeProfileType === 'your' ? 'Your' : 'Partner'} Profile
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Core completion: {getCoreCompletion()}%
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={currentProfile.name}
              onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
              placeholder={activeProfileType === 'your' ? 'Your name' : 'Partner\'s name'}
              className="mt-1"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="love">Love Languages</TabsTrigger>
              <TabsTrigger value="stress">Stress & Support</TabsTrigger>
              <TabsTrigger value="values">Values & Life</TabsTrigger>
              <TabsTrigger value="patterns">Relationship</TabsTrigger>
            </TabsList>

            <TabsContent value="communication" className="space-y-6">
              <RatingQuestion
                label="I prefer direct and straightforward communication *"
                field="communicationStyle"
                description="How this helps: Better conversation suggestions"
              />

              <RatingQuestion
                label="I like to address conflicts immediately *"
                field="conflictApproach"
                description="Understanding your conflict approach"
              />

              <Collapsible open={expandedSections.communicationDeep} onOpenChange={() => toggleExpanded('communicationDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Want more specific insights?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <RatingQuestion
                    label="I shut down when someone raises their voice"
                    field="upsetBehavior"
                    description="Understanding upset behavior patterns"
                  />
                  <RatingQuestion
                    label="I feel heard when someone repeats back what I said"
                    field="howHeard"
                    description="What makes you feel understood"
                  />
                  <RatingQuestion
                    label="I prefer specific apologies that acknowledge what went wrong"
                    field="apologyStyle"
                    description="Your apology preferences"
                  />
                  <RatingQuestion
                    label="I get overwhelmed when too many topics are discussed at once"
                    field="overwhelmSigns"
                    description="Recognizing overwhelm patterns"
                  />
                  <RatingQuestion
                    label="Interrupting during conversations really bothers me"
                    field="communicationTriggers"
                    description="Communication triggers to avoid"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="love" className="space-y-6">
              <RatingQuestion
                label="Words of affirmation are my primary love language *"
                field="loveLanguage"
                description="Understanding your primary love language"
              />

              <RatingQuestion
                label="Quality time means undivided attention to me *"
                field="qualityTimeMeans"
                description="What quality time means to you"
              />

              <Collapsible open={expandedSections.loveDeep} onOpenChange={() => toggleExpanded('loveDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Get personalized suggestions?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <RatingQuestion
                    label="I prefer compliments about my character over my appearance"
                    field="affirmationExamples"
                    description="Words of affirmation preferences"
                  />
                  <RatingQuestion
                    label="I enjoy casual physical touch throughout the day"
                    field="touchPreferences"
                    description="Physical touch comfort level"
                  />
                  <RatingQuestion
                    label="Small daily acts of service mean more to me than grand gestures"
                    field="serviceIdeas"
                    description="Acts of service preferences"
                  />
                  <RatingQuestion
                    label="I prefer thoughtful gifts over expensive ones"
                    field="giftPreferences"
                    description="Gift-giving philosophy"
                  />
                  <RatingQuestion
                    label="Phone-free time together is essential for me to feel connected"
                    field="qualityTimeDetails"
                    description="Quality time specifics"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="stress" className="space-y-6">
              <RatingQuestion
                label="When stressed, I usually want to talk it out *"
                field="stressResponse"
                description="Understanding your stress response"
              />

              <RatingQuestion
                label="Physical comfort helps me when I'm stressed *"
                field="stressHelp"
                description="What helps when you're stressed"
              />

              <Collapsible open={expandedSections.stressDeep} onOpenChange={() => toggleExpanded('stressDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Help your partner support you better?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <RatingQuestion
                    label="Work deadlines are my biggest stress trigger"
                    field="stressTriggers"
                    description="Common stress triggers"
                  />
                  <RatingQuestion
                    label="I get quiet and withdrawn when stress builds up"
                    field="warningSignsStress"
                    description="Early warning signs"
                  />
                  <RatingQuestion
                    label="Talking about my problems when I'm stressed makes it worse"
                    field="stressWorsen"
                    description="What makes stress worse"
                  />
                  <RatingQuestion
                    label="I tend to overthink situations when I'm anxious"
                    field="anxietyPatterns"
                    description="Anxiety response patterns"
                  />
                  <RatingQuestion
                    label="My energy levels greatly affect my mood"
                    field="energyMoods"
                    description="Energy and mood connection"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="values" className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Top 3 Core Values *</Label>
                <p className="text-sm text-gray-600 mb-3">Select your most important values</p>
                <div className="grid grid-cols-2 gap-2">
                  {CORE_VALUES.map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={value}
                        checked={currentProfile.coreValues.includes(value)}
                        onCheckedChange={(checked) => handleValueChange(value, !!checked)}
                        disabled={!currentProfile.coreValues.includes(value) && currentProfile.coreValues.length >= 3}
                      />
                      <Label htmlFor={value} className="text-sm">{value}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <RatingQuestion
                label="I prefer to make quick gut decisions *"
                field="decisionMaking"
                description="Understanding your decision making style"
              />

              <Collapsible open={expandedSections.valuesDeep} onOpenChange={() => toggleExpanded('valuesDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ More personalized daily insights?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <RatingQuestion
                    label="I prefer to save money rather than spend on experiences"
                    field="moneyMindset"
                    description="Financial values and approach"
                  />
                  <RatingQuestion
                    label="I need clear boundaries between work and personal time"
                    field="workLife"
                    description="Work-life balance preferences"
                  />
                  <RatingQuestion
                    label="I recharge better with alone time than social activities"
                    field="socialEnergy"
                    description="Social energy preferences"
                  />
                  <RatingQuestion
                    label="I function better with consistent daily routines"
                    field="routinePrefs"
                    description="Routine and structure needs"
                  />
                  <RatingQuestion
                    label="I prefer a tidy, organized living space"
                    field="householdStyle"
                    description="Household and lifestyle preferences"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <RatingQuestion
                label="I am comfortable with both closeness and independence *"
                field="attachmentStyle"
                description="No judgment - helps understand patterns"
              />

              <RatingQuestion
                label="I am focused on improving my communication skills *"
                field="growthArea"
                description="Current growth area focus"
              />

              <Collapsible open={expandedSections.patternsDeep} onOpenChange={() => toggleExpanded('patternsDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Deeper relationship insights?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <RatingQuestion
                    label="I tend to repeat the same relationship patterns"
                    field="pastPatterns"
                    description="Past relationship patterns"
                  />
                  <RatingQuestion
                    label="My family background strongly influences my relationship style"
                    field="familyInfluence"
                    description="Family background influence"
                  />
                  <RatingQuestion
                    label="I'm actively working on personal development and growth"
                    field="therapyExperience"
                    description="Personal development engagement"
                  />
                  <RatingQuestion
                    label="Certain topics or situations trigger strong emotional reactions in relationships"
                    field="relationshipTriggers"
                    description="Relationship triggers awareness"
                  />
                  <RatingQuestion
                    label="I'm comfortable with emotional and physical intimacy"
                    field="intimacyPatterns"
                    description="Intimacy comfort level"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-8">
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-pink-500 to-fuchsia-500">
              <Check className="w-4 h-4 mr-2" />
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
