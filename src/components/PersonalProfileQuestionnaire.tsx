
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Heart, User, Brain, Home, Users, Target, MessageSquare, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  name?: string;
  pronouns?: string[];
  customPronouns?: string;
  gender?: string[];
  customGender?: string;
  orientation?: string[];
  customOrientation?: string;
  age?: string;
  relationshipStatus?: string[];
  stressReactions?: string[];
  attachmentStyles?: string[];
  conflictNeeds?: string[];
  showLove?: string[];
  receiveLove?: string[];
  familyDynamics?: string[];
  professionalSupport?: string[];
  relationshipInfluences?: string[];
  relationshipPatterns?: string[];
  partnerName?: string;
  relationshipType?: string[];
  relationshipDuration?: string[];
  relationshipPositives?: string[];
  otherPositives?: string;
  relationshipChallenges?: string[];
  livingArrangement?: string[];
  emotionalConnection?: string;
  hopingFor?: string[];
  readiness?: string[];
  healthyRelationship?: string[];
  otherHealthy?: string;
  additionalInfo?: string;
}

interface PersonalProfileQuestionnaireProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose }: PersonalProfileQuestionnaireProps) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [showAgeRestriction, setShowAgeRestriction] = useState(false);
  
  const totalSections = 6;
  const sections = [
    { id: 1, title: "About You", icon: User, description: "Let's start with the basics. This helps Kai get a feel for your world." },
    { id: 2, title: "Your Emotional Blueprint", icon: Brain, description: "Kai supports you better when it understands how you operate—especially when things get messy." },
    { id: 3, title: "Your Past & Foundations", icon: Home, description: "No judgment—this just helps Kai understand where you're coming from." },
    { id: 4, title: "Your Current Relationship", icon: Users, description: "Understanding your dynamic helps Kai support the real stuff you're navigating." },
    { id: 5, title: "What You're Hoping For", icon: Target, description: "Let's get clear on what you want help with right now." },
    { id: 6, title: "Final Thoughts", icon: MessageSquare, description: "Anything else you'd like Kai to know?" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof FormData] as string[] || [];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const handleAgeSelection = (value: string) => {
    if (value === "under18") {
      setShowAgeRestriction(true);
      return;
    }
    handleInputChange("age", value);
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete(formData);
      toast.success("Profile completed successfully!");
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection1 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="name" className="text-lg font-semibold text-gray-900">
          What's your name or nickname? <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter your name or nickname"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="text-lg py-3"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What pronouns do you use?</Label>
        <div className="grid grid-cols-2 gap-3">
          {["She/her", "He/him", "They/them", "Xe/xem", "Ze/zir", "No pronouns — use my name", "Prefer not to say"].map((pronoun) => (
            <div key={pronoun} className="flex items-center space-x-2">
              <Checkbox
                id={`pronoun-${pronoun}`}
                checked={formData.pronouns?.includes(pronoun) || false}
                onCheckedChange={(checked) => handleCheckboxChange("pronouns", pronoun, checked as boolean)}
              />
              <Label htmlFor={`pronoun-${pronoun}`} className="text-sm">{pronoun}</Label>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm text-gray-600">Add your own:</Label>
          <Input
            placeholder="Custom pronouns"
            value={formData.customPronouns || ""}
            onChange={(e) => handleInputChange("customPronouns", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How do you identify your gender? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Woman", "Man", "Non-binary", "Genderqueer", "Trans woman", "Trans man", "Agender", "Gender fluid", "Two-Spirit", "Questioning", "Prefer not to say"].map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={formData.gender?.includes(gender) || false}
                onCheckedChange={(checked) => handleCheckboxChange("gender", gender, checked as boolean)}
              />
              <Label htmlFor={`gender-${gender}`} className="text-sm">{gender}</Label>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm text-gray-600">Add your own:</Label>
          <Input
            placeholder="Custom gender identity"
            value={formData.customGender || ""}
            onChange={(e) => handleInputChange("customGender", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How do you describe your sexual orientation? (Select all that apply — optional)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Straight / Heterosexual", "Gay", "Lesbian", "Bisexual", "Pansexual", "Queer", "Asexual", "Demisexual", "Questioning", "Prefer not to say"].map((orientation) => (
            <div key={orientation} className="flex items-center space-x-2">
              <Checkbox
                id={`orientation-${orientation}`}
                checked={formData.orientation?.includes(orientation) || false}
                onCheckedChange={(checked) => handleCheckboxChange("orientation", orientation, checked as boolean)}
              />
              <Label htmlFor={`orientation-${orientation}`} className="text-sm">{orientation}</Label>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm text-gray-600">Add your own:</Label>
          <Input
            placeholder="Custom orientation"
            value={formData.customOrientation || ""}
            onChange={(e) => handleInputChange("customOrientation", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How old are you?</Label>
        <RadioGroup value={formData.age} onValueChange={handleAgeSelection}>
          {[
            { value: "under18", label: "Under 18" },
            { value: "18-24", label: "18–24" },
            { value: "25-29", label: "25–29" },
            { value: "30-39", label: "30–39" },
            { value: "40-49", label: "40–49" },
            { value: "50-60", label: "50-60" },
            { value: "60+", label: "60+" }
          ].map((age) => (
            <div key={age.value} className="flex items-center space-x-2">
              <RadioGroupItem value={age.value} id={`age-${age.value}`} />
              <Label htmlFor={`age-${age.value}`} className="text-sm">{age.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What's your current relationship status? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Single", "In a relationship", "Engaged", "Married", "Open / Poly", "Exploring", "Separated / Divorced", "Prefer not to say"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={formData.relationshipStatus?.includes(status) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipStatus", status, checked as boolean)}
              />
              <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">When you're stressed in a relationship, how do you tend to react? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "I shut down or withdraw",
            "I get clingy or anxious",
            "I try to fix everything",
            "I get defensive or angry",
            "I freeze or dissociate",
            "I use humor to distract",
            "I keep the peace and hide my feelings",
            "It depends / I'm still figuring it out"
          ].map((reaction) => (
            <div key={reaction} className="flex items-center space-x-2">
              <Checkbox
                id={`stress-${reaction}`}
                checked={formData.stressReactions?.includes(reaction) || false}
                onCheckedChange={(checked) => handleCheckboxChange("stressReactions", reaction, checked as boolean)}
              />
              <Label htmlFor={`stress-${reaction}`} className="text-sm">{reaction}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">Which attachment styles resonate with you? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Secure",
            "Anxious / Preoccupied",
            "Avoidant / Dismissive",
            "Fearful-Avoidant",
            "I'm not sure",
            "I don't believe in attachment styles",
            "Still exploring"
          ].map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <Checkbox
                id={`attachment-${style}`}
                checked={formData.attachmentStyles?.includes(style) || false}
                onCheckedChange={(checked) => handleCheckboxChange("attachmentStyles", style, checked as boolean)}
              />
              <Label htmlFor={`attachment-${style}`} className="text-sm">{style}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What do you usually need in conflict? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "To be heard without being fixed",
            "Emotional reassurance",
            "Space to process",
            "Clarity and structure",
            "For it to blow over",
            "Apology or repair",
            "Help putting my feelings into words",
            "I don't know yet"
          ].map((need) => (
            <div key={need} className="flex items-center space-x-2">
              <Checkbox
                id={`conflict-${need}`}
                checked={formData.conflictNeeds?.includes(need) || false}
                onCheckedChange={(checked) => handleCheckboxChange("conflictNeeds", need, checked as boolean)}
              />
              <Label htmlFor={`conflict-${need}`} className="text-sm">{need}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How do you show love to others? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Words of affirmation",
            "Quality time",
            "Acts of service",
            "Physical touch",
            "Gift giving",
            "Support or problem-solving",
            "Play or humor",
            "Encouragement / Coaching"
          ].map((way) => (
            <div key={way} className="flex items-center space-x-2">
              <Checkbox
                id={`show-love-${way}`}
                checked={formData.showLove?.includes(way) || false}
                onCheckedChange={(checked) => handleCheckboxChange("showLove", way, checked as boolean)}
              />
              <Label htmlFor={`show-love-${way}`} className="text-sm">{way}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How do you prefer to receive love? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Words of affirmation",
            "Quality time",
            "Acts of service",
            "Physical touch",
            "Gift giving",
            "Feeling seen / emotionally understood",
            "Check-ins or follow-through",
            "Shared experiences"
          ].map((way) => (
            <div key={way} className="flex items-center space-x-2">
              <Checkbox
                id={`receive-love-${way}`}
                checked={formData.receiveLove?.includes(way) || false}
                onCheckedChange={(checked) => handleCheckboxChange("receiveLove", way, checked as boolean)}
              />
              <Label htmlFor={`receive-love-${way}`} className="text-sm">{way}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How would you describe your family dynamics growing up? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Emotionally supportive",
            "Emotionally distant",
            "High conflict",
            "Loving but inconsistent",
            "Overprotective",
            "Chaotic or unstable",
            "Emotionally unsafe",
            "Avoided hard topics",
            "Still unpacking it",
            "Prefer not to say"
          ].map((dynamic) => (
            <div key={dynamic} className="flex items-center space-x-2">
              <Checkbox
                id={`family-${dynamic}`}
                checked={formData.familyDynamics?.includes(dynamic) || false}
                onCheckedChange={(checked) => handleCheckboxChange("familyDynamics", dynamic, checked as boolean)}
              />
              <Label htmlFor={`family-${dynamic}`} className="text-sm">{dynamic}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">Have you worked with a therapist, coach, or support group? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Yes — currently",
            "Yes — in the past",
            "Not yet, but I'm open to it",
            "No",
            "Prefer not to say"
          ].map((support) => (
            <div key={support} className="flex items-center space-x-2">
              <Checkbox
                id={`support-${support}`}
                checked={formData.professionalSupport?.includes(support) || false}
                onCheckedChange={(checked) => handleCheckboxChange("professionalSupport", support, checked as boolean)}
              />
              <Label htmlFor={`support-${support}`} className="text-sm">{support}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What influenced your ideas about love and relationships? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "My parents or caregivers",
            "Friends / peer relationships",
            "Religion or culture",
            "Therapy / coaching",
            "Books / media / movies",
            "Past trauma",
            "No one really — I'm learning as I go",
            "Still figuring it out"
          ].map((influence) => (
            <div key={influence} className="flex items-center space-x-2">
              <Checkbox
                id={`influence-${influence}`}
                checked={formData.relationshipInfluences?.includes(influence) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipInfluences", influence, checked as boolean)}
              />
              <Label htmlFor={`influence-${influence}`} className="text-sm">{influence}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What relationship patterns have you noticed in yourself? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "I give more than I get",
            "I avoid vulnerability",
            "I feel overwhelmed by closeness",
            "I fear abandonment",
            "I attract emotionally unavailable people",
            "I lose myself in relationships",
            "I push people away",
            "I repeat old dynamics",
            "Still learning / Not sure"
          ].map((pattern) => (
            <div key={pattern} className="flex items-center space-x-2">
              <Checkbox
                id={`pattern-${pattern}`}
                checked={formData.relationshipPatterns?.includes(pattern) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipPatterns", pattern, checked as boolean)}
              />
              <Label htmlFor={`pattern-${pattern}`} className="text-sm">{pattern}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="partnerName" className="text-lg font-semibold text-gray-900">
          Partner or Relationship Name/Nickname
        </Label>
        <Input
          id="partnerName"
          placeholder="Enter partner's name or nickname"
          value={formData.partnerName || ""}
          onChange={(e) => handleInputChange("partnerName", e.target.value)}
          className="text-lg py-3"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How would you describe your current (or most recent) relationship? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Romantic",
            "Sexual",
            "Life partners",
            "Domestic partners",
            "Situationship",
            "Open / Poly",
            "Long-distance",
            "Casual / Exploring",
            "In a rough patch",
            "Undefined"
          ].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`relationship-type-${type}`}
                checked={formData.relationshipType?.includes(type) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipType", type, checked as boolean)}
              />
              <Label htmlFor={`relationship-type-${type}`} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How long have you been (or were you) in this relationship? (Select 1-2)</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Less than 6 months",
            "6–12 months",
            "1–3 years",
            "3–7 years",
            "7+ years",
            "Off and on / complicated"
          ].map((duration) => (
            <div key={duration} className="flex items-center space-x-2">
              <Checkbox
                id={`duration-${duration}`}
                checked={formData.relationshipDuration?.includes(duration) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipDuration", duration, checked as boolean)}
              />
              <Label htmlFor={`duration-${duration}`} className="text-sm">{duration}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What's working well in this relationship? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "We're emotionally connected",
            "We can laugh together",
            "We talk through conflict",
            "We support each other's growth",
            "We're sexually compatible",
            "We're on the same page",
            "We show up during hard times"
          ].map((positive) => (
            <div key={positive} className="flex items-center space-x-2">
              <Checkbox
                id={`positive-${positive}`}
                checked={formData.relationshipPositives?.includes(positive) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipPositives", positive, checked as boolean)}
              />
              <Label htmlFor={`positive-${positive}`} className="text-sm">{positive}</Label>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm text-gray-600">Other:</Label>
          <Input
            placeholder="Other positive aspects"
            value={formData.otherPositives || ""}
            onChange={(e) => handleInputChange("otherPositives", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What feels difficult or unresolved? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "We argue often",
            "We avoid talking about issues",
            "We feel distant or disconnected",
            "I don't feel seen or heard",
            "One or both of us is emotionally shut down",
            "There's trust or safety concerns",
            "There's been a betrayal or break",
            "We want different things",
            "We're stuck in a pattern"
          ].map((challenge) => (
            <div key={challenge} className="flex items-center space-x-2">
              <Checkbox
                id={`challenge-${challenge}`}
                checked={formData.relationshipChallenges?.includes(challenge) || false}
                onCheckedChange={(checked) => handleCheckboxChange("relationshipChallenges", challenge, checked as boolean)}
              />
              <Label htmlFor={`challenge-${challenge}`} className="text-sm">{challenge}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How do you currently live? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "We live together full-time",
            "We live apart",
            "We stay over frequently",
            "On and off",
            "It's complicated"
          ].map((living) => (
            <div key={living} className="flex items-center space-x-2">
              <Checkbox
                id={`living-${living}`}
                checked={formData.livingArrangement?.includes(living) || false}
                onCheckedChange={(checked) => handleCheckboxChange("livingArrangement", living, checked as boolean)}
              />
              <Label htmlFor={`living-${living}`} className="text-sm">{living}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How emotionally connected do you feel with your partner right now?</Label>
        <RadioGroup value={formData.emotionalConnection} onValueChange={(value) => handleInputChange("emotionalConnection", value)}>
          {[
            { value: "deeply-connected", label: "Deeply connected" },
            { value: "mostly-close", label: "Mostly close" },
            { value: "sometimes-connected", label: "Sometimes connected" },
            { value: "often-disconnected", label: "Often disconnected" },
            { value: "different-pages", label: "On different pages" },
            { value: "unsure", label: "I'm unsure how I feel" }
          ].map((connection) => (
            <div key={connection.value} className="flex items-center space-x-2">
              <RadioGroupItem value={connection.value} id={`connection-${connection.value}`} />
              <Label htmlFor={`connection-${connection.value}`} className="text-sm">{connection.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What are you most hoping Kai can support you with? (Select up to 3)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Understanding myself better",
            "Communication tools",
            "Setting or keeping boundaries",
            "Rebuilding trust",
            "Reconnecting emotionally",
            "Reigniting intimacy",
            "Navigating conflict",
            "Making a relationship decision",
            "Healing from past hurt",
            "Working through something with my partner",
            "Understanding poly/open dynamics",
            "Processing a breakup",
            "I'm not sure yet"
          ].map((hope) => (
            <div key={hope} className="flex items-center space-x-2">
              <Checkbox
                id={`hope-${hope}`}
                checked={formData.hopingFor?.includes(hope) || false}
                onCheckedChange={(checked) => handleCheckboxChange("hopingFor", hope, checked as boolean)}
              />
              <Label htmlFor={`hope-${hope}`} className="text-sm">{hope}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">How ready are you to do the work? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
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
                id={`readiness-${readiness}`}
                checked={formData.readiness?.includes(readiness) || false}
                onCheckedChange={(checked) => handleCheckboxChange("readiness", readiness, checked as boolean)}
              />
              <Label htmlFor={`readiness-${readiness}`} className="text-sm">{readiness}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">What does a healthy relationship mean to you? (Select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Feeling emotionally safe",
            "Growth — as individuals and together",
            "Being accepted as I am",
            "Communication that builds trust",
            "Closeness and intimacy",
            "Independence and interdependence",
            "Being able to repair after conflict",
            "Shared life goals or values",
            "Joy, humor, and play"
          ].map((healthy) => (
            <div key={healthy} className="flex items-center space-x-2">
              <Checkbox
                id={`healthy-${healthy}`}
                checked={formData.healthyRelationship?.includes(healthy) || false}
                onCheckedChange={(checked) => handleCheckboxChange("healthyRelationship", healthy, checked as boolean)}
              />
              <Label htmlFor={`healthy-${healthy}`} className="text-sm">{healthy}</Label>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm text-gray-600">Something else:</Label>
          <Input
            placeholder="Other aspects of healthy relationships"
            value={formData.otherHealthy || ""}
            onChange={(e) => handleInputChange("otherHealthy", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Anything else you want Kai to know about you, your story, or your relationship?
        </Label>
        <p className="text-sm text-gray-600 mb-4">This is completely optional, but feel free to share anything that might help Kai understand your unique situation better.</p>
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Share anything else you'd like Kai to know..."
          value={formData.additionalInfo || ""}
          onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
        />
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1: return renderSection1();
      case 2: return renderSection2();
      case 3: return renderSection3();
      case 4: return renderSection4();
      case 5: return renderSection5();
      case 6: return renderSection6();
      default: return null;
    }
  };

  const currentSectionData = sections[currentSection - 1];
  const CurrentIcon = currentSectionData.icon;

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${showAgeRestriction ? 'blur-sm' : ''}`}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CurrentIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
                    <p className="text-gray-600">Help Kai understand you better</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="bg-white/70 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Section {currentSection} of {totalSections}</span>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">
                    {currentSectionData.title}
                  </span>
                </div>
                <Progress value={(currentSection / totalSections) * 100} className="h-3 bg-gray-200" />
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {Math.round((currentSection / totalSections) * 100)}% complete
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-gradient-to-br from-gray-50/50 to-white">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentSectionData.title}</h3>
              <p className="text-gray-600">{currentSectionData.description}</p>
            </div>
            {renderCurrentSection()}
          </div>

          {/* Navigation */}
          <div className="p-6 border-t bg-gray-50/80 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 1}
                className="flex items-center gap-2 px-6 py-2 rounded-xl border-gray-300 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSections }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i + 1 === currentSection 
                        ? 'bg-purple-500 w-8' 
                        : i + 1 < currentSection
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {currentSection === totalSections ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Age Restriction Modal */}
      {showAgeRestriction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-white shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Age-Appropriate Resources</h3>
              <p className="text-gray-600">
                We care about your safety and wellbeing. For users under 18, we recommend checking out age-appropriate resources.
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.loveisrespect.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Love is Respect
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-sm text-gray-500">
                  A comprehensive resource for healthy relationship information
                </p>
              </div>
              <Button
                onClick={() => setShowAgeRestriction(false)}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default PersonalProfileQuestionnaire;
