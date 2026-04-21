import { PartnerProfileData } from '../types';
import { profileCompletionCache } from '@/utils/calculationCache';

export const validatePartnerSection = (section: number, profileData: PartnerProfileData): boolean => {
  switch (section) {
    case 1: {
      // The Basics - require name AND pronouns
      const hasName = profileData.partnerName?.trim() !== '';
      const hasPronouns = profileData.partnerPronouns?.trim() !== '';
      return hasName && hasPronouns;
    }
    case 2: {
      // How They Operate - require love language
      const hasLoveLanguage = profileData.partnerLoveLanguage?.length > 0;
      return hasLoveLanguage;
    }
    case 3: {
      // Their Foundation - require attachment style
      const hasAttachmentStyle = profileData.partnerAttachmentStyle?.trim() !== '';
      return hasAttachmentStyle;
    }
    default:
      return false;
  }
};

export const calculatePartnerProgress = (profileData: PartnerProfileData): number => {
  // Use global cache for expensive calculation
  return profileCompletionCache.get('partner', profileData, () => {
    let totalFields = 0;
    let completedFields = 0;
    
    // Count all possible fields
    const allFields = [
      'partnerName', 'partnerPronouns', 'partnerAge', 'partnerOrientation', 'partnerGender',
      'partnerLoveLanguage', 'partnerConflictStyle', 'partnerCommunicationResponse', 'partnerSelfAwareness',
      'partnerHeartbreakBetrayal', 'partnerFamilyStructure', 'partnerAttachmentStyle'
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
  });
};