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
      <div className={`${isMobile ? 'account-mobile' : ''} space-y-2.5`}>
        {/* Section Header */}
        <div className={`${isMobile ? 'mobile-space-md' : 'mb-4'}`}>
          <h2 className={`${isMobile ? 'mobile-title' : 'text-sm font-semibold'} text-white`}>
            Privacy & Security
          </h2>
          <p className={`${isMobile ? 'mobile-subtitle' : 'text-xs'} text-white/70 mt-1`}>
            Manage your privacy preferences and data security
          </p>
        </div>

        {/* Data Protection */}
        <Card className={`${isMobile ? 'mobile-card' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'mobile-card-header' : 'p-2.5'}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'mobile-title' : 'text-sm font-medium'} text-white`}>Data Protection</CardTitle>
                <CardDescription className={`${isMobile ? 'mobile-caption' : 'text-xs'} text-white/60`}>
                  Manage how your data is stored and protected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content space-y-2.5' : 'p-2.5 pt-0 space-y-2.5'}>
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-4 touch-manipulation">
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${isMobile ? 'mobile-body' : 'text-xs'} text-white`}>
                      Encrypt Chat History
                    </p>
                    {settings.encryptionEnabled && (
                      <span className={`px-2 py-0.5 bg-primary/10 text-primary rounded-full ${isMobile ? 'mobile-caption' : 'text-[10px]'}`}>
                        Active
                      </span>
                    )}
                  </div>
                  <p className={`text-white/60 ${isMobile ? 'mobile-caption' : 'text-[10px]'}`}>
                    Enable end-to-end encryption for your conversations
                  </p>
                </div>
                <Switch
                  checked={settings.encryptionEnabled}
                  onCheckedChange={handleEnableEncryption}
                  className="touch-manipulation"
                />
              </div>

              <Separator className="my-2" />

              <div className="space-y-1.5">
                <p className={`font-medium ${isMobile ? 'mobile-body' : 'text-xs'} text-white`}>Download Your Data</p>
                <p className={`text-white/60 ${isMobile ? 'mobile-caption' : 'text-[10px]'}`}>
                  Create a backup of all your stored data
                </p>
                <Button
                  variant="ghost"
                  onClick={createManualBackup}
                  className={`w-full touch-manipulation touch-feedback text-white hover:bg-white/5 ${isMobile ? 'mobile-button-secondary' : 'text-xs py-1.5 h-8'}`}
                >
                  <Download className={isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                  Download Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card className={`${isMobile ? 'mobile-card' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'mobile-card-header' : 'p-2.5'}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'mobile-title' : 'text-sm font-medium'} text-white`}>Communication</CardTitle>
                <CardDescription className={`${isMobile ? 'mobile-caption' : 'text-xs'} text-white/60`}>
                  Control how we communicate with you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content' : 'p-2.5 pt-0'}>
            <div className="flex items-start justify-between gap-4 touch-manipulation">
              <div className="flex-1 space-y-0.5">
                <p className={`font-medium ${isMobile ? 'mobile-body' : 'text-xs'} text-white`}>
                  Marketing Emails
                </p>
                <p className={`text-white/60 ${isMobile ? 'mobile-caption' : 'text-[10px]'}`}>
                  Receive updates about new features and improvements
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                className="touch-manipulation"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className={`${isMobile ? 'mobile-card' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'mobile-card-header' : 'p-2.5'}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'mobile-title' : 'text-sm font-medium'} text-white`}>Data Management</CardTitle>
                <CardDescription className={`${isMobile ? 'mobile-caption' : 'text-xs'} text-white/60`}>
                  Configure data retention policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content' : 'p-2.5 pt-0'}>
            <div className="space-y-1.5">
              <p className={`font-medium ${isMobile ? 'mobile-body' : 'text-xs'} text-white`}>
                Data Retention Period
              </p>
              <p className={`text-white/60 ${isMobile ? 'mobile-caption' : 'text-[10px]'} mb-2`}>
                How long should we keep your conversation history?
              </p>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) => handleSettingChange('dataRetention', value)}
              >
                <SelectTrigger className={`w-full touch-manipulation text-white border-white/20 bg-white/5 ${isMobile ? 'mobile-button-secondary h-9' : 'text-xs h-8'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days" className={isMobile ? 'mobile-body' : 'text-xs'}>30 Days</SelectItem>
                  <SelectItem value="90days" className={isMobile ? 'mobile-body' : 'text-xs'}>90 Days</SelectItem>
                  <SelectItem value="1year" className={isMobile ? 'mobile-body' : 'text-xs'}>1 Year</SelectItem>
                  <SelectItem value="forever" className={isMobile ? 'mobile-body' : 'text-xs'}>Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className={`${isMobile ? 'mobile-card' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'mobile-card-header' : 'p-2.5'}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'mobile-title' : 'text-sm font-medium'} text-white`}>Analytics</CardTitle>
                <CardDescription className={`${isMobile ? 'mobile-caption' : 'text-xs'} text-white/60`}>
                  Help us improve your experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'mobile-card-content' : 'p-2.5 pt-0'}>
            <div className="flex items-start justify-between gap-4 touch-manipulation">
              <div className="flex-1 space-y-0.5">
                <p className={`font-medium ${isMobile ? 'mobile-body' : 'text-xs'} text-white`}>
                  Anonymous Usage Analytics
                </p>
                <p className={`text-white/60 ${isMobile ? 'mobile-caption' : 'text-[10px]'}`}>
                  Share anonymous usage data to help us improve the app
                </p>
              </div>
              <Switch
                checked={settings.anonymousUsage}
                onCheckedChange={(checked) => handleSettingChange('anonymousUsage', checked)}
                className="touch-manipulation"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Prompt Dialog */}
      <AlertDialog open={showBackupPrompt} onOpenChange={setShowBackupPrompt}>
        <AlertDialogContent className={isMobile ? 'mobile-dialog' : ''}>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertTriangle className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              </div>
              <AlertDialogTitle className={isMobile ? 'mobile-title' : 'text-sm'}>Enable Encryption</AlertDialogTitle>
            </div>
            <AlertDialogDescription className={`space-y-2 text-left ${isMobile ? 'mobile-body' : 'text-xs'}`}>
              <p>
                Before enabling encryption, we'll create a backup of your current data.
              </p>
              <p className="font-medium text-foreground">
                Important: Once encryption is enabled, you won't be able to recover your data if you lose access to your account.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
            <AlertDialogCancel className={isMobile ? 'mobile-button-secondary w-full' : 'text-xs'}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={createManualBackup}
              className={`touch-manipulation touch-feedback ${isMobile ? 'mobile-button-primary w-full' : 'text-xs'}`}
            >
              Create Backup & Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountSecurity;