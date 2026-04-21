
// Partner profile validation logic utility functions
export const validatePartnerSection = (section: number, profileData: any) => {
  if (section === 1) {
    // Only Section 1 has required fields: name and pronouns
    const hasName = profileData.partnerName && profileData.partnerName.trim() !== '';
    const hasPronouns = profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '';
    return hasName && hasPronouns;
  }
  // All other sections have no requirements - allow free navigation
  return true;
};

export const getPartnerRequiredCount = (section: number, profileData: any) => {
  if (section === 1) {
    return 2; // name and pronouns are required
  }
  return 0; // no required fields in other sections
};

export const getPartnerTotalCount = (section: number) => {
  // Return total available fields per section for meaningful progress indicators
  switch (section) {
    case 1: return 4; // name, age, gender, pronouns
    case 2: return 3; // stress response, conflict needs, love language
    case 3: return 4; // stressors, relationship needs, conflict style, superpower
    case 4: return 3; // family background, emotions, values (removed understanding better)
    default: return 0;
  }
};

export const getPartnerCompletedCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      let count = 0;
      if (profileData.partnerName && profileData.partnerName.trim() !== '') count++;
      if (profileData.partnerAge && profileData.partnerAge.trim() !== '') count++;
      if (profileData.partnerGender && profileData.partnerGender.length > 0) count++;
      if (profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '') count++;
      return count;
    }
    case 2: {
      let count = 0;
      if (profileData.partnerStressResponse && profileData.partnerStressResponse.length > 0) count++;
      if (profileData.partnerConflictNeeds && profileData.partnerConflictNeeds.length > 0) count++;
      if (profileData.partnerLoveLanguage && profileData.partnerLoveLanguage.length > 0) count++;
      return count;
    }
    case 3: {
      let count = 0;
      if (profileData.partnerStressors && profileData.partnerStressors.trim() !== '') count++;
      if (profileData.partnerRelationshipNeeds && profileData.partnerRelationshipNeeds.length > 0) count++;
      if (profileData.partnerConflictStyle && profileData.partnerConflictStyle.trim() !== '') count++;
      if (profileData.partnerSuperpower && profileData.partnerSuperpower.trim() !== '') count++;
      return count;
    }
    case 4: {
      let count = 0;
      // Removed partnerUnderstandBetter - that field no longer exists
      if (profileData.partnerFamilyBackground && profileData.partnerFamilyBackground.length > 0) count++;
      if (profileData.partnerEmotions && profileData.partnerEmotions.length > 0) count++;
      if (profileData.partnerValues && profileData.partnerValues.length > 0) count++;
      return count;
    }
    default: return 0;
  }
};

// Calculate overall progress from 0-100%
export const calculatePartnerOverallProgress = (profileData: any) => {
  // Check required fields first
  const hasRequiredName = profileData.partnerName && profileData.partnerName.trim() !== '';
  const hasRequiredPronouns = profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '';
  const requiredCompleted = (hasRequiredName ? 1 : 0) + (hasRequiredPronouns ? 1 : 0);
  
  // Count optional fields across all sections
  let optionalCompleted = 0;
  for (let section = 1; section <= 4; section++) {
    const sectionCompleted = getPartnerCompletedCount(section, profileData);
    if (section === 1) {
      // Subtract required fields from section 1 count to avoid double counting
      optionalCompleted += Math.max(0, sectionCompleted - requiredCompleted);
    } else {
      optionalCompleted += sectionCompleted;
    }
  }
  
  // Base progress on required fields (minimum to complete) + bonus for optional fields
  const requiredWeight = 50; // 50% for completing required fields
  const optionalWeight = 50; // 50% for optional fields (12 total optional fields)
  const maxOptionalFields = 12; // 14 total - 2 required
  
  const requiredProgress = (requiredCompleted / 2) * requiredWeight;
  const optionalProgress = Math.min(optionalCompleted / maxOptionalFields, 1) * optionalWeight;
  const overallProgress = Math.min(Math.round(requiredProgress + optionalProgress), 100);
  
  return overallProgress;
};
