import React from "react";
import QuestionFlow, { QuestionStep } from "@/components/QuestionFlow/QuestionFlow";
import { ProfileData } from "../types";
import NamePronounsCard from "../components/sections/WhoYouAre/NamePronounsCard";
import AgeSelectionCard from "../components/sections/WhoYouAre/AgeSelectionCard";
import GenderSelectionCard from "../components/sections/WhoYouAre/GenderSelectionCard";
import OrientationSelectionCard from "../components/sections/WhoYouAre/OrientationSelectionCard";

interface PersonalFlowProps {
  profileData: ProfileData;
  updateField: (field: any, value: any) => void;
  handleMultiSelect: (field: any, value: string) => void;
  onComplete: () => void;
  onClose: () => void;
}

const PersonalFlow: React.FC<PersonalFlowProps> = ({ profileData, updateField, handleMultiSelect, onComplete, onClose }) => {
  const steps: QuestionStep<ProfileData>[] = [
    {
      id: "name-pronouns",
      title: "Your Basics",
      validate: (d) => Boolean(d.name && d.pronouns && String(d.name).trim().length > 0 && String(d.pronouns).trim().length > 0),
      render: () => (
        <NamePronounsCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
    {
      id: "age",
      title: "Your Basics",
      validate: (d) => Boolean(d.age && d.age !== "Under 18"),
      render: () => (
        <AgeSelectionCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
    {
      id: "gender",
      title: "Your Basics",
      validate: (d) => {
        const g: any = (d as any).gender;
        if (Array.isArray(g)) return g.length > 0;
        return Boolean(g);
      },
      render: () => (
        <GenderSelectionCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
    {
      id: "orientation",
      title: "Your Basics",
      validate: (d) => {
        const o: any = (d as any).orientation;
        if (Array.isArray(o)) return o.length > 0;
        return Boolean(o);
      },
      render: () => (
        <OrientationSelectionCard profileData={profileData} updateField={updateField as any} isComplete={false} />
      ),
    },
  ];

  return (
    <QuestionFlow
      title="Tell us about you"
      steps={steps}
      data={profileData}
      stepProps={{ profileData, updateField, handleMultiSelect }}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
};

export default PersonalFlow;
