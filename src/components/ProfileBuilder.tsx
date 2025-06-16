
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, User, Users } from "lucide-react";
import { toast } from 'sonner';

interface ProfileBuilderProps {
  onProfileUpdate: (newProfiles: any, newDemographics: any) => void;
  initialProfiles: {your: any[], partner: any[]};
  initialDemographics: {your: any, partner: any};
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ onProfileUpdate, initialProfiles, initialDemographics }) => {
  const [yourName, setYourName] = useState(initialDemographics?.your?.name || "");
  const [partnerName, setPartnerName] = useState(initialDemographics?.partner?.name || "");
  const [yourProfile, setYourProfile] = useState(initialProfiles?.your?.[0] || {});
  const [partnerProfile, setPartnerProfile] = useState(initialProfiles?.partner?.[0] || {});

  useEffect(() => {
    // Initialize state from props
    setYourName(initialDemographics?.your?.name || "");
    setPartnerName(initialDemographics?.partner?.name || "");
    setYourProfile(initialProfiles?.your?.[0] || {});
    setPartnerProfile(initialProfiles?.partner?.[0] || {});
  }, [initialDemographics, initialProfiles]);

  const handleInputChange = (event: any, profileType: string) => {
    const { name, value } = event.target;
    if (profileType === "your") {
      setYourProfile(prev => ({ ...prev, [name]: value }));
    } else {
      setPartnerProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const newProfiles = { your: [yourProfile], partner: [partnerProfile] };
    const newDemographics = { your: { name: yourName }, partner: { name: partnerName } };
    onProfileUpdate(newProfiles, newDemographics);
    toast.success("Profiles updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Relationship Profile Builder</h2>
        <p className="text-gray-600">
          Create detailed profiles for yourself and your partner to personalize your relationship support.
        </p>
      </div>

      <Card className="bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            Basic Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="yourName">Your Name</Label>
              <Input
                type="text"
                id="yourName"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="partnerName">Partner's Name</Label>
              <Input
                type="text"
                id="partnerName"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Enter your partner's name"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <Accordion type="single" collapsible>
            <AccordionItem value="your-profile">
              <AccordionTrigger className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Profile
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="your-love-language">Love Language</Label>
                    <Input
                      type="text"
                      id="your-love-language"
                      name="loveLanguage"
                      value={yourProfile.loveLanguage || ""}
                      onChange={(e) => handleInputChange(e, "your")}
                      placeholder="e.g., words of affirmation, acts of service"
                    />
                  </div>
                  <div>
                    <Label htmlFor="your-interests">Interests & Hobbies</Label>
                    <Input
                      type="text"
                      id="your-interests"
                      name="interests"
                      value={yourProfile.interests || ""}
                      onChange={(e) => handleInputChange(e, "your")}
                      placeholder="e.g., hiking, cooking, reading"
                    />
                  </div>
                  <div>
                    <Label htmlFor="your-stressors">Stressors</Label>
                    <Input
                      type="text"
                      id="your-stressors"
                      name="stressors"
                      value={yourProfile.stressors || ""}
                      onChange={(e) => handleInputChange(e, "your")}
                      placeholder="e.g., work deadlines, family issues"
                    />
                  </div>
                  <div>
                    <Label htmlFor="your-communication-style">Communication Style</Label>
                    <Input
                      type="text"
                      id="your-communication-style"
                      name="communicationStyle"
                      value={yourProfile.communicationStyle || ""}
                      onChange={(e) => handleInputChange(e, "your")}
                      placeholder="e.g., direct, passive, assertive"
                    />
                  </div>
                  <div>
                    <Label htmlFor="your-strengths">Strengths</Label>
                    <Input
                      type="text"
                      id="your-strengths"
                      name="strengths"
                      value={yourProfile.strengths || ""}
                      onChange={(e) => handleInputChange(e, "your")}
                      placeholder="e.g., empathy, problem-solving, creativity"
                    />
                  </div>
                   <div>
                    <Label htmlFor="your-insecurities">Insecurities</Label>
                    <Input
                      type="text"
                      id="your-insecurities"
                      name="insecurities"
                      value={yourProfile.insecurities || ""}
                      onChange={(e) => handleInputChange(e, "your")}
                      placeholder="e.g., feeling inadequate, fear of failure"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="partner-profile">
              <AccordionTrigger className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Partner's Profile
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partner-love-language">Love Language</Label>
                    <Input
                      type="text"
                      id="partner-love-language"
                      name="loveLanguage"
                      value={partnerProfile.loveLanguage || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., words of affirmation, acts of service"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-interests">Interests & Hobbies</Label>
                    <Input
                      type="text"
                      id="partner-interests"
                      name="interests"
                      value={partnerProfile.interests || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., hiking, cooking, reading"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-stressors">Stressors</Label>
                    <Input
                      type="text"
                      id="partner-stressors"
                      name="stressors"
                      value={partnerProfile.stressors || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., work deadlines, family issues"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-communication-style">Communication Style</Label>
                    <Input
                      type="text"
                      id="partner-communication-style"
                      name="communicationStyle"
                      value={partnerProfile.communicationStyle || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., direct, passive, assertive"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-strengths">Strengths</Label>
                    <Input
                      type="text"
                      id="partner-strengths"
                      name="strengths"
                      value={partnerProfile.strengths || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., empathy, problem-solving, creativity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-insecurities">Insecurities</Label>
                    <Input
                      type="text"
                      id="partner-insecurities"
                      name="insecurities"
                      value={partnerProfile.insecurities || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., feeling inadequate, fear of failure"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-dailyRoutine">Daily Routine</Label>
                    <Input
                      type="text"
                      id="partner-dailyRoutine"
                      name="dailyRoutine"
                      value={partnerProfile.dailyRoutine || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., goes to the gym, works from home"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-preferences">Preferences</Label>
                    <Input
                      type="text"
                      id="partner-preferences"
                      name="preferences"
                      value={partnerProfile.preferences || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., likes surprises, prefers quiet evenings"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-boundaries">Boundaries</Label>
                    <Input
                      type="text"
                      id="partner-boundaries"
                      name="boundaries"
                      value={partnerProfile.boundaries || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., needs alone time, dislikes public displays of affection"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-currentStressLevel">Current Stress Level</Label>
                    <Input
                      type="text"
                      id="partner-currentStressLevel"
                      name="currentStressLevel"
                      value={partnerProfile.currentStressLevel || ""}
                      onChange={(e) => handleInputChange(e, "partner")}
                      placeholder="e.g., stressed, relaxed, overwhelmed"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
          >
            Update Profiles
            <PlusCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileBuilder;
