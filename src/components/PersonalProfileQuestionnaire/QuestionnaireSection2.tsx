
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

  const relationshipStatus = profileData.relationshipStatus;
  const isSingle = relationshipStatus && ['On the apps', 'Single & actively dating', 'Single & taking a break', 'Single & taking a break from dating', 'Casually seeing people'].includes(relationshipStatus);
  const hasRelationship = relationshipStatus && ['Talking to someone', 'Talking stage', 'In a relationship', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(relationshipStatus);

  return (
    <div className="space-y-4">
      <RelationshipStatusSelector 
        profileData={profileData}
        updateField={updateField}
      />

      {isSingle && (
        <DatingQuestions 
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
        />
      )}

      {hasRelationship && (
        <>
          <RelationshipLengthSelector 
            profileData={profileData}
            updateField={updateField}
          />
          
          <RelationshipQuestions 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            relationshipStatus={relationshipStatus}
          />
        </>
      )}

    </div>
  );
};

export default QuestionnaireSection2;
