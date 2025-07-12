
import { ProfileData } from '../types';

export const validateSection = (section: number, profileData: ProfileData): boolean => {
  console.log(`🔍 Validating section ${section}:`, { profileData });
  
  let isValid = false;
  
  switch (section) {
    case 1: {
      // Who You Are: name, age, orientation, pronouns, gender required
      const required = ['name', 'age', 'orientation', 'pronouns', 'gender'];
      isValid = required.every(field => {
        const value = profileData[field as keyof ProfileData];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
      break;
    }
    case 2: {
      // Your Relationship: relationshipStatus required + conditional fields
      if (!profileData.relationshipStatus) {
        isValid = false;
        break;
      }
      
      const isSingle = ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);
      const hasRelationship = ['Talking to someone', 'In a relationship', 'Engaged', 'Married'].includes(profileData.relationshipStatus);
      
      if (isSingle) {
        isValid = (profileData.datingChallenges || []).length > 0;
      } else if (hasRelationship) {
        isValid = profileData.relationshipLength && 
                 (profileData.relationshipChallenges || []).length > 0 && 
                 (profileData.relationshipWorking || []).length > 0;
      } else {
        isValid = true; // For other statuses like "It's complicated"
      }
      break;
    }
    case 3: {
      // How You Operate: stressResponse and loveLanguage required
      isValid = (profileData.stressResponse || []).length > 0 && 
               (profileData.loveLanguage || []).length > 0;
      break;
    }
    case 4: {
      // Your Foundation: familyDynamics required
      isValid = (profileData.familyDynamics || []).length > 0;
      break;
    }
    default:
      isValid = true;
  }
  
  console.log(`✅ Section ${section} validation result:`, isValid);
  if (isValid) {
    console.log(`🎉 Section ${section} completed! Should auto-advance.`);
  }
  
  return isValid;
};

export const calculateProgress = (profileData: ProfileData): number => {
  let totalRequired = 0;
  let totalCompleted = 0;
  
  // Section 1: 5 required fields
  const section1Required = ['name', 'age', 'orientation', 'pronouns', 'gender'];
  const section1Completed = section1Required.filter(field => {
    const value = profileData[field as keyof ProfileData];
    return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
  }).length;
  
  totalRequired += 5;
  totalCompleted += section1Completed;
  
  // Section 2: Variable based on relationship status
  if (profileData.relationshipStatus) {
    totalRequired += 1;
    totalCompleted += 1;
    
    const isSingle = ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);
    const hasRelationship = ['Talking to someone', 'In a relationship', 'Engaged', 'Married'].includes(profileData.relationshipStatus);
    
    if (isSingle) {
      totalRequired += 1;
      if ((profileData.datingChallenges || []).length > 0) totalCompleted += 1;
    }
    
    if (hasRelationship) {
      totalRequired += 3;
      if (profileData.relationshipLength) totalCompleted += 1;
      if ((profileData.relationshipChallenges || []).length > 0) totalCompleted += 1;
      if ((profileData.relationshipWorking || []).length > 0) totalCompleted += 1;
    }
  } else {
    totalRequired += 1;
  }
  
  // Section 3: 2 required fields
  totalRequired += 2;
  if ((profileData.stressResponse || []).length > 0) totalCompleted += 1;
  if ((profileData.loveLanguage || []).length > 0) totalCompleted += 1;
  
  // Section 4: 1 required field
  totalRequired += 1;
  if ((profileData.familyDynamics || []).length > 0) totalCompleted += 1;
  
  return totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
};
