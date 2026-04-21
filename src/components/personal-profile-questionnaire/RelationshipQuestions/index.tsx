
import RelationshipChallenges from "./RelationshipChallenges";
import RelationshipOptionalSection from "./RelationshipOptionalSection";
import { useRelationshipQuestions } from "./useRelationshipQuestions";

interface RelationshipQuestionsProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  relationshipStatus?: string;
}

const RelationshipQuestions = ({ profileData, updateField, handleMultiSelect, relationshipStatus }: RelationshipQuestionsProps) => {
  const {
    isExpanded,
    setIsExpanded,
    relationshipLengthConfig,
    workingWellConfig
  } = useRelationshipQuestions(relationshipStatus);

  return (
    <>
      {/* Main Relationship Challenges Question */}
      <RelationshipChallenges
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      {/* Optional Dive Deeper Section */}
      <RelationshipOptionalSection
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        relationshipLengthConfig={relationshipLengthConfig}
        workingWellConfig={workingWellConfig}
        profileData={profileData}
        updateField={updateField}
        handleMultiSelect={handleMultiSelect}
      />
    </>
  );
};

export default RelationshipQuestions;
