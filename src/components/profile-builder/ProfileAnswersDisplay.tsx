import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProfileAnswersDisplayProps {
  profileData: any;
  profileType: 'personal' | 'partner';
}

const ProfileAnswersDisplay = ({ profileData, profileType }: ProfileAnswersDisplayProps) => {
  // Filter out empty and metadata fields
  const filledAnswers = useMemo(() => {
    if (!profileData) return [];

    const skipFields = ['lastUpdated', 'version', 'completedAt', 'profileSource'];
    const answers: { label: string; value: string }[] = [];

    Object.entries(profileData).forEach(([key, value]) => {
      if (skipFields.includes(key)) return;
      
      // Handle arrays
      if (Array.isArray(value) && value.length > 0) {
        answers.push({
          label: formatFieldName(key),
          value: value.join(', ')
        });
      }
      // Handle non-empty strings
      else if (typeof value === 'string' && value.trim()) {
        answers.push({
          label: formatFieldName(key),
          value: value
        });
      }
    });

    return answers;
  }, [profileData]);

  if (filledAnswers.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-2">
      <div className="rounded-xl ring-1 ring-white/20 bg-gradient-to-r from-white/8 via-white/5 to-white/8 backdrop-blur-sm shadow-lg shadow-white/5">
        <Collapsible>
          <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between gap-3 text-sm text-white/90 hover:bg-white/5 transition-colors rounded-xl">
            <div className="flex items-center gap-3">
              <span className="font-medium text-white">
                {profileType === 'personal' ? 'Your Answers' : 'Partner Answers'} ({filledAnswers.length})
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-white/60 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3 pt-1">
            <div className="space-y-3 text-sm">
              {filledAnswers.map((answer, index) => (
                <div key={index} className="border-l-2 border-white/20 pl-3">
                  <div className="text-white/60 text-xs mb-1">{answer.label}</div>
                  <div className="text-white/90">{answer.value}</div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

// Helper to format field names into readable labels
const formatFieldName = (fieldName: string): string => {
  // Handle partner fields
  if (fieldName.startsWith('partner')) {
    fieldName = fieldName.replace(/^partner/, '');
  }

  // Convert camelCase to Title Case
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default ProfileAnswersDisplay;
