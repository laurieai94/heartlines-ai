
import { useState } from "react";
import { toast } from "sonner";
import RelationshipAlerts from "./ThoughtfulActions/RelationshipAlerts";
import ActionForm from "./ThoughtfulActions/ActionForm";
import QuickActions from "./ThoughtfulActions/QuickActions";
import SuggestionsList from "./ThoughtfulActions/SuggestionsList";

interface Suggestion {
  id: number;
  category: string;
  partnerMood: string;
  occasion: string;
  context: string;
  suggestions: string;
  timestamp: string;
}

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface ThoughtfulActionsProps {
  profiles?: ProfileData;
  demographicsData?: DemographicsData;
}

const ThoughtfulActions = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: ThoughtfulActionsProps) => {
  const [partnerMood, setPartnerMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Get partner info from profiles
  const partnerName = demographicsData.partner?.name || 'your partner';
  const partnerProfile = profiles.partner[0] || {};
  const yourProfile = profiles.your[0] || {};

  const generateSuggestions = async () => {
    if (!category) {
      toast.error("Please select an action category");
      return;
    }

    setLoading(true);

    try {
      // Create personalized suggestions based on profile data
      const getPersonalizedSuggestions = () => {
        let suggestions = "";
        
        // Base suggestions by category
        if (category === "acts_of_service") {
          suggestions = `**Action**: Take care of their daily stress points
**Why it matters**: Acts of service show love through helpful actions that make their day easier
**How to do it**: ${partnerProfile.stressors ? `Focus on relieving their stress around ${partnerProfile.stressors}` : 'Handle tasks they usually do without being asked'}
**Time needed**: 30-60 minutes

**Action**: Create a comfort environment
**Why it matters**: ${partnerProfile.loveLanguage === 'acts_of_service' ? 'This directly speaks their love language' : 'Shows thoughtful attention to their needs'}
**How to do it**: ${partnerMood.includes('stressed') ? 'Set up a relaxing space with their favorite things' : 'Organize their space or prepare something they enjoy'}
**Time needed**: 20-30 minutes

**Action**: Anticipate their needs
**Why it matters**: Shows you pay attention and care about their wellbeing
**How to do it**: ${partnerProfile.dailyRoutine ? `Support their routine by ${partnerProfile.dailyRoutine}` : 'Think about what would make their day smoother'}
**Time needed**: Variable`;
        } else if (category === "quality_time") {
          suggestions = `**Action**: Plan focused one-on-one time
**Why it matters**: ${partnerProfile.loveLanguage === 'quality_time' ? 'This is their primary love language' : 'Strengthens your emotional connection'}
**How to do it**: ${partnerProfile.interests ? `Plan something around their interest in ${partnerProfile.interests}` : 'Choose an activity you both enjoy without distractions'}
**Time needed**: 1-2 hours

**Action**: Create meaningful conversation
**Why it matters**: Deep connection happens through understanding each other better
**How to do it**: ${partnerProfile.communicationStyle ? `Adapt to their ${partnerProfile.communicationStyle} communication style` : 'Ask open-ended questions about their thoughts and feelings'}
**Time needed**: 30-45 minutes

**Action**: Be fully present
**Why it matters**: ${partnerMood.includes('lonely') ? 'Shows them they matter and addresses their current feelings' : 'Quality time is about attention, not just proximity'}
**How to do it**: Put away devices and focus entirely on them and the moment
**Time needed**: However long you spend together`;
        } else if (category === "physical_touch") {
          suggestions = `**Action**: Offer comforting physical connection
**Why it matters**: ${partnerProfile.loveLanguage === 'physical_touch' ? 'Physical touch is their primary love language' : 'Physical touch releases bonding hormones and reduces stress'}
**How to do it**: ${partnerMood.includes('stressed') ? 'Offer a shoulder massage or gentle back rub' : 'Give genuine hugs and maintain appropriate physical closeness'}
**Time needed**: 10-20 minutes

**Action**: Show affection through touch
**Why it matters**: Helps maintain physical intimacy and emotional connection
**How to do it**: ${partnerProfile.preferences ? `Consider their preferences around ${partnerProfile.preferences}` : 'Hold hands, gentle touches on arm or back, cuddle time'}
**Time needed**: Throughout the day

**Action**: Be mindful of their touch preferences
**Why it matters**: Respects their boundaries while showing love in their language
**How to do it**: ${partnerProfile.boundaries ? `Remember their boundaries around ${partnerProfile.boundaries}` : 'Ask what kind of physical affection they need right now'}
**Time needed**: Ongoing awareness`;
        } else if (category === "words_of_affirmation") {
          suggestions = `**Action**: Express specific appreciation
**Why it matters**: ${partnerProfile.loveLanguage === 'words_of_affirmation' ? 'Words are their primary love language' : 'Specific appreciation feels more genuine and meaningful'}
**How to do it**: ${partnerProfile.strengths ? `Acknowledge their strength in ${partnerProfile.strengths}` : 'Point out specific things they did and how it made you feel'}
**Time needed**: 5-10 minutes

**Action**: Write a heartfelt note
**Why it matters**: Written words can be kept and reread, extending the positive impact
**How to do it**: ${occasion ? `Write about why this ${occasion} is special because of who they are` : 'Share what you admire about them and your relationship'}
**Time needed**: 15-20 minutes

**Action**: Verbal encouragement
**Why it matters**: ${partnerMood.includes('doubt') ? 'Addresses their current emotional needs' : 'Builds their confidence and shows your support'}
**How to do it**: ${partnerProfile.insecurities ? `Specifically counter their concerns about ${partnerProfile.insecurities}` : 'Tell them about their positive qualities and your faith in them'}
**Time needed**: 10-15 minutes`;
        } else if (category === "gifts") {
          suggestions = `**Action**: Choose a meaningful gift
**Why it matters**: ${partnerProfile.loveLanguage === 'receiving_gifts' ? 'Gifts are their primary love language' : 'Thoughtful gifts show you think about them when apart'}
**How to do it**: ${partnerProfile.interests ? `Find something related to their interest in ${partnerProfile.interests}` : 'Choose something that shows you listen to what they mention wanting'}
**Time needed**: 30-60 minutes (shopping)

**Action**: Create something personal
**Why it matters**: Handmade gifts show time, effort, and personal thought
**How to do it**: ${partnerProfile.hobbies ? `Make something that connects to their hobby of ${partnerProfile.hobbies}` : 'Create photo album, playlist, or handwritten letter'}
**Time needed**: 1-3 hours

**Action**: Give the gift of experience
**Why it matters**: Creates memories together while showing thoughtfulness
**How to do it**: ${occasion ? `Plan an experience that fits this ${occasion}` : 'Plan tickets to something they mentioned or a new experience to try together'}
**Time needed**: Variable (planning + experience)`;
        }

        // Add context-specific personalization
        if (partnerMood) {
          suggestions += `\n\n**Special Consideration**: Since ${partnerName} is ${partnerMood}, ${
            partnerMood.includes('stressed') ? 'focus on calming and supportive actions' :
            partnerMood.includes('sad') ? 'emphasize comfort and understanding' :
            partnerMood.includes('excited') ? 'match their energy and celebrate with them' :
            'be attuned to their emotional needs'
          }.`;
        }

        if (context) {
          suggestions += `\n\n**Context Consideration**: ${context}`;
        }

        return suggestions;
      };

      const personalizedSuggestions = getPersonalizedSuggestions();

      const newSuggestion: Suggestion = {
        id: Date.now(),
        category,
        partnerMood,
        occasion,
        context,
        suggestions: personalizedSuggestions,
        timestamp: new Date().toLocaleString()
      };

      setSuggestions([newSuggestion, ...suggestions]);
      toast.success("Personalized thoughtful actions generated!");
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (categoryValue: string) => {
    setCategory(categoryValue);
    
    // Set default mood based on profile if available
    if (partnerProfile.currentStressLevel) {
      setPartnerMood(`feeling ${partnerProfile.currentStressLevel}`);
    } else {
      setPartnerMood("having a regular day");
    }
    
    setOccasion("");
    setContext(`Looking for ways to show I care${partnerName !== 'your partner' ? ` for ${partnerName}` : ''}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thoughtful Actions</h2>
        <p className="text-gray-600">
          Get personalized suggestions for meaningful gestures based on {partnerName !== 'your partner' ? `${partnerName}'s` : 'your partner\'s'} current needs and mood
        </p>
        {(profiles.your.length > 0 || profiles.partner.length > 0) && (
          <p className="text-sm text-coral-600 mt-1">
            💡 Suggestions personalized using your relationship profiles
          </p>
        )}
      </div>

      <RelationshipAlerts />

      <ActionForm
        partnerMood={partnerMood}
        setPartnerMood={setPartnerMood}
        occasion={occasion}
        setOccasion={setOccasion}
        category={category}
        setCategory={setCategory}
        context={context}
        setContext={setContext}
        loading={loading}
        onGenerateSuggestions={generateSuggestions}
        partnerName={partnerName}
        partnerProfile={partnerProfile}
      />

      <QuickActions onQuickAction={handleQuickAction} />

      <SuggestionsList suggestions={suggestions} />
    </div>
  );
};

export default ThoughtfulActions;
