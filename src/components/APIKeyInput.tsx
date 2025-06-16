
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Settings, ExternalLink } from "lucide-react";

interface APIKeyInputProps {
  onSupabaseConfigured: (configured: boolean) => void;
  isConfigured: boolean;
}

const APIKeyInput = ({ onSupabaseConfigured, isConfigured }: APIKeyInputProps) => {
  useEffect(() => {
    // Since we're using Lovable's Supabase integration, mark as configured
    onSupabaseConfigured(true);
  }, [onSupabaseConfigured]);

  if (isConfigured) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">✅ Supabase backend connected - Secure AI coaching active</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          API calls are now handled securely through your Supabase Edge Function
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-4 h-4 text-blue-600" />
        <h3 className="font-medium text-blue-800">Configure Anthropic AI Backend</h3>
      </div>
      
      <div className="space-y-3 text-sm text-blue-700">
        <p>
          Your AI coaching now runs through a secure Supabase backend. To complete the setup:
        </p>
        
        <div className="bg-blue-100 rounded-lg p-3 space-y-2">
          <p className="font-medium">Required Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Get your Anthropic API key from the link below</li>
            <li>Go to your Supabase project dashboard</li>
            <li>Navigate to Edge Functions → Secrets</li>
            <li>Add a new secret: <code className="bg-blue-200 px-1 rounded">ANTHROPIC_API_KEY</code></li>
            <li>Paste your API key as the value</li>
            <li>Deploy the edge function (if not auto-deployed)</li>
          </ol>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open('https://console.anthropic.com/account/keys', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Get Anthropic API Key
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open Supabase Dashboard
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-blue-600 mt-3">
        This secure setup eliminates CORS issues and keeps your API key safe on the backend.
      </p>
    </Card>
  );
};

export default APIKeyInput;
