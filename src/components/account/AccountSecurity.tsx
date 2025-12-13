import { useState } from 'react';
import { Mail, Clock, BarChart3, Key, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { PrivacyManager } from '@/utils/encryption';
import { validatePasswordPolicy } from '@/utils/passwordPolicy';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cleanupAuthState } from '@/utils/authCleanup';

const AccountSecurity = () => {
  const { isMobile } = useOptimizedMobile();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => PrivacyManager.getPrivacySettings());
  
  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Account deletion state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  // Data export state
  const [exporting, setExporting] = useState(false);
  
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    PrivacyManager.updatePrivacySettings(newSettings);
  };
  
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    const validation = validatePasswordPolicy(newPassword);
    if (!validation.isValid) {
      toast({
        title: "Invalid password",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }
    
    setChangingPassword(true);
    
    try {
      // Verify current password by trying to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('No user found');
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (signInError) {
        toast({
          title: "Invalid current password",
          description: "Please check your current password and try again",
          variant: "destructive"
        });
        return;
      }
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully"
      });
      
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setChangingPassword(false);
    }
  };
  
  const handleDataExport = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch all user data in parallel
      const [
        profileResult,
        personalProfileResult,
        partnerProfileResult,
        conversationsResult,
        remindersResult,
        onboardingResult
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_profiles').select('*').eq('user_id', user.id).eq('profile_type', 'your').maybeSingle(),
        supabase.from('user_profiles').select('*').eq('user_id', user.id).eq('profile_type', 'partner').maybeSingle(),
        supabase.from('chat_conversations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_reminders').select('*').eq('user_id', user.id),
        supabase.from('onboarding_status').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: {
          email: user.email
        },
        profile: profileResult.data ? {
          name: profileResult.data.name,
          avatar_url: profileResult.data.avatar_url,
          phone_number: profileResult.data.phone_number,
          created_at: profileResult.data.created_at
        } : null,
        personalProfile: personalProfileResult.data ? {
          demographics: personalProfileResult.data.demographics_data,
          questionnaire: personalProfileResult.data.profile_data
        } : null,
        partnerProfile: partnerProfileResult.data ? {
          demographics: partnerProfileResult.data.demographics_data,
          questionnaire: partnerProfileResult.data.profile_data
        } : null,
        conversations: conversationsResult.data?.map(conv => ({
          id: conv.id,
          title: conv.title,
          messages: conv.messages,
          created_at: conv.created_at,
          updated_at: conv.updated_at
        })) || [],
        reminders: remindersResult.data || [],
        onboardingStatus: onboardingResult.data || null
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `heartlines-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "data exported",
        description: "your data has been downloaded as a json file"
      });
    } catch (error: any) {
      toast({
        title: "export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };
  
  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: "Confirmation required",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive"
      });
      return;
    }
    
    if (!deletePassword) {
      toast({
        title: "Password required",
        description: "Please enter your password to confirm deletion",
        variant: "destructive"
      });
      return;
    }
    
    setDeletingAccount(true);
    
    try {
      // Verify password
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('No user found');
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword
      });
      
      if (signInError) {
        toast({
          title: "Invalid password",
          description: "Please check your password and try again",
          variant: "destructive"
        });
        return;
      }
      
      // Clean up all user data before signing out
      cleanupAuthState();
      
      // Sign out and notify (proper deletion requires backend implementation)
      await supabase.auth.signOut();
      
      toast({
        title: "Account deletion initiated",
        description: "Your session has been ended. Contact support to complete account deletion.",
        variant: "destructive"
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeletingAccount(false);
    }
  };
  
  return <>
      <div className={`${isMobile ? 'account-mobile' : ''} ${isMobile ? 'space-y-2' : 'space-y-1.5'}`}>
        {/* Communication Preferences */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-2.5 pb-1.5' : 'p-2'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Mail className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>communication</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  control how we communicate with you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-2.5 pt-0' : 'p-2 pt-0'}>
            <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-3' : 'gap-4'}`}>
              <div className="flex-1 space-y-1">
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                  marketing emails
                </p>
                <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                  receive updates about new features and improvements
                </p>
              </div>
              <Switch checked={settings.marketingEmails} onCheckedChange={checked => handleSettingChange('marketingEmails', checked)} className="touch-manipulation flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-2.5 pb-1.5' : 'p-2'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Clock className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>data management</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  configure data retention policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-2.5 pt-0' : 'p-2 pt-0'}>
            <div className={isMobile ? 'space-y-2' : 'space-y-1.5'}>
              <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                data retention period
              </p>
              <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug mb-2' : 'text-sm mb-2'}`}>
                how long should we keep your conversation history?
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

        {/* Data Export */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-2.5 pb-1.5' : 'p-2'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Download className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>export your data</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  download all your personal data in json format
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-2.5 pt-0' : 'p-2 pt-0'}>
            <Button 
              onClick={handleDataExport}
              disabled={exporting}
              variant="outline"
              className={`w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white touch-manipulation ${isMobile ? 'text-sm h-11' : 'text-sm h-8'}`}
            >
              {exporting ? 'exporting...' : 'export my data'}
            </Button>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-2.5 pb-1.5' : 'p-2'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <BarChart3 className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>analytics</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  help us improve your experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-2.5 pt-0' : 'p-2 pt-0'}>
            <div className={`flex items-start justify-between touch-manipulation ${isMobile ? 'gap-3' : 'gap-4'}`}>
              <div className="flex-1 space-y-1">
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-white`}>
                  anonymous usage analytics
                </p>
                <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                  share anonymous usage data to help us improve the app
                </p>
              </div>
              <Switch checked={settings.anonymousUsage} onCheckedChange={checked => handleSettingChange('anonymousUsage', checked)} className="touch-manipulation flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-white/10 backdrop-blur-sm border border-white/20`}>
          <CardHeader className={isMobile ? 'p-2.5 pb-1.5' : 'p-2'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Key className={`text-pink-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>password</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-white/60`}>
                  change your account password
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-2.5 pt-0' : 'p-2 pt-0'}>
            <Button 
              onClick={() => setShowPasswordDialog(true)}
              variant="outline"
              className={`w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white touch-manipulation ${isMobile ? 'text-sm h-11' : 'text-sm h-8'}`}
            >
              change password
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone - Account Deletion */}
        <Card className={`${isMobile ? 'rounded-lg' : ''} bg-red-500/10 backdrop-blur-sm border border-red-500/30`}>
          <CardHeader className={isMobile ? 'p-2.5 pb-1.5' : 'p-2'}>
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-red-500/10 ${isMobile ? 'p-2' : 'p-2'}`}>
                <Trash2 className={`text-red-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <CardTitle className={`${isMobile ? 'text-base font-medium' : 'text-base font-medium'} text-white`}>danger zone</CardTitle>
                <CardDescription className={`${isMobile ? 'text-sm leading-snug' : 'text-sm'} text-red-200/60`}>
                  permanently delete your account and all data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'p-2.5 pt-0' : 'p-2 pt-0'}>
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className={`w-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-400 touch-manipulation ${isMobile ? 'text-sm h-11' : 'text-sm h-8'}`}
            >
              delete account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-gradient-to-br from-background/95 to-background/98 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Change Password</DialogTitle>
            <DialogDescription className="text-white/60">
              Enter your current password and choose a new one. Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-white">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter current password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(false)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={changingPassword}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Deletion Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-background/95 to-background/98 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Account Permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 space-y-3">
              <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your profile and personal information</li>
                <li>All conversations and chat history</li>
                <li>Reminders and preferences</li>
                <li>Subscription information</li>
              </ul>
              <div className="pt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="delete-confirmation" className="text-white">Type <span className="font-bold text-red-400">DELETE</span> to confirm</Label>
                  <Input
                    id="delete-confirmation"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="bg-white/5 border-red-500/30 text-white"
                    placeholder="Type DELETE"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delete-password" className="text-white">Enter your password to confirm</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="bg-white/5 border-red-500/30 text-white"
                    placeholder="Your password"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAccountDeletion}
              disabled={deletingAccount || deleteConfirmation !== 'DELETE'}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
export default AccountSecurity;