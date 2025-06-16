
import { PersonContext } from "@/types/AIInsights";

export class AICoachEngine {
  static buildPersonContext(profiles: any, demographicsData: any): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemographics = demographicsData.your || {};
    const partnerDemographics = demographicsData.partner || {};

    return {
      relationship: {
        length: yourDemographics.relationshipLength || undefined,
        livingTogether: yourDemographics.livingTogether || false,
        stage: yourDemographics.relationshipStage || undefined
      },
      yourTraits: {
        name: yourDemographics.name || undefined,
        loveLanguage: yourProfile.loveLanguage || undefined,
        communicationStyle: yourProfile.communicationStyle || undefined,
        conflictStyle: yourProfile.conflictStyle || undefined,
        stressResponse: yourProfile.stressResponse || undefined,
        attachmentStyle: yourProfile.attachmentStyle || undefined,
        triggers: yourProfile.triggers || [],
        strengths: yourProfile.strengths || [],
        growthAreas: yourProfile.growthAreas || []
      },
      partnerTraits: {
        name: partnerDemographics.name || undefined,
        loveLanguage: partnerProfile.loveLanguage || undefined,
        communicationStyle: partnerProfile.communicationStyle || undefined,
        conflictStyle: partnerProfile.conflictStyle || undefined,
        stressResponse: partnerProfile.stressResponse || undefined,
        attachmentStyle: partnerProfile.attachmentStyle || undefined,
        triggers: partnerProfile.triggers || [],
        strengths: partnerProfile.strengths || [],
        growthAreas: partnerProfile.growthAreas || []
      },
      dynamics: {
        loveLanguageMatch: yourProfile.loveLanguage === partnerProfile.loveLanguage,
        loveLanguageGap: yourProfile.loveLanguage !== partnerProfile.loveLanguage,
        communicationMatch: yourProfile.communicationStyle === partnerProfile.communicationStyle,
        conflictDynamic: yourProfile.conflictStyle && partnerProfile.conflictStyle ? 
          `${yourProfile.conflictStyle}-${partnerProfile.conflictStyle}` : undefined
      }
    };
  }

  static getAIResponse(userMessage: string, context: PersonContext): string {
    const message = userMessage.toLowerCase();
    const youName = context.yourTraits.name || 'you';
    const theirName = context.partnerTraits.name || 'your partner';

    // Support and care responses
    if (message.includes("support") || message.includes("help")) {
      let response = `Okay, first - I love that you're thinking about how to show up better for ${theirName}. That already says so much about who you are.\n\n`;
      
      response += `Here's what I'm seeing: `;
      if (context.dynamics.loveLanguageMatch) {
        response += `You both speak ${context.partnerTraits.loveLanguage} as your love language, which is honestly such a gift. You naturally get how to love each other.`;
      } else if (context.dynamics.loveLanguageGap && context.partnerTraits.loveLanguage) {
        response += `${theirName}'s love language is ${context.partnerTraits.loveLanguage} while yours is ${context.yourTraits.loveLanguage}. So you might be loving them in your language instead of theirs - super common, and totally fixable.`;
      } else {
        response += `support isn't one-size-fits-all, and what feels good to you might not be what ${theirName} needs most right now.`;
      }

      response += `\n\nReal talk: when ${theirName} is stressed, they tend to ${context.partnerTraits.stressResponse}. So your support needs to account for that pattern, not fight against it.\n\n`;

      response += `**Try this:**\n`;
      
      if (context.partnerTraits.loveLanguage === 'acts_of_service') {
        response += `• **Handle the stuff that stresses them out** - Look for tasks they usually do and just... do them. No announcement needed.\n`;
        response += `• **Ask specifically**: "${theirName}, what would actually make your day easier right now?" Then do that thing.\n`;
      } else if (context.partnerTraits.loveLanguage === 'words_of_affirmation') {
        response += `• **Get specific with your words** - Instead of "you're great," try "${theirName}, I really love how you handled [specific thing]."\n`;
        response += `• **Text them something real** - Send them something appreciative in the middle of their day.\n`;
      } else if (context.partnerTraits.loveLanguage === 'quality_time') {
        response += `• **Phone away, full attention** - Even 15 minutes of being completely present beats hours of distracted hanging out.\n`;
        response += `• **Ask what they want to do together** - Let them pick the activity and follow their lead.\n`;
      } else {
        response += `• **Pay attention to how they show love** - That's probably how they want to receive it too.\n`;
        response += `• **Ask directly**: "${theirName}, I want to support you better. What would feel most helpful right now?"\n`;
      }

      response += `\n**Your next move:** Pick one specific thing that would make ${theirName}'s day easier and handle it without being asked.\n\n`;
      response += `You've got this. The fact that you're asking shows you're already on the right track.`;

      return response;
    }

    // Conflict and argument responses
    if (message.includes("argument") || message.includes("fight") || message.includes("conflict")) {
      let response = `Oof, yeah. Recurring arguments are exhausting as hell, and I bet you're both feeling frustrated about this cycle you're stuck in.\n\n`;

      response += `Here's what I think is really happening: `;
      if (context.dynamics.conflictDynamic) {
        const yourStyle = context.yourTraits.conflictStyle;
        const theirStyle = context.partnerTraits.conflictStyle;
        
        if (yourStyle === 'confrontational' && theirStyle === 'avoidant') {
          response += `You want to hash things out immediately, and ${theirName} needs to retreat and process. So you chase, they withdraw, you chase harder, they shut down more. It's like a really shitty dance nobody enjoys.`;
        } else if (yourStyle === 'avoidant' && theirStyle === 'confrontational') {
          response += `${theirName} wants to talk it out right now, and you need time to think. They see your need for space as rejection, and you see their urgency as pressure. Classic mismatch.`;
        } else if (yourStyle === theirStyle && yourStyle === 'confrontational') {
          response += `You're both wanting to be heard RIGHT NOW. Which means you're talking over each other instead of actually listening. Both valid, but the timing is all wrong.`;
        } else {
          response += `there's a pattern here that goes deeper than whatever you're actually arguing about.`;
        }
      } else {
        response += `most fights aren't really about the thing you're fighting about. They're about the feelings underneath - feeling unheard, unvalued, misunderstood, or disconnected.`;
      }

      response += `\n\n**Real talk:** The content of your arguments probably changes, but the emotional pattern stays the same. `;
      
      if (context.yourTraits.attachmentStyle || context.partnerTraits.attachmentStyle) {
        response += `This is your attachment stuff showing up - the deep fears about safety, connection, and being enough.\n\n`;
      }

      response += `**Here's what to try differently:**\n`;
      response += `• **Pause the pattern**: When you feel it escalating, try "I can feel us getting into that thing we do. Can we take 20 minutes?"\n`;
      response += `• **Get to the feelings first**: Before diving into the issue, each person says "What I really need right now is..."\n`;
      response += `• **Focus on the need, not being right**: Ask yourself "What is each of us trying to get our needs met here?"\n\n`;

      response += `**Your next step:** The next time you feel an argument building, pause and ask yourself: "What am I actually needing right now?" Then share that instead of the complaint.\n\n`;
      response += `This shit is hard, but you can absolutely learn to fight better. It just takes practice.`;

      return response;
    }

    // Anxiety and relationship security
    if (message.includes("anxious") || message.includes("worried") || message.includes("stress")) {
      let response = `First of all, take a breath. What you're feeling makes total sense, and you're not being dramatic or needy for feeling this way.\n\n`;

      if (context.yourTraits.attachmentStyle === 'anxious') {
        response += `I know you mentioned your attachment style is anxious, so your nervous system is literally wired to be more sensitive to relationship threats. This isn't your fault - it's how your brain learned to keep you safe.\n\n`;
      }

      response += `The key is figuring out if this is about something ${theirName} actually did/said, or if it's your brain spiraling.\n\n`;

      response += `**Let's reality-check this:**\n`;
      response += `• What specifically happened that triggered this feeling?\n`;
      response += `• Is this based on ${theirName}'s actual behavior or your interpretation of it?\n`;
      response += `• What story is your brain telling you right now?\n\n`;

      response += `**What to do right now:**\n`;
      response += `• Write down exactly what you're worried about - get it out of your head\n`;
      response += `• Ask yourself: "What would help me feel more secure right now?"\n`;
      response += `• Share that specific need with ${theirName} instead of the anxiety spiral\n\n`;

      response += `**Your next step:** Be specific about what you need. Instead of "I'm anxious about us," try "${theirName}, I'm feeling disconnected and would love to spend some focused time together tonight."\n\n`;
      response += `Your feelings are valid, AND you have more control over this than it feels like right now. You've got this.`;

      return response;
    }

    // Default response
    let response = `Thanks for sharing what's going on with you and ${theirName}. I can tell this matters a lot to you, which honestly says everything about who you are as a partner.\n\n`;

    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      response += `I know you bring ${context.yourTraits.strengths.join(', ')} to this relationship, and those are real assets. `;
    }

    response += `**Here's what I want you to remember:**\n`;
    response += `• Every relationship has its unique rhythm and challenges - that's not a bug, it's a feature\n`;
    response += `• You two are on the same team, even when it doesn't feel like it\n`;
    response += `• Working on your relationship doesn't mean it's broken - it means you want it to be great\n\n`;

    response += `**Tell me more:** What specific situation or feeling brought you here today? The more context you give me about what's actually happening, the more personalized guidance I can offer.\n\n`;
    response += `You've got this. Seriously.`;

    return response;
  }
}
