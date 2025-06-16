
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
    // Check if Supabase environment variables are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const configured = !!(supabaseUrl && supabaseAnonKey);
    onSupabaseConfigured(configured);
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
        <h3 className="font-medium text-blue-800">Configure Supabase Backend</h3>
      </div>
      
      <div className="space-y-3 text-sm text-blue-700">
        <p>
          Your Supabase integration needs to be properly configured for AI coaching to work.
        </p>
        
        <div className="bg-blue-100 rounded-lg p-3 space-y-2">
          <p className="font-medium">Troubleshooting Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Check that the green Supabase button (top right) shows "Connected"</li>
            <li>Try refreshing the page</li>
            <li>If still not working, disconnect and reconnect Supabase</li>
            <li>Ensure your Supabase project is active and deployed</li>
          </ol>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh Page
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
        The Supabase integration should automatically provide the necessary environment variables.
      </p>
    </Card>
  );
};

export default APIKeyInput;
