
import { useState } from "react";
import NewPersonalQuestionnaire from "./NewPersonalQuestionnaire";

interface PersonalProfileQuestionnaireProps {
  onComplete: (profileData: any) => void;
  onClose: () => void;
  isModal?: boolean;
}

const PersonalProfileQuestionnaire = ({ onComplete, onClose, isModal = false }: PersonalProfileQuestionnaireProps) => {
  return (
    <NewPersonalQuestionnaire
      onComplete={onComplete}
      onClose={onClose}
      isModal={isModal}
    />
  );
};

export default PersonalProfileQuestionnaire;
