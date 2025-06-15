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

const COMMUNICATION_STYLES = [
  "Direct and straightforward",
  "Gentle and diplomatic", 
  "Emotional and expressive",
  "Analytical and detailed",
  "Context-dependent"
];

const CONFLICT_APPROACHES = [
  "Address immediately",
  "Need processing time",
  "Avoid when possible",
  "Seek compromise",
  "Varies by situation"
];

const LOVE_LANGUAGES = [
  "Words of Affirmation",
  "Quality Time",
  "Physical Touch", 
  "Acts of Service",
  "Receiving Gifts",
  "Combination"
];

const QUALITY_TIME_OPTIONS = [
  "Undivided attention",
  "Shared activities",
  "Deep conversations",
  "Comfortable silence together"
];

const STRESS_RESPONSES = [
  "Want to talk it out",
  "Need space to process",
  "Seek physical comfort",
  "Get busy with tasks",
  "Withdraw from others"
];

const STRESS_HELP = [
  "Physical comfort",
  "Verbal reassurance", 
  "Practical help",
  "Alone time",
  "Distraction/activities"
];

const CORE_VALUES = [
  "Family/relationships", "Career", "Adventure", "Security", 
  "Creativity", "Health", "Freedom", "Growth", "Community", "Authenticity"
];

const DECISION_STYLES = [
  "Quick gut decisions",
  "Need time to research",
  "Prefer collaborative decisions", 
  "Avoid decisions when possible"
];

const ATTACHMENT_STYLES = [
  "Comfortable with closeness and independence",
  "Sometimes worry about relationship security",
  "Highly value independence",
  "Want closeness but sometimes fear getting hurt",
  "Still figuring it out"
];

const GROWTH_AREAS = [
  "Better communication",
  "Setting boundaries",
  "Being more vulnerable",
  "Managing relationship anxiety",
  "Balancing independence with partnership"
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
              <div>
                <Label className="text-base font-semibold">Communication Style *</Label>
                <p className="text-sm text-gray-600 mb-3">How this helps: Better conversation suggestions</p>
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

              <div>
                <Label className="text-base font-semibold">Conflict Approach *</Label>
                <RadioGroup 
                  value={currentProfile.conflictApproach}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, conflictApproach: value})}
                  className="mt-3"
                >
                  {CONFLICT_APPROACHES.map((approach) => (
                    <div key={approach} className="flex items-center space-x-2">
                      <RadioGroupItem value={approach} id={approach} />
                      <Label htmlFor={approach}>{approach}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Collapsible open={expandedSections.communicationDeep} onOpenChange={() => toggleExpanded('communicationDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Want more specific insights?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="upsetBehavior">When upset behavior patterns</Label>
                    <Textarea
                      id="upsetBehavior"
                      value={currentProfile.upsetBehavior || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, upsetBehavior: e.target.value})}
                      placeholder="Describe behavior patterns when upset..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="howHeard">How they feel heard</Label>
                    <Textarea
                      id="howHeard"
                      value={currentProfile.howHeard || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, howHeard: e.target.value})}
                      placeholder="What makes them feel heard and understood..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="apologyStyle">Apology styles (giving/receiving)</Label>
                    <Textarea
                      id="apologyStyle"
                      value={currentProfile.apologyStyle || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, apologyStyle: e.target.value})}
                      placeholder="How they give and receive apologies..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="love" className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Primary Love Language *</Label>
                <RadioGroup 
                  value={currentProfile.loveLanguage}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, loveLanguage: value})}
                  className="mt-3"
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
                <Label className="text-base font-semibold">Quality Time Means... *</Label>
                <RadioGroup 
                  value={currentProfile.qualityTimeMeans}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, qualityTimeMeans: value})}
                  className="mt-3"
                >
                  {QUALITY_TIME_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Collapsible open={expandedSections.loveDeep} onOpenChange={() => toggleExpanded('loveDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Get personalized suggestions?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="affirmationExamples">Specific words of affirmation examples</Label>
                    <Textarea
                      id="affirmationExamples"
                      value={currentProfile.affirmationExamples || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, affirmationExamples: e.target.value})}
                      placeholder="What words or phrases mean the most..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="touchPreferences">Physical touch preferences</Label>
                    <Textarea
                      id="touchPreferences"
                      value={currentProfile.touchPreferences || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, touchPreferences: e.target.value})}
                      placeholder="Preferred types of physical affection..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="stress" className="space-y-6">
              <div>
                <Label className="text-base font-semibold">When Stressed, I Usually... *</Label>
                <RadioGroup 
                  value={currentProfile.stressResponse}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, stressResponse: value})}
                  className="mt-3"
                >
                  {STRESS_RESPONSES.map((response) => (
                    <div key={response} className="flex items-center space-x-2">
                      <RadioGroupItem value={response} id={response} />
                      <Label htmlFor={response}>{response}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold">What Helps When I'm Stressed *</Label>
                <RadioGroup 
                  value={currentProfile.stressHelp}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, stressHelp: value})}
                  className="mt-3"
                >
                  {STRESS_HELP.map((help) => (
                    <div key={help} className="flex items-center space-x-2">
                      <RadioGroupItem value={help} id={help} />
                      <Label htmlFor={help}>{help}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Collapsible open={expandedSections.stressDeep} onOpenChange={() => toggleExpanded('stressDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Help your partner support you better?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="stressTriggers">Common stress triggers</Label>
                    <Textarea
                      id="stressTriggers"
                      value={currentProfile.stressTriggers || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, stressTriggers: e.target.value})}
                      placeholder="What typically causes stress..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="warningSignsStress">Early warning signs</Label>
                    <Textarea
                      id="warningSignsStress"
                      value={currentProfile.warningSignsStress || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, warningSignsStress: e.target.value})}
                      placeholder="Signs that stress is building up..."
                    />
                  </div>
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

              <div>
                <Label className="text-base font-semibold">Decision Making Style *</Label>
                <RadioGroup 
                  value={currentProfile.decisionMaking}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, decisionMaking: value})}
                  className="mt-3"
                >
                  {DECISION_STYLES.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style}>{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Collapsible open={expandedSections.valuesDeep} onOpenChange={() => toggleExpanded('valuesDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ More personalized daily insights?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="moneyMindset">Money mindset and financial values</Label>
                    <Textarea
                      id="moneyMindset"
                      value={currentProfile.moneyMindset || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, moneyMindset: e.target.value})}
                      placeholder="Approach to money and financial decisions..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="workLife">Work-life balance preferences</Label>
                    <Textarea
                      id="workLife"
                      value={currentProfile.workLife || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, workLife: e.target.value})}
                      placeholder="How you prefer to balance work and personal life..."
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <div>
                <Label className="text-base font-semibold">My Attachment Style *</Label>
                <p className="text-sm text-gray-600 mb-3">No judgment - helps understand patterns</p>
                <RadioGroup 
                  value={currentProfile.attachmentStyle}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, attachmentStyle: value})}
                >
                  {ATTACHMENT_STYLES.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style} className="text-sm">{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold">Current Growth Area *</Label>
                <RadioGroup 
                  value={currentProfile.growthArea}
                  onValueChange={(value) => setCurrentProfile({...currentProfile, growthArea: value})}
                  className="mt-3"
                >
                  {GROWTH_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <RadioGroupItem value={area} id={area} />
                      <Label htmlFor={area}>{area}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Collapsible open={expandedSections.patternsDeep} onOpenChange={() => toggleExpanded('patternsDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Deeper relationship insights?</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="pastPatterns">Past relationship patterns</Label>
                    <Textarea
                      id="pastPatterns"
                      value={currentProfile.pastPatterns || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, pastPatterns: e.target.value})}
                      placeholder="Patterns you've noticed in past relationships..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="familyInfluence">Family background influence</Label>
                    <Textarea
                      id="familyInfluence"
                      value={currentProfile.familyInfluence || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, familyInfluence: e.target.value})}
                      placeholder="How family background influences your relationships..."
                    />
                  </div>
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
