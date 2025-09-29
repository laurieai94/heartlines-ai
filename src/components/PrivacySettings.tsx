import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Download, Eye, Mail, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { PrivacyManager } from '@/utils/encryption';
import { toast } from 'sonner';

export const PrivacySettings = () => {
  const [settings, setSettings] = useState(PrivacyManager.getPrivacySettings());
  const [showBackupPrompt, setShowBackupPrompt] = useState(false);

  useEffect(() => {
    setSettings(PrivacyManager.getPrivacySettings());
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    // Show backup prompt when enabling encryption for the first time
    if (key === 'encryptionEnabled' && value && !settings.encryptionEnabled) {
      setShowBackupPrompt(true);
      return;
    }

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    PrivacyManager.updatePrivacySettings({ [key]: value });
    
    toast.success("Privacy settings updated", {
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleEnableEncryption = () => {
    try {
      // Create backup first
      const filename = PrivacyManager.createLocalBackup();
      
      // Enable encryption - update state directly to ensure toggle turns on
      const newSettings = { ...settings, encryptionEnabled: true };
      setSettings(newSettings);
      PrivacyManager.updatePrivacySettings({ encryptionEnabled: true });
      setShowBackupPrompt(false);
      
      toast.success("Encryption enabled", {
        description: `Backup created: ${filename}. Your future messages will be encrypted.`,
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create backup. Encryption not enabled.",
      });
    }
  };

  const createManualBackup = () => {
    try {
      const filename = PrivacyManager.createLocalBackup();
      toast.success("Backup created", {
        description: `Downloaded: ${filename}`,
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create backup.",
      });
    }
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

      {/* Data Protection */}
      <div className="questionnaire-card p-4 shadow-lg">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white font-semibold mb-2">
            <Shield className="h-5 w-5" />
            Data Protection
          </div>
          <p className="text-white/70 text-sm mb-4">
            Protect your sensitive conversations with encryption
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-white">Encrypt Chat History</div>
              <div className="text-xs text-white/60">
                Encrypt stored messages locally and in the cloud
              </div>
            </div>
            <Switch
              checked={settings.encryptionEnabled}
              onCheckedChange={(checked) => handleSettingChange('encryptionEnabled', checked)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-coral-400 data-[state=checked]:to-pink-500"
            />
          </div>

          {settings.encryptionEnabled && (
            <div className="bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-white/90">
                <Shield className="h-3 w-3 text-coral-400" />
                Your messages are encrypted with AES-256 before storage
              </div>
            </div>
          )}

          <Separator className="border-white/20" />

          <div className="flex items-center justify-between">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={createManualBackup} 
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Backup
            </Button>
            <div className="text-xs text-white/60">
              Create a local backup of your data
            </div>
          </div>
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
            <SelectContent className="bg-burgundy-900/95 backdrop-blur-md border border-white/20">
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
              Share anonymous usage patterns to help improve Kai
            </div>
          </div>
          <Switch
            checked={settings.anonymousUsage}
            onCheckedChange={(checked) => handleSettingChange('anonymousUsage', checked)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-coral-400 data-[state=checked]:to-pink-500"
          />
        </div>
      </div>

      {/* Backup Prompt Modal - burgundy theme */}
      {showBackupPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="questionnaire-modal-card w-full max-w-md p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <AlertTriangle className="h-5 w-5 text-coral-400" />
                Enable Encryption
              </div>
              <p className="text-white/70 text-sm">
                We'll create a backup of your current data before enabling encryption.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm">
                <p className="font-medium mb-2 text-white text-sm">What happens next:</p>
                <ul className="text-xs text-white/70 space-y-1">
                  <li>• A backup file will be downloaded</li>
                  <li>• Future messages will be encrypted</li>
                  <li>• Existing messages remain accessible</li>
                  <li>• You can disable this anytime</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowBackupPrompt(false)}
                  className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEnableEncryption}
                  className="flex-1 bg-gradient-to-r from-coral-500 to-pink-500 text-white hover:from-coral-600 hover:to-pink-600 shadow-lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup & Enable
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};