import { useState } from 'react';
import { Shield, Download, Mail, Clock, BarChart3, Lock } from 'lucide-react';
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
      <div className={`${isMobile ? 'account-mobile' : ''} ${isMobile ? 'space-y-3' : 'space-y-2.5'}`}>
        {/* Data Protection */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Shield className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>Data Protection</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  Manage how your data is stored and protected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-3 pt-0 space-y-3' : 'p-2.5 pt-0 space-y-2.5'}>
            <div className={isMobile ? 'space-y-3' : 'space-y-2.5'}>
              <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-3' : 'gap-4'}`}>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                      Encrypt Chat History
                    </p>
                    {settings.encryptionEnabled && <span className={`px-1.5 py-0.5 bg-primary/10 text-primary rounded-full ${isMobile ? 'text-xs' : 'text-xs'}`}>
                        Active
                      </span>}
                  </div>
                  <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                    Enable end-to-end encryption for your conversations
                  </p>
                </div>
                <Switch checked={settings.encryptionEnabled} onCheckedChange={handleEnableEncryption} className="touch-manipulation flex-shrink-0" />
              </div>

              <Separator className="my-2" />

              <div className={isMobile ? 'space-y-2' : 'space-y-1.5'}>
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>Download Your Data</p>
                <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug mb-2' : 'text-sm'}`}>
                  Create a backup of all your stored data
                </p>
                <Button variant="ghost" onClick={createManualBackup} className={`w-full touch-manipulation touch-feedback text-white hover:bg-white/5 ${isMobile ? 'text-sm h-11' : 'text-sm py-1.5 h-8'}`}>
                  <Download className={`text-pink-400 ${isMobile ? 'w-4 h-4 mr-2' : 'w-4 h-4'}`} />
                  Download Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Mail className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>Communication</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  Control how we communicate with you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-3 pt-0' : 'p-2.5 pt-0'}>
            <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-3' : 'gap-4'}`}>
              <div className="flex-1 space-y-1">
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                  Marketing Emails
                </p>
                <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                  Receive updates about new features and improvements
                </p>
              </div>
              <Switch checked={settings.marketingEmails} onCheckedChange={checked => handleSettingChange('marketingEmails', checked)} className="touch-manipulation flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Clock className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>Data Management</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  Configure data retention policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-3 pt-0' : 'p-2.5 pt-0'}>
            <div className={isMobile ? 'space-y-2' : 'space-y-1.5'}>
              <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                Data Retention Period
              </p>
              <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug mb-2' : 'text-sm mb-2'}`}>
                How long should we keep your conversation history?
              </p>
              <Select value={settings.dataRetention} onValueChange={value => handleSettingChange('dataRetention', value)}>
                <SelectTrigger className={`w-full touch-manipulation text-white border-white/20 bg-white/5 ${isMobile ? 'text-sm h-11' : 'text-sm h-8'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days" className={isMobile ? 'text-sm' : 'text-sm'}>30 Days</SelectItem>
                  <SelectItem value="90days" className={isMobile ? 'text-sm' : 'text-sm'}>90 Days</SelectItem>
                  <SelectItem value="1year" className={isMobile ? 'text-sm' : 'text-sm'}>1 Year</SelectItem>
                  <SelectItem value="forever" className={isMobile ? 'text-sm' : 'text-sm'}>Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <BarChart3 className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>Analytics</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  Help us improve your experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-3 pt-0' : 'p-2.5 pt-0'}>
            <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-3' : 'gap-4'}`}>
              <div className="flex-1 space-y-1">
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                  Anonymous Usage Analytics
                </p>
                <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                  Share anonymous usage data to help us improve the app
                </p>
              </div>
              <Switch checked={settings.anonymousUsage} onCheckedChange={checked => handleSettingChange('anonymousUsage', checked)} className="touch-manipulation flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Prompt Dialog */}
      <AlertDialog open={showBackupPrompt} onOpenChange={setShowBackupPrompt}>
        <AlertDialogContent className={`${isMobile ? 'max-w-[calc(100%-2rem)]' : ''} bg-[#5D2536]/70 backdrop-blur-lg border border-white/20`}>
          <AlertDialogHeader>
            <div className={`flex items-center mb-2 ${isMobile ? 'gap-2' : 'gap-3'}`}>
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                <Lock className={`text-pink-400 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
              <AlertDialogTitle className={`${isMobile ? 'text-sm' : 'text-base'} text-white`}>Turn On Encryption </AlertDialogTitle>
            </div>
            <AlertDialogDescription className={`space-y-2 text-left ${isMobile ? 'text-xs' : 'text-sm'} text-white/80`}>
              <p>
                We'll make a quick backup, then lock everything with encryption.
              </p>
              <p className="font-medium text-white">
                But remember: if you get locked out, we can't get it back for you.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
            <AlertDialogCancel className={`${isMobile ? 'text-[13px] h-8 w-full' : 'text-sm'} bg-[#5D2536]/60 text-white border-white/30 hover:bg-[#5D2536]/80 hover:border-white/40`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={createManualBackup} className={`bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation touch-feedback ${isMobile ? 'text-[13px] h-8 w-full' : 'text-sm'}`}>
              Create Backup & Encrypt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
export default AccountSecurity;