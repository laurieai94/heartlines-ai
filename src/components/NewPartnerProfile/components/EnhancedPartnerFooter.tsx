import { PartnerProfileData } from "../types";

interface EnhancedPartnerFooterProps {
  profileData: PartnerProfileData;
  onComplete: () => void;
  autoCompleteEnabled?: boolean;
}

const EnhancedPartnerFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false
}: EnhancedPartnerFooterProps) => {
  
  const getSectionName = (section: number) => {
    const names = {
      1: "Who They Are",
      2: "How They Operate", 
      3: "Their Foundation"
    };
    return names[section as keyof typeof names] || "";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-6">
      {/* Section Navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-8">
          {[1, 2, 3].map((section, index) => (
            <div key={section} className="flex items-center">
              <span className="text-white/70 text-sm font-medium">
                {getSectionName(section)}
              </span>
              {index < 2 && (
                <div className="w-8 h-px bg-white/20 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status Message */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white/90 text-sm font-medium">
            AI relationship coach Kai is waiting
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPartnerFooter;