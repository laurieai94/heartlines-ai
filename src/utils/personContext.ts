
import { ProfileData, DemographicsData, PersonContext } from "@/types/AIInsights";

export class PersonContextBuilder {
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
    
    // Map deeper insights
    if (partnerData.partnerStressors) mapped.triggers = partnerData.partnerStressors;
    if (partnerData.partnerRelationshipNeeds) mapped.strengths = partnerData.partnerRelationshipNeeds;
    if (partnerData.partnerConflictStyle) mapped.conflictStyle = partnerData.partnerConflictStyle;
    if (partnerData.partnerSuperpower) {
      mapped.strengths = mapped.strengths ? [...mapped.strengths, partnerData.partnerSuperpower] : [partnerData.partnerSuperpower];
    }
    
    // Map background information
    if (partnerData.partnerFamilyBackground) mapped.familyDynamics = partnerData.partnerFamilyBackground;
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
    if (personalData.biggestChallenge) mapped.growthAreas = personalData.biggestChallenge;
    if (personalData.relationshipChallenges) {
      mapped.growthAreas = mapped.growthAreas ? [...mapped.growthAreas, ...personalData.relationshipChallenges] : personalData.relationshipChallenges;
    }
    if (personalData.motivations) mapped.whyRealTalk = personalData.motivations;
    if (personalData.relationshipInfluences) mapped.loveInfluences = personalData.relationshipInfluences;
    
    // Map family background fields
    if (personalData.familySituation) mapped.familyDynamics = [personalData.familySituation];
    if (personalData.familyEmotions) {
      mapped.familyDynamics = mapped.familyDynamics ? [...mapped.familyDynamics, ...personalData.familyEmotions] : personalData.familyEmotions;
    }
    if (personalData.familyConflict) mapped.parentConflictStyle = personalData.familyConflict;
    if (personalData.familyLove) mapped.loveMessages = personalData.familyLove;
    
    console.log('Mapped personal questionnaire fields:', { original: personalData, mapped });
    return mapped;
  }

  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemo = demographicsData.your || {};
    const partnerDemo = demographicsData.partner || {};

    // Apply field mapping for personal data to handle questionnaire field names
    const mappedYourProfile = this.mapPersonalQuestionnaireFields(yourProfile);
    const mappedYourDemo = this.mapPersonalQuestionnaireFields(yourDemo);
    const yourData = { ...mappedYourProfile, ...mappedYourDemo };
    
    // Apply field mapping for partner data to handle questionnaire field names
    const mappedPartnerProfile = this.mapPartnerQuestionnaireFields(partnerProfile);
    const mappedPartnerDemo = this.mapPartnerQuestionnaireFields(partnerDemo);
    const partnerData = { ...mappedPartnerProfile, ...mappedPartnerDemo };

    console.log('Building PersonContext with:', { 
      yourData: Object.keys(yourData), 
      partnerData: Object.keys(partnerData),
      yourDataValues: yourData,
      partnerDataValues: partnerData 
    });

    return {
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
        whyRealTalk: yourData.whyRealTalk || yourData.motivations || [],
        mentalHealthContext: yourData.mentalHealthContext,
        education: yourData.education,
        workSituation: yourData.workSituation,
        sexualOrientation: yourData.sexualOrientation || yourData.orientation || [],
        genderIdentity: yourData.genderIdentity || yourData.gender || [],
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
        datingContext: yourData.relationshipStatus
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
        whyRealTalk: partnerData.whyRealTalk || partnerData.motivations || [],
        mentalHealthContext: partnerData.mentalHealthContext,
        education: partnerData.education,
        workSituation: partnerData.workSituation,
        sexualOrientation: partnerData.sexualOrientation || partnerData.orientation || [],
        genderIdentity: partnerData.genderIdentity || partnerData.gender || []
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
  }
}
