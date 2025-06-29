
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ArrowLeft, ArrowRight, Heart, ExternalLink, Camera, Upload } from "lucide-react";

interface FormData {
  name: string;
  avatarUrl: string;
  pronouns: string[];
  customPronouns: string;
  gender: string[];
  customGender: string;
  orientation: string[];
  customOrientation: string;
  age: string;
  relationshipStatus: string[];
  stressReactions: string[];
  attachmentStyles: string[];
  conflictNeeds: string[];
  showLove: string[];
  receiveLove: string[];
  familyDynamics: string[];
  professionalSupport: string[];
  relationshipInfluences: string[];
  relationshipPatterns: string[];
  partnerName: string;
  relationshipType: string[];
  relationshipDuration: string[];
  relationshipPositives: string[];
  otherPositives: string;
  relationshipChallenges: string[];
  livingArrangement: string[];
  emotionalConnection: string;
  hopingFor: string[];
  readiness: string[];
  healthyRelationship: string[];
  otherHealthy: string;
  additionalInfo: string;
}

interface PersonalProfileQuestionnaireProps {
  onComplete: (data: FormData) => void;
  onClose: () => void;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose }: PersonalProfileQuestionnaireProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    avatarUrl: '',
    pronouns: [],
    customPronouns: '',
    gender: [],
    customGender: '',
    orientation: [],
    customOrientation: '',
    age: '',
    relationshipStatus: [],
    stressReactions: [],
    attachmentStyles: [],
    conflictNeeds: [],
    showLove: [],
    receiveLove: [],
    familyDynamics: [],
    professionalSupport: [],
    relationshipInfluences: [],
    relationshipPatterns: [],
    partnerName: '',
    relationshipType: [],
    relationshipDuration: [],
    relationshipPositives: [],
    otherPositives: '',
    relationshipChallenges: [],
    livingArrangement: [],
    emotionalConnection: '',
    hopingFor: [],
    readiness: [],
    healthyRelationship: [],
    otherHealthy: '',
    additionalInfo: ''
  });

  const totalSections = 6;

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    const current = (formData[field] as string[]) || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgeSelection = (age: string) => {
    if (age === 'Under 18') {
      setShowAgeWarning(true);
      return;
    }
    handleInputChange('age', age);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('avatarUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserInitials = () => {
    return formData.name ? formData.name.charAt(0).toUpperCase() : '?';
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const getProgress = () => {
    return (currentSection / totalSections) * 100;
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 1: return "About You";
      case 2: return "Your Emotional Blueprint";
      case 3: return "Your Past & Foundations";
      case 4: return "Your Current Relationship";
      case 5: return "What You're Hoping For";
      case 6: return "Final Thoughts";
      default: return "";
    }
  };

  const getSectionDescription = () => {
    switch (currentSection) {
      case 1: return "Let's start with the basics. This helps RealTalk get a feel for your world.";
      case 2: return "RealTalk supports you better when it understands how you operate—especially when things get messy.";
      case 3: return "No judgment—this just helps RealTalk understand where you're coming from.";
      case 4: return "Understanding your dynamic helps RealTalk support the real stuff you're navigating.";
      case 5: return "Let's get clear on what you want help with right now.";
      case 6: return "Almost done! Any final thoughts to share with RealTalk?";
      default: return "";
    }
  };

  // Age Warning Modal
  if (showAgeWarning) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Youth Relationship Resources
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We want to make sure you have access to resources specifically designed for young people navigating relationships. 
            Love is Respect offers excellent support tailored for your age group.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => window.open('https://www.loveisrespect.org/', '_blank')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Visit Love is Respect
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full py-3 rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
              <p className="text-gray-600">{getSectionDescription()}</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Section {currentSection} of {totalSections}: {getSectionTitle()}
              </span>
              <span className="text-sm text-gray-500">{Math.round(getProgress())}% complete</span>
            </div>
            <Progress value={getProgress()} className="h-3" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentSection === 1 && (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-purple-200">
                    <AvatarImage src={formData.avatarUrl || undefined} alt={formData.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors duration-200">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 text-center">Click the camera icon to add your photo (optional)</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  What's your name or nickname?
                </label>
                <Input 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>

              {/* Pronouns */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What pronouns do you use?
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['She/her', 'He/him', 'They/them', 'Xe/xem', 'Ze/zir', 'No pronouns — use my name', 'Prefer not to say'].map((pronoun) => (
                    <div key={pronoun} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.pronouns?.includes(pronoun) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('pronouns', pronoun);
                          } else {
                            handleMultiSelect('pronouns', pronoun);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{pronoun}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Input 
                    value={formData.customPronouns}
                    onChange={(e) => handleInputChange('customPronouns', e.target.value)}
                    placeholder="Add your own"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How do you identify your gender? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Woman', 'Man', 'Non-binary', 'Genderqueer', 'Trans woman', 'Trans man', 'Agender', 'Gender fluid', 'Two-Spirit', 'Questioning', 'Prefer not to say'].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.gender?.includes(gender) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('gender', gender);
                          } else {
                            handleMultiSelect('gender', gender);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{gender}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Input 
                    value={formData.customGender}
                    onChange={(e) => handleInputChange('customGender', e.target.value)}
                    placeholder="Add your own"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sexual Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How do you describe your sexual orientation? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Straight / Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer', 'Asexual', 'Demisexual', 'Questioning', 'Prefer not to say'].map((orientation) => (
                    <div key={orientation} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.orientation?.includes(orientation) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('orientation', orientation);
                          } else {
                            handleMultiSelect('orientation', orientation);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{orientation}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Input 
                    value={formData.customOrientation}
                    onChange={(e) => handleInputChange('customOrientation', e.target.value)}
                    placeholder="Add your own"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How old are you?
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {['Under 18', '18–24', '25–29', '30–39', '40–49', '50–60', '60+'].map((ageRange) => (
                    <Button
                      key={ageRange}
                      variant={formData.age === ageRange ? "default" : "outline"}
                      onClick={() => handleAgeSelection(ageRange)}
                      className="justify-start"
                    >
                      {ageRange}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Relationship Status */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What's your current relationship status? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Single', 'In a relationship', 'Engaged', 'Married', 'Open / Poly', 'Exploring', 'Separated / Divorced', 'Prefer not to say'].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipStatus?.includes(status) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipStatus', status);
                          } else {
                            handleMultiSelect('relationshipStatus', status);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Emotional Blueprint */}
          {currentSection === 2 && (
            <div className="space-y-6">
              {/* Stress Reactions */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  When you're stressed in a relationship, how do you tend to react? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'I shut down or withdraw',
                    'I get clingy or anxious', 
                    'I try to fix everything',
                    'I get defensive or angry',
                    'I freeze or dissociate',
                    'I use humor to distract',
                    'I keep the peace and hide my feelings',
                    "It depends / I'm still figuring it out"
                  ].map((reaction) => (
                    <div key={reaction} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.stressReactions?.includes(reaction) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('stressReactions', reaction);
                          } else {
                            handleMultiSelect('stressReactions', reaction);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{reaction}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachment Styles */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Which attachment styles resonate with you? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Secure',
                    'Anxious / Preoccupied',
                    'Avoidant / Dismissive', 
                    'Fearful-Avoidant',
                    "I'm not sure",
                    "I don't believe in attachment styles",
                    'Still exploring'
                  ].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.attachmentStyles?.includes(style) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('attachmentStyles', style);
                          } else {
                            handleMultiSelect('attachmentStyles', style);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{style}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conflict Needs */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What do you usually need in conflict? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'To be heard without being fixed',
                    'Emotional reassurance',
                    'Space to process',
                    'Clarity and structure',
                    'For it to blow over',
                    'Apology or repair',
                    'Help putting my feelings into words',
                    "I don't know yet"
                  ].map((need) => (
                    <div key={need} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.conflictNeeds?.includes(need) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('conflictNeeds', need);
                          } else {
                            handleMultiSelect('conflictNeeds', need);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show Love */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How do you show love to others? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Words of affirmation',
                    'Quality time',
                    'Acts of service',
                    'Physical touch',
                    'Gift giving',
                    'Support or problem-solving',
                    'Play or humor',
                    'Encouragement / Coaching'
                  ].map((way) => (
                    <div key={way} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.showLove?.includes(way) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('showLove', way);
                          } else {
                            handleMultiSelect('showLove', way);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{way}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receive Love */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How do you prefer to receive love? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Words of affirmation',
                    'Quality time',
                    'Acts of service',
                    'Physical touch',
                    'Gift giving',
                    'Feeling seen / emotionally understood',
                    'Check-ins or follow-through',
                    'Shared experiences'
                  ].map((way) => (
                    <div key={way} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.receiveLove?.includes(way) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('receiveLove', way);
                          } else {
                            handleMultiSelect('receiveLove', way);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{way}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Past & Foundations */}
          {currentSection === 3 && (
            <div className="space-y-6">
              {/* Family Dynamics */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How would you describe your family dynamics growing up? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Emotionally supportive',
                    'Emotionally distant',
                    'High conflict',
                    'Loving but inconsistent',
                    'Overprotective',
                    'Chaotic or unstable',
                    'Emotionally unsafe',
                    'Avoided hard topics',
                    'Still unpacking it',
                    'Prefer not to say'
                  ].map((dynamic) => (
                    <div key={dynamic} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.familyDynamics?.includes(dynamic) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('familyDynamics', dynamic);
                          } else {
                            handleMultiSelect('familyDynamics', dynamic);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{dynamic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Support */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Have you worked with a therapist, coach, or support group? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Yes — currently',
                    'Yes — in the past',
                    "Not yet, but I'm open to it",
                    'No',
                    'Prefer not to say'
                  ].map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.professionalSupport?.includes(support) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('professionalSupport', support);
                          } else {
                            handleMultiSelect('professionalSupport', support);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{support}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship Influences */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What influenced your ideas about love and relationships? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'My parents or caregivers',
                    'Friends / peer relationships',
                    'Religion or culture',
                    'Therapy / coaching',
                    'Books / media / movies',
                    'Past trauma',
                    "No one really — I'm learning as I go",
                    'Still figuring it out'
                  ].map((influence) => (
                    <div key={influence} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipInfluences?.includes(influence) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipInfluences', influence);
                          } else {
                            handleMultiSelect('relationshipInfluences', influence);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{influence}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship Patterns */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What relationship patterns have you noticed in yourself? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'I give more than I get',
                    'I avoid vulnerability',
                    'I feel overwhelmed by closeness',
                    'I fear abandonment',
                    'I attract emotionally unavailable people',
                    'I lose myself in relationships',
                    'I push people away',
                    'I repeat old dynamics',
                    'Still learning / Not sure'
                  ].map((pattern) => (
                    <div key={pattern} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipPatterns?.includes(pattern) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipPatterns', pattern);
                          } else {
                            handleMultiSelect('relationshipPatterns', pattern);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Current Relationship */}
          {currentSection === 4 && (
            <div className="space-y-6">
              {/* Partner Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Partner or Relationship Name/Nickname
                </label>
                <Input 
                  value={formData.partnerName}
                  onChange={(e) => handleInputChange('partnerName', e.target.value)}
                  placeholder="Enter their name or nickname"
                  className="w-full"
                />
              </div>

              {/* Relationship Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How would you describe your current (or most recent) relationship? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Romantic',
                    'Sexual',
                    'Life partners',
                    'Domestic partners',
                    'Situationship',
                    'Open / Poly',
                    'Long-distance',
                    'Casual / Exploring',
                    'In a rough patch',
                    'Undefined'
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipType?.includes(type) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipType', type);
                          } else {
                            handleMultiSelect('relationshipType', type);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How long have you been (or were you) in this relationship? (Select 1-2)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Less than 6 months',
                    '6–12 months',
                    '1–3 years',
                    '3–7 years',
                    '7+ years',
                    'Off and on / complicated'
                  ].map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipDuration?.includes(duration) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipDuration', duration);
                          } else {
                            handleMultiSelect('relationshipDuration', duration);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship Positives */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What's working well in this relationship? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "We're emotionally connected",
                    'We can laugh together',
                    'We talk through conflict',
                    "We support each other's growth",
                    "We're sexually compatible",
                    "We're on the same page",
                    'We show up during hard times'
                  ].map((positive) => (
                    <div key={positive} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipPositives?.includes(positive) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipPositives', positive);
                          } else {
                            handleMultiSelect('relationshipPositives', positive);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{positive}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Input 
                    value={formData.otherPositives}
                    onChange={(e) => handleInputChange('otherPositives', e.target.value)}
                    placeholder="Other:"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Relationship Challenges */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What feels difficult or unresolved? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'We argue often',
                    'We avoid talking about issues',
                    'We feel distant or disconnected',
                    "I don't feel seen or heard",
                    'One or both of us is emotionally shut down',
                    'There\'s trust or safety concerns',
                    'There\'s been a betrayal or break',
                    'We want different things',
                    "We're stuck in a pattern"
                  ].map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.relationshipChallenges?.includes(challenge) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('relationshipChallenges', challenge);
                          } else {
                            handleMultiSelect('relationshipChallenges', challenge);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Living Arrangement */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How do you currently live? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'We live together full-time',
                    'We live apart',
                    'We stay over frequently',
                    'On and off',
                    "It's complicated"
                  ].map((arrangement) => (
                    <div key={arrangement} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.livingArrangement?.includes(arrangement) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('livingArrangement', arrangement);
                          } else {
                            handleMultiSelect('livingArrangement', arrangement);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{arrangement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotional Connection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How emotionally connected do you feel with your partner right now?
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Deeply connected',
                    'Mostly close',
                    'Sometimes connected',
                    'Often disconnected',
                    'On different pages',
                    "I'm unsure how I feel"
                  ].map((connection) => (
                    <Button
                      key={connection}
                      variant={formData.emotionalConnection === connection ? "default" : "outline"}
                      onClick={() => handleInputChange('emotionalConnection', connection)}
                      className="justify-start"
                    >
                      {connection}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 5: What You're Hoping For */}
          {currentSection === 5 && (
            <div className="space-y-6">
              {/* Hoping For */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What are you most hoping RealTalk can support you with? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Understanding myself better',
                    'Communication tools',
                    'Setting or keeping boundaries',
                    'Rebuilding trust',
                    'Reconnecting emotionally',
                    'Reigniting intimacy',
                    'Navigating conflict',
                    'Making a relationship decision',
                    'Healing from past hurt',
                    'Working through something with my partner',
                    'Understanding poly/open dynamics',
                    'Processing a breakup',
                    "I'm not sure yet"
                  ].map((hope) => (
                    <div key={hope} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.hopingFor?.includes(hope) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('hopingFor', hope);
                          } else {
                            handleMultiSelect('hopingFor', hope);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{hope}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Readiness */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  How ready are you to do the work? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "I'm open and motivated",
                    "I'm nervous but committed",
                    "I want change, but don't know how",
                    "I'm here because I'm stuck",
                    "I'm just curious",
                    "I'm not sure yet"
                  ].map((readiness) => (
                    <div key={readiness} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.readiness?.includes(readiness) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('readiness', readiness);
                          } else {
                            handleMultiSelect('readiness', readiness);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{readiness}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Healthy Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  What does a healthy relationship mean to you? (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Feeling emotionally safe',
                    'Growth — as individuals and together',
                    'Being accepted as I am',
                    'Communication that builds trust',
                    'Closeness and intimacy',
                    'Independence and interdependence',
                    'Being able to repair after conflict',
                    'Shared life goals or values',
                    'Joy, humor, and play'
                  ].map((healthy) => (
                    <div key={healthy} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={formData.healthyRelationship?.includes(healthy) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleMultiSelect('healthyRelationship', healthy);
                          } else {
                            handleMultiSelect('healthyRelationship', healthy);
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{healthy}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Input 
                    value={formData.otherHealthy}
                    onChange={(e) => handleInputChange('otherHealthy', e.target.value)}
                    placeholder="Something else:"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Final Thoughts */}
          {currentSection === 6 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Anything else you want RealTalk to know about you, your story, or your relationship? (Optional)
                </label>
                <Textarea 
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Share anything else that feels important..."
                  className="w-full min-h-[120px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentSection === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalSections }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i + 1 === currentSection ? 'bg-purple-500' : 
                    i + 1 < currentSection ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentSection < totalSections ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Complete Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileQuestionnaire;
