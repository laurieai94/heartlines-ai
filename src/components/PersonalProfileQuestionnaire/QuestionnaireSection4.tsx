
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home, Heart, Users, MessageCircle } from "lucide-react";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection4Props) => {
  if (!isReady) return null;

  const familySituationOptions = [
    'Parents married/together - solid, healthy relationship',
    'Parents married/together - typical ups and downs',
    'Parents married/together - constant fighting but stayed',
    'Parents divorced and stayed divorced',
    'Parents divorced, one/both remarried someone else',
    'Parents divorced but got back together (wild, I know)',
    'Single parent household',
    'Raised by grandparents/other family',
    'Other (please specify)'
  ];

  const familyEmotionsOptions = [
    'All emotions were totally normal and talked about',
    'Happy feelings great, sad/angry ones shut down',
    'We just weren\'t an emotions family',
    'There were "good" and "bad" emotions',
    'Someone was always having a meltdown',
    'I became the family therapist way too young',
    'Showing feelings meant getting judged',
    'Emotional vibe was completely unpredictable',
    'Other (please specify)'
  ];

  const familyConflictOptions = [
    'Actually talked through problems like adults',
    'Someone always gave in to avoid drama',
    'Conflict was avoided at all costs',
    'Screaming matches were just another Tuesday',
    'Every argument had a winner and loser',
    'Silent treatment and passive-aggressive vibes',
    'I was constantly playing peacekeeper',
    'Arguments came out of nowhere and felt scary',
    'Other (please specify)'
  ];

  const familyLoveOptions = [
    'Lots of "I love yous" and physical affection',
    'Love through doing stuff - cooking, helping out',
    'Love through spending quality time together',
    'Love through gifts and buying things',
    'Love felt conditional - had to earn it',
    'Love was hot and cold',
    'Love felt overwhelming or suffocating',
    'Love was assumed but rarely shown',
    'Other (please specify)'
  ];

  const handleSingleSelect = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleOtherText = (field: string, value: string) => {
    updateField(`${field}Other`, value);
  };

  return (
    <div className="space-y-2">
      {/* Family Situation */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-white">
            What was your family situation like growing up? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <Home className="w-3 h-3 text-green-300" />
            <span>Your family dynamics basically programmed your relationship patterns</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {familySituationOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSingleSelect('familySituation', option)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                profileData.familySituation === option
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {profileData.familySituation === 'Other (please specify)' && (
          <div className="mt-2">
            <Textarea
              value={profileData.familySituationOther || ''}
              onChange={(e) => handleOtherText('familySituation', e.target.value)}
              placeholder="Please specify..."
              className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-3 min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Family Emotions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-white">
            How did your family handle emotions and feelings? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <Heart className="w-3 h-3 text-pink-300" />
            <span>This shapes whether you feel safe being vulnerable</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {familyEmotionsOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleMultiSelect('familyEmotions', option)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.familyEmotions || []).includes(option)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {(profileData.familyEmotions || []).includes('Other (please specify)') && (
          <div className="mt-2">
            <Textarea
              value={profileData.familyEmotionsOther || ''}
              onChange={(e) => handleOtherText('familyEmotions', e.target.value)}
              placeholder="Please specify..."
              className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-3 min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Family Conflict */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-white">
            When your family had conflict, what usually went down? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <MessageCircle className="w-3 h-3 text-orange-300" />
            <span>You learned conflict resolution patterns by observing this</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {familyConflictOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleMultiSelect('familyConflict', option)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.familyConflict || []).includes(option)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {(profileData.familyConflict || []).includes('Other (please specify)') && (
          <div className="mt-2">
            <Textarea
              value={profileData.familyConflictOther || ''}
              onChange={(e) => handleOtherText('familyConflict', e.target.value)}
              placeholder="Please specify..."
              className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-3 min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Family Love */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-2">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-white">
            How was love typically shown in your family? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1 font-normal">
            <Users className="w-3 h-3 text-blue-300" />
            <span>This is your blueprint for giving and receiving love</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {familyLoveOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleMultiSelect('familyLove', option)}
              className={`w-full p-2 rounded-lg text-left text-xs font-medium transition-all duration-200 hover:scale-[1.01] ${
                (profileData.familyLove || []).includes(option)
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {(profileData.familyLove || []).includes('Other (please specify)') && (
          <div className="mt-2">
            <Textarea
              value={profileData.familyLoveOther || ''}
              onChange={(e) => handleOtherText('familyLove', e.target.value)}
              placeholder="Please specify..."
              className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-3 min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
