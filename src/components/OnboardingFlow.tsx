
import { useState, useEffect } from 'react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Users, CheckCircle } from 'lucide-react';
import Demographics from './Demographics';
import ProfileForm from './ProfileForm';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { status, updateStatus } = useOnboardingStatus();
  const { profiles } = useUserProfiles();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'your-demographics' | 'your-profile' | 'partner-demographics' | 'partner-profile' | 'complete'>('welcome');
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');

  useEffect(() => {
    if (status) {
      if (status.onboarding_completed) {
        onComplete();
      } else if (!profiles.your) {
        setCurrentStep('your-demographics');
      } else if (!status.profile_completed) {
        setCurrentStep('your-profile');
      } else if (!profiles.partner) {
        setCurrentStep('partner-demographics');
      } else if (!status.partner_profile_completed) {
        setCurrentStep('partner-profile');
      } else {
        setCurrentStep('complete');
      }
    }
  }, [status, profiles, onComplete]);

  const handleYourDemographicsComplete = () => {
    setCurrentStep('your-profile');
  };

  const handleYourProfileComplete = async () => {
    await updateStatus({ profile_completed: true });
    setCurrentStep('partner-demographics');
  };

  const handlePartnerDemographicsComplete = () => {
    setCurrentStep('partner-profile');
  };

  const handlePartnerProfileComplete = async () => {
    await updateStatus({ 
      partner_profile_completed: true,
      onboarding_completed: true 
    });
    setCurrentStep('complete');
  };

  const handleCompleteOnboarding = () => {
    onComplete();
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-coral-500" />
              <CardTitle className="text-3xl">Welcome to RealTalk</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Let's set up your relationship coaching experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg border-purple-200 bg-purple-50">
                <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Your Profile</h3>
                <p className="text-sm text-purple-700">Tell us about your communication style and preferences</p>
              </div>
              <div className="text-center p-4 border rounded-lg border-pink-200 bg-pink-50">
                <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <h3 className="font-semibold text-pink-900">Partner Profile</h3>
                <p className="text-sm text-pink-700">Help us understand your partner's patterns too</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                This takes about 5-10 minutes and helps Kai provide personalized relationship coaching.
              </p>
              <Button 
                onClick={() => setCurrentStep('your-demographics')}
                className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 px-8 py-3 text-lg"
              >
                Let's Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'your-demographics') {
    return (
      <Demographics 
        profileType="your"
        onClose={() => {}}
        onComplete={handleYourDemographicsComplete}
        initialData={profiles.your?.demographics_data}
      />
    );
  }

  if (currentStep === 'your-profile') {
    return (
      <ProfileForm 
        profileType="your"
        onClose={() => {}}
        onComplete={handleYourProfileComplete}
        onBackToDemographics={() => setCurrentStep('your-demographics')}
        initialProfiles={{ your: profiles.your ? [profiles.your.profile_data] : [], partner: [] }}
        initialDemographics={{ your: profiles.your?.demographics_data, partner: null }}
      />
    );
  }

  if (currentStep === 'partner-demographics') {
    return (
      <Demographics 
        profileType="partner"
        onClose={() => {}}
        onComplete={handlePartnerDemographicsComplete}
        initialData={profiles.partner?.demographics_data}
      />
    );
  }

  if (currentStep === 'partner-profile') {
    return (
      <ProfileForm 
        profileType="partner"
        onClose={() => {}}
        onComplete={handlePartnerProfileComplete}
        onBackToDemographics={() => setCurrentStep('partner-demographics')}
        initialProfiles={{ your: [], partner: profiles.partner ? [profiles.partner.profile_data] : [] }}
        initialDemographics={{ your: profiles.your?.demographics_data, partner: profiles.partner?.demographics_data }}
      />
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">You're All Set!</CardTitle>
            <CardDescription>
              Your profiles are complete. Kai is ready to help with your relationship journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={handleCompleteOnboarding}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 px-8 py-3 text-lg"
            >
              Start Chatting with Kai
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OnboardingFlow;
