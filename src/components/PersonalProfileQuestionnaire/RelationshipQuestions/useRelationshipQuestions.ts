
import { useState } from "react";
import { getRelationshipLengthConfig, getWorkingWellConfig } from "./relationshipConfig";

export const useRelationshipQuestions = (relationshipStatus?: string) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const relationshipLengthConfig = getRelationshipLengthConfig(relationshipStatus);
  const workingWellConfig = getWorkingWellConfig(relationshipStatus);

  return {
    isExpanded,
    setIsExpanded,
    relationshipLengthConfig,
    workingWellConfig
  };
};
