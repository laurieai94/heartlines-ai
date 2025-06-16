import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Plus, Edit3, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Demographics from "./Demographics";
import ProfileForm from "./ProfileForm";

interface Profile {
  id: string;
  name: string;
  type: 'your' | 'partner';
  status: 'empty' | 'demographics' | 'complete';
  lastUpdated: string;
  demographicsData?: any;
}

const ProfileBuilder = () => {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: 'your-profile',
      name: 'Your Profile', 
      type: 'your',
      status: 'empty',
      lastUpdated: '',
    }
  ]);

  const [showDemographics, setShowDemographics] = useState<{ show: boolean; profileType: 'your' | 'partner' }>({ 
    show: false, 
    profileType: 'your' 
  });
  
  const [showProfileForm, setShowProfileForm] = useState<{ 
    show: boolean; 
    profileType: 'your' | 'partner';
    demographicsData?: any;
  }>({ 
    show: false, 
    profileType: 'your' 
  });

  const handleAddProfile = () => {
    setProfiles(prev => [...prev, {
      id: `partner-profile-${Date.now()}`,
      name: 'Partner\'s Profile',
      type: 'partner',
      status: 'empty',
      lastUpdated: '',
    }]);
  };

  const handleDemographics = (profileType: 'your' | 'partner') => {
    setShowDemographics({ show: true, profileType });
  };

  const handleDemographicsComplete = (demographicsData: any) => {
    const profileType = showDemographics.profileType;
    
    // Update the profile with demographics data
    setProfiles(prev => prev.map(profile => 
      profile.type === profileType 
        ? { 
            ...profile, 
            status: 'demographics' as const,
            lastUpdated: new Date().toLocaleDateString(),
            demographicsData
          }
        : profile
    ));
    
    setShowDemographics({ show: false, profileType: 'your' });
    
    // Open profile form with demographics data
    setShowProfileForm({ 
      show: true, 
      profileType,
      demographicsData 
    });
  };

  const handleProfileFormComplete = (profileData: any) => {
    const profileType = showProfileForm.profileType;
    
    setProfiles(prev => prev.map(profile => 
      profile.type === profileType 
        ? { 
            ...profile, 
            status: 'complete' as const,
            lastUpdated: new Date().toLocaleDateString(),
            name: profileData.name || profile.name
          }
        : profile
    ));
    
    setShowProfileForm({ show: false, profileType: 'your' });
  };

  const handleEditProfile = (profileType: 'your' | 'partner') => {
    const profile = profiles.find(p => p.type === profileType);
    setShowProfileForm({ 
      show: true, 
      profileType,
      demographicsData: profile?.demographicsData 
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Relationship Profile Builder</h2>
        <p className="text-gray-500">
          Create detailed profiles for yourself and your partner to unlock personalized insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map(profile => (
          <Card key={profile.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {profile.type === 'your' ? 
                    <User className="w-6 h-6 text-blue-500" /> : 
                    <Heart className="w-6 h-6 text-red-500" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
              </div>

              <div className="space-y-2">
                {profile.status === 'empty' && (
                  <Badge variant="outline" className="text-gray-500 bg-gray-100 border-gray-200">
                    <Clock className="w-4 h-4 mr-2" />
                    Not Started
                  </Badge>
                )}
                {profile.status === 'demographics' && (
                  <Badge variant="outline" className="text-blue-500 bg-blue-50 border-blue-200">
                    <Clock className="w-4 h-4 mr-2" />
                    Demographics Complete
                  </Badge>
                )}
                {profile.status === 'complete' && (
                  <Badge variant="outline" className="text-green-500 bg-green-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Profile Complete
                  </Badge>
                )}
                <p className="text-gray-600 text-sm">Last updated: {profile.lastUpdated || 'N/A'}</p>
              </div>

              <div className="flex justify-end gap-2">
                {profile.status === 'empty' ? (
                  <Button onClick={() => handleDemographics(profile.type)} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Start Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => handleEditProfile(profile.type)} variant="outline" className="text-gray-700">
                    Edit Profile
                    <Edit3 className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {profiles.length < 2 && (
          <Card className="bg-gray-50 border-dashed border-gray-300 border-2 flex items-center justify-center">
            <Button variant="ghost" className="text-gray-500" onClick={handleAddProfile}>
              <Plus className="w-5 h-5 mr-2" />
              Add Partner's Profile
            </Button>
          </Card>
        )}
      </div>

      {showDemographics.show && (
        <Demographics
          profileType={showDemographics.profileType}
          onClose={() => setShowDemographics({ show: false, profileType: 'your' })}
          onComplete={handleDemographicsComplete}
        />
      )}

      {showProfileForm.show && (
        <ProfileForm
          profileType={showProfileForm.profileType}
          onClose={() => setShowProfileForm({ show: false, profileType: 'your' })}
          onComplete={handleProfileFormComplete}
          demographicsData={showProfileForm.demographicsData}
        />
      )}
    </div>
  );
};

export default ProfileBuilder;
