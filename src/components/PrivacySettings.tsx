import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Download, Eye, Mail, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { PrivacyManager } from '@/utils/encryption';
import { useToast } from '@/hooks/use-toast';

export const PrivacySettings = () => {
  const { toast } = useToast();
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
    
    toast({
      title: "Privacy settings updated",
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
      
      toast({
        title: "Encryption enabled",
        description: `Backup created: ${filename}. Your future messages will be encrypted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create backup. Encryption not enabled.",
        variant: "destructive"
      });
    }
  };

  const createManualBackup = () => {
    try {
      const filename = PrivacyManager.createLocalBackup();
      toast({
        title: "Backup created",
        description: `Downloaded: ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create backup.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy & Security</h3>
        <p className="text-sm text-muted-foreground">
          Control how your data is stored and used. Changes take effect immediately.
        </p>
      </div>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Data Protection
          </CardTitle>
          <CardDescription>
            Protect your sensitive conversations with encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Encrypt Chat History</div>
              <div className="text-xs text-muted-foreground">
                Encrypt stored messages locally and in the cloud
              </div>
            </div>
            <Switch
              checked={settings.encryptionEnabled}
              onCheckedChange={(checked) => handleSettingChange('encryptionEnabled', checked)}
            />
          </div>

          {settings.encryptionEnabled && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                Your messages are encrypted with AES-256 before storage
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Button variant="outline" size="sm" onClick={createManualBackup}>
                <Download className="h-4 w-4 mr-2" />
                Download Backup
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Create a local backup of your data
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Communication
          </CardTitle>
          <CardDescription>
            Manage how we communicate with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Marketing Emails</div>
              <div className="text-xs text-muted-foreground">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Data Management
          </CardTitle>
          <CardDescription>
            Control how long your data is stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Data Retention</div>
              <div className="text-xs text-muted-foreground">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </CardTitle>
          <CardDescription>
            Help us improve by sharing anonymous usage data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Anonymous Usage Analytics</div>
              <div className="text-xs text-muted-foreground">
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
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Enable Encryption
              </CardTitle>
              <CardDescription>
                We'll create a backup of your current data before enabling encryption.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">What happens next:</p>
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