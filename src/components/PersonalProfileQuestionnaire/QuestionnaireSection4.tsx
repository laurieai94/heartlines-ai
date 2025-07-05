
import FamilySituationQuestion from "./FamilySituationQuestion";
import FamilyEmotionsQuestion from "./FamilyEmotionsQuestion";
import FamilyConflictQuestion from "./FamilyConflictQuestion";
import FamilyLoveQuestion from "./FamilyLoveQuestion";

interface QuestionnaireSection4Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection4 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection4Props) => {
  if (!isReady) return null;

  const handleSingleSelect = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleOtherText = (field: string, value: string) => {
    updateField(`${field}Other`, value);
  };

  return (
    <div className="space-y-1.5">
      <FamilySituationQuestion
        selectedValue={profileData.familySituation || ''}
        otherText={profileData.familySituationOther || ''}
        onSelect={(value) => handleSingleSelect('familySituation', value)}
        onOtherTextChange={(value) => handleOtherText('familySituation', value)}
      />

      <FamilyEmotionsQuestion
        selectedValues={profileData.familyEmotions || []}
        otherText={profileData.familyEmotionsOther || ''}
        onToggle={(value) => handleMultiSelect('familyEmotions', value)}
        onOtherTextChange={(value) => handleOtherText('familyEmotions', value)}
      />

      <FamilyConflictQuestion
        selectedValues={profileData.familyConflict || []}
        otherText={profileData.familyConflictOther || ''}
        onToggle={(value) => handleMultiSelect('familyConflict', value)}
        onOtherTextChange={(value) => handleOtherText('familyConflict', value)}
      />

      <FamilyLoveQuestion
        selectedValues={profileData.familyLove || []}
        otherText={profileData.familyLoveOther || ''}
        onToggle={(value) => handleMultiSelect('familyLove', value)}
        onOtherTextChange={(value) => handleOtherText('familyLove', value)}
      />
    </div>
  );
};

export default QuestionnaireSection4;
