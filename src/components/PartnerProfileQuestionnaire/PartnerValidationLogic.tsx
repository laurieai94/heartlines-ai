
// Partner profile validation logic utility functions
export const validatePartnerSection = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      // Partner basics - name is required, others optional
      return profileData.partnerName && profileData.partnerName.trim() !== '';
    }
    case 2: {
      // Partner situation - at least one field should be filled
      const fields = ['partnerRelationshipStatus', 'partnerGoals', 'partnerChallenges'];
      return fields.some(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    case 3: {
      // Partner style - at least one field should be filled
      const fields = ['partnerCommunicationStyle', 'partnerConflictStyle', 'partnerLoveLanguage', 'partnerAttachmentStyle'];
      return fields.some(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    case 4: {
      // Partner background - at least one field should be filled
      const fields = ['partnerFamilyBackground', 'partnerUpbringing', 'partnerValues'];
      return fields.some(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    default:
      return true;
  }
};

export const getPartnerRequiredCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: return 1; // Just name required
    case 2: return 1; // At least one situation field
    case 3: return 1; // At least one style field
    case 4: return 1; // At least one background field
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
      return Math.min(count, 1); // Show as 1/1 when name is filled
    }
    case 2: {
      let count = 0;
      if (profileData.partnerRelationshipStatus && profileData.partnerRelationshipStatus.trim() !== '') count++;
      if (profileData.partnerGoals && profileData.partnerGoals.length > 0) count++;
      if (profileData.partnerChallenges && profileData.partnerChallenges.length > 0) count++;
      return Math.min(count, 1); // Show as 1/1 when at least one is filled
    }
    case 3: {
      let count = 0;
      if (profileData.partnerCommunicationStyle && profileData.partnerCommunicationStyle.length > 0) count++;
      if (profileData.partnerConflictStyle && profileData.partnerConflictStyle.trim() !== '') count++;
      if (profileData.partnerLoveLanguage && profileData.partnerLoveLanguage.length > 0) count++;
      if (profileData.partnerAttachmentStyle && profileData.partnerAttachmentStyle.trim() !== '') count++;
      return Math.min(count, 1); // Show as 1/1 when at least one is filled
    }
    case 4: {
      let count = 0;
      if (profileData.partnerFamilyBackground && profileData.partnerFamilyBackground.length > 0) count++;
      if (profileData.partnerUpbringing && profileData.partnerUpbringing.trim() !== '') count++;
      if (profileData.partnerValues && profileData.partnerValues.length > 0) count++;
      return Math.min(count, 1); // Show as 1/1 when at least one is filled
    }
    default: return 0;
  }
};

// Calculate overall progress from 0-100%
export const calculatePartnerOverallProgress = (profileData: any) => {
  let totalRequired = 0;
  let totalCompleted = 0;
  
  // Calculate total required and completed across all sections
  for (let section = 1; section <= 4; section++) {
    const required = getPartnerRequiredCount(section, profileData);
    const completed = getPartnerCompletedCount(section, profileData);
    
    totalRequired += required;
    totalCompleted += completed;
    
    // Add debugging to track progress calculation
    console.log(`Partner Section ${section}: ${completed}/${required} (${Math.round((completed/required)*100)}%)`);
  }
  
  const overallProgress = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
  console.log(`Partner Overall Progress: ${totalCompleted}/${totalRequired} = ${overallProgress}%`);
  
  // Return percentage (0-100)
  return overallProgress;
};
