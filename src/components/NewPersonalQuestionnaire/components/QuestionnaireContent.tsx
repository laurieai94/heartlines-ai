import { ProfileData } from "../types";
import WhoYouAre from "./sections/WhoYouAre";
import YourRelationship from "./sections/YourRelationship";
import HowYouOperate from "./sections/HowYouOperate";
import YourFoundation from "./sections/YourFoundation";

interface QuestionnaireContentProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  currentSection: number;
  onSectionComplete?: (nextSection: number) => void;
}

const QuestionnaireContent = ({
  profileData,
  updateField,
  handleMultiSelect,
  currentSection,
  onSectionComplete
}: QuestionnaireContentProps) => {
  const handleSectionComplete = (nextSection: number) => {
    onSectionComplete?.(nextSection);
  };

  return (
    <div className="h-full overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <div className="px-4 py-8 space-y-12">
        <div data-section="1">
          <WhoYouAre 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 1}
            onSectionComplete={() => handleSectionComplete(2)}
          />
        </div>
        
        <div data-section="2">
          <YourRelationship 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 2}
            onSectionComplete={() => handleSectionComplete(3)}
          />
        </div>
        
        <div data-section="3">
          <HowYouOperate 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 3}
            onSectionComplete={() => handleSectionComplete(4)}
          />
        </div>
        
        <div data-section="4">
          <YourFoundation 
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isActive={currentSection === 4}
            onSectionComplete={() => handleSectionComplete(5)}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContent;