import { useState } from 'react';
import { Mail, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { PrivacyManager } from '@/utils/encryption';

const AccountSecurity = () => {
  const { isMobile } = useOptimizedMobile();
  const [settings, setSettings] = useState(() => PrivacyManager.getPrivacySettings());
  
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    PrivacyManager.updatePrivacySettings(newSettings);
  };
  
  return <>
      <div className={`${isMobile ? 'account-mobile' : ''} ${isMobile ? 'space-y-3' : 'space-y-2.5'}`}>
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
    </>;
};
export default AccountSecurity;