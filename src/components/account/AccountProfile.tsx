import { useState } from 'react';
import { Save, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AvatarUpload from '@/components/AvatarUpload';

const AccountProfile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone_number: ''
  });
  const [saving, setSaving] = useState(false);

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

  const hasChanges = formData.name !== (profile?.name || '') || 
                   formData.phone_number !== '';

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Profile Information</h3>
        <p className="text-white/70 text-xs">
          Manage your personal information and profile picture
        </p>
      </div>

      {/* Avatar Upload */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="pt-2.5 p-2.5">
          <div className="flex items-center gap-3">
            <AvatarUpload 
              currentAvatarUrl={profile?.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              userName={profile?.name || user?.email || undefined}
              size="compact"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium mb-0.5 text-sm">Profile Picture</h4>
              <p className="text-white/60 text-xs">Upload or change your profile picture</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white text-sm">Basic Information</CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0 space-y-3">
          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white flex items-center gap-1.5 text-xs">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-white/5 border-white/20 text-white/60 cursor-not-allowed text-xs"
            />
            <p className="text-[10px] text-white/50">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white text-xs">
              Display Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your display name"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20 text-xs"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-white flex items-center gap-1.5 text-xs">
              <Phone className="h-3.5 w-3.5" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              placeholder="Enter your phone number"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20 text-xs"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-3">
            <Button 
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="questionnaire-button-primary text-xs py-1.5"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Status */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="p-2.5">
          <CardTitle className="text-white text-sm">Profile Completion</CardTitle>
          <CardDescription className="text-white/60 text-xs">
            Complete your profile to get better AI coaching
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-xs">Email verified</span>
              <div className="flex items-center gap-1.5 text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-[10px]">Complete</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-xs">Display name</span>
              <div className={`flex items-center gap-1.5 ${formData.name ? 'text-green-400' : 'text-orange-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${formData.name ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                <span className="text-[10px]">{formData.name ? 'Complete' : 'Pending'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-xs">Profile picture</span>
              <div className={`flex items-center gap-1.5 ${profile?.avatar_url ? 'text-green-400' : 'text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${profile?.avatar_url ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-[10px]">{profile?.avatar_url ? 'Complete' : 'Optional'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountProfile;