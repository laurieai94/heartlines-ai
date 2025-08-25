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
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Profile Information</h3>
        <p className="text-white/70">
          Manage your personal information and profile picture
        </p>
      </div>

      {/* Avatar Upload */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <AvatarUpload 
              currentAvatarUrl={profile?.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              userName={profile?.name || user?.email || undefined}
              size="compact"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">Profile Picture</h4>
              <p className="text-white/60 text-sm">Upload or change your profile picture</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Basic Information</CardTitle>
          <CardDescription className="text-white/60">
            Your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-white/5 border-white/20 text-white/60 cursor-not-allowed"
            />
            <p className="text-xs text-white/50">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Display Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your display name"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              placeholder="Enter your phone number"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:ring-pink-400/20"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="questionnaire-button-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Status */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Profile Completion</CardTitle>
          <CardDescription className="text-white/60">
            Complete your profile to get better AI coaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Email verified</span>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Complete</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Display name</span>
              <div className={`flex items-center gap-2 ${formData.name ? 'text-green-400' : 'text-orange-400'}`}>
                <div className={`w-2 h-2 rounded-full ${formData.name ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                <span className="text-sm">{formData.name ? 'Complete' : 'Pending'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Profile picture</span>
              <div className={`flex items-center gap-2 ${profile?.avatar_url ? 'text-green-400' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${profile?.avatar_url ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-sm">{profile?.avatar_url ? 'Complete' : 'Optional'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountProfile;