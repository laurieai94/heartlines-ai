
import { useRef, useEffect } from "react";
import PartnerQuestionnaireSection1 from "./PartnerQuestionnaireSection1";
import PartnerQuestionnaireSection2 from "./PartnerQuestionnaireSection2";
import PartnerQuestionnaireSection3 from "./PartnerQuestionnaireSection3";
import PartnerQuestionnaireSection4 from "./PartnerQuestionnaireSection4";
import { Sparkles } from "lucide-react";
import { BRAND } from "@/branding";

interface PartnerQuestionnaireContentProps {
  currentSection: number;
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  sectionReadiness: { [key: number]: boolean };
}

const PartnerQuestionnaireContent = ({
  currentSection,
  profileData,
  updateField,
  handleMultiSelect,
  sectionReadiness
}: PartnerQuestionnaireContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to first question when section changes
  const scrollToFirstQuestion = () => {
    if (contentRef.current) {
      const firstQuestionCard = contentRef.current.querySelector('[data-question-card]');
      if (firstQuestionCard) {
        firstQuestionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Trigger scroll when section changes
  useEffect(() => {
    scrollToFirstQuestion();
  }, [currentSection]);

  return (
    <div 
      ref={contentRef}
      className="flex-1 overflow-y-auto bg-black/5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
    >
      <div className="px-1.5 pt-2 pb-1 md:pt-6 lg:pt-8">
        {/* Prominent Opening Note - only show on section 1 and hide on small screens */}
        {currentSection === 1 && (
          <div className="hidden sm:block bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-2.5 mb-1.5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10 animate-pulse"></div>
            <div className="relative flex items-start gap-2.5">
              <div className="w-5 h-5 bg-gradient-to-br from-rose-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-sm text-white leading-relaxed">
                <div className="font-semibold mb-0.5">No pressure, no guessing required.</div>
                <div className="text-white/90">
                  Share what you know <span className="text-white/70">•</span> Skip what you don't
                </div>
                <div className="text-white/80 text-xs mt-1">
                  {BRAND.name} works with whatever you've got ✨
                </div>
              </div>
            </div>
          </div>
        )}

        <PartnerQuestionnaireSection1 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[1] && currentSection === 1}
        />
        <PartnerQuestionnaireSection2 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[2] && currentSection === 2}
        />
        <PartnerQuestionnaireSection3 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[3] && currentSection === 3}
        />
        <PartnerQuestionnaireSection4 
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
          isReady={sectionReadiness[4] && currentSection === 4}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireContent;
