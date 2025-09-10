import React from "react";
import QuestionFlow, { QuestionStep } from "@/components/QuestionFlow/QuestionFlow";
import { PartnerProfileData } from "../types";
import PartnerNamePronounsCard from "../components/questions/PartnerNamePronounsCard";
import PartnerAgeCard from "../components/questions/PartnerAgeCard";
import PartnerOrientationCard from "../components/questions/PartnerOrientationCard";
import PartnerGenderCard from "../components/questions/PartnerGenderCard";

interface PartnerFlowProps {
  profileData: PartnerProfileData;
  updateField: (field: any, value: any) => void;
  handleMultiSelect: (field: any, value: string) => void;
  onComplete: (skipPopup?: boolean) => void;
  onClose: () => void;
}

const PartnerFlow: React.FC<PartnerFlowProps> = ({ profileData, updateField, handleMultiSelect, onComplete, onClose }) => {
  const steps: QuestionStep<PartnerProfileData>[] = [
    {
      id: "partner-name-pronouns",
      title: "About your person",
      validate: (d) => Boolean(d.partnerName && d.partnerPronouns && String(d.partnerName).trim().length > 0 && String(d.partnerPronouns).trim().length > 0),
      render: () => (
        <PartnerNamePronounsCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
    {
      id: "partner-age",
      title: "About your person",
      validate: (d) => Boolean(d.partnerAge && d.partnerAge !== "Under 18"),
      render: () => (
        <PartnerAgeCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
    {
      id: "partner-orientation",
      title: "About your person",
      validate: (d) => Boolean(d.partnerOrientation && String(d.partnerOrientation).trim().length > 0),
      render: () => (
        <PartnerOrientationCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
    {
      id: "partner-gender",
      title: "About your person",
      validate: (d) => Array.isArray(d.partnerGender) ? d.partnerGender.length > 0 : Boolean(d.partnerGender),
      render: () => (
        <PartnerGenderCard profileData={profileData} handleMultiSelect={handleMultiSelect as any} isComplete={false} />
      ),
    },
  ];

  return (
    <QuestionFlow
      title="Tell us about your person"
      steps={steps}
      data={profileData}
      stepProps={{ profileData, updateField, handleMultiSelect }}
      onComplete={() => onComplete(false)}
      onClose={onClose}
    />
  );
};

export default PartnerFlow;
