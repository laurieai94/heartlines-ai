import { PartnerProfileData } from '../types';

export const validatePartnerSection = (section: number, profileData: PartnerProfileData): boolean => {
  let isValid = false;
  
  switch (section) {
    case 1: {
      // The Basics: only partnerName and partnerPronouns required
      isValid = !!profileData.partnerName?.trim() && !!profileData.partnerPronouns?.trim();
      break;
    }
    case 2: {
      // How They Operate: all optional for now
      isValid = true;
      break;
    }
    case 3: {
      // Their Foundation: all optional for now  
      isValid = true;
      break;
    }
    default:
      isValid = true;
  }
  
  return isValid;
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