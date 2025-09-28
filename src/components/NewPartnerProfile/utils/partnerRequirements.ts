import { PartnerProfileData } from '@/hooks/usePartnerProfileData';

export const getTotalPartnerRequiredFieldsCount = (): number => {
  return 4; // partnerName, partnerPronouns, partnerLoveLanguage, partnerAttachmentStyle
};

export const getCompletedPartnerRequiredFieldsCount = (profileData: PartnerProfileData): number => {
  let completedCount = 0;
  
  // Check required fields based on partner validation logic
  if (profileData.partnerName?.trim() !== '') completedCount++;
  if (profileData.partnerPronouns?.trim() !== '') completedCount++;
  if (profileData.partnerLoveLanguage?.length > 0) completedCount++;
  if (profileData.partnerAttachmentStyle?.trim() !== '') completedCount++;
  
  return completedCount;
};

export const isPartnerProfileComplete = (profileData: PartnerProfileData): boolean => {
  const completedFields = getCompletedPartnerRequiredFieldsCount(profileData);
  const totalFields = getTotalPartnerRequiredFieldsCount();
  return completedFields === totalFields;
};