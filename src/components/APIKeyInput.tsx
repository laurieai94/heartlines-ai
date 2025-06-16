
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, ExternalLink, Zap } from "lucide-react";

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
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">✅ Anthropic AI connected - Real coaching active</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-4 h-4 text-blue-600" />
        <h3 className="font-medium text-blue-800">Connect Anthropic AI for Coaching</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">
        This app uses Anthropic's Claude AI for personalized relationship coaching. Add your API key to get started.
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
            Connect Anthropic AI
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
      
      <p className="text-xs text-blue-600 mt-2">
        Your API key is stored locally and only used for your coaching sessions.
      </p>
    </Card>
  );
};

export default APIKeyInput;
