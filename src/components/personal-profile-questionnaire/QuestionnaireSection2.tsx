
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
  const isSingle = relationshipStatus && ['On the apps', 'Single & taking a break from dating', 'Single & living my best life', 'Recently single', 'Casually seeing people'].includes(relationshipStatus);
  const hasRelationship = relationshipStatus && ['Talking stage', 'Soft launching someone new', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(relationshipStatus);

  return (
    <div className="space-y-2.5">
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
