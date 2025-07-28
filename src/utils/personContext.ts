import { ProfileData, DemographicsData, PersonContext, FamilyBackground } from "@/types/AIInsights";

export class PersonContextBuilder {
  // Helper function to normalize data to arrays
  private static normalizeToArray(value: any): any[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  }

  // Helper function to map partner questionnaire fields to standard field names
  private static mapPartnerQuestionnaireFields(partnerData: any): any {
    const mapped = { ...partnerData };
    
    // Map partner questionnaire fields to standard field names
    if (partnerData.partnerName) mapped.name = partnerData.partnerName;
    if (partnerData.partnerAge) mapped.age = partnerData.partnerAge;
    if (partnerData.partnerPronouns) mapped.pronouns = partnerData.partnerPronouns;
    if (partnerData.partnerCustomPronouns) mapped.customPronouns = partnerData.partnerCustomPronouns;
    if (partnerData.partnerGender) mapped.genderIdentity = partnerData.partnerGender;
    if (partnerData.partnerOrientation) mapped.sexualOrientation = partnerData.partnerOrientation;
    
    // Map behavioral patterns
    if (partnerData.partnerStressResponse) mapped.stressResponse = partnerData.partnerStressResponse;
    if (partnerData.partnerConflictNeeds) mapped.conflictStyle = partnerData.partnerConflictNeeds;
    if (partnerData.partnerLoveLanguage) mapped.loveLanguages = partnerData.partnerLoveLanguage;
    if (partnerData.partnerConflictStyle) mapped.conflictStyle = partnerData.partnerConflictStyle;
    
    // Map new partner questionnaire fields
    if (partnerData.partnerCommunicationResponse) mapped.communicationResponse = partnerData.partnerCommunicationResponse;
    if (partnerData.partnerSelfAwareness) mapped.selfAwareness = partnerData.partnerSelfAwareness;
    if (partnerData.partnerHeartbreakBetrayal) mapped.heartbreakBetrayal = partnerData.partnerHeartbreakBetrayal;
    if (partnerData.partnerFamilyStructure) mapped.familyStructure = partnerData.partnerFamilyStructure;
    if (partnerData.partnerAttachmentStyle) mapped.attachmentStyle = partnerData.partnerAttachmentStyle;
    
    // Map deeper insights
    if (partnerData.partnerStressors) mapped.triggers = partnerData.partnerStressors;
    if (partnerData.partnerRelationshipNeeds) mapped.strengths = partnerData.partnerRelationshipNeeds;
    if (partnerData.partnerSuperpower) {
      mapped.strengths = mapped.strengths ? [...mapped.strengths, partnerData.partnerSuperpower] : [partnerData.partnerSuperpower];
    }
    
    // Map family background information (both old and new formats)
    const familyBackground: FamilyBackground = {};
    if (partnerData.partnerFamilyBackground) familyBackground.situation = partnerData.partnerFamilyBackground;
    if (partnerData.partnerFamilyStructure) familyBackground.situation = partnerData.partnerFamilyStructure;
    if (partnerData.partnerEmotions) familyBackground.emotions = partnerData.partnerEmotions;
    if (partnerData.partnerValues) familyBackground.dynamics = partnerData.partnerValues;
    
    if (Object.keys(familyBackground).length > 0) {
      mapped.familyBackground = familyBackground;
    }
    
    // Keep legacy field for backwards compatibility
    if (partnerData.partnerFamilyBackground) mapped.familyDynamics = partnerData.partnerFamilyBackground;
    if (partnerData.partnerFamilyStructure) mapped.familyDynamics = partnerData.partnerFamilyStructure;
    if (partnerData.partnerEmotions) mapped.attachmentStyle = partnerData.partnerEmotions;
    if (partnerData.partnerValues) mapped.whyRealTalk = partnerData.partnerValues;
    
    // Map any additional common fields
    if (partnerData.partnerEducation) mapped.education = partnerData.partnerEducation;
    if (partnerData.partnerWork) mapped.workSituation = partnerData.partnerWork;
    if (partnerData.partnerMentalHealth) mapped.mentalHealthContext = partnerData.partnerMentalHealth;
    
    console.log('Mapped partner questionnaire fields:', { original: partnerData, mapped });
    return mapped;
  }

  // Helper function to map personal questionnaire fields to standard field names
  private static mapPersonalQuestionnaireFields(personalData: any): any {
    const mapped = { ...personalData };
    
    // Map personal questionnaire fields to standard field names
    if (personalData.gender) mapped.genderIdentity = personalData.gender;
    if (personalData.orientation) mapped.sexualOrientation = personalData.orientation;
    if (personalData.conflictNeeds) mapped.conflictStyle = personalData.conflictNeeds;
    if (personalData.feelLovedWhen) mapped.loveLanguages = personalData.feelLovedWhen;
    if (personalData.stressReactions) mapped.stressResponse = personalData.stressReactions;
    if (personalData.attachmentStyles) mapped.attachmentStyle = personalData.attachmentStyles;
    
    // Map relationship context fields
    if (personalData.workingWell) mapped.strengths = personalData.workingWell;
    if (personalData.relationshipPositives) {
      mapped.strengths = mapped.strengths ? [...mapped.strengths, ...personalData.relationshipPositives] : personalData.relationshipPositives;
    }
    if (personalData.relationshipWorking) {
      mapped.strengths = mapped.strengths ? [...mapped.strengths, ...personalData.relationshipWorking] : personalData.relationshipWorking;
    }
    if (personalData.biggestChallenge) mapped.growthAreas = personalData.biggestChallenge;
    if (personalData.relationshipChallenges) {
      mapped.growthAreas = mapped.growthAreas ? [...mapped.growthAreas, ...personalData.relationshipChallenges] : personalData.relationshipChallenges;
    }
    if (personalData.motivations) mapped.whyRealTalk = personalData.motivations;
    if (personalData.relationshipInfluences) mapped.loveInfluences = personalData.relationshipInfluences;
    
    // Map new personal questionnaire fields
    if (personalData.talkingDescription) mapped.talkingDescription = personalData.talkingDescription;
    if (personalData.talkingChallenges) mapped.talkingChallenges = personalData.talkingChallenges;
    if (personalData.datingChallenges) mapped.datingChallenges = personalData.datingChallenges;
    if (personalData.separationSituation) mapped.separationSituation = personalData.separationSituation;
    if (personalData.datingReadiness) mapped.datingReadiness = personalData.datingReadiness;
    if (personalData.timeSinceLoss) mapped.timeSinceLoss = personalData.timeSinceLoss;
    if (personalData.grievingProcess) mapped.grievingProcess = personalData.grievingProcess;
    if (personalData.heartbreakBetrayal) mapped.heartbreakBetrayal = personalData.heartbreakBetrayal;
    if (personalData.familyStructure) mapped.familyStructure = personalData.familyStructure;
    
    // Map family background fields - preserve ALL family data (both old and new formats)
    const familyBackground: FamilyBackground = {};
    
    if (personalData.familySituation) {
      familyBackground.situation = [personalData.familySituation];
      // Keep legacy field for backwards compatibility
      mapped.familyDynamics = [personalData.familySituation];
    }
    
    // Map new familyStructure field
    if (personalData.familyStructure) {
      familyBackground.situation = mapped.familyBackground?.situation ? 
        [...mapped.familyBackground.situation, ...personalData.familyStructure] : 
        personalData.familyStructure;
      // Add to familyDynamics for legacy support
      if (mapped.familyDynamics) {
        mapped.familyDynamics = [...mapped.familyDynamics, ...personalData.familyStructure];
      } else {
        mapped.familyDynamics = personalData.familyStructure;
      }
    }
    
    if (personalData.familyEmotions) {
      familyBackground.emotions = personalData.familyEmotions;
      // Add to familyDynamics for legacy support
      if (mapped.familyDynamics) {
        mapped.familyDynamics = [...mapped.familyDynamics, ...personalData.familyEmotions];
      } else {
        mapped.familyDynamics = personalData.familyEmotions;
      }
    }
    
    if (personalData.familyConflict) {
      familyBackground.conflict = personalData.familyConflict;
      mapped.parentConflictStyle = personalData.familyConflict;
    }
    
    if (personalData.familyLove) {
      familyBackground.love = personalData.familyLove;
      mapped.loveMessages = personalData.familyLove;
    }
    
    // Only set familyBackground if we have data
    if (Object.keys(familyBackground).length > 0) {
      mapped.familyBackground = familyBackground;
    }
    
    console.log('Mapped personal questionnaire fields:', { 
      original: personalData, 
      mapped, 
      familyBackground: mapped.familyBackground 
    });
    return mapped;
  }

  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemo = demographicsData.your || {};
    const partnerDemo = demographicsData.partner || {};

    console.log('=== Building PersonContext - Raw Data ===');
    console.log('yourProfile:', yourProfile);
    console.log('partnerProfile:', partnerProfile);
    console.log('yourDemo:', yourDemo);
    console.log('partnerDemo:', partnerDemo);

    // Apply field mapping for personal data to handle questionnaire field names
    const mappedYourProfile = this.mapPersonalQuestionnaireFields(yourProfile);
    const mappedYourDemo = this.mapPersonalQuestionnaireFields(yourDemo);
    const yourData = { ...mappedYourProfile, ...mappedYourDemo };
    
    // Apply field mapping for partner data to handle questionnaire field names
    const mappedPartnerProfile = this.mapPartnerQuestionnaireFields(partnerProfile);
    const mappedPartnerDemo = this.mapPartnerQuestionnaireFields(partnerDemo);
    const partnerData = { ...mappedPartnerProfile, ...mappedPartnerDemo };

    console.log('=== Building PersonContext - Final Mapped Data ===');
    console.log('yourData familyBackground:', yourData.familyBackground);
    console.log('partnerData familyBackground:', partnerData.familyBackground);
    console.log('yourData keys:', Object.keys(yourData));
    console.log('partnerData keys:', Object.keys(partnerData));
    
    // Enhanced logging for new questionnaire fields
    console.log('=== NEW QUESTIONNAIRE FIELDS CHECK ===');
    console.log('Personal new fields found:');
    console.log('  - talkingDescription:', yourData.talkingDescription);
    console.log('  - talkingChallenges:', yourData.talkingChallenges);
    console.log('  - relationshipChallenges:', yourData.relationshipChallenges);
    console.log('  - relationshipWorking:', yourData.relationshipWorking);
    console.log('  - datingChallenges:', yourData.datingChallenges);
    console.log('  - heartbreakBetrayal:', yourData.heartbreakBetrayal);
    console.log('  - familyStructure:', yourData.familyStructure);
    console.log('  - separationSituation:', yourData.separationSituation);
    console.log('  - datingReadiness:', yourData.datingReadiness);
    console.log('  - timeSinceLoss:', yourData.timeSinceLoss);
    console.log('  - grievingProcess:', yourData.grievingProcess);
    
    console.log('Partner new fields found:');
    console.log('  - partnerCommunicationResponse:', yourData.partnerCommunicationResponse || partnerData.communicationResponse);
    console.log('  - partnerSelfAwareness:', yourData.partnerSelfAwareness || partnerData.selfAwareness);
    console.log('  - partnerHeartbreakBetrayal:', yourData.partnerHeartbreakBetrayal || partnerData.heartbreakBetrayal);
    console.log('  - partnerFamilyStructure:', yourData.partnerFamilyStructure || partnerData.familyStructure);
    console.log('  - partnerAttachmentStyle:', yourData.partnerAttachmentStyle || partnerData.attachmentStyle);

    const context = {
      relationship: {
        length: yourData.relationshipLength || yourData.relationshipStatus,
        livingTogether: yourData.livingTogether,
        stage: yourData.relationshipStage,
        emotionalConnection: yourData.emotionalConnection,
        livingArrangement: yourData.livingArrangement,
        relationshipType: yourData.relationshipType
      },
      yourTraits: {
        name: yourData.name,
        age: yourData.age,
        pronouns: yourData.pronouns || yourData.customPronouns,
        loveLanguages: yourData.loveLanguages || yourData.feelLovedWhen || [],
        communicationStyle: yourData.communicationStyle || yourData.communicationDirectness,
        conflictStyle: yourData.conflictStyle || yourData.conflictNeeds,
        stressResponse: yourData.stressResponse || yourData.stressReactions || [],
        attachmentStyle: yourData.attachmentStyle || yourData.attachmentStyles,
        triggers: yourData.triggers || [],
        strengths: yourData.strengths || yourData.workingWell || yourData.relationshipPositives || [],
        growthAreas: yourData.growthAreas || yourData.biggestChallenge || yourData.relationshipChallenges || [],
        familyDynamics: yourData.familyDynamics || [],
        familyBackground: yourData.familyBackground,
        whyRealTalk: yourData.whyRealTalk || yourData.motivations || [],
        mentalHealthContext: yourData.mentalHealthContext,
        education: yourData.education,
        workSituation: yourData.workSituation,
        sexualOrientation: this.normalizeToArray(yourData.sexualOrientation || yourData.orientation),
        genderIdentity: this.normalizeToArray(yourData.genderIdentity || yourData.gender),
        parentConflictStyle: yourData.parentConflictStyle || [],
        loveMessages: yourData.loveMessages || [],
        loveInfluences: yourData.loveInfluences || yourData.relationshipInfluences || [],
        relationshipLength: yourData.relationshipLength,
        feelsDifficult: yourData.feelsDifficult || [],
        hopingFor: yourData.hopingFor || [],
        readiness: yourData.readiness || [],
        healthyRelationship: yourData.healthyRelationship || [],
        additionalInfo: yourData.additionalInfo,
        profileComplete: yourData.profileComplete,
        completedAt: yourData.completedAt,
        datingChallenges: yourData.datingChallenges || [],
        datingGoals: yourData.datingGoals || [],
        datingContext: yourData.relationshipStatus,
        // New relationship-specific fields
        talkingDescription: yourData.talkingDescription || [],
        talkingChallenges: yourData.talkingChallenges || [],
        relationshipChallenges: yourData.relationshipChallenges || [],
        relationshipWorking: yourData.relationshipWorking || [],
        // Status-specific fields
        separationSituation: yourData.separationSituation || [],
        datingReadiness: yourData.datingReadiness || [],
        timeSinceLoss: yourData.timeSinceLoss,
        grievingProcess: yourData.grievingProcess || [],
        // Foundation fields
        heartbreakBetrayal: yourData.heartbreakBetrayal || [],
        familyStructure: yourData.familyStructure || []
      },
      partnerTraits: {
        name: partnerData.name || yourData.partnerName,
        age: partnerData.age,
        pronouns: partnerData.pronouns || partnerData.customPronouns,
        loveLanguages: partnerData.loveLanguages || partnerData.feelLovedWhen || [],
        communicationStyle: partnerData.communicationStyle || partnerData.communicationDirectness,
        conflictStyle: partnerData.conflictStyle || partnerData.conflictNeeds,
        stressResponse: partnerData.stressResponse || partnerData.stressReactions || [],
        attachmentStyle: partnerData.attachmentStyle || partnerData.attachmentStyles,
        triggers: partnerData.triggers || [],
        strengths: partnerData.strengths || partnerData.workingWell || partnerData.relationshipPositives || [],
        growthAreas: partnerData.growthAreas || partnerData.biggestChallenge || partnerData.relationshipChallenges || [],
        familyDynamics: partnerData.familyDynamics || [],
        familyBackground: partnerData.familyBackground,
        whyRealTalk: partnerData.whyRealTalk || partnerData.motivations || [],
        mentalHealthContext: partnerData.mentalHealthContext,
        education: partnerData.education,
        workSituation: partnerData.workSituation,
        sexualOrientation: this.normalizeToArray(partnerData.sexualOrientation || partnerData.orientation),
        genderIdentity: this.normalizeToArray(partnerData.genderIdentity || partnerData.gender),
        // New partner fields
        communicationResponse: partnerData.communicationResponse || [],
        selfAwareness: partnerData.selfAwareness,
        heartbreakBetrayal: partnerData.heartbreakBetrayal || [],
        familyStructure: partnerData.familyStructure || []
      },
      dynamics: {
        loveLanguageMatch: yourData.loveLanguages?.some(lang => 
          partnerData.loveLanguages?.includes(lang)
        ),
        loveLanguageGap: yourData.loveLanguages?.length > 0 && 
          partnerData.loveLanguages?.length > 0 &&
          !yourData.loveLanguages.some(lang => 
            partnerData.loveLanguages.includes(lang)
          ),
        communicationMatch: yourData.communicationStyle === partnerData.communicationStyle,
        conflictDynamic: `${yourData.conflictStyle || 'unknown'} + ${partnerData.conflictStyle || 'unknown'}`
      }
    };
    
    // Final logging of complete PersonContext for Kai
    console.log('=== FINAL PersonContext FOR KAI ===');
    console.log('Complete context keys:', Object.keys(context));
    console.log('yourTraits with all new fields:', {
      name: context.yourTraits.name,
      relationshipChallenges: context.yourTraits.relationshipChallenges,
      talkingDescription: context.yourTraits.talkingDescription,
      heartbreakBetrayal: context.yourTraits.heartbreakBetrayal,
      familyStructure: context.yourTraits.familyStructure,
      datingChallenges: context.yourTraits.datingChallenges
    });
    console.log('partnerTraits with all new fields:', {
      name: context.partnerTraits.name,
      communicationResponse: context.partnerTraits.communicationResponse,
      selfAwareness: context.partnerTraits.selfAwareness,
      heartbreakBetrayal: context.partnerTraits.heartbreakBetrayal,
      familyStructure: context.partnerTraits.familyStructure
    });
    
    return context;
  }
}
