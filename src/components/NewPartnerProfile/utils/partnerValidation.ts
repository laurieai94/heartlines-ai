import { PartnerProfileData } from '../types';

export const validatePartnerSection = (section: number, profileData: PartnerProfileData): boolean => {
  switch (section) {
    case 1: {
      // The Basics - check if any basic field is filled
      const hasName = profileData.partnerName?.trim();
      const hasPronouns = profileData.partnerPronouns?.trim();
      const hasAge = profileData.partnerAge?.trim();
      const hasOrientation = profileData.partnerOrientation?.trim();
      const hasGender = profileData.partnerGender?.length > 0;
      return !!(hasName || hasPronouns || hasAge || hasOrientation || hasGender);
    }
    case 2: {
      // How They Operate - check if any operation field is filled
      const hasLoveLanguage = profileData.partnerLoveLanguage?.length > 0;
      const hasConflictStyle = profileData.partnerConflictStyle?.length > 0;
      const hasCommunicationResponse = profileData.partnerCommunicationResponse?.length > 0;
      const hasSelfAwareness = profileData.partnerSelfAwareness?.trim();
      return !!(hasLoveLanguage || hasConflictStyle || hasCommunicationResponse || hasSelfAwareness);
    }
    case 3: {
      // Their Foundation - check if any foundation field is filled
      const hasHeartbreakBetrayal = profileData.partnerHeartbreakBetrayal?.length > 0;
      const hasFamilyStructure = profileData.partnerFamilyStructure?.length > 0;
      const hasAttachmentStyle = profileData.partnerAttachmentStyle?.trim();
      return !!(hasHeartbreakBetrayal || hasFamilyStructure || hasAttachmentStyle);
    }
    default:
      return false;
  }
};

export const calculatePartnerProgress = (profileData: PartnerProfileData): number => {
  let totalFields = 0;
  let completedFields = 0;
  
  // Count all possible fields
  const allFields = [
    'partnerName', 'partnerPronouns', 'partnerAge', 'partnerOrientation', 'partnerGender',
    'partnerLoveLanguage', 'partnerConflictStyle', 'partnerSelfAwareness',
    'partnerFamilyStructure', 'partnerAttachmentStyle'
  ];
  
  allFields.forEach(field => {
    totalFields += 1;
    const value = profileData[field as keyof PartnerProfileData];
    
    if (Array.isArray(value)) {
      if (value.length > 0) completedFields += 1;
    } else if (typeof value === 'string') {
      if (value.trim() !== '') completedFields += 1;
    }
  });
  
  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};