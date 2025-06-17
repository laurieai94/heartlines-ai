
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Heart } from "lucide-react";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";

interface ProfileBuilderProps {
  onProfileUpdate: (profiles: any, demographics: any) => void;
  initialProfiles: { your: any[], partner: any[] };
  initialDemographics: { your: any, partner: any };
}

const ProfileBuilder = ({ onProfileUpdate, initialProfiles, initialDemographics }: ProfileBuilderProps) => {
  const [showDemographics, setShowDemographics] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [profiles, setProfiles] = useState(initialProfiles);
  const [demographicsData, setDemographicsData] = useState(initialDemographics);

  const handleOpenDemographics = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    setShowDemographics(true);
  };

  const handleDemographicsComplete = (data: any) => {
    const updatedDemographics = {
      ...demographicsData,
      [activeProfileType]: data
    };
    setDemographicsData(updatedDemographics);
    setShowDemographics(false);
    
    // Immediately open the profile form after demographics
    setShowProfileForm(true);
  };

  const handleOpenProfileForm = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    setShowProfileForm(true);
  };

  const handleProfileComplete = (profileData: any) => {
    const updatedProfiles = {
      ...profiles,
      [activeProfileType]: [profileData]
    };
    setProfiles(updatedProfiles);
    setShowProfileForm(false);
    onProfileUpdate(updatedProfiles, demographicsData);
  };

  const handleBackToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          {/* Your Profile Card */}
          <Card className="mb-6 p-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Your Profile</h2>
            </div>
            {demographicsData.your ? (
              <>
                <p>Name: {demographicsData.your.name}</p>
                <p>Age: {demographicsData.your.age}</p>
                <Button onClick={() => handleOpenProfileForm('your')} className="w-full">
                  Edit Your Profile
                </Button>
              </>
            ) : (
              <Button onClick={() => handleOpenDemographics('your')} className="w-full">
                Create Your Profile
              </Button>
            )}
          </Card>

          {/* Partner's Profile Card */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Partner's Profile</h2>
            </div>
            {demographicsData.partner ? (
              <>
                <p>Name: {demographicsData.partner.name}</p>
                <p>Age: {demographicsData.partner.age}</p>
                <Button onClick={() => handleOpenProfileForm('partner')} className="w-full">
                  Edit Partner's Profile
                </Button>
              </>
            ) : (
              <Button onClick={() => handleOpenDemographics('partner')} className="w-full">
                Create Partner's Profile
              </Button>
            )}
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Relationship Insights</h2>
            <p>
              Once you and your partner have created your profiles, this section will provide personalized insights
              and recommendations to improve your relationship.
            </p>
          </Card>
        </div>
      </div>

      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={demographicsData[activeProfileType]}
        />
      )}

      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={profiles}
          initialDemographics={demographicsData}
        />
      )}
    </>
  );
};

export default ProfileBuilder;
