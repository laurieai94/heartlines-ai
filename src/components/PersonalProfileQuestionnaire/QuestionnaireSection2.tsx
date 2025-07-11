
import RelationshipStatusSelector from "./RelationshipStatusSelector";
import DatingQuestions from "./DatingQuestions";
import RelationshipLengthSelector from "./RelationshipLengthSelector";
import RelationshipQuestions from "./RelationshipQuestions";

interface QuestionnaireSection2Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection2 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection2Props) => {
  if (!isReady) return null;

  // Check if user should see relationship challenges (not single/casual dating)
  const showRelationshipChallenges = profileData.relationshipStatus && 
    ['Talking to someone', 'In a relationship', 'Engaged', 'Married', 'Separated/Divorced', 'It\'s complicated'].includes(profileData.relationshipStatus);
  
  // Check if user is in a defined relationship that has a length (not casual/complicated)
  const hasRelationshipLength = profileData.relationshipStatus && 
    ['In a relationship', 'Engaged', 'Married', 'Separated/Divorced'].includes(profileData.relationshipStatus);

  // Check if user is single/dating (trigger for additional questions)
  const isSingleOrDating = profileData.relationshipStatus && 
    ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);

  return (
    <div className="space-y-1.5">
      {/* Relationship Status - Main Question */}
      <RelationshipStatusSelector 
        profileData={profileData}
        updateField={updateField}
      />

      {/* Conditional Dating Questions for Single/Dating Users */}
      {isSingleOrDating && (
        <DatingQuestions 
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
        />
      )}

      {/* Conditional Relationship Length */}
      {hasRelationshipLength && (
        <RelationshipLengthSelector 
          profileData={profileData}
          updateField={updateField}
        />
      )}

      {/* Conditional Relationship Challenges */}
      {showRelationshipChallenges && (
        <RelationshipQuestions 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
        />
      )}
    </div>
  );
};

export default QuestionnaireSection2;
