import { useState } from 'react';
import { Save, User, Mail, Key } from 'lucide-react';
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
  const { user, resetPassword } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  const { isMobile, simulateHapticFeedback } = useOptimizedMobile();
  
  
  const [formData, setFormData] = useState({
    name: profile?.name || ''
  });
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpdate = async (url: string) => {
    try {
      await updateProfile({ avatar_url: url });
      toast.success('Avatar updated', {
        description: 'Your profile picture has been successfully updated.'
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
      const { error } = await resetPassword(user.email);
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
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'space-y-1.5' : 'space-y-2.5'} touch-manipulation`}>
      {/* Consolidated Profile Card */}
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 ${
        isMobile ? 'rounded-lg' : ''
      }`}>
        <CardContent className={isMobile ? 'p-2 space-y-2' : 'p-2.5 space-y-3'}>
          {/* Avatar and Name Section */}
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
            <AvatarUpload 
              currentAvatarUrl={profile?.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              userName={profile?.name || user?.email || undefined}
              size="compact"
            />
            <div className="flex-1 min-w-0">
              <h4 className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                {profile?.name || 'User'}
              </h4>
              <p className={`text-white/60 truncate ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Display Name */}
          <div className={isMobile ? 'space-y-1' : 'space-y-1.5'}>
            <Label htmlFor="name" className={`text-white ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
              Display Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your display name"
              className={`bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20 touch-manipulation ${
                isMobile ? 'text-[12px] h-8' : 'text-sm'
              }`}
            />
          </div>

          {/* Actions Row */}
          <div className={`flex ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
            {hasChanges && (
              <Button 
                onClick={(e) => {
                  if (isMobile && e.currentTarget) {
                    simulateHapticFeedback(e.currentTarget, 'medium');
                  }
                  handleSave();
                }}
                disabled={saving}
                className={`flex-1 questionnaire-button-primary touch-manipulation touch-feedback ${
                  isMobile ? 'text-[11px] h-7' : 'text-sm'
                }`}
              >
                <Save className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            )}
            <Button 
              onClick={(e) => {
                if (isMobile && e.currentTarget) {
                  simulateHapticFeedback(e.currentTarget, 'medium');
                }
                handlePasswordReset();
              }}
              disabled={sendingReset}
              variant="outline"
              className={`${hasChanges ? 'flex-1' : 'w-full'} bg-white/5 border-white/20 text-white hover:bg-white/10 touch-manipulation ${
                isMobile ? 'text-[11px] h-7' : 'text-sm'
              }`}
            >
              <Key className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
              {sendingReset ? 'Sending...' : 'Reset Password'}
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* View Profile Button */}
          <Button 
            onClick={(e) => {
              if (isMobile && e.currentTarget) {
                simulateHapticFeedback(e.currentTarget, 'light');
              }
              navigate('/profile');
            }}
            variant="outline"
            className={`w-full bg-white/5 border-white/20 text-white hover:bg-white/10 touch-manipulation ${
              isMobile ? 'text-[11px] h-7' : 'text-sm'
            }`}
          >
            <User className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
            View Full Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountProfile;
