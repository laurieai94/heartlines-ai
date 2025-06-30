
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
    'Supportive/stable', 'Loving but chaotic', 'Emotionally distant',
    'High conflict/unsafe', 'Overprotective', 'Avoided conversations',
    'Complex/unpacking', 'Prefer not to share'
  ];

  const parentConflictOptions = [
    'Talked calmly', 'Avoided entirely', 'Fought intensely',
    'One gave in', 'Silent treatment', 'Brought others in',
    'Resolved quickly', 'Don\'t remember', 'Prefer not to share'
  ];

  const loveMessagesOptions = [
    'Love requires sacrifice', 'Independence more important', 'Conflict means failure',
    'Earn love through performance', 'Love should be easy', 'Trust is dangerous',
    'Never go to bed angry', 'Family first', 'Still discovering'
  ];

  const loveInfluencesOptions = [
    'Parents\' relationship', 'Friends/peers', 'Culture/religion',
    'Books/media', 'Past experiences', 'Therapy/development',
    'Trauma', 'Creating own blueprint'
  ];

  const mentalHealthOptions = [
    'Good space', 'Managing anxiety/depression', 'Working through trauma',
    'Major life stress', 'In therapy', 'Prefer not to share'
  ];

  const growthAreasOptions = [
    'Self-awareness', 'Communication/conflict resolution', 'Boundaries',
    'Trust/intimacy', 'Breaking patterns', 'Healing hurt',
    'Understanding attachment', 'Creating desired relationship'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Your Foundation</h3>
        <p className="text-gray-600">These optional questions help provide deeper, more personalized insights</p>
        <p className="text-xs text-blue-600">✓ This section is optional - answer what feels comfortable</p>
        <p className="text-xs text-green-600">✓ Your answers are automatically saved</p>
      </div>

      {/* Family Dynamics */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Family dynamics growing up
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {familyDynamicsOptions.map((dynamic) => (
            <button
              key={dynamic}
              onClick={() => handleMultiSelect('familyDynamics', dynamic)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.familyDynamics || []).includes(dynamic)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {dynamic}
            </button>
          ))}
        </div>
      </div>

      {/* Parent Conflict Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          How parents handled conflict
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {parentConflictOptions.map((style) => (
            <button
              key={style}
              onClick={() => handleMultiSelect('parentConflictStyle', style)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.parentConflictStyle || []).includes(style)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Love Messages */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Messages about love received
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {loveMessagesOptions.map((message) => (
            <button
              key={message}
              onClick={() => handleMultiSelect('loveMessages', message)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.loveMessages || []).includes(message)
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      {/* Love Influences */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What influenced love ideas
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {loveInfluencesOptions.map((influence) => (
            <button
              key={influence}
              onClick={() => handleMultiSelect('loveInfluences', influence)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.loveInfluences || []).includes(influence)
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {influence}
            </button>
          ))}
        </div>
      </div>

      {/* Mental Health Context */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Current mental health context
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {mentalHealthOptions.map((context) => (
            <button
              key={context}
              onClick={() => updateField('mentalHealthContext', context)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                profileData.mentalHealthContext === context
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              {context}
            </button>
          ))}
        </div>
      </div>

      {/* Growth Areas */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          What hoping to grow in
        </Label>
        <p className="text-xs text-gray-500">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {growthAreasOptions.map((area) => (
            <button
              key={area}
              onClick={() => handleMultiSelect('growthAreas', area)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (profileData.growthAreas || []).includes(area)
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">🌟 You're Ready to Transform Your Relationships!</h4>
          <p className="text-sm text-gray-700">
            Your profile creates the foundation for personalized coaching with Kai. 
            Every conversation will be tailored to your unique patterns, needs, and goals.
          </p>
          <p className="text-xs text-gray-500">
            You can always update your profile as you grow and learn more about yourself
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection4;
