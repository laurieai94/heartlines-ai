
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, User, Plus, Clock, CheckCircle, Search, ArrowRight, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import ProfileForm from "@/components/ProfileForm";

interface ProfileStats {
  completion: number;
  sectionsComplete: number;
  totalSections: number;
}

const ProfileBuilder = () => {
  const [profiles, setProfiles] = useState<{your: any[], partner: any[]}>({
    your: [],
    partner: []
  });
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showDetails, setShowDetails] = useState(false);

  const yourProfileStats: ProfileStats = {
    completion: profiles.your.length > 0 ? 75 : 0,
    sectionsComplete: profiles.your.length > 0 ? 4 : 0,
    totalSections: 5
  };

  const partnerProfileStats: ProfileStats = {
    completion: profiles.partner.length > 0 ? 50 : 0,
    sectionsComplete: profiles.partner.length > 0 ? 2 : 0,
    totalSections: 5
  };

  return (
    <div className="space-y-8">
      {/* Simplified Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Let's Get to Know the Real You</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Build your relationship profiles in just 5 minutes
        </p>
        
        {/* Quick Progress Overview */}
        {(yourProfileStats.completion > 0 || partnerProfileStats.completion > 0) && (
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Progress value={yourProfileStats.completion} className="w-20" />
              <span className="text-sm text-gray-600">Your Profile: {yourProfileStats.completion}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={partnerProfileStats.completion} className="w-20" />
              <span className="text-sm text-gray-600">Partner: {partnerProfileStats.completion}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Cards - Simplified */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Your Profile Card */}
        <Card className="p-6 bg-gradient-to-br from-pink-50 to-fuchsia-50 border-2 border-pink-200 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Personal Profile</h3>
                <p className="text-sm text-gray-600">
                  {yourProfileStats.completion > 0 ? `${yourProfileStats.completion}% Complete` : 'Not started'}
                </p>
              </div>
            </div>

            <p className="text-gray-700">
              Answer core questions about your communication style, love language, and relationship patterns.
            </p>

            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Lightbulb className="w-4 h-4 text-pink-500" />
                <span className="font-medium">What you'll unlock:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalized relationship advice</li>
                <li>• Communication scripts for difficult conversations</li>
                <li>• Self-awareness insights</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setActiveProfileType('your');
                  setShowForm(true);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-lg py-3"
              >
                {yourProfileStats.completion > 0 ? 'Continue Your Profile' : 'Start Your Profile'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>3-4 minutes to get started</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Partner Profile Card */}
        <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Partner Profile</h3>
                <p className="text-sm text-gray-600">
                  {partnerProfileStats.completion > 0 ? `${partnerProfileStats.completion}% Complete` : 'Optional but recommended'}
                </p>
              </div>
            </div>

            <p className="text-gray-700">
              Help us understand your partner's patterns for better relationship advice.
            </p>

            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Lightbulb className="w-4 h-4 text-rose-500" />
                <span className="font-medium">What you'll unlock:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Specific ways to support them</li>
                <li>• Conversation scripts for their style</li>
                <li>• Compatibility insights</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveProfileType('partner');
                  setShowForm(true);
                }}
                className="w-full border-pink-200 hover:bg-pink-50 text-lg py-3"
              >
                {partnerProfileStats.completion > 0 ? 'Continue Partner Profile' : 'Add Partner Profile'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-center text-gray-500">
                Based on your observations
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Value Proposition */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-lg max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">The Questions That Actually Matter</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            How do you really act when you're stressed? What makes you feel most loved? 
            What toxic patterns are you definitely not repeating from your last relationship? 
            (Spoiler: you probably are.) The more honest you are, the less we'll sound like a generic self-help book.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="text-left space-y-3">
              <h4 className="font-semibold text-gray-900">Simple Process:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">3-4 minutes for core insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Optional deep dives for advanced features</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Update anytime as you grow</span>
                </div>
              </div>
            </div>
            
            <div className="text-left space-y-3">
              <h4 className="font-semibold text-gray-900">You Get:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Personalized conversation scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Stress support strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Love language insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Expandable Details Section */}
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-gray-600 hover:text-gray-900"
        >
          {showDetails ? 'Hide' : 'Show'} detailed information
          <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </Button>
        
        {showDetails && (
          <div className="mt-6 space-y-6">
            {/* Privacy Note */}
            <Card className="p-4 bg-gray-50 border-l-4 border-blue-400">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  <strong>Privacy:</strong> All profile responses stay private to you. Only share insights you choose to share.
                </p>
              </div>
            </Card>

            {/* Profile Building Tips */}
            <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Building Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Be honest</h4>
                      <p className="text-sm text-gray-600">The AI only works with real data, not aspirational answers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">"Not sure yet" is okay</h4>
                      <p className="text-sm text-gray-600">Profiles improve as you learn more about each other</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Start with core questions</h4>
                      <p className="text-sm text-gray-600">Get immediate value, then expand sections over time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Update as you grow</h4>
                      <p className="text-sm text-gray-600">Relationships evolve, and so should your profiles</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Profile Form Modal */}
      {showForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowForm(false)}
          onSave={(profile) => {
            setProfiles(prev => ({
              ...prev,
              [activeProfileType]: [...prev[activeProfileType], profile]
            }));
            setShowForm(false);
            toast.success(`${activeProfileType === 'your' ? 'Your' : 'Partner'} profile saved successfully!`);
          }}
        />
      )}
    </div>
  );
};

export default ProfileBuilder;
