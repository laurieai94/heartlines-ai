import { useState } from 'react';
import { Shield, Mail, Key, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AccountSecurity = () => {
  const { user, resetPassword } = useAuth();
  
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
    <div className="space-y-2.5">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Security Settings</h3>
        <p className="text-white/70 text-xs">
          Manage your account security and authentication preferences
        </p>
      </div>

      {/* Account Security Status */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <Shield className="h-3.5 w-3.5" />
            Security Overview
          </CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Your account security status and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-2.5">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-white font-medium text-xs">Email Verified</p>
                  <p className="text-[10px] text-white/60">Your email address is verified</p>
                </div>
              </div>
              <div className="text-green-400 text-[10px] font-medium">Secure</div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-white font-medium text-xs">Password Authentication</p>
                  <p className="text-[10px] text-white/60">Secure password-based login</p>
                </div>
              </div>
              <div className="text-blue-400 text-[10px] font-medium">Active</div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-orange-400" />
                <div>
                  <p className="text-white font-medium text-xs">Two-Factor Authentication</p>
                  <p className="text-[10px] text-white/60">Add an extra layer of security</p>
                </div>
              </div>
              <div className="text-orange-400 text-[10px] font-medium">Coming Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <Key className="h-3.5 w-3.5" />
            Password Management
          </CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Reset your password or update security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-2.5">
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-white flex items-center gap-1.5 text-xs">
              <Mail className="h-3.5 w-3.5" />
              Email
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20 text-xs"
            />
          </div>

          <Button 
            onClick={handlePasswordReset}
            disabled={sendingReset || !email}
            className="questionnaire-button-secondary text-xs py-1.5"
          >
            <Key className="h-3.5 w-3.5 mr-1.5" />
            {sendingReset ? 'Sending...' : 'Send Password Reset'}
          </Button>

        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white text-sm">Session Management</CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Manage your active sessions and devices
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-2.5">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-white font-medium text-xs">Current Session</p>
              <div className="flex items-center gap-1.5 text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-[10px]">Active</span>
              </div>
            </div>
            <p className="text-xs text-white/60">
              Web browser • {new Date().toLocaleDateString()}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">
              This is your current session. You'll remain logged in until you sign out.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-gray-500/20 border border-gray-400/30">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="text-gray-300 font-medium">Enhanced Session Management</p>
                <p className="text-gray-400/80 mt-0.5">
                  Advanced session controls, device management, and security alerts 
                  will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white text-sm">Security Tips</CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Keep your account safe with these recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <ul className="space-y-2 text-xs text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Use a strong, unique password for your account</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Keep your email account secure as it's used for password resets</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
              <span>Never share your login credentials with others</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
              <span>Sign out from shared or public devices</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;