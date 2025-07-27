import { PartnerProfileData } from '../types';

export const validatePartnerSection = (section: number, profileData: PartnerProfileData): boolean => {
  // All sections are now optional - no requirements
  return true;
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