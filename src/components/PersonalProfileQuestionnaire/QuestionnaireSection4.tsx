
import { Label } from "@/components/ui/label";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection4Props) => {
  if (!isReady) return null;

  const familyDynamicsOptions = [
    'Supportive/stable', 'Loving but chaotic', 'Emotionally distant', 'High conflict/unsafe',
    'Overprotective', 'Avoided conversations', 'Complex/unpacking', 'Prefer not to share'
  ];

  const parentConflictOptions = [
    'Talked calmly', 'Avoided entirely', 'Fought intensely', 'One gave in',
    'Silent treatment', 'Brought others in', 'Resolved quickly', 'Don\'t remember', 'Prefer not to share'
  ];

  const loveMessagesOptions = [
    'Love requires sacrifice', 'Independence more important', 'Conflict means failure',
    'Earn love through performance', 'Love should be easy', 'Trust is dangerous',
    'Never go to bed angry', 'Family first', 'Still discovering'
  ];

  const loveInfluencesOptions = [
    'Parents\' relationship', 'Friends/peers', 'Culture/religion', 'Books/media',
    'Past experiences', 'Therapy/development', 'Trauma', 'Creating own blueprint'
  ];

  const mentalHealthOptions = [
    'Good space', 'Managing anxiety/depression', 'Working through trauma',
    'Major life stress', 'In therapy', 'Prefer not to share'
  ];

  const growthAreasOptions = [
    'Self-awareness', 'Communication/conflict resolution', 'Boundaries', 'Trust/intimacy',
    'Breaking patterns', 'Healing hurt', 'Understanding attachment', 'Creating desired relationship'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Your Foundation</h3>
        <p className="text-gray-600 text-lg">
          These details are <strong>completely optional</strong> but help unlock deeper insights
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-full px-4 py-2 mx-auto w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Your answers are automatically saved
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <p className="text-purple-700 font-medium">
            💡 Skip any questions that don't feel right to answer - you can always come back later
          </p>
        </div>
      </div>

      {/* Family Dynamics */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          Family dynamics growing up <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {familyDynamicsOptions.map((dynamic) => (
            <button
              key={dynamic}
              onClick={() => handleMultiSelect('familyDynamics', dynamic)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.familyDynamics || []).includes(dynamic)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {dynamic}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Family patterns often influence how we approach relationships as adults
        </p>
      </div>

      {/* Parent Conflict Style */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          How parents handled conflict <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {parentConflictOptions.map((style) => (
            <button
              key={style}
              onClick={() => handleMultiSelect('parentConflictStyle', style)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.parentConflictStyle || []).includes(style)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> The conflict styles we observe growing up often become our default approaches
        </p>
      </div>

      {/* Love Messages */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          Messages about love received <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loveMessagesOptions.map((message) => (
            <button
              key={message}
              onClick={() => handleMultiSelect('loveMessages', message)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.loveMessages || []).includes(message)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50 shadow-sm hover:shadow-md'
              }`}
            >
              {message}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Early messages about love shape our expectations and relationship patterns
        </p>
      </div>

      {/* Love Influences */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          What influenced love ideas <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loveInfluencesOptions.map((influence) => (
            <button
              key={influence}
              onClick={() => handleMultiSelect('loveInfluences', influence)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.loveInfluences || []).includes(influence)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md'
              }`}
            >
              {influence}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Understanding what shaped your relationship beliefs helps us provide more relevant guidance
        </p>
      </div>

      {/* Mental Health Context */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          Current mental health context <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mentalHealthOptions.map((context) => (
            <button
              key={context}
              onClick={() => updateField('mentalHealthContext', context)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                profileData.mentalHealthContext === context
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-green-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 shadow-sm hover:shadow-md'
              }`}
            >
              {context}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Mental health affects relationships, and we want to provide appropriate support
        </p>
      </div>

      {/* Growth Areas */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-700">
          What hoping to grow in <span className="text-gray-500 font-normal">(Optional)</span>
        </Label>
        <p className="text-sm text-purple-600 font-medium">✨ Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {growthAreasOptions.map((area) => (
            <button
              key={area}
              onClick={() => handleMultiSelect('growthAreas', area)}
              className={`p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left hover:scale-105 ${
                (profileData.growthAreas || []).includes(area)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 shadow-sm hover:shadow-md'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          💡 <strong>Why we ask:</strong> Knowing your growth goals helps us prioritize the most relevant coaching topics
        </p>
      </div>

      {/* Final Encouragement */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-100">
        <div className="text-3xl mb-3">🌟</div>
        <p className="text-xl font-bold text-purple-900 mb-2">
          You're all set!
        </p>
        <p className="text-purple-700 text-lg mb-4">
          Thanks for sharing so thoughtfully. This foundation will help RealTalk provide truly personalized guidance.
        </p>
        <p className="text-purple-600 text-sm">
          Remember: You can always update your profile as you learn and grow
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
