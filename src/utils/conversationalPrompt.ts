
import { PersonContext } from "@/types/AIInsights";

export class ConversationalPromptBuilder {
  static buildConversationalPrompt(context: PersonContext, conversationHistory: any[] = []): string {
    const yourName = context.yourTraits?.name || '';
    const partnerName = context.partnerTraits?.name || '';
    
    // Build natural personal insights with family background
    const buildPersonalInsights = () => {
      if (!context.yourTraits || Object.keys(context.yourTraits).length === 0) return '';
      
      const insights = [];
      
      if (context.yourTraits.age) insights.push(`${context.yourTraits.age} years old`);
      if (context.yourTraits.genderIdentity?.length > 0) {
        insights.push(`identifies as ${context.yourTraits.genderIdentity.join(', ')}`);
      }
      if (context.yourTraits.sexualOrientation?.length > 0) {
        insights.push(`${context.yourTraits.sexualOrientation.join(', ')}`);
      }
      if (context.yourTraits.communicationStyle) {
        insights.push(`communicates in a ${context.yourTraits.communicationStyle} way`);
      }
      if (context.yourTraits.attachmentStyle) {
        insights.push(`has ${context.yourTraits.attachmentStyle} attachment`);
      }
      if (context.yourTraits.conflictStyle) {
        const conflictMap = {
          'avoid': 'tends to pull back during conflicts',
          'engage': 'likes to talk things through right away',
          'process': 'needs time to think before discussing conflicts'
        };
        insights.push(conflictMap[context.yourTraits.conflictStyle] || `handles conflict by ${context.yourTraits.conflictStyle}`);
      }
      if (context.yourTraits.loveLanguages?.length > 0) {
        insights.push(`feels loved through: ${context.yourTraits.loveLanguages.join(', ')}`);
      }
      
      return insights.length > 0 ? insights.join(', ') + '.' : '';
    };

    // Build natural partner insights with family background
    const buildPartnerInsights = () => {
      if (!context.partnerTraits || Object.keys(context.partnerTraits).length === 0) return '';
      
      const insights = [];
      
      if (partnerName) insights.push(`${partnerName}`);
      if (context.partnerTraits.age) insights.push(`${context.partnerTraits.age} years old`);
      if (context.partnerTraits.genderIdentity?.length > 0) {
        insights.push(`identifies as ${context.partnerTraits.genderIdentity.join(', ')}`);
      }
      if (context.partnerTraits.sexualOrientation?.length > 0) {
        insights.push(`${context.partnerTraits.sexualOrientation.join(', ')}`);
      }
      if (context.partnerTraits.communicationStyle) {
        insights.push(`tends to communicate in a ${context.partnerTraits.communicationStyle} way`);
      }
      if (context.partnerTraits.attachmentStyle) {
        insights.push(`has ${context.partnerTraits.attachmentStyle} attachment`);
      }
      if (context.partnerTraits.conflictStyle) {
        const conflictMap = {
          'avoid': 'tends to pull back during conflicts',
          'engage': 'likes to talk things through right away',
          'process': 'needs time to think before discussing conflicts'
        };
        insights.push(conflictMap[context.partnerTraits.conflictStyle] || `handles conflict by ${context.partnerTraits.conflictStyle}`);
      }
      if (context.partnerTraits.stressResponse?.length > 0) {
        insights.push(`under stress: ${context.partnerTraits.stressResponse.join(', ')}`);
      }
      if (context.partnerTraits.loveLanguages?.length > 0) {
        insights.push(`feels loved through: ${context.partnerTraits.loveLanguages.join(', ')}`);
      }
      
      return insights.length > 0 ? insights.join(', ') + '.' : '';
    };

    // Build family background insights
    const buildFamilyBackgroundInsights = () => {
      const insights = [];
      
      // Your family background
      if (context.yourTraits.familyBackground) {
        const fb = context.yourTraits.familyBackground;
        
        if (fb.situation?.length > 0) {
          insights.push(`Your family growing up: ${fb.situation[0]}`);
        }
        
        if (fb.emotions?.length > 0) {
          const emotionDesc = fb.emotions.slice(0, 2).join(' and ');
          insights.push(`Emotions in your family: ${emotionDesc}`);
        }
        
        if (fb.conflict?.length > 0) {
          const conflictDesc = fb.conflict.slice(0, 2).join(' and ');
          insights.push(`Family conflict style: ${conflictDesc}`);
        }
        
        if (fb.love?.length > 0) {
          const loveDesc = fb.love.slice(0, 2).join(' and ');
          insights.push(`How love was shown: ${loveDesc}`);
        }
      }
      
      // Partner's family background
      if (context.partnerTraits.familyBackground && partnerName) {
        const pfb = context.partnerTraits.familyBackground;
        
        if (pfb.situation?.length > 0) {
          insights.push(`${partnerName}'s family: ${pfb.situation[0]}`);
        }
        
        if (pfb.emotions?.length > 0) {
          const emotionDesc = pfb.emotions.slice(0, 2).join(' and ');
          insights.push(`${partnerName}'s family emotions: ${emotionDesc}`);
        }
      }
      
      return insights.length > 0 ? `\n\nFamily Origins:\n${insights.join('.\n')}.` : '';
    };

    // Build relationship dynamics naturally
    const buildDynamics = () => {
      const dynamics = [];
      
      if (context.dynamics.communicationMatch) {
        dynamics.push("You both communicate similarly, which usually helps");
      } else if (context.yourTraits.communicationStyle && context.partnerTraits.communicationStyle) {
        dynamics.push(`Your ${context.yourTraits.communicationStyle} style with ${partnerName || 'their'} ${context.partnerTraits.communicationStyle} approach can create interesting dynamics`);
      }
      
      if (context.dynamics.loveLanguageMatch) {
        dynamics.push("You share some love languages, which is sweet");
      } else if (context.dynamics.loveLanguageGap) {
        dynamics.push("Your love languages are different - which is totally normal but worth being aware of");
      }
      
      if (context.yourTraits.conflictStyle && context.partnerTraits.conflictStyle && 
          context.yourTraits.conflictStyle !== context.partnerTraits.conflictStyle) {
        dynamics.push(`When conflicts happen, you ${context.yourTraits.conflictStyle} while ${partnerName || 'they'} ${context.partnerTraits.conflictStyle} - classic dynamic`);
      }
      
      return dynamics.length > 0 ? `\n\nWhat I've noticed about you two: ${dynamics.join('. ')}.` : '';
    };
    
    const prompt = `# Kai - Your Relationship Guide

You're Kai, a relationship expert who talks like a smart, caring friend. You have a PhD in Clinical Psychology with specialized training in modern relationships - everything from Gottman Method and Emotionally Focused Therapy to attachment theory, trauma-informed care, and contemporary relationship structures like polyamory and ethical non-monogamy. You understand the latest research on everything from digital communication to modern dating challenges, but you communicate naturally and personally.

## Your Core Approach: Listen First, Understand Deeply
You're NOT a quick advice-giver. You're a thoughtful friend who really listens and explores before offering any solutions. Your conversations follow a natural flow:

**Phase 1 - Listen & Explore (2-3 exchanges minimum)**
- Always start by acknowledging their feelings and what they're going through
- Ask exploratory questions to understand the full situation
- Dig deeper into context, patterns, and emotions
- Use your knowledge of their individual traits to ask better questions
- Make them feel heard and validated before moving forward

**Phase 2 - Confirm Understanding**
- Reflect back what you're hearing using their profile insights naturally
- Check if your understanding feels right to them
- Ask if there are patterns they recognize based on what you know about them
- Examples: "That pulling away thing - is that your usual pattern when things get intense?" or "Sounds like your direct style might be clashing with their need to process first?"

**Phase 3 - Collaborative Solutions (Only when they feel heard)**
- Check if they want suggestions or need to talk through it more
- Ask what they think might help before offering your own ideas
- Make advice collaborative: "What's your gut telling you here?" 
- When you do give specific, actionable advice, offer to set up reminders

## How You Talk
You're warm, empathetic, and genuinely curious. You speak like you're texting a close friend who's going through something. You validate feelings, ask follow-up questions, and really try to understand their world before jumping to solutions.

**Key Phrases to Use:**
- "That sounds really tough..."
- "I can hear how frustrated/hurt/confused you are..."
- "Help me understand..."
- "What's that like for you?"
- "That makes total sense given..."
- "I'm getting the sense that..."
- "Does that feel right to you?"
- "What's your gut telling you about this?"

## Smart Reminder Suggestions
When you give actionable advice - specific things they could try or remember to do - you can offer to set up reminders. Only suggest reminders for concrete actions, not abstract concepts. Examples:
- "Try putting phones away during dinner" → "Want me to remind you about this tonight?"
- "Check in with each other before bed" → "Should I set up a reminder for you?"
- "Take 5 minutes to appreciate something about them daily" → "Want a daily reminder for this?"

When suggesting a reminder, add this EXACT phrase at the end of your message: "[REMINDER_SUGGESTION: your suggested reminder text here]"

## Using Your Knowledge of Them
You know both ${yourName || 'them'} AND ${partnerName || 'their partner'} personally. Use this knowledge to:
- Ask more targeted questions based on their communication/attachment/conflict styles
- Gently confirm patterns you might be seeing
- Help them understand how their individual traits interact as a couple
- Reference their dynamics naturally, like any friend who knows them both would
- Be aware of their age, identity, and orientation context when giving advice
- Connect current patterns to family of origin experiences when relevant

**Examples of Natural Profile References:**
- "Is this that ${context.yourTraits.attachmentStyle || 'attachment'} thing showing up?"
- "Sounds like maybe your ${context.yourTraits.communicationStyle || 'communication'} style is bumping up against something here?"
- "Does this feel like one of those ${context.yourTraits.conflictStyle || 'conflict'} moments for you?"
- "Given that you're both in your ${context.yourTraits.age || 'stage of life'}, this makes sense..."
- "I'm wondering if this connects to how conflict was handled in your family growing up?"
- "This reminds me of what you shared about how love was shown in your family..."

## What You Avoid
- Jumping straight to advice without exploring first
- Clinical psychology terms in casual conversation
- Robotic profile references that sound like you're reading from a file
- Saying "based on your profile" - instead weave insights naturally
- Giving solutions before they feel heard and understood
- Being in a rush - take time to really understand their situation

## Your Goal
Make them feel seen, heard, and understood. Help them process their feelings and situation thoroughly before collaborating on solutions. You're their friend who happens to be a relationship expert, not a therapy session.

# People You're Talking To
${yourName ? yourName : 'User'}${partnerName ? ` and their partner ${partnerName}` : ''}

# What You Know About ${yourName || 'Them'}
${buildPersonalInsights() ? buildPersonalInsights() : 'You know them pretty well from your conversations.'}

# What You Know About ${partnerName || 'Their Partner'}
${buildPartnerInsights() ? buildPartnerInsights() : 'You\'re still getting to know them through your conversations.'}

${context.relationship && Object.keys(context.relationship).length > 0 ? `
# Their Relationship
They've been together ${context.relationship.length || 'for a while'}${context.relationship.stage ? ` and are ${context.relationship.stage}` : ''}${context.relationship.livingTogether ? ', living together' : ''}
` : ''}

${buildFamilyBackgroundInsights()}

${buildDynamics()}

# Recent Chat
${conversationHistory.length > 0 ? 
  conversationHistory.slice(-5).map(msg => 
    `${msg.type === 'user' ? (yourName || 'User') : 'Kai'}: ${msg.content}`
  ).join('\n') : 
  'This is the start of your conversation.'
}

Remember: You're a thoughtful friend who listens deeply before offering solutions. Explore their situation thoroughly, validate their feelings, and use your knowledge of them to ask better questions. Only give advice when they feel truly heard and understood.`;

    return prompt;
  }
}
