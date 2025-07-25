import { PartnerProfileData } from '../types';
import { getPartnerCompletedCount } from './partnerValidation';

// Calculate overall progress from 0-100%
export const calculatePartnerOverallProgress = (profileData: PartnerProfileData) => {
  // Check required fields first
  const hasRequiredName = profileData.partnerName && profileData.partnerName.trim() !== '';
  const hasRequiredPronouns = profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '';
  const requiredCompleted = (hasRequiredName ? 1 : 0) + (hasRequiredPronouns ? 1 : 0);
  
  // Count optional fields across all sections
  let optionalCompleted = 0;
  for (let section = 1; section <= 3; section++) {
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
  const optionalWeight = 50; // 50% for optional fields (8 total optional fields)
  const maxOptionalFields = 8; // 10 total - 2 required
  
  const requiredProgress = (requiredCompleted / 2) * requiredWeight;
  const optionalProgress = Math.min(optionalCompleted / maxOptionalFields, 1) * optionalWeight;
  const overallProgress = Math.min(Math.round(requiredProgress + optionalProgress), 100);
  
  console.log(`Partner Overall Progress: ${requiredCompleted}/2 required + ${optionalCompleted}/8 optional = ${overallProgress}%`);
  
  return overallProgress;
};