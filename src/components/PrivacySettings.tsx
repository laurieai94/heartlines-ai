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
      
      // Enable encryption
      handleSettingChange('encryptionEnabled', true);
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Privacy & Security</h3>
        <p className="text-sm text-white/70">
          Control how your data is stored and used. Changes take effect immediately.
        </p>
      </div>

      {/* Data Protection */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-4 w-4" />
            Data Protection
          </CardTitle>
          <CardDescription className="text-white/70">
            Protect your sensitive conversations with encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">Encrypt Chat History</div>
              <div className="text-xs text-white/60">
                Encrypt stored messages locally and in the cloud
              </div>
            </div>
            <Switch
              checked={settings.encryptionEnabled}
              onCheckedChange={(checked) => handleSettingChange('encryptionEnabled', checked)}
            />
          </div>

          {settings.encryptionEnabled && (
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Shield className="h-3 w-3" />
                Your messages are encrypted with AES-256 before storage
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Button variant="outline" size="sm" onClick={createManualBackup} className="border-white/20 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Download Backup
              </Button>
            </div>
            <div className="text-xs text-white/60">
              Create a local backup of your data
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-4 w-4" />
            Communication
          </CardTitle>
          <CardDescription className="text-white/70">
            Manage how we communicate with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">Marketing Emails</div>
              <div className="text-xs text-white/60">
                Receive updates about new features and tips
              </div>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="h-4 w-4" />
            Data Management
          </CardTitle>
          <CardDescription className="text-white/70">
            Control how long your data is stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">Data Retention</div>
              <div className="text-xs text-white/60">
                How long to keep your conversation history
              </div>
            </div>
            <Select 
              value={settings.dataRetention} 
              onValueChange={(value) => handleSettingChange('dataRetention', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="never">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </CardTitle>
          <CardDescription className="text-white/70">
            Help us improve by sharing anonymous usage data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">Anonymous Usage Analytics</div>
              <div className="text-xs text-white/60">
                Share anonymous usage patterns to help improve Kai
              </div>
            </div>
            <Switch
              checked={settings.anonymousUsage}
              onCheckedChange={(checked) => handleSettingChange('anonymousUsage', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Prompt Modal */}
      {showBackupPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-white/95 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Enable Encryption
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                We'll create a backup of your current data before enabling encryption.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1 text-foreground">What happens next:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• A backup file will be downloaded</li>
                  <li>• Future messages will be encrypted</li>
                  <li>• Existing messages remain accessible</li>
                  <li>• You can disable this anytime</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBackupPrompt(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEnableEncryption}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup & Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};