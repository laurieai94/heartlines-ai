
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, User, Plus, ChevronDown, Check, Clock } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  // Partner-specific fields
  relationshipType?: string;
  relationshipLength?: string;
  customRelationshipType?: string;
  // Communication & Conflict
  directCommunication: string;
  gentleApproach: string;
  needTimeToProcess: string;
  // Deep dive communication
  goSilentWhenUpset?: string;
  needToTalkImmediately?: string;
  feelHeardWithValidation?: string;
  needChangedBehaviorApology?: string;
  workDeadlineStress?: string;
  // Love Languages
  wordsOfAffirmation: string;
  qualityTime: string;
  physicalTouch: string;
  // Deep dive love languages
  qualityTimeUndividedAttention?: string;
  proudOfYouAffirmations?: string;
  casualTouchThroughoutDay?: string;
  householdChoresService?: string;
  thoughtfulVsExpensiveGifts?: string;
  // Stress & Support
  talkThroughStressImmediately: string;
  needSpaceToProcess: string;
  physicalComfortHelps: string;
  // Deep dive stress
  socialSituationsAnxious?: string;
  showStressThroughCommunication?: string;
  beingRushedMakesWorse?: string;
  practicalHelpRelieves?: string;
  withdrawWhenOverwhelmed?: string;
  // Values & Daily Life
  familyRelationshipsImportance: string;
  careerSuccessImportance: string;
  financialSecurityImportance: string;
  quickGutDecisions: string;
  // Deep dive values
  personalFreedomImportant?: string;
  needTimeToResearch?: string;
  saverFocusedSecurity?: string;
  socialInteractionsEnergize?: string;
  preferStructuredRoutines?: string;
  // Relationship Patterns
  comfortableClosenessIndependence: string;
  worryRelationshipSecurity: string;
  improvingCommunicationFocus: string;
  // Deep dive patterns
  wantClosenessButFearHurt?: string;
  boundariesFocus?: string;
  loseMyselfInRelationships?: string;
  learnedHealthyFromFamily?: string;
  workingOnPersonalDevelopment?: string;
}

const AGREEMENT_SCALE = [
  "Strongly Disagree",
  "Disagree", 
  "Neutral",
  "Agree",
  "Strongly Agree"
];

const AGREEMENT_SCALE_WITH_UNSURE = [
  "Strongly Disagree",
  "Disagree", 
  "Neutral",
  "Agree",
  "Strongly Agree",
  "Not sure yet"
];

const IMPORTANCE_SCALE = [
  "Not Important",
  "Slightly Important",
  "Moderately Important", 
  "Very Important",
  "Extremely Important"
];

const IMPORTANCE_SCALE_WITH_UNSURE = [
  "Not Important to Them",
  "Slightly Important",
  "Moderately Important", 
  "Very Important",
  "Extremely Important",
  "Not sure yet"
];

const FOCUS_SCALE = [
  "Not working on",
  "A little",
  "Somewhat",
  "Quite a bit",
  "Actively working on this"
];

const FOCUS_SCALE_PARTNER = [
  "Not at all",
  "A little",
  "Somewhat",
  "Quite a bit",
  "Very actively",
  "Not sure yet"
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
    directCommunication: "",
    gentleApproach: "",
    needTimeToProcess: "",
    wordsOfAffirmation: "",
    qualityTime: "",
    physicalTouch: "",
    talkThroughStressImmediately: "",
    needSpaceToProcess: "",
    physicalComfortHelps: "",
    familyRelationshipsImportance: "",
    careerSuccessImportance: "",
    financialSecurityImportance: "",
    quickGutDecisions: "",
    comfortableClosenessIndependence: "",
    worryRelationshipSecurity: "",
    improvingCommunicationFocus: ""
  });

  const handleSaveProfile = () => {
    if (!currentProfile.name || !currentProfile.directCommunication || !currentProfile.wordsOfAffirmation) {
      toast.error("Please complete at least the core questions in each section");
      return;
    }

    setProfiles(prev => ({
      ...prev,
      [activeProfileType]: [...prev[activeProfileType], { ...currentProfile, id: Date.now() }]
    }));
    
    // Reset form
    setCurrentProfile({
      name: "",
      directCommunication: "",
      gentleApproach: "",
      needTimeToProcess: "",
      wordsOfAffirmation: "",
      qualityTime: "",
      physicalTouch: "",
      talkThroughStressImmediately: "",
      needSpaceToProcess: "",
      physicalComfortHelps: "",
      familyRelationshipsImportance: "",
      careerSuccessImportance: "",
      financialSecurityImportance: "",
      quickGutDecisions: "",
      comfortableClosenessIndependence: "",
      worryRelationshipSecurity: "",
      improvingCommunicationFocus: ""
    });
    setShowForm(false);
    setExpandedSections({});
    toast.success(`${activeProfileType === 'your' ? 'Your' : 'Partner'} profile created successfully!`);
  };

  const toggleExpanded = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCoreCompletion = () => {
    const coreFields = [
      'directCommunication', 'gentleApproach', 'needTimeToProcess',
      'wordsOfAffirmation', 'qualityTime', 'physicalTouch',
      'talkThroughStressImmediately', 'needSpaceToProcess', 'physicalComfortHelps',
      'familyRelationshipsImportance', 'careerSuccessImportance', 'financialSecurityImportance', 'quickGutDecisions',
      'comfortableClosenessIndependence', 'worryRelationshipSecurity', 'improvingCommunicationFocus'
    ];
    const completed = coreFields.filter(field => currentProfile[field as keyof ProfileData]).length;
    return Math.round((completed / coreFields.length) * 100);
  };

  const RatingQuestion = ({ 
    label, 
    field, 
    scale = AGREEMENT_SCALE,
    isPartner = false
  }: { 
    label: string; 
    field: keyof ProfileData; 
    scale?: string[];
    isPartner?: boolean;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup 
        value={currentProfile[field] as string || ''}
        onValueChange={(value) => setCurrentProfile({...currentProfile, [field]: value})}
        className="flex flex-wrap gap-4"
      >
        {scale.map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <RadioGroupItem value={rating} id={`${field}-${rating}`} />
            <Label htmlFor={`${field}-${rating}`} className="text-xs">{rating}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const isPartnerProfile = activeProfileType === 'partner';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Relationship Profiles</h2>
          <p className="text-gray-600">Complete the core questions in 3-4 minutes, expand sections for deeper insights</p>
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
                {profile.relationshipType && (
                  <p className="text-xs text-gray-500">{profile.relationshipType} • {profile.relationshipLength}</p>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Communication:</span> {profile.directCommunication ? 'Direct' : 'Gentle'}</p>
              <p><span className="font-medium">Love Language:</span> {profile.wordsOfAffirmation === 'Strongly Agree' ? 'Words' : profile.qualityTime === 'Strongly Agree' ? 'Quality Time' : 'Physical Touch'}</p>
              <p><span className="font-medium">Focus:</span> Communication Growth</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Form */}
      {showForm && (
        <Card className="p-8 bg-white/90 backdrop-blur-md border-0 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {isPartnerProfile ? 'Create Partner Profile for RealTalk' : 'Create Your Profile'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Core completion: {getCoreCompletion()}%
            </div>
          </div>

          {isPartnerProfile && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Getting Started</h4>
              <p className="text-gray-600 mb-6">Help us understand {currentProfile.name || '[Partner\'s Name]'} so we can give you better relationship insights</p>
              
              <div className="space-y-6">
                <h5 className="font-semibold text-gray-900">Basic Info</h5>
                
                <div>
                  <Label htmlFor="name">Partner's Name *</Label>
                  <Input
                    id="name"
                    value={currentProfile.name}
                    onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
                    placeholder="Partner's name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Your Relationship</Label>
                  <RadioGroup 
                    value={currentProfile.relationshipType || ''}
                    onValueChange={(value) => setCurrentProfile({...currentProfile, relationshipType: value})}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {['Dating', 'Engaged', 'Married', 'Long-term partnership'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`relationship-${type}`} />
                        <Label htmlFor={`relationship-${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="relationship-other" />
                      <Label htmlFor="relationship-other" className="text-sm">Other:</Label>
                    </div>
                  </RadioGroup>
                  {currentProfile.relationshipType === 'Other' && (
                    <Input
                      value={currentProfile.customRelationshipType || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, customRelationshipType: e.target.value})}
                      placeholder="Specify relationship type"
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label>How long together</Label>
                  <Select value={currentProfile.relationshipLength || ''} onValueChange={(value) => setCurrentProfile({...currentProfile, relationshipLength: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than 6 months">Less than 6 months</SelectItem>
                      <SelectItem value="6 months-1 year">6 months-1 year</SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="2-5 years">2-5 years</SelectItem>
                      <SelectItem value="5+ years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {!isPartnerProfile && (
            <div className="mb-6">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={currentProfile.name}
                onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="love">Love Languages</TabsTrigger>
              <TabsTrigger value="stress">Stress & Support</TabsTrigger>
              <TabsTrigger value="values">Values & Life</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="communication" className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Why this matters:</strong> {isPartnerProfile ? 'Helps you navigate conversations and disagreements more effectively' : 'Helps AI suggest better ways to approach difficult conversations and resolve disagreements'}
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions {isPartnerProfile ? '(Based on what you\'ve observed)' : '(Required)'}</h4>
                
                <RatingQuestion
                  label={isPartnerProfile ? "They are direct and straightforward in communication" : "I am direct and straightforward in my communication"}
                  field="directCommunication"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "They prefer gentle and diplomatic approaches" : "I prefer gentle and diplomatic approaches"}
                  field="gentleApproach"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "They need time to process before discussing conflicts" : "I need time to process before discussing conflicts"}
                  field="needTimeToProcess"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />
              </div>

              <Collapsible open={expandedSections.communicationDeep} onOpenChange={() => toggleExpanded('communicationDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ {isPartnerProfile ? 'Want better conflict navigation tips?' : 'Want more specific communication insights?'} Unlocks: {isPartnerProfile ? 'How to approach them during disagreements, timing suggestions' : 'Personalized conflict scripts and timing suggestions'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "When upset, they go silent/withdraw" : "When upset, I go silent/withdraw"}
                    field="goSilentWhenUpset"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "When upset, they need to talk it out immediately" : "When upset, I need to talk it out immediately"}
                    field="needToTalkImmediately"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They feel heard when I validate their emotions" : "I feel heard when someone validates my emotions"}
                    field="feelHeardWithValidation"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They need to see changed behavior as an apology" : "I need to see changed behavior as an apology"}
                    field="needChangedBehaviorApology"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Work deadlines trigger their stress responses" : "Work deadlines trigger my stress responses"}
                    field="workDeadlineStress"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="love" className="space-y-6">
              <div className="bg-pink-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-pink-800">
                  <strong>Why this matters:</strong> {isPartnerProfile ? 'Get specific suggestions for making them feel appreciated and valued' : 'Helps AI suggest specific ways to show and receive love that actually resonate'}
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions {isPartnerProfile ? '(Based on what you\'ve noticed)' : '(Required)'}</h4>
                
                <RatingQuestion
                  label={isPartnerProfile ? "Words of Affirmation make them feel most loved" : "Words of Affirmation make me feel most loved"}
                  field="wordsOfAffirmation"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "Quality Time is their primary love language" : "Quality Time is my primary love language"}
                  field="qualityTime"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "Physical Touch is how they best receive love" : "Physical Touch is how I best receive love"}
                  field="physicalTouch"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />
              </div>

              <Collapsible open={expandedSections.loveDeep} onOpenChange={() => toggleExpanded('loveDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ {isPartnerProfile ? 'Get specific ways to make their day?' : 'Get personalized love language suggestions?'} Unlocks: {isPartnerProfile ? 'Personalized romantic gestures and daily appreciation ideas' : 'Specific daily actions and romantic gesture ideas'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Quality time means having my undivided attention" : "Quality time means having undivided attention"}
                    field="qualityTimeUndividedAttention"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They prefer 'I'm proud of you' style affirmations" : "I prefer 'I'm proud of you' style affirmations"}
                    field="proudOfYouAffirmations"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They like casual touch throughout the day" : "I like casual touch throughout the day"}
                    field="casualTouchThroughoutDay"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Household chores are meaningful acts of service to them" : "Household chores are meaningful acts of service"}
                    field="householdChoresService"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Thoughtful gifts matter more than expensive ones to them" : "Thoughtful gifts matter more than expensive ones"}
                    field="thoughtfulVsExpensiveGifts"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="stress" className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-orange-800">
                  <strong>Why this matters:</strong> {isPartnerProfile ? 'Know exactly how to support them during difficult times' : 'Helps your partner know exactly how to support you during tough times'}
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions {isPartnerProfile ? '(Based on what you\'ve observed)' : '(Required)'}</h4>
                
                <RatingQuestion
                  label={isPartnerProfile ? "They want to talk through stress immediately" : "I want to talk through my stress immediately"}
                  field="talkThroughStressImmediately"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "They need space to process stress alone first" : "I need space to process stress alone first"}
                  field="needSpaceToProcess"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "Physical comfort helps them feel better when stressed" : "Physical comfort helps me feel better when stressed"}
                  field="physicalComfortHelps"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />
              </div>

              <Collapsible open={expandedSections.stressDeep} onOpenChange={() => toggleExpanded('stressDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ {isPartnerProfile ? 'Learn to recognize when they need support?' : 'Help your partner support you better?'} Unlocks: {isPartnerProfile ? 'Their stress warning signs and what helps vs. what makes it worse' : 'Early warning signs recognition and specific support strategies'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Social situations make them anxious" : "Social situations make me anxious"}
                    field="socialSituationsAnxious"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They show stress through shorter responses/communication" : "I show stress through shorter responses/communication"}
                    field="showStressThroughCommunication"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Being rushed makes their stress worse" : "Being rushed makes my stress worse"}
                    field="beingRushedMakesWorse"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Practical help with tasks relieves their stress" : "Practical help with tasks relieves my stress"}
                    field="practicalHelpRelieves"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They withdraw from others when overwhelmed" : "I withdraw from others when overwhelmed"}
                    field="withdrawWhenOverwhelmed"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="values" className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-800">
                  <strong>Why this matters:</strong> {isPartnerProfile ? 'Understand what drives their decisions and daily preferences' : 'Ensures relationship advice aligns with what actually matters to you'}
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions {isPartnerProfile ? '(Based on what you know)' : '(Required)'}</h4>
                
                <RatingQuestion
                  label="Family and close relationships"
                  field="familyRelationshipsImportance"
                  scale={isPartnerProfile ? IMPORTANCE_SCALE_WITH_UNSURE : IMPORTANCE_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label="Career success and achievement"
                  field="careerSuccessImportance"
                  scale={isPartnerProfile ? IMPORTANCE_SCALE_WITH_UNSURE : IMPORTANCE_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label="Financial security and stability"
                  field="financialSecurityImportance"
                  scale={isPartnerProfile ? IMPORTANCE_SCALE_WITH_UNSURE : IMPORTANCE_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "They make quick, gut-instinct decisions" : "I make quick, gut-instinct decisions"}
                  field="quickGutDecisions"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />
              </div>

              <Collapsible open={expandedSections.valuesDeep} onOpenChange={() => toggleExpanded('valuesDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ {isPartnerProfile ? 'Better understand their daily preferences?' : 'More personalized daily insights?'} Unlocks: {isPartnerProfile ? 'How to work with their decision-making style and energy patterns' : 'Lifestyle-specific relationship advice and compatibility insights'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Personal freedom and independence are extremely important to them" : "Personal freedom and independence are extremely important to me"}
                    field="personalFreedomImportant"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They need time to research before making decisions" : "I need time to research before making decisions"}
                    field="needTimeToResearch"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They're a saver focused on financial security" : "I'm a saver focused on financial security"}
                    field="saverFocusedSecurity"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "Social interactions energize them" : "Social interactions energize me"}
                    field="socialInteractionsEnergize"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They prefer highly structured routines" : "I prefer highly structured routines"}
                    field="preferStructuredRoutines"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-purple-800">
                  <strong>Why this matters:</strong> {isPartnerProfile ? 'Navigate their attachment style and support their growth' : 'Helps AI understand your relationship history to give better guidance for growth'}
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions {isPartnerProfile ? '(Based on what you\'ve noticed)' : '(Required)'}</h4>
                
                <RatingQuestion
                  label={isPartnerProfile ? "They're comfortable with both closeness and independence" : "I'm comfortable with both closeness and independence"}
                  field="comfortableClosenessIndependence"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "They sometimes worry about relationship security" : "I sometimes worry about relationship security"}
                  field="worryRelationshipSecurity"
                  scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                  isPartner={isPartnerProfile}
                />

                <RatingQuestion
                  label={isPartnerProfile ? "They're actively working on improving communication during conflict" : "Improving communication during conflict (Rate current focus)"}
                  field="improvingCommunicationFocus"
                  scale={isPartnerProfile ? FOCUS_SCALE_PARTNER : FOCUS_SCALE}
                  isPartner={isPartnerProfile}
                />
              </div>

              <Collapsible open={expandedSections.patternsDeep} onOpenChange={() => toggleExpanded('patternsDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ {isPartnerProfile ? 'Understand their relationship needs better?' : 'Deeper relationship insights?'} Unlocks: {isPartnerProfile ? 'How to support their growth and navigate their attachment style' : 'Attachment-aware advice and personalized growth recommendations'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They want closeness but sometimes fear getting hurt" : "I want closeness but sometimes fear getting hurt"}
                    field="wantClosenessButFearHurt"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They're actively working on setting and maintaining boundaries" : "Setting and maintaining boundaries (Rate current focus)"}
                    field="boundariesFocus"
                    scale={isPartnerProfile ? FOCUS_SCALE_PARTNER : FOCUS_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They tend to lose themselves in relationships" : "I tend to lose myself in relationships"}
                    field="loseMyselfInRelationships"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They learned healthy relationship patterns from their family" : "I learned healthy relationship patterns from my family"}
                    field="learnedHealthyFromFamily"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
                  />
                  
                  <RatingQuestion
                    label={isPartnerProfile ? "They're currently working on personal development" : "I'm currently working on personal development"}
                    field="workingOnPersonalDevelopment"
                    scale={isPartnerProfile ? AGREEMENT_SCALE_WITH_UNSURE : AGREEMENT_SCALE}
                    isPartner={isPartnerProfile}
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
