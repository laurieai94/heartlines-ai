import React from 'react';

interface PersonalQuestionWrapperProps {
  children: React.ReactNode;
  onNext: () => void;
}

// Simple wrapper that provides a mock flow context for question cards
const PersonalQuestionWrapper = ({ children, onNext }: PersonalQuestionWrapperProps) => {
  // Create a mock flow context
  const mockFlowContext = {
    profileData: {},
    updateField: () => {},
    handleMultiSelect: () => {},
    onComplete: () => {},
    goToNext: () => onNext(),
    scrollHelper: () => {}
  };

  return (
    <div className="personal-question-wrapper">
      {React.cloneElement(children as React.ReactElement, {
        onSectionComplete: onNext
      })}
    </div>
  );
};

export default PersonalQuestionWrapper;