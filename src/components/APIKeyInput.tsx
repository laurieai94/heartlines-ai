
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, ExternalLink } from "lucide-react";

interface APIKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

const APIKeyInput = ({ onApiKeySet, hasApiKey }: APIKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setApiKey("");
    }
  };

  if (hasApiKey) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <Key className="w-4 h-4" />
          <span className="text-sm font-medium">✅ AI API connected - Real coaching active</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-4 h-4 text-amber-600" />
        <h3 className="font-medium text-amber-800">Connect AI for Real Coaching</h3>
      </div>
      
      <p className="text-sm text-amber-700 mb-3">
        Currently using simulated responses. Add your Anthropic API key for genuine AI coaching.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? "Hide" : "Show"}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={!apiKey.trim()}>
            Connect AI
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open('https://console.anthropic.com/account/keys', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Get API Key
          </Button>
        </div>
      </form>
      
      <p className="text-xs text-amber-600 mt-2">
        Your API key is stored locally and only used for your coaching sessions.
      </p>
    </Card>
  );
};

export default APIKeyInput;
