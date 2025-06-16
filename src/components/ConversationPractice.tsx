import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Heart, DollarSign, Home, Users, Target, RotateCcw, Lightbulb, User } from "lucide-react";

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface ConversationPracticeProps {
  profiles?: ProfileData;
  demographicsData?: DemographicsData;
}

const ConversationPractice = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: ConversationPracticeProps) => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [customScenario, setCustomScenario] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPartnerProfile, setSelectedPartnerProfile] = useState<string>("");

  // Get user and partner names from demographics with better fallbacks
  const userName = demographicsData.your?.name || 'You';
  const partnerName = demographicsData.partner?.name && demographicsData.partner.name.length > 1 
    ? demographicsData.partner.name 
    : 'your partner';

  console.log('Demographics data:', demographicsData);
  console.log('Partner name extracted:', partnerName);

  const scenarios = [
    {
      id: "money",
      icon: DollarSign,
      title: "Money conversation",
      subtitle: "bringing up the budget",
      description: `Practice discussing financial concerns or budget planning with ${partnerName}`
    },
    {
      id: "household",
      icon: Home,
      title: "Household responsibilities",
      subtitle: "dishes are piling up again",
      description: `Navigate conversations about chores and household management with ${partnerName}`
    },
    {
      id: "family",
      icon: Users,
      title: "Family plans",
      subtitle: "discussing kids/marriage timeline",
      description: `Practice talking about future family plans and relationship milestones`
    },
    {
      id: "support",
      icon: Heart,
      title: "Support needed",
      subtitle: "partner seems stressed about work",
      description: `Learn how to offer support when ${partnerName} is going through a difficult time`
    },
    {
      id: "goals",
      icon: Target,
      title: "Future goals",
      subtitle: "where do we see this relationship going",
      description: `Practice discussions about relationship direction and shared goals`
    },
    {
      id: "recurring",
      icon: RotateCcw,
      title: "Recurring issue",
      subtitle: "that thing you always fight about",
      description: `Work through that persistent issue that keeps coming up between you two`
    }
  ];

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setIsCustom(false);
    setCustomScenario("");
  };

  const handleCustomScenario = () => {
    setIsCustom(true);
    setSelectedScenario("");
  };

  const handleStartPractice = () => {
    // This will be implemented to start the AI practice session
    console.log('Starting practice session with scenario:', selectedScenario || customScenario);
    console.log('Using partner profile:', selectedPartnerProfile);
    console.log('Partner name being used:', partnerName);
  };

  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0;
  const hasPartnerProfiles = profiles.partner.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Difficult Conversations Before They Happen</h2>
        <p className="text-gray-600 mb-2">
          Role-play with AI that acts like {partnerName}, while getting real-time coaching
        </p>
        <p className="text-sm text-gray-500">
          Ever wish you could practice that difficult conversation before having it? Our AI becomes {partnerName} based on their profile, while simultaneously coaching you on communication strategies.
        </p>
        {hasProfiles && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <Lightbulb className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">
              AI partner simulation ready - I know {partnerName}'s communication style and triggers
            </p>
          </div>
        )}
      </div>

      {/* Partner Profile Selection */}
      {hasPartnerProfiles && (
        <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Partner Profile for Role-Play</h3>
              <p className="text-sm text-gray-600">Select which partner profile the AI should use to simulate {partnerName}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Select value={selectedPartnerProfile} onValueChange={setSelectedPartnerProfile}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${partnerName}'s profile for simulation`} />
              </SelectTrigger>
              <SelectContent>
                {profiles.partner.map((profile, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {partnerName}'s Profile {profiles.partner.length > 1 ? `#${index + 1}` : ''}
                    {profile.relationshipLength && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({profile.relationshipLength} relationship)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPartnerProfile && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                ✅ AI will role-play as {partnerName} using their selected profile traits and communication style
              </div>
            )}
          </div>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Scenario Starters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const IconComponent = scenario.icon;
            const isSelected = selectedScenario === scenario.id;
            
            return (
              <Card 
                key={scenario.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-coral-500 bg-coral-50' : 'bg-white/60 backdrop-blur-md'
                }`}
                onClick={() => handleScenarioSelect(scenario.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-coral-500 text-white' : 'bg-coral-100 text-coral-600'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{scenario.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{scenario.subtitle}</p>
                    <p className="text-xs text-gray-500">{scenario.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Scenario</h3>
        <p className="text-sm text-gray-600 mb-4">
          Describe the specific situation you want to practice...
        </p>
        <Textarea
          placeholder={`Describe the conversation you want to practice with ${partnerName}. Be as specific as possible about the context, your concerns, and what outcome you're hoping for.`}
          value={customScenario}
          onChange={(e) => {
            setCustomScenario(e.target.value);
            if (e.target.value) {
              handleCustomScenario();
            }
          }}
          className="min-h-[100px] mb-4"
        />
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {(selectedScenario || customScenario) ? (
              hasProfiles && selectedPartnerProfile ? (
                <span className="text-green-600">✅ Ready to simulate conversation with {partnerName}</span>
              ) : hasProfiles && !selectedPartnerProfile ? (
                <span className="text-amber-600">⚠️ Select {partnerName}'s profile above for realistic simulation</span>
              ) : (
                <span className="text-amber-600">⚠️ Complete profiles for realistic {partnerName} simulation</span>
              )
            ) : (
              "Select a scenario or describe a custom situation to get started"
            )}
          </div>
          
          <Button 
            onClick={handleStartPractice}
            disabled={!selectedScenario && !customScenario.trim() || (hasPartnerProfiles && !selectedPartnerProfile)}
            className="bg-coral-500 hover:bg-coral-600 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Practice Session
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConversationPractice;
