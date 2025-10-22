import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Clock, BarChart3 } from 'lucide-react';
import { PrivacyManager } from '@/utils/encryption';
import { toast } from 'sonner';

export const PrivacySettings = () => {
  const [settings, setSettings] = useState(PrivacyManager.getPrivacySettings());

  useEffect(() => {
    setSettings(PrivacyManager.getPrivacySettings());
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    PrivacyManager.updatePrivacySettings({ [key]: value });
    
    toast.success("Privacy settings updated", {
      description: "Your privacy preferences have been saved.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header - standardized to match AccountLayout */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-white mb-1">Privacy & Security</h1>
        <p className="text-white/70 text-xs">Control how your data is stored and used. Changes take effect immediately.</p>
      </div>

      {/* Communication Preferences */}
      <div className="questionnaire-card p-4 shadow-lg">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white font-semibold mb-2">
            <Mail className="h-5 w-5" />
            Communication
          </div>
          <p className="text-white/70 text-sm mb-4">
            Manage how we communicate with you
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">Marketing Emails</div>
            <div className="text-xs text-white/60">
              Receive updates about new features and tips
            </div>
          </div>
          <Switch
            checked={settings.marketingEmails}
            onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-coral-400 data-[state=checked]:to-pink-500"
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="questionnaire-card p-4 shadow-lg">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white font-semibold mb-2">
            <Clock className="h-5 w-5" />
            Data Management
          </div>
          <p className="text-white/70 text-sm mb-4">
            Control how long your data is stored
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">Data Retention</div>
            <div className="text-xs text-white/60">
              How long to keep your conversation history
            </div>
          </div>
          <Select 
            value={settings.dataRetention} 
            onValueChange={(value) => handleSettingChange('dataRetention', value)}
          >
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-burgundy-800/95 backdrop-blur-md border border-white/20">
              <SelectItem value="30" className="text-white hover:bg-white/10 focus:bg-white/10">30 days</SelectItem>
              <SelectItem value="90" className="text-white hover:bg-white/10 focus:bg-white/10">90 days</SelectItem>
              <SelectItem value="365" className="text-white hover:bg-white/10 focus:bg-white/10">1 year</SelectItem>
              <SelectItem value="never" className="text-white hover:bg-white/10 focus:bg-white/10">Forever</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Analytics */}
      <div className="questionnaire-card p-4 shadow-lg">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white font-semibold mb-2">
            <BarChart3 className="h-5 w-5" />
            Analytics
          </div>
          <p className="text-white/70 text-sm mb-4">
            Help us improve by sharing anonymous usage data
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">Anonymous Usage Analytics</div>
            <div className="text-xs text-white/60">
              share anonymous usage patterns to help improve kai
            </div>
          </div>
          <Switch
            checked={settings.anonymousUsage}
            onCheckedChange={(checked) => handleSettingChange('anonymousUsage', checked)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-coral-400 data-[state=checked]:to-pink-500"
          />
        </div>
      </div>

    </div>
  );
};