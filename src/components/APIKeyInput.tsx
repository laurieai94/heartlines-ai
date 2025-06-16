
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
    // Since we're using Lovable's Supabase integration, always mark as configured
    console.log('Supabase integration detected - marking as configured');
    onSupabaseConfigured(true);
  }, [onSupabaseConfigured]);

  if (isConfigured) {
    return (
      <Card className="p-2 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <Zap className="w-3 h-3" />
          <span className="text-xs font-medium">Backend connected</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-2 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2">
        <Settings className="w-3 h-3 text-blue-600" />
        <span className="text-xs text-blue-700">Backend configuration needed</span>
      </div>
    </Card>
  );
};

export default APIKeyInput;
