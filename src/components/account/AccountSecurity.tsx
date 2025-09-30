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
  const {
    isMobile
  } = useOptimizedMobile();
  const [settings, setSettings] = useState(() => PrivacyManager.getPrivacySettings());
  const [showBackupPrompt, setShowBackupPrompt] = useState(false);
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    PrivacyManager.updatePrivacySettings(newSettings);
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
    } catch (error) {
      toast.error('Backup Failed', {
        description: 'Unable to create backup. Please try again.'
      });
    }
  };
  return <>
      <div className={`${isMobile ? 'account-mobile' : ''} space-y-2.5`}>
        {/* Data Protection */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-1.5' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                <Shield className={`text-pink-400 ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-sm font-medium' : 'text-base font-medium'} text-white`}>Data Protection</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs leading-tight' : 'text-sm'} text-white/60`}>
                  Manage how your data is stored and protected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-1.5 pt-0 space-y-2' : 'p-2.5 pt-0 space-y-2.5'}>
            <div className={isMobile ? 'space-y-2' : 'space-y-2.5'}>
              <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-2' : 'gap-4'}`}>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-medium ${isMobile ? 'text-[13px]' : 'text-sm'} text-white`}>
                      Encrypt Chat History
                    </p>
                    {settings.encryptionEnabled && <span className={`px-1.5 py-0.5 bg-primary/10 text-primary rounded-full ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                        Active
                      </span>}
                  </div>
                  <p className={`text-white/60 ${isMobile ? 'text-xs leading-tight' : 'text-sm'}`}>
                    Enable end-to-end encryption for your conversations
                  </p>
                </div>
                <Switch checked={settings.encryptionEnabled} onCheckedChange={handleEnableEncryption} className="touch-manipulation" />
              </div>

              <Separator className="my-2" />

              <div className={isMobile ? 'space-y-1' : 'space-y-1.5'}>
                <p className={`font-medium ${isMobile ? 'text-[13px]' : 'text-sm'} text-white`}>Download Your Data</p>
                <p className={`text-white/60 ${isMobile ? 'text-xs leading-tight' : 'text-sm'}`}>
                  Create a backup of all your stored data
                </p>
                <Button variant="ghost" onClick={createManualBackup} className={`w-full touch-manipulation touch-feedback text-white hover:bg-white/5 ${isMobile ? 'text-[13px] py-1 h-7' : 'text-sm py-1.5 h-8'}`}>
                  <Download className={`text-pink-400 ${isMobile ? 'w-2.5 h-2.5 mr-1' : 'w-3.5 h-3.5'}`} />
                  Download Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-1.5' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                <Mail className={`text-pink-400 ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-sm font-medium' : 'text-base font-medium'} text-white`}>Communication</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs leading-tight' : 'text-sm'} text-white/60`}>
                  Control how we communicate with you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-1.5 pt-0' : 'p-2.5 pt-0'}>
            <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-2' : 'gap-4'}`}>
              <div className="flex-1 space-y-0.5">
                <p className={`font-medium ${isMobile ? 'text-[13px]' : 'text-sm'} text-white`}>
                  Marketing Emails
                </p>
                <p className={`text-white/60 ${isMobile ? 'text-xs leading-tight' : 'text-sm'}`}>
                  Receive updates about new features and improvements
                </p>
              </div>
              <Switch checked={settings.marketingEmails} onCheckedChange={checked => handleSettingChange('marketingEmails', checked)} className="touch-manipulation" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-1.5' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                <Clock className={`text-pink-400 ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-sm font-medium' : 'text-base font-medium'} text-white`}>Data Management</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs leading-tight' : 'text-sm'} text-white/60`}>
                  Configure data retention policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-1.5 pt-0' : 'p-2.5 pt-0'}>
            <div className={isMobile ? 'space-y-1' : 'space-y-1.5'}>
              <p className={`font-medium ${isMobile ? 'text-[13px]' : 'text-sm'} text-white`}>
                Data Retention Period
              </p>
              <p className={`text-white/60 ${isMobile ? 'text-xs leading-tight mb-1' : 'text-sm mb-2'}`}>
                How long should we keep your conversation history?
              </p>
              <Select value={settings.dataRetention} onValueChange={value => handleSettingChange('dataRetention', value)}>
                <SelectTrigger className={`w-full touch-manipulation text-white border-white/20 bg-white/5 ${isMobile ? 'text-[13px] h-7' : 'text-sm h-8'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days" className={isMobile ? 'text-[13px]' : 'text-sm'}>30 Days</SelectItem>
                  <SelectItem value="90days" className={isMobile ? 'text-[13px]' : 'text-sm'}>90 Days</SelectItem>
                  <SelectItem value="1year" className={isMobile ? 'text-[13px]' : 'text-sm'}>1 Year</SelectItem>
                  <SelectItem value="forever" className={isMobile ? 'text-[13px]' : 'text-sm'}>Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-1.5' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                <BarChart3 className={`text-pink-400 ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-sm font-medium' : 'text-base font-medium'} text-white`}>Analytics</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs leading-tight' : 'text-sm'} text-white/60`}>
                  Help us improve your experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-1.5 pt-0' : 'p-2.5 pt-0'}>
            <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-2' : 'gap-4'}`}>
              <div className="flex-1 space-y-0.5">
                <p className={`font-medium ${isMobile ? 'text-[13px]' : 'text-sm'} text-white`}>
                  Anonymous Usage Analytics
                </p>
                <p className={`text-white/60 ${isMobile ? 'text-xs leading-tight' : 'text-sm'}`}>
                  Share anonymous usage data to help us improve the app
                </p>
              </div>
              <Switch checked={settings.anonymousUsage} onCheckedChange={checked => handleSettingChange('anonymousUsage', checked)} className="touch-manipulation" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Prompt Dialog */}
      <AlertDialog open={showBackupPrompt} onOpenChange={setShowBackupPrompt}>
        <AlertDialogContent className={`${isMobile ? 'max-w-[calc(100%-2rem)]' : ''} bg-[#5D2536]/25 backdrop-blur-lg border border-white/20`}>
          <AlertDialogHeader>
            <div className={`flex items-center mb-2 ${isMobile ? 'gap-2' : 'gap-3'}`}>
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                <AlertTriangle className={`text-pink-400 ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </div>
              <AlertDialogTitle className={`${isMobile ? 'text-sm' : 'text-base'} text-white`}>Turn On Encryption </AlertDialogTitle>
            </div>
            <AlertDialogDescription className={`space-y-2 text-left ${isMobile ? 'text-xs' : 'text-sm'} text-white/80`}>
              <p>
                Before enabling encryption, we'll create a backup of your current data.
              </p>
              <p className="font-medium text-white">
                Important: Once encryption is enabled, you won't be able to recover your data if you lose access to your account.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
            <AlertDialogCancel className={`${isMobile ? 'text-[13px] h-8 w-full' : 'text-sm'} bg-[#5D2536]/60 text-white border-white/30 hover:bg-[#5D2536]/80 hover:border-white/40`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={createManualBackup} className={`touch-manipulation touch-feedback ${isMobile ? 'text-[13px] h-8 w-full' : 'text-sm'}`}>
              Create Backup & Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
export default AccountSecurity;