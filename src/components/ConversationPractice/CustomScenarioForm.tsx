
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

interface CustomScenarioFormProps {
  customScenario: string;
  partnerName: string;
  onCustomScenarioChange: (value: string) => void;
  onStartPractice: () => void;
  canStartPractice: boolean;
  statusMessage: string;
}

const CustomScenarioForm = ({ 
  customScenario, 
  partnerName, 
  onCustomScenarioChange, 
  onStartPractice, 
  canStartPractice,
  statusMessage 
}: CustomScenarioFormProps) => {
  return (
    <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Scenario</h3>
      <p className="text-sm text-gray-600 mb-4">
        Describe the specific situation you want to practice...
      </p>
      <Textarea
        placeholder={`Describe the conversation you want to practice with ${partnerName}. Be as specific as possible about the context, your concerns, and what outcome you're hoping for.`}
        value={customScenario}
        onChange={(e) => onCustomScenarioChange(e.target.value)}
        className="min-h-[100px] mb-4"
      />
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {statusMessage}
        </div>
        
        <Button 
          onClick={onStartPractice}
          disabled={!canStartPractice}
          className="bg-coral-500 hover:bg-coral-600 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Start Practice Session
        </Button>
      </div>
    </Card>
  );
};

export default CustomScenarioForm;
