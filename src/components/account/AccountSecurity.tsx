import { useState } from 'react';
import { Shield, Mail, Key, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { toast } from 'sonner';

const AccountSecurity = () => {
  const { user, resetPassword } = useAuth();
  const { isMobile, simulateHapticFeedback } = useOptimizedMobile();
  
  const [email, setEmail] = useState(user?.email || '');
  const [sendingReset, setSendingReset] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) return;
    
    setSendingReset(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      toast.success('Password reset sent', {
        description: 'Check your email for instructions to reset your password.'
      });
    } catch (error) {
      toast.error('Reset failed', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className={`${isMobile ? '' : 'space-y-2.5'} touch-manipulation`}>
      <div>
        <h3 className={`font-semibold text-white mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Security Settings
        </h3>
        <p className={`text-white/70 ${isMobile ? 'text-[10px] leading-tight' : 'text-xs'}`}>
          Manage your account security and authentication preferences
        </p>
      </div>

      {/* Account Security Status */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardHeader className={isMobile ? 'p-2' : 'p-2.5'}>
          <CardTitle className={`text-white flex items-center gap-2 ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            <Shield className={isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            Security Overview
          </CardTitle>
          <CardDescription className={`text-white/60 ${
            isMobile ? 'text-[10px] leading-tight' : 'text-xs'
          }`}>
            Your account security status and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-2 pt-0 space-y-2' : 'p-2.5 pt-0 space-y-2.5'}`}>
          <div className={`grid ${isMobile ? 'gap-2' : 'gap-3'}`}>
            <div className={`flex items-center justify-between rounded-lg bg-white/5 border border-white/10 ${
              isMobile ? 'p-1.5' : 'p-2'
            }`}>
              <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                <CheckCircle className={`text-green-400 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <div className="min-w-0">
                  <p className={`text-white font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    Email Verified
                  </p>
                  <p className={`text-white/60 ${
                    isMobile ? 'text-[9px] leading-tight' : 'text-[10px]'
                  }`}>
                    Your email address is verified
                  </p>
                </div>
              </div>
              <div className={`text-green-400 font-medium ${
                isMobile ? 'text-[9px]' : 'text-[10px]'
              }`}>Secure</div>
            </div>

            <div className={`flex items-center justify-between rounded-lg bg-white/5 border border-white/10 ${
              isMobile ? 'p-1.5' : 'p-2'
            }`}>
              <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                <Key className={`text-blue-400 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <div className="min-w-0">
                  <p className={`text-white font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    Password Authentication
                  </p>
                  <p className={`text-white/60 ${
                    isMobile ? 'text-[9px] leading-tight' : 'text-[10px]'
                  }`}>
                    Secure password-based login
                  </p>
                </div>
              </div>
              <div className={`text-blue-400 font-medium ${
                isMobile ? 'text-[9px]' : 'text-[10px]'
              }`}>Active</div>
            </div>

            <div className={`flex items-center justify-between rounded-lg bg-white/5 border border-white/10 ${
              isMobile ? 'p-1.5' : 'p-2'
            }`}>
              <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                <Smartphone className={`text-orange-400 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <div className="min-w-0">
                  <p className={`text-white font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    Two-Factor Authentication
                  </p>
                  <p className={`text-white/60 ${
                    isMobile ? 'text-[9px] leading-tight' : 'text-[10px]'
                  }`}>
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <div className={`text-orange-400 font-medium ${
                isMobile ? 'text-[9px]' : 'text-[10px]'
              }`}>Coming Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardHeader className={isMobile ? 'p-2' : 'p-2.5'}>
          <CardTitle className={`text-white flex items-center gap-2 ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            <Key className={isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            Password Management
          </CardTitle>
          <CardDescription className={`text-white/60 ${
            isMobile ? 'text-[10px] leading-tight' : 'text-xs'
          }`}>
            Reset your password or update security settings
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-2 pt-0 space-y-2' : 'p-2.5 pt-0 space-y-2.5'}`}>
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className={`text-white flex items-center gap-1.5 ${
              isMobile ? 'text-[10px]' : 'text-xs'
            }`}>
              <Mail className={isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
              Email
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20 touch-manipulation ${
                isMobile ? 'text-[11px] h-10' : 'text-xs'
              }`}
            />
          </div>

          <Button 
            onClick={(e) => {
              if (isMobile && e.currentTarget) {
                simulateHapticFeedback(e.currentTarget, 'medium');
              }
              handlePasswordReset();
            }}
            disabled={sendingReset || !email}
            className={`questionnaire-button-secondary touch-manipulation touch-feedback ${
              isMobile ? 'mobile-button-primary w-full' : 'text-xs py-1.5'
            }`}
          >
            <Key className={`mr-1.5 ${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
            {sendingReset ? 'Sending...' : 'Send Password Reset'}
          </Button>

        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardHeader className={isMobile ? 'p-2' : 'p-2.5'}>
          <CardTitle className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Session Management
          </CardTitle>
          <CardDescription className={`text-white/60 ${
            isMobile ? 'text-[10px] leading-tight' : 'text-xs'
          }`}>
            Manage your active sessions and devices
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-2 pt-0 space-y-2' : 'p-2.5 pt-0 space-y-2.5'}`}>
          <div className={`rounded-lg bg-white/5 border border-white/10 ${
            isMobile ? 'p-2' : 'p-3'
          }`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-1.5'}`}>
              <p className={`text-white font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                Current Session
              </p>
              <div className={`flex items-center text-green-400 ${
                isMobile ? 'gap-1' : 'gap-1.5'
              }`}>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className={isMobile ? 'text-[9px]' : 'text-[10px]'}>Active</span>
              </div>
            </div>
            <p className={`text-white/60 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
              Web browser • {new Date().toLocaleDateString()}
            </p>
            <p className={`text-white/50 mt-0.5 ${
              isMobile ? 'text-[9px] leading-tight' : 'text-[10px]'
            }`}>
              This is your current session. You'll remain logged in until you sign out.
            </p>
          </div>

          <div className={`rounded-lg bg-gray-500/20 border border-gray-400/30 ${
            isMobile ? 'p-2' : 'p-2.5'
          }`}>
            <div className={`flex items-start ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
              <AlertCircle className={`text-gray-400 mt-0.5 flex-shrink-0 ${
                isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'
              }`} />
              <div className={isMobile ? 'text-[10px]' : 'text-xs'}>
                <p className={`text-gray-300 font-medium ${
                  isMobile ? 'text-[10px]' : ''
                }`}>Enhanced Session Management</p>
                <p className={`text-gray-400/80 mt-0.5 ${
                  isMobile ? 'text-[9px] leading-tight' : ''
                }`}>
                  Advanced session controls, device management, and security alerts 
                  will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardHeader className={isMobile ? 'p-2' : 'p-2.5'}>
          <CardTitle className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Security Tips
          </CardTitle>
          <CardDescription className={`text-white/60 ${
            isMobile ? 'text-[10px] leading-tight' : 'text-xs'
          }`}>
            Keep your account safe with these recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-2 pt-0' : 'p-2.5 pt-0'}`}>
          <ul className={`text-white/80 ${
            isMobile ? 'space-y-1.5 text-[10px]' : 'space-y-2 text-xs'
          }`}>
            <li className={`${isMobile ? 'security-tip' : 'flex items-start gap-2'}`}>
              <CheckCircle className={`text-green-400 flex-shrink-0 ${
                isMobile ? 'security-tip-icon' : 'h-3 w-3 mt-0.5'
              }`} />
              <span className={isMobile ? 'mobile-body' : ''}>
                Use a strong, unique password for your account
              </span>
            </li>
            <li className={`${isMobile ? 'security-tip' : 'flex items-start gap-2'}`}>
              <CheckCircle className={`text-green-400 flex-shrink-0 ${
                isMobile ? 'security-tip-icon' : 'h-3 w-3 mt-0.5'
              }`} />
              <span className={isMobile ? 'mobile-body' : ''}>
                Keep your email account secure as it's used for password resets
              </span>
            </li>
            <li className={`${isMobile ? 'security-tip' : 'flex items-start gap-2'}`}>
              <AlertCircle className={`text-orange-400 flex-shrink-0 ${
                isMobile ? 'security-tip-icon' : 'h-3 w-3 mt-0.5'
              }`} />
              <span className={isMobile ? 'mobile-body' : ''}>
                Never share your login credentials with others
              </span>
            </li>
            <li className={`${isMobile ? 'security-tip' : 'flex items-start gap-2'}`}>
              <AlertCircle className={`text-orange-400 flex-shrink-0 ${
                isMobile ? 'security-tip-icon' : 'h-3 w-3 mt-0.5'
              }`} />
              <span className={isMobile ? 'mobile-body' : ''}>
                Sign out from shared or public devices
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;