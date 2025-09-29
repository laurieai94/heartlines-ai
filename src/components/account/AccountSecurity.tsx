import { useState } from 'react';
import { Shield, Download, Mail, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { toast } from 'sonner';
import { PrivacyManager } from '@/utils/encryption';

const AccountSecurity = () => {
  const { isMobile } = useOptimizedMobile();
  const [settings, setSettings] = useState(() => PrivacyManager.getPrivacySettings());
  const [showBackupPrompt, setShowBackupPrompt] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    PrivacyManager.updatePrivacySettings(newSettings);
    
    toast.success('Settings Updated', {
      description: 'Your privacy preferences have been saved.',
    });
  };

  const handleEnableEncryption = () => {
    if (!settings.encryptionEnabled) {
      setShowBackupPrompt(true);
    } else {
      handleSettingChange('encryptionEnabled', false);
      PrivacyManager.setEncryptionEnabled(false);
    }
  };

  const createManualBackup = () => {
    try {
      PrivacyManager.createLocalBackup();
      
      if (showBackupPrompt) {
        handleSettingChange('encryptionEnabled', true);
        PrivacyManager.setEncryptionEnabled(true);
        setShowBackupPrompt(false);
      }
      
      toast.success('Backup Created', {
        description: 'Your data has been downloaded successfully.',
      });
    } catch (error) {
      toast.error('Backup Failed', {
        description: 'Unable to create backup. Please try again.',
      });
    }
  };

  return (
    <>
      <div className={`${isMobile ? 'account-mobile' : ''} space-y-4 md:space-y-6`}>
        {/* Data Protection */}
        <Card className={isMobile ? 'mobile-card' : ''}>
          <CardHeader className={isMobile ? 'mobile-card-header' : ''}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
              </div>
              <div>
                <CardTitle className={isMobile ? 'mobile-title' : 'text-lg'}>Data Protection</CardTitle>
                <CardDescription className={isMobile ? 'mobile-subtitle' : ''}>
                  Manage how your data is stored and protected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content space-y-4' : 'space-y-6'}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${isMobile ? 'mobile-body' : ''}`}>
                      Encrypt Chat History
                    </p>
                    {settings.encryptionEnabled && (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className={`text-muted-foreground ${isMobile ? 'mobile-caption' : 'text-sm'}`}>
                    Enable end-to-end encryption for your conversations
                  </p>
                </div>
                <Switch
                  checked={settings.encryptionEnabled}
                  onCheckedChange={handleEnableEncryption}
                  className={isMobile ? 'touch-feedback' : ''}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className={`font-medium ${isMobile ? 'mobile-body' : ''}`}>Download Your Data</p>
                <p className={`text-muted-foreground ${isMobile ? 'mobile-caption' : 'text-sm'}`}>
                  Create a backup of all your stored data
                </p>
                <Button
                  variant="outline"
                  onClick={createManualBackup}
                  className={`w-full ${isMobile ? 'mobile-button-secondary touch-feedback' : ''}`}
                >
                  <Download className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                  Download Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card className={isMobile ? 'mobile-card' : ''}>
          <CardHeader className={isMobile ? 'mobile-card-header' : ''}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
              </div>
              <div>
                <CardTitle className={isMobile ? 'mobile-title' : 'text-lg'}>Communication</CardTitle>
                <CardDescription className={isMobile ? 'mobile-subtitle' : ''}>
                  Control how we communicate with you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content' : ''}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <p className={`font-medium ${isMobile ? 'mobile-body' : ''}`}>
                  Marketing Emails
                </p>
                <p className={`text-muted-foreground ${isMobile ? 'mobile-caption' : 'text-sm'}`}>
                  Receive updates about new features and improvements
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                className={isMobile ? 'touch-feedback' : ''}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className={isMobile ? 'mobile-card' : ''}>
          <CardHeader className={isMobile ? 'mobile-card-header' : ''}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
              </div>
              <div>
                <CardTitle className={isMobile ? 'mobile-title' : 'text-lg'}>Data Management</CardTitle>
                <CardDescription className={isMobile ? 'mobile-subtitle' : ''}>
                  Configure data retention policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content' : ''}>
            <div className="space-y-2">
              <p className={`font-medium ${isMobile ? 'mobile-body' : ''}`}>
                Data Retention Period
              </p>
              <p className={`text-muted-foreground ${isMobile ? 'mobile-caption' : 'text-sm'} mb-3`}>
                How long should we keep your conversation history?
              </p>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) => handleSettingChange('dataRetention', value)}
              >
                <SelectTrigger className={isMobile ? 'h-11' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className={isMobile ? 'mobile-card' : ''}>
          <CardHeader className={isMobile ? 'mobile-card-header' : ''}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
              </div>
              <div>
                <CardTitle className={isMobile ? 'mobile-title' : 'text-lg'}>Analytics</CardTitle>
                <CardDescription className={isMobile ? 'mobile-subtitle' : ''}>
                  Help us improve your experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content' : ''}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <p className={`font-medium ${isMobile ? 'mobile-body' : ''}`}>
                  Anonymous Usage Analytics
                </p>
                <p className={`text-muted-foreground ${isMobile ? 'mobile-caption' : 'text-sm'}`}>
                  Share anonymous usage data to help us improve the app
                </p>
              </div>
              <Switch
                checked={settings.anonymousUsage}
                onCheckedChange={(checked) => handleSettingChange('anonymousUsage', checked)}
                className={isMobile ? 'touch-feedback' : ''}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Prompt Dialog */}
      <AlertDialog open={showBackupPrompt} onOpenChange={setShowBackupPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <AlertDialogTitle>Enable Encryption</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-3 text-left">
              <p>
                Before enabling encryption, we'll create a backup of your current data.
              </p>
              <p className="font-medium text-foreground">
                Important: Once encryption is enabled, you won't be able to recover your data if you lose access to your account.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createManualBackup}>
              Create Backup & Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountSecurity;