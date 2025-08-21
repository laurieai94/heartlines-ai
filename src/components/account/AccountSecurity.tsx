import { useState } from 'react';
import { Shield, Mail, Key, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AccountSecurity = () => {
  const { user, resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email || '');
  const [sendingReset, setSendingReset] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) return;
    
    setSendingReset(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      toast({
        title: 'Password reset sent',
        description: 'Check your email for instructions to reset your password.'
      });
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Security Settings</h3>
        <p className="text-white/70">
          Manage your account security and authentication preferences
        </p>
      </div>

      {/* Account Security Status */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
          <CardDescription className="text-white/60">
            Your account security status and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Email Verified</p>
                  <p className="text-sm text-white/60">Your email address is verified</p>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">Secure</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Password Authentication</p>
                  <p className="text-sm text-white/60">Secure password-based login</p>
                </div>
              </div>
              <div className="text-blue-400 text-sm font-medium">Active</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-white/60">Add an extra layer of security</p>
                </div>
              </div>
              <div className="text-orange-400 text-sm font-medium">Coming Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Management
          </CardTitle>
          <CardDescription className="text-white/60">
            Reset your password or update security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20"
            />
          </div>

          <Button 
            onClick={handlePasswordReset}
            disabled={sendingReset || !email}
            className="questionnaire-button-secondary"
          >
            <Key className="h-4 w-4 mr-2" />
            {sendingReset ? 'Sending...' : 'Send Password Reset'}
          </Button>

          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-200 font-medium">Password Reset Instructions</p>
                <p className="text-blue-300/80 mt-1">
                  Click the button above to receive a secure link via email. 
                  Follow the link to create a new password for your account.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Session Management</CardTitle>
          <CardDescription className="text-white/60">
            Manage your active sessions and devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-medium">Current Session</p>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Active</span>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Web browser • {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-white/50 mt-1">
              This is your current session. You'll remain logged in until you sign out.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-500/20 border border-gray-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-gray-300 font-medium">Enhanced Session Management</p>
                <p className="text-gray-400/80 mt-1">
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
        <CardHeader>
          <CardTitle className="text-white">Security Tips</CardTitle>
          <CardDescription className="text-white/60">
            Keep your account safe with these recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Use a strong, unique password for your account</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Keep your email account secure as it's used for password resets</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span>Never share your login credentials with others</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span>Sign out from shared or public devices</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;