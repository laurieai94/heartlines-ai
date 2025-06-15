import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, User, Plus, ChevronDown, Check, Clock } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  name: string;
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

const IMPORTANCE_SCALE = [
  "Not Important",
  "Slightly Important",
  "Moderately Important", 
  "Very Important",
  "Extremely Important"
];

const FOCUS_SCALE = [
  "Not working on",
  "A little",
  "Somewhat",
  "Quite a bit",
  "Actively working on this"
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
    scale = AGREEMENT_SCALE
  }: { 
    label: string; 
    field: keyof ProfileData; 
    scale?: string[];
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
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="communication" className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800"><strong>Why this matters:</strong> Helps AI suggest better ways to approach difficult conversations and resolve disagreements</p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions (Required)</h4>
                
                <RatingQuestion
                  label="I am direct and straightforward in my communication"
                  field="directCommunication"
                />

                <RatingQuestion
                  label="I prefer gentle and diplomatic approaches"
                  field="gentleApproach"
                />

                <RatingQuestion
                  label="I need time to process before discussing conflicts"
                  field="needTimeToProcess"
                />
              </div>

              <Collapsible open={expandedSections.communicationDeep} onOpenChange={() => toggleExpanded('communicationDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Want more specific communication insights? Unlocks: Personalized conflict scripts and timing suggestions</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label="When upset, I go silent/withdraw"
                    field="goSilentWhenUpset"
                  />
                  
                  <RatingQuestion
                    label="When upset, I need to talk it out immediately"
                    field="needToTalkImmediately"
                  />
                  
                  <RatingQuestion
                    label="I feel heard when someone validates my emotions"
                    field="feelHeardWithValidation"
                  />
                  
                  <RatingQuestion
                    label="I need to see changed behavior as an apology"
                    field="needChangedBehaviorApology"
                  />
                  
                  <RatingQuestion
                    label="Work deadlines trigger my stress responses"
                    field="workDeadlineStress"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="love" className="space-y-6">
              <div className="bg-pink-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-pink-800"><strong>Why this matters:</strong> Helps AI suggest specific ways to show and receive love that actually resonate</p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions (Required)</h4>
                
                <RatingQuestion
                  label="Words of Affirmation make me feel most loved"
                  field="wordsOfAffirmation"
                />

                <RatingQuestion
                  label="Quality Time is my primary love language"
                  field="qualityTime"
                />

                <RatingQuestion
                  label="Physical Touch is how I best receive love"
                  field="physicalTouch"
                />
              </div>

              <Collapsible open={expandedSections.loveDeep} onOpenChange={() => toggleExpanded('loveDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Get personalized love language suggestions? Unlocks: Specific daily actions and romantic gesture ideas</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label="Quality time means having undivided attention"
                    field="qualityTimeUndividedAttention"
                  />
                  
                  <RatingQuestion
                    label="I prefer 'I'm proud of you' style affirmations"
                    field="proudOfYouAffirmations"
                  />
                  
                  <RatingQuestion
                    label="I like casual touch throughout the day"
                    field="casualTouchThroughoutDay"
                  />
                  
                  <RatingQuestion
                    label="Household chores are meaningful acts of service"
                    field="householdChoresService"
                  />
                  
                  <RatingQuestion
                    label="Thoughtful gifts matter more than expensive ones"
                    field="thoughtfulVsExpensiveGifts"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="stress" className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-orange-800"><strong>Why this matters:</strong> Helps your partner know exactly how to support you during tough times</p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions (Required)</h4>
                
                <RatingQuestion
                  label="I want to talk through my stress immediately"
                  field="talkThroughStressImmediately"
                />

                <RatingQuestion
                  label="I need space to process stress alone first"
                  field="needSpaceToProcess"
                />

                <RatingQuestion
                  label="Physical comfort helps me feel better when stressed"
                  field="physicalComfortHelps"
                />
              </div>

              <Collapsible open={expandedSections.stressDeep} onOpenChange={() => toggleExpanded('stressDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Help your partner support you better? Unlocks: Early warning signs recognition and specific support strategies</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label="Social situations make me anxious"
                    field="socialSituationsAnxious"
                  />
                  
                  <RatingQuestion
                    label="I show stress through shorter responses/communication"
                    field="showStressThroughCommunication"
                  />
                  
                  <RatingQuestion
                    label="Being rushed makes my stress worse"
                    field="beingRushedMakesWorse"
                  />
                  
                  <RatingQuestion
                    label="Practical help with tasks relieves my stress"
                    field="practicalHelpRelieves"
                  />
                  
                  <RatingQuestion
                    label="I withdraw from others when overwhelmed"
                    field="withdrawWhenOverwhelmed"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="values" className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-800"><strong>Why this matters:</strong> Ensures relationship advice aligns with what actually matters to you</p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions (Required)</h4>
                
                <RatingQuestion
                  label="Family and close relationships"
                  field="familyRelationshipsImportance"
                  scale={IMPORTANCE_SCALE}
                />

                <RatingQuestion
                  label="Career success and achievement"
                  field="careerSuccessImportance"
                  scale={IMPORTANCE_SCALE}
                />

                <RatingQuestion
                  label="Financial security and stability"
                  field="financialSecurityImportance"
                  scale={IMPORTANCE_SCALE}
                />

                <RatingQuestion
                  label="I make quick, gut-instinct decisions"
                  field="quickGutDecisions"
                />
              </div>

              <Collapsible open={expandedSections.valuesDeep} onOpenChange={() => toggleExpanded('valuesDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ More personalized daily insights? Unlocks: Lifestyle-specific relationship advice and compatibility insights</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label="Personal freedom and independence are extremely important to me"
                    field="personalFreedomImportant"
                  />
                  
                  <RatingQuestion
                    label="I need time to research before making decisions"
                    field="needTimeToResearch"
                  />
                  
                  <RatingQuestion
                    label="I'm a saver focused on financial security"
                    field="saverFocusedSecurity"
                  />
                  
                  <RatingQuestion
                    label="Social interactions energize me"
                    field="socialInteractionsEnergize"
                  />
                  
                  <RatingQuestion
                    label="I prefer highly structured routines"
                    field="preferStructuredRoutines"
                  />
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-purple-800"><strong>Why this matters:</strong> Helps AI understand your relationship history to give better guidance for growth</p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Core Questions (Required)</h4>
                
                <RatingQuestion
                  label="I'm comfortable with both closeness and independence"
                  field="comfortableClosenessIndependence"
                />

                <RatingQuestion
                  label="I sometimes worry about relationship security"
                  field="worryRelationshipSecurity"
                />

                <RatingQuestion
                  label="Improving communication during conflict (Rate current focus)"
                  field="improvingCommunicationFocus"
                  scale={FOCUS_SCALE}
                />
              </div>

              <Collapsible open={expandedSections.patternsDeep} onOpenChange={() => toggleExpanded('patternsDeep')}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>☐ Deeper relationship insights? Unlocks: Attachment-aware advice and personalized growth recommendations</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <h4 className="font-semibold text-gray-900">Optional Deep Dive:</h4>
                  
                  <RatingQuestion
                    label="I want closeness but sometimes fear getting hurt"
                    field="wantClosenessButFearHurt"
                  />
                  
                  <RatingQuestion
                    label="Setting and maintaining boundaries (Rate current focus)"
                    field="boundariesFocus"
                    scale={FOCUS_SCALE}
                  />
                  
                  <RatingQuestion
                    label="I tend to lose myself in relationships"
                    field="loseMyselfInRelationships"
                  />
                  
                  <RatingQuestion
                    label="I learned healthy relationship patterns from my family"
                    field="learnedHealthyFromFamily"
                  />
                  
                  <RatingQuestion
                    label="I'm currently working on personal development"
                    field="workingOnPersonalDevelopment"
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
