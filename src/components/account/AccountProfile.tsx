import { useState } from 'react';
import { Save, User, Mail, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { toast } from 'sonner';
import AvatarUpload from '@/components/AvatarUpload';
const AccountProfile = () => {
  const {
    user,
    resetPassword,
    signOut
  } = useAuth();
  const {
    profile,
    loading: profileLoading,
    updateProfile
  } = useUserProfile();
  const navigate = useNavigate();
  const {
    isMobile,
    simulateHapticFeedback
  } = useOptimizedMobile();
  const [formData, setFormData] = useState({
    name: profile?.name || ''
  });
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAvatarUpdate = async (url: string) => {
    try {
      await updateProfile({
        avatar_url: url
      });
    } catch (error) {
      toast.error('Avatar update failed', {
        description: 'Something went wrong while updating your avatar.'
      });
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated', {
        description: 'Your profile has been successfully updated.'
      });
    } catch (error) {
      toast.error('Update failed', {
        description: 'Something went wrong while updating your profile.'
      });
    } finally {
      setSaving(false);
    }
  };
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      const {
        error
      } = await resetPassword(user.email);
      if (error) throw error;
      toast.success('Password reset email sent', {
        description: 'Check your email for instructions to reset your password.'
      });
    } catch (error) {
      toast.error('Failed to send reset email', {
        description: 'Something went wrong. Please try again later.'
      });
    } finally {
      setSendingReset(false);
    }
  };
  const hasChanges = formData.name !== (profile?.name || '');
  if (profileLoading) {
    return <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>;
  }
  return <div className={`${isMobile ? 'space-y-3' : 'space-y-2.5'} touch-manipulation`}>
      {/* Avatar Upload */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${isMobile ? 'rounded-lg' : ''}`}>
        <CardContent className={isMobile ? 'p-3' : 'pt-2.5 p-2.5'}>
          <div className={`${isMobile ? 'flex items-center gap-3' : 'flex items-center gap-3 pt-2.5'}`}>
            <AvatarUpload currentAvatarUrl={profile?.avatar_url} onAvatarUpdate={handleAvatarUpdate} userName={profile?.name || user?.email || undefined} size="compact" />
            <div className="flex-1 min-w-0">
              <h4 className={`text-white font-medium ${isMobile ? 'text-base mb-1' : 'text-base mb-0.5'}`}>profile pic</h4>
              <p className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
                lookin' fresh? update your pic.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${isMobile ? 'rounded-lg' : ''}`}>
        <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
          <CardTitle className={`text-white ${isMobile ? 'text-base' : 'text-base'}`}>basic info</CardTitle>
          <CardDescription className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
            your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-3 pt-0 space-y-3' : 'p-2.5 pt-0 space-y-3'}`}>
          {/* Email (read-only) */}
          <div className={isMobile ? 'space-y-1.5' : 'space-y-1.5'}>
            <Label htmlFor="email" className={`text-white flex items-center gap-1.5 ${isMobile ? 'text-sm' : 'text-sm'}`}>
              <Mail className={isMobile ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5'} />
              email
            </Label>
            <Input id="email" type="email" value={user?.email || ''} disabled className={`bg-white/5 border-white/20 text-white/60 cursor-not-allowed touch-manipulation ${isMobile ? 'text-sm h-11' : 'text-sm'}`} />
            <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              email cannot be changed. contact support if needed.
            </p>
          </div>

          {/* Name */}
          <div className={isMobile ? 'space-y-1.5' : 'space-y-1.5'}>
            <Label htmlFor="name" className={`text-white ${isMobile ? 'text-sm' : 'text-sm'}`}>
              display name
            </Label>
            <Input id="name" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="enter your display name" className={`bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20 touch-manipulation ${isMobile ? 'text-sm h-11' : 'text-sm'}`} />
          </div>

          {/* Save Button */}
          {hasChanges && <div className={`flex justify-end ${isMobile ? 'pt-1' : 'pt-3'}`}>
              <Button onClick={e => {
            if (isMobile && e.currentTarget) {
              simulateHapticFeedback(e.currentTarget, 'medium');
            }
            handleSave();
          }} disabled={saving} className={`questionnaire-button-primary touch-manipulation touch-feedback ${isMobile ? 'text-sm h-11 px-6' : 'text-sm py-1.5'}`}>
                <Save className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                {saving ? 'saving...' : 'save changes'}
              </Button>
            </div>}
        </CardContent>
      </Card>

      {/* Reset Password */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${isMobile ? 'rounded-lg' : ''}`}>
        <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
          <CardTitle className={`text-white ${isMobile ? 'text-base' : 'text-base'}`}>
            reset password
          </CardTitle>
          <CardDescription className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
            send a reset link to {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-3 pt-0' : 'p-2.5 pt-0'}>
          <Button onClick={e => {
          if (isMobile && e.currentTarget) {
            simulateHapticFeedback(e.currentTarget, 'medium');
          }
          handlePasswordReset();
        }} disabled={sendingReset} className={`w-full questionnaire-button-primary touch-manipulation touch-feedback ${isMobile ? 'text-sm h-11' : 'text-sm py-2'}`}>
            <Key className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
            {sendingReset ? 'sending...' : 'reset your password'}
          </Button>
        </CardContent>
      </Card>

      {/* View Personal Profile */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${isMobile ? 'rounded-lg' : ''}`}>
        <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
          <CardTitle className={`text-white ${isMobile ? 'text-base' : 'text-base'}`}>
            personal profile
          </CardTitle>
          <CardDescription className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
            access your complete personal profile and questionnaire
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-3 pt-0' : 'p-2.5 pt-0'}>
          <Button onClick={e => {
          if (isMobile && e.currentTarget) {
            simulateHapticFeedback(e.currentTarget, 'light');
          }
          navigate('/profile');
        }} className={`w-full questionnaire-button-primary touch-manipulation touch-feedback ${isMobile ? 'text-sm h-11' : 'text-sm py-2'}`}>
            <User className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
            view personal profile
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${isMobile ? 'rounded-lg' : ''}`}>
        <CardHeader className={isMobile ? 'p-3 pb-2' : 'p-2.5'}>
          <CardTitle className={`text-white ${isMobile ? 'text-base' : 'text-base'}`}>
            sign out
          </CardTitle>
          <CardDescription className={`text-white/60 ${isMobile ? 'text-sm leading-snug' : 'text-sm'}`}>
            sign out of your account
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-3 pt-0' : 'p-2.5 pt-0'}>
          <Button onClick={e => {
          if (isMobile && e.currentTarget) {
            simulateHapticFeedback(e.currentTarget, 'medium');
          }
          signOut();
        }} className={`w-full bg-burgundy-600 hover:bg-burgundy-600 text-white touch-manipulation touch-feedback ${isMobile ? 'text-sm h-11' : 'text-sm py-2'}`}>
            <LogOut className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
            sign out
          </Button>
        </CardContent>
      </Card>
    </div>;
};
export default AccountProfile;