
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Heart, User, Brain, Home, Target } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import { toast } from "sonner";

interface PersonalProfileQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

const PersonalProfileQuestionnaire = ({ isOpen, onClose, onComplete }: PersonalProfileQuestionnaireProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const totalPages = 5;

  // Initialize form data from localStorage or empty state
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('realtalk_personal_profile_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved profile data:', error);
      }
    }
    return {
      // Basic Info
      name: '',
      pronouns: [],
      customPronouns: '',
      gender: [],
      customGender: '',
      orientation: [],
      customOrientation: '',
      age: '',
      relationshipStatus: [],
      avatarUrl: '',

      // Emotional Blueprint
      stressReactions: [],
      attachmentStyles: [],
      conflictNeeds: [],
      showLove: [],
      receiveLove: [],

      // Past & Foundations
      familyDynamics: [],
      professionalSupport: [],
      relationshipInfluences: [],
      relationshipPatterns: [],

      // Current Relationship
      partnerName: '',
      relationshipType: [],
      relationshipDuration: '',
      relationshipPositives: [],
      otherPositives: '',
      relationshipChallenges: [],
      livingArrangement: [],
      emotionalConnection: [],

      // Hopes & Goals
      hopingFor: [],
      readiness: [],
      healthyRelationship: [],
      otherHealthy: '',
      additionalInfo: ''
    };
  });

  // Save to localStorage whenever form data changes
  useEffect(() => {
    localStorage.setItem('realtalk_personal_profile_draft', JSON.stringify(formData));
  }, [formData]);

  // Calculate completion percentage
  const calculateProgress = () => {
    const fields = [
      'name', 'age', 'stressReactions', 'attachmentStyles', 'showLove', 
      'receiveLove', 'familyDynamics', 'relationshipStatus'
    ];
    
    let completed = 0;
    fields.forEach(field => {
      const value = formData[field];
      if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim())) {
        completed++;
      }
    });
    
    return Math.round((completed / fields.length) * 100);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayUpdate = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // Show completion prompt
      setShowCompletionPrompt(true);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComplete = () => {
    // Clear the draft from localStorage
    localStorage.removeItem('realtalk_personal_profile_draft');
    onComplete(formData);
    setShowCompletionPrompt(false);
  };

  const handleTalkToKai = () => {
    handleComplete();
  };

  const handleContinueProfile = () => {
    setShowCompletionPrompt(false);
    onClose();
  };

  if (showCompletionPrompt) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-coral-600" />
              Great job!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You've completed your personal profile! Would you like to talk to your relationship coach Kai now?
            </p>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleTalkToKai} className="w-full">
                Yes, let's chat with Kai!
              </Button>
              <Button variant="outline" onClick={handleContinueProfile} className="w-full">
                No, continue with profile setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-coral-600" />
            Personal Profile - Page {currentPage} of {totalPages}
          </DialogTitle>
          <Progress value={(currentPage / totalPages) * 100} className="mt-2" />
        </DialogHeader>

        {/* Page 1: Basic Information */}
        {currentPage === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-coral-600" />
                Tell us about yourself
              </CardTitle>
              <CardDescription>
                Basic information to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AvatarUpload
                  currentAvatar={formData.avatarUrl}
                  onAvatarChange={(url) => updateFormData('avatarUrl', url)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="What should we call you?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    placeholder="Your age"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Pronouns</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['they/them', 'she/her', 'he/him', 'other'].map((pronoun) => (
                    <div key={pronoun} className="flex items-center space-x-2">
                      <Checkbox
                        id={pronoun}
                        checked={formData.pronouns.includes(pronoun)}
                        onCheckedChange={() => handleArrayUpdate('pronouns', pronoun)}
                      />
                      <Label htmlFor={pronoun} className="text-sm">{pronoun}</Label>
                    </div>
                  ))}
                </div>
                {formData.pronouns.includes('other') && (
                  <Input
                    value={formData.customPronouns}
                    onChange={(e) => updateFormData('customPronouns', e.target.value)}
                    placeholder="Please specify your pronouns"
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label>Relationship Status</Label>
                <RadioGroup
                  value={formData.relationshipStatus[0] || ''}
                  onValueChange={(value) => updateFormData('relationshipStatus', [value])}
                >
                  {[
                    'Single',
                    'In a relationship',
                    'Married',
                    'Engaged',
                    'It\'s complicated',
                    'Prefer not to say'
                  ].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <RadioGroupItem value={status} id={status} />
                      <Label htmlFor={status}>{status}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page 2: Emotional Blueprint */}
        {currentPage === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-coral-600" />
                Your Emotional Blueprint
              </CardTitle>
              <CardDescription>
                Understanding how you connect and respond emotionally
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>When stressed, I tend to... (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Withdraw and need space',
                    'Seek comfort from others',
                    'Get more talkative',
                    'Become more emotional',
                    'Focus on solving problems',
                    'Feel overwhelmed',
                    'Get irritable or snappy',
                    'Try to stay busy'
                  ].map((reaction) => (
                    <div key={reaction} className="flex items-center space-x-2">
                      <Checkbox
                        id={reaction}
                        checked={formData.stressReactions.includes(reaction)}
                        onCheckedChange={() => handleArrayUpdate('stressReactions', reaction)}
                      />
                      <Label htmlFor={reaction} className="text-sm">{reaction}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>My attachment style feels like... (select all that resonate)</Label>
                <div className="space-y-2">
                  {[
                    'I need reassurance that people care about me',
                    'I value my independence highly',
                    'I worry about being abandoned',
                    'I find it hard to depend on others',
                    'I want to be close but worry about getting hurt',
                    'I\'m comfortable with emotional intimacy'
                  ].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={style}
                        checked={formData.attachmentStyles.includes(style)}
                        onCheckedChange={() => handleArrayUpdate('attachmentStyles', style)}
                      />
                      <Label htmlFor={style} className="text-sm">{style}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>I show love by... (select your top ways)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Spending quality time together',
                    'Physical affection and touch',
                    'Doing helpful things/acts of service',
                    'Giving thoughtful gifts',
                    'Expressing feelings with words',
                    'Being physically intimate',
                    'Planning special experiences',
                    'Being a good listener'
                  ].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={language}
                        checked={formData.showLove.includes(language)}
                        onCheckedChange={() => handleArrayUpdate('showLove', language)}
                      />
                      <Label htmlFor={language} className="text-sm">{language}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>I feel most loved when someone... (select your top ways)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Spends uninterrupted time with me',
                    'Shows physical affection',
                    'Does things to help me',
                    'Gives me thoughtful gifts',
                    'Tells me they love/appreciate me',
                    'Is physically intimate with me',
                    'Plans special things for us',
                    'Really listens when I talk'
                  ].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={language}
                        checked={formData.receiveLove.includes(language)}
                        onCheckedChange={() => handleArrayUpdate('receiveLove', language)}
                      />
                      <Label htmlFor={language} className="text-sm">{language}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page 3: Past & Foundations */}
        {currentPage === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-coral-600" />
                Your Foundations
              </CardTitle>
              <CardDescription>
                Understanding your background and influences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Growing up, my family dynamics were... (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Very close and supportive',
                    'Emotionally distant',
                    'High conflict/lots of arguing',
                    'Stable and predictable',
                    'Unpredictable or chaotic',
                    'Focused on achievement',
                    'Very traditional values',
                    'Open about feelings',
                    'Divorced or separated parents',
                    'Blended family dynamics'
                  ].map((dynamic) => (
                    <div key={dynamic} className="flex items-center space-x-2">
                      <Checkbox
                        id={dynamic}
                        checked={formData.familyDynamics.includes(dynamic)}
                        onCheckedChange={() => handleArrayUpdate('familyDynamics', dynamic)}
                      />
                      <Label htmlFor={dynamic} className="text-sm">{dynamic}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>I've worked with... (select any that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Individual therapist',
                    'Couples counselor',
                    'Support groups',
                    'Life coach',
                    'Psychiatrist for medication',
                    'None of the above'
                  ].map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox
                        id={support}
                        checked={formData.professionalSupport.includes(support)}
                        onCheckedChange={() => handleArrayUpdate('professionalSupport', support)}
                      />
                      <Label htmlFor={support} className="text-sm">{support}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page 4: Current Relationship (if applicable) */}
        {currentPage === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-coral-600" />
                Current Relationship
              </CardTitle>
              <CardDescription>
                Tell us about your current relationship (skip if single)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.relationshipStatus[0] !== 'Single' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="partnerName">Partner's name (or what you'd like to call them)</Label>
                    <Input
                      id="partnerName"
                      value={formData.partnerName}
                      onChange={(e) => updateFormData('partnerName', e.target.value)}
                      placeholder="Your partner's name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationshipDuration">How long have you been together?</Label>
                    <Input
                      id="relationshipDuration"
                      value={formData.relationshipDuration}
                      onChange={(e) => updateFormData('relationshipDuration', e.target.value)}
                      placeholder="e.g., 2 years, 6 months"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>What's going well in your relationship? (select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        'Good communication',
                        'Physical intimacy',
                        'Emotional connection',
                        'Shared values',
                        'Having fun together',
                        'Supporting each other\'s goals',
                        'Handling conflict well',
                        'Trust and honesty'
                      ].map((positive) => (
                        <div key={positive} className="flex items-center space-x-2">
                          <Checkbox
                            id={positive}
                            checked={formData.relationshipPositives.includes(positive)}
                            onCheckedChange={() => handleArrayUpdate('relationshipPositives', positive)}
                          />
                          <Label htmlFor={positive} className="text-sm">{positive}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>What are your biggest challenges? (select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        'Communication issues',
                        'Different conflict styles',
                        'Intimacy/physical connection',
                        'Different values or goals',
                        'Not enough quality time',
                        'Financial stress',
                        'Work-life balance',
                        'Family/in-law issues',
                        'Trust issues',
                        'Different social needs'
                      ].map((challenge) => (
                        <div key={challenge} className="flex items-center space-x-2">
                          <Checkbox
                            id={challenge}
                            checked={formData.relationshipChallenges.includes(challenge)}
                            onCheckedChange={() => handleArrayUpdate('relationshipChallenges', challenge)}
                          />
                          <Label htmlFor={challenge} className="text-sm">{challenge}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {formData.relationshipStatus[0] === 'Single' && (
                <div className="text-center py-8 text-gray-500">
                  <p>Since you're single, we'll skip the relationship-specific questions.</p>
                  <p>Click Next to continue to the final section.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Page 5: Hopes & Goals */}
        {currentPage === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-coral-600" />
                Your Hopes & Goals
              </CardTitle>
              <CardDescription>
                What are you hoping to achieve?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Right now, I'm hoping for... (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Better communication skills',
                    'Deeper emotional connection',
                    'More confidence in relationships',
                    'Help with conflict resolution',
                    'Understanding my patterns',
                    'Support through a rough patch',
                    'Clarity about my relationship',
                    'Tools for personal growth'
                  ].map((hope) => (
                    <div key={hope} className="flex items-center space-x-2">
                      <Checkbox
                        id={hope}
                        checked={formData.hopingFor.includes(hope)}
                        onCheckedChange={() => handleArrayUpdate('hopingFor', hope)}
                      />
                      <Label htmlFor={hope} className="text-sm">{hope}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>A healthy relationship to me means... (select your top values)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Open and honest communication',
                    'Mutual respect and trust',
                    'Supporting each other\'s growth',
                    'Having fun and enjoying time together',
                    'Handling conflict constructively',
                    'Physical and emotional intimacy',
                    'Shared goals and values',
                    'Maintaining individual identity'
                  ].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={value}
                        checked={formData.healthyRelationship.includes(value)}
                        onCheckedChange={() => handleArrayUpdate('healthyRelationship', value)}
                      />
                      <Label htmlFor={value} className="text-sm">{value}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Anything else you'd like to share?</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  placeholder="Any additional context, concerns, or things you'd like me to know..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            {calculateProgress()}% complete
          </div>

          <Button
            onClick={nextPage}
            className="flex items-center gap-2"
          >
            {currentPage === totalPages ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalProfileQuestionnaire;
