// Safety utilities for detecting sensitive topics and adding disclaimers

export function detectSensitiveTopic(content: string): {
  isSensitive: boolean;
  topic: 'trauma' | 'mental-health' | 'severe-conflict' | 'abuse' | null;
} {
  const patterns = {
    trauma: /\b(trauma|ptsd|flashback|trigger)\b/i,
    mentalHealth: /\b(anxiety|depression|panic|therapy|therapist|medication)\b/i,
    severeConflict: /\b(yelling|screaming|violence|threatening)\b/i,
    abuse: /\b(abuse|abusive|controlling|manipulative|gaslighting)\b/i
  };
  
  for (const [topicKey, pattern] of Object.entries(patterns)) {
    if (pattern.test(content)) {
      // Convert camelCase to kebab-case
      const topic = topicKey.replace(/([A-Z])/g, '-$1').toLowerCase();
      return { 
        isSensitive: true, 
        topic: topic as 'trauma' | 'mental-health' | 'severe-conflict' | 'abuse'
      };
    }
  }
  
  return { isSensitive: false, topic: null };
}

export function addSafetyDisclaimer(content: string, topic: string | null): string {
  if (!topic) return content;
  
  const disclaimers: Record<string, string> = {
    'trauma': '\n\n_💜 Reminder: If you\'re experiencing trauma symptoms, consider reaching out to a trauma-specialized therapist._',
    'mental-health': '\n\n_💜 Reminder: For mental health concerns, please consult with a licensed mental health professional._',
    'severe-conflict': '\n\n_💜 If you feel unsafe, please reach out to the National Domestic Violence Hotline at 1-800-799-7233._',
    'abuse': '\n\n_🚨 If you\'re experiencing abuse, the National Domestic Violence Hotline (1-800-799-7233) provides confidential support 24/7._'
  };
  
  return content + (disclaimers[topic] || '');
}
