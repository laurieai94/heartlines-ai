
import { ProfileData, DemographicsData, PersonContext } from "@/types/AIInsights";

export class PersonContextBuilder {
  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemo = demographicsData.your || {};
    const partnerDemo = demographicsData.partner || {};

    // Merge profile and demographics data completely
    const yourData = { ...yourProfile, ...yourDemo };
    const partnerData = { ...partnerProfile, ...partnerDemo };

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
