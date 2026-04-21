
import { useState } from "react";
import { DollarSign, Home, Users, Target, RotateCcw, Heart, Lightbulb } from "lucide-react";
import ScenarioCard from './ConversationPractice/ScenarioCard';
import PartnerProfileSelector from './ConversationPractice/PartnerProfileSelector';
import CustomScenarioForm from './ConversationPractice/CustomScenarioForm';
import ProgressiveAccessWrapper from '../auth/ProgressiveAccessWrapper';

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

  const handleCustomScenarioChange = (value: string) => {
    setCustomScenario(value);
    if (value) {
      setIsCustom(true);
      setSelectedScenario("");
    }
  };

  const handleStartPractice = () => {
    // This will be implemented to start the AI practice session
  };

  const hasProfiles = profiles.your.length > 0 && profiles.partner.length > 0;
  const hasPartnerProfiles = profiles.partner.length > 0;

  const canStartPractice = (!selectedScenario && !customScenario.trim() || (hasPartnerProfiles && !selectedPartnerProfile)) ? false : true;
  
  const getStatusMessage = () => {
    if (!(selectedScenario || customScenario)) {
      return "Select a scenario or describe a custom situation to get started";
    }
    if (hasProfiles && selectedPartnerProfile) {
      return `✅ Ready to simulate conversation with ${partnerName}`;
    }
    if (hasProfiles && !selectedPartnerProfile) {
      return `⚠️ Select ${partnerName}'s profile above for realistic simulation`;
    }
    return `⚠️ Complete profiles for realistic ${partnerName} simulation`;
  };

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

      <PartnerProfileSelector
        partnerProfiles={profiles.partner}
        partnerName={partnerName}
        selectedPartnerProfile={selectedPartnerProfile}
        onProfileSelect={setSelectedPartnerProfile}
      />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Scenario Starters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <ProgressiveAccessWrapper key={scenario.id} action="practice-scenario">
              <ScenarioCard
                id={scenario.id}
                icon={scenario.icon}
                title={scenario.title}
                subtitle={scenario.subtitle}
                description={scenario.description}
                isSelected={selectedScenario === scenario.id}
                onSelect={handleScenarioSelect}
              />
            </ProgressiveAccessWrapper>
          ))}
        </div>
      </div>

      <ProgressiveAccessWrapper action="practice-custom">
        <CustomScenarioForm
          customScenario={customScenario}
          partnerName={partnerName}
          onCustomScenarioChange={handleCustomScenarioChange}
          onStartPractice={handleStartPractice}
          canStartPractice={canStartPractice}
          statusMessage={getStatusMessage()}
        />
      </ProgressiveAccessWrapper>
    </div>
  );
};

export default ConversationPractice;
