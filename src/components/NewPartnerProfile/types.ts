export interface PartnerProfileData {
  // Section 1: The Basics (required: name, pronouns)
  partnerName?: string;
  partnerPronouns?: string;
  partnerAge?: string;
  partnerOrientation?: string[];
  partnerOrientationSelfDescribe?: string;
  partnerGender?: string[];
  partnerGenderSelfDescribe?: string;
  
  // Section 2: How They Operate
  partnerLoveLanguages?: string[];
  partnerConflictStyle?: string[];
  partnerSelfAwareness?: string;
  
  // Section 3: Their Foundation
  partnerFamilyDynamic?: string[];
  partnerAttachmentStyle?: string;
  
  // Metadata
  completedAt?: string;
  profileSource?: string;
}

export interface PartnerQuestionCardProps {
  profileData: PartnerProfileData;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}