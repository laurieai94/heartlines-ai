import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Plus, Edit3, CheckCircle2, Clock, ArrowRight, Info, Lightbulb, Target } from "lucide-react";
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
      {/* Header Section */}
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Relationship Profile Builder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create detailed profiles for yourself and your partner to unlock personalized insights, 
            improve communication, and strengthen your relationship with AI-powered guidance.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Comprehensive Insights</h3>
            </div>
            <p className="text-blue-800 text-sm">
              Get detailed analysis of your relationship dynamics, communication patterns, and compatibility factors.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-green-900">Personalized Advice</h3>
            </div>
            <p className="text-green-800 text-sm">
              Receive tailored recommendations and conversation starters based on both your personalities.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-100 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900">Relationship Goals</h3>
            </div>
            <p className="text-purple-800 text-sm">
              Set and track meaningful relationship milestones with actionable steps to achieve them.
            </p>
          </Card>
        </div>

        {/* Progress Indicator */}
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {profiles.filter(p => p.status === 'complete').length}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900">Profile Completion</h3>
              <p className="text-yellow-800">
                {profiles.filter(p => p.status === 'complete').length} of {profiles.length} profiles completed. 
                {profiles.length < 2 && " Add your partner's profile for deeper insights!"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Cards */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Your Profiles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map(profile => (
            <Card key={profile.id} className="bg-white shadow-lg rounded-xl overflow-hidden border-2 hover:shadow-xl transition-shadow">
              <div className="p-8 space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    profile.type === 'your' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-br from-pink-500 to-red-500'
                  }`}>
                    {profile.type === 'your' ? 
                      <User className="w-8 h-8 text-white" /> : 
                      <Heart className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-600">
                      {profile.type === 'your' ? 'Your personal profile' : 'Your partner\'s profile'}
                    </p>
                  </div>
                </div>

                {/* Status and Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {profile.status === 'empty' && (
                      <Badge variant="outline" className="text-gray-600 bg-gray-100 border-gray-300 px-3 py-1">
                        <Clock className="w-4 h-4 mr-2" />
                        Not Started
                      </Badge>
                    )}
                    {profile.status === 'demographics' && (
                      <Badge variant="outline" className="text-blue-600 bg-blue-100 border-blue-300 px-3 py-1">
                        <Clock className="w-4 h-4 mr-2" />
                        Demographics Complete
                      </Badge>
                    )}
                    {profile.status === 'complete' && (
                      <Badge variant="outline" className="text-green-600 bg-green-100 border-green-300 px-3 py-1">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Profile Complete
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Last updated:</strong> {profile.lastUpdated || 'Never'}</p>
                    <p><strong>Completion time:</strong> ~7 minutes</p>
                  </div>

                  {/* Progress Description */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {profile.status === 'empty' && (
                      <p className="text-sm text-gray-700">
                        <strong>What's included:</strong> Demographics, communication style, values, lifestyle preferences, and relationship goals.
                      </p>
                    )}
                    {profile.status === 'demographics' && (
                      <p className="text-sm text-gray-700">
                        <strong>Next:</strong> Complete your full profile with communication preferences, values, and lifestyle details.
                      </p>
                    )}
                    {profile.status === 'complete' && (
                      <p className="text-sm text-green-700">
                        <strong>✓ Complete!</strong> Your profile is ready for AI insights and personalized recommendations.
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {profile.status === 'empty' ? (
                    <Button 
                      onClick={() => handleDemographics(profile.type)} 
                      className={`w-full ${
                        profile.type === 'your'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                          : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                      } text-white font-semibold py-3 px-6 rounded-lg`}
                    >
                      Start Building Profile
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleEditProfile(profile.type)} 
                      variant="outline" 
                      className="w-full border-2 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg"
                    >
                      Edit Profile
                      <Edit3 className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Add Partner Card */}
          {profiles.length < 2 && (
            <Card className="border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors">
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-700">Add Partner's Profile</h3>
                  <p className="text-gray-600 max-w-xs">
                    Create your partner's profile to unlock relationship compatibility insights and personalized advice for both of you.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg"
                  onClick={handleAddProfile}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Partner's Profile
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
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
