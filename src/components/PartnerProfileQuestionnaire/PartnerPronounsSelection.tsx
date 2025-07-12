
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCheck } from "lucide-react";

interface PartnerPronounsSelectionProps {
  selectedPronouns: string;
  onPronounsSelect: (pronouns: string) => void;
}

const PartnerPronounsSelection = ({ selectedPronouns, onPronounsSelect }: PartnerPronounsSelectionProps) => {
  const [customPronouns, setCustomPronouns] = useState(
    !["She/her", "He/him", "They/them", "Ze/zir", "Multiple sets", "Use their name", "Not sure", "Other"].includes(selectedPronouns) 
      ? selectedPronouns 
      : ""
  );

  const pronounsOptions = [
    "She/her", "He/him", "They/them", "Ze/zir", "Multiple sets", "Use their name", "Not sure", "Other"
  ];

  const handleOptionSelect = (option: string) => {
    if (option === "Other") {
      onPronounsSelect(customPronouns.trim() || "Other");
    } else {
      onPronounsSelect(option);
      setCustomPronouns(""); // Clear custom input when selecting a predefined option
    }
  };

  const handleCustomChange = (value: string) => {
    setCustomPronouns(value);
    onPronounsSelect(value.trim() || "Other");
  };

  return (
    <div className="bg-white/10 rounded-lg p-2.5 space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        <Label className="text-sm font-medium text-white">
          What pronouns do they use?
        </Label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {pronounsOptions.map((pronoun) => (
          <button
            key={pronoun}
            onClick={() => handleOptionSelect(pronoun)}
            className={`p-1.5 rounded-md text-xs font-medium transition-all hover:scale-[1.01] ${
              selectedPronouns === pronoun || (pronoun === "Other" && !pronounsOptions.includes(selectedPronouns))
                ? 'questionnaire-button-selected'
                : 'questionnaire-button-secondary'
            }`}
          >
            {pronoun}
          </button>
        ))}
      </div>
      
      {/* Custom pronouns input */}
      {(selectedPronouns === "Other" || !pronounsOptions.includes(selectedPronouns)) && (
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Enter custom pronouns..."
            value={customPronouns}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 text-xs h-8"
          />
        </div>
      )}
      
      <p className="text-xs text-white/60">So RealTalk doesn't misgender them</p>
    </div>
  );
};

export default PartnerPronounsSelection;
