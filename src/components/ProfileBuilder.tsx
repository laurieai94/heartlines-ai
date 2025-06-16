
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, User, Plus, Clock, CheckCircle, Search, ArrowRight } from "lucide-react";
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

  const profileSections = [
    { name: "Communication & Conflict Style", complete: true },
    { name: "Love Languages & Appreciation", complete: true },
    { name: "Stress Response & Support Needs", complete: false },
    { name: "Values & Daily Life Preferences", complete: false },
    { name: "Relationship Patterns & Growth Areas", complete: false }
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
          <span>Profile Building</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Build Your Relationship Profiles</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete the core questions in 3-4 minutes, expand sections for deeper insights
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Progress value={yourProfileStats.completion} className="w-20" />
            <span className="text-sm text-gray-600">Your Profile: {yourProfileStats.completion}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={partnerProfileStats.completion} className="w-20" />
            <span className="text-sm text-gray-600">Partner: {partnerProfileStats.completion}%</span>
          </div>
        </div>
      </div>

      {/* How Profile Building Works */}
      <Card className="p-8 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">We Get to Know You (For Real)</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, 
            what makes you feel loved, and yes, even your weird quirks. The more honest you are, 
            the better we can help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Profile Building Process */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Profile Building Process</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-semibold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Start with the essentials</h4>
                  <p className="text-gray-600 text-sm">Core questions take just 3-4 minutes and unlock basic AI insights</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-semibold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Go deeper when ready</h4>
                  <p className="text-gray-600 text-sm">Each optional section adds 1-2 minutes but unlocks powerful features like personalized conflict scripts</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-semibold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Build both profiles</h4>
                  <p className="text-gray-600 text-sm">Understanding your partner's patterns helps you support them better</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Profiles Unlock */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">What Your Profiles Unlock</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-600 text-sm">Why you both react differently to stress (and what actually helps)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-600 text-sm">The specific words and actions that make each of you feel most loved</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-600 text-sm">How to approach difficult conversations based on your communication styles</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-600 text-sm">Your compatibility patterns and growth opportunities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-600">
              <strong>Privacy:</strong> All profile responses stay private to you. Only share insights you choose to share.
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Creation Dashboard */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Your Personal Profile */}
        <Card className="p-8 bg-white/80 backdrop-blur-md border-2 border-pink-200 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Personal Profile</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={yourProfileStats.completion} className="w-24" />
                  <span className="text-sm font-medium text-gray-600">
                    {yourProfileStats.completion > 0 ? `${yourProfileStats.sectionsComplete}/${yourProfileStats.totalSections} sections` : '0% Complete'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              Build your personal relationship profile to unlock AI insights about your communication style, 
              love language, and relationship patterns
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Features Unlocked:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalized relationship advice</li>
                <li>• Communication coaching</li>
                <li>• Self-awareness insights</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setActiveProfileType('your');
                  setShowForm(true);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
              >
                {yourProfileStats.completion > 0 ? 'Continue Building' : 'Start Your Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>3-4 minutes for core questions</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Partner Profile */}
        <Card className="p-8 bg-white/60 backdrop-blur-md border shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Partner's Profile</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={partnerProfileStats.completion} className="w-24" />
                  <span className="text-sm font-medium text-gray-600">
                    {partnerProfileStats.completion > 0 ? `${partnerProfileStats.sectionsComplete}/${partnerProfileStats.totalSections} sections` : '0% Complete'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              Help the AI understand your partner's patterns to get specific advice on supporting them 
              and improving your relationship
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Features Unlocked:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Specific ways to support them</li>
                <li>• Conversation scripts tailored to their style</li>
                <li>• Compatibility analysis</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveProfileType('partner');
                  setShowForm(true);
                }}
                className="w-full border-pink-200 hover:bg-pink-50"
              >
                {partnerProfileStats.completion > 0 ? 'Continue Partner Profile' : 'Add Partner Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-gray-500">
                Based on your observations - they can create their own profile later
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Building Quick Start */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-lg">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Profile Building Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Start with core questions</h4>
                  <p className="text-sm text-gray-600">You'll get immediate value, then expand sections over time</p>
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
          <div className="text-center pt-4">
            <p className="text-lg text-gray-700 mb-4">
              Ready to build your relationship intelligence? Start with your personal profile to unlock AI insights.
            </p>
            <Button 
              onClick={() => {
                setActiveProfileType('your');
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Building Progress Overview */}
      <Card className="p-8 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Profile Sections</h3>
        <div className="space-y-4">
          {profileSections.map((section, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/40 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${section.complete ? 'text-green-500' : 'text-gray-300'}`} />
                <div>
                  <h4 className="font-medium text-gray-900">{section.name}</h4>
                  <p className="text-sm text-gray-600">Core questions (required) + Optional deep dive (enhanced features)</p>
                </div>
              </div>
              <span className={`text-sm px-2 py-1 rounded ${section.complete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {section.complete ? 'Complete' : 'Available'}
              </span>
            </div>
          ))}
        </div>
      </Card>

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
