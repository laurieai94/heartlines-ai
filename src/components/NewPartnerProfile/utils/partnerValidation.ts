import { PartnerProfileData } from '../types';

// Partner profile validation logic utility functions
export const validatePartnerSection = (section: number, profileData: PartnerProfileData) => {
  if (section === 1) {
    // Only Section 1 has required fields: name and pronouns
    const hasName = profileData.partnerName && profileData.partnerName.trim() !== '';
    const hasPronouns = profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '';
    return hasName && hasPronouns;
  }
  // All other sections have no requirements - allow free navigation
  return true;
};

export const getPartnerRequiredCount = (section: number) => {
  if (section === 1) {
    return 2; // name and pronouns are required
  }
  return 0; // no required fields in other sections
};

export const getPartnerTotalCount = (section: number) => {
  switch (section) {
    case 1: return 5; // name, pronouns, age, orientation, gender
    case 2: return 3; // love languages, conflict style, self-awareness
    case 3: return 2; // family dynamic, attachment style
    default: return 0;
  }
};

export const getPartnerCompletedCount = (section: number, profileData: PartnerProfileData) => {
  let completed = 0;
  
  switch (section) {
    case 1:
      if (profileData.partnerName && profileData.partnerName.trim() !== '') completed++;
      if (profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '') completed++;
      if (profileData.partnerAge && profileData.partnerAge.trim() !== '') completed++;
      if (profileData.partnerOrientation && profileData.partnerOrientation.length > 0) completed++;
      if (profileData.partnerGender && profileData.partnerGender.length > 0) completed++;
      break;
      
    case 2:
      if (profileData.partnerLoveLanguages && profileData.partnerLoveLanguages.length > 0) completed++;
      if (profileData.partnerConflictStyle && profileData.partnerConflictStyle.length > 0) completed++;
      if (profileData.partnerSelfAwareness && profileData.partnerSelfAwareness.trim() !== '') completed++;
      break;
      
    case 3:
      if (profileData.partnerFamilyDynamic && profileData.partnerFamilyDynamic.length > 0) completed++;
      if (profileData.partnerAttachmentStyle && profileData.partnerAttachmentStyle.trim() !== '') completed++;
      break;
  }
  
  return completed;
};