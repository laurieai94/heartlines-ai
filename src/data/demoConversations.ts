export interface DemoMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DemoConversation {
  id: string;
  title: string;
  theme: string;
  messages: DemoMessage[];
  userName?: string;
  coachName?: string;
}

export const demoConversations: DemoConversation[] = [
  {
    id: 'texting-communication',
    title: 'texting anxiety',
    theme: 'communication',
    userName: 'Maya',
    coachName: 'kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'kai, he hasn\'t texted me all day.',
        timestamp: '10:23 AM'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'That feels rough. What\'s the first thought that hit you?',
        timestamp: '10:24 AM'
      },
      {
        id: '3',
        type: 'user',
        content: 'That he\'s not into me anymore. Or I messed something up.',
        timestamp: '10:25 AM'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'Makes sense you\'d jump there. Quick check: how was your last time together?',
        timestamp: '10:26 AM'
      },
      {
        id: '5',
        type: 'user',
        content: 'Honestly… great. We laughed a lot. He kissed me goodnight.',
        timestamp: '10:27 AM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'So the evidence says connection was strong. Silence doesn\'t always equal rejection.',
        timestamp: '10:28 AM'
      },
      {
        id: '7',
        type: 'user',
        content: 'Then why is it eating me alive?',
        timestamp: '10:29 AM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'Because uncertainty triggers anxiety. The brain fills the gap with worst-case scenarios.',
        timestamp: '10:30 AM'
      },
      {
        id: '9',
        type: 'user',
        content: 'So what do I do?',
        timestamp: '10:31 AM'
      },
      {
        id: '10',
        type: 'assistant',
        content: 'You can set the tone. Send a light, confident check-in. Something like: "Hey, hope your day\'s not too crazy 😊."',
        timestamp: '10:32 AM'
      },
      {
        id: '11',
        type: 'user',
        content: 'That doesn\'t sound needy.',
        timestamp: '10:33 AM'
      },
      {
        id: '12',
        type: 'assistant',
        content: 'Right—it\'s warm without pressure. If he\'s just busy, it opens the door.',
        timestamp: '10:34 AM'
      },
      {
        id: '13',
        type: 'user',
        content: 'Okay… I can send that.',
        timestamp: '10:35 AM'
      },
      {
        id: '14',
        type: 'assistant',
        content: 'Good. And remember: his timing doesn\'t define your worth.',
        timestamp: '10:36 AM'
      }
    ]
  },
  {
    id: 'grindr-connection',
    title: 'dating app fatigue',
    theme: 'self-worth & connection',
    userName: 'Alex',
    coachName: 'kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'kai, I\'m so drained from Grindr. Same cycle every night.',
        timestamp: '8:15 PM'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'What usually happens for you on there?',
        timestamp: '8:16 PM'
      },
      {
        id: '3',
        type: 'user',
        content: 'I chat, maybe meet up… then it fizzles out.',
        timestamp: '8:17 PM'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'And when it fizzles, how do you usually feel afterward?',
        timestamp: '8:18 PM'
      },
      {
        id: '5',
        type: 'user',
        content: 'Empty. Like I don\'t matter.',
        timestamp: '8:19 PM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'That\'s painful. What do you wish was different about those interactions?',
        timestamp: '8:20 PM'
      },
      {
        id: '7',
        type: 'user',
        content: 'I wish someone wanted to actually know me, not just hook up.',
        timestamp: '8:21 PM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'So connection beyond the physical?',
        timestamp: '8:22 PM'
      },
      {
        id: '9',
        type: 'user',
        content: 'Exactly.',
        timestamp: '8:22 PM'
      },
      {
        id: '10',
        type: 'assistant',
        content: 'What kind of connection are you craving—emotional, intellectual, daily presence?',
        timestamp: '8:23 PM'
      },
      {
        id: '11',
        type: 'user',
        content: 'Probably all of that. Just… feeling seen.',
        timestamp: '8:24 PM'
      },
      {
        id: '12',
        type: 'assistant',
        content: 'Makes sense. Let me ask—how often do you feel seen by yourself, outside of the app?',
        timestamp: '8:25 PM'
      },
      {
        id: '13',
        type: 'user',
        content: 'Uh… rarely. I kind of avoid being alone.',
        timestamp: '8:26 PM'
      },
      {
        id: '14',
        type: 'assistant',
        content: 'That\'s important. What do you think would shift if you practiced asking yourself the same questions you want a partner to ask you?',
        timestamp: '8:27 PM'
      },
      {
        id: '15',
        type: 'user',
        content: 'Like what questions?',
        timestamp: '8:28 PM'
      },
      {
        id: '16',
        type: 'assistant',
        content: 'For example: "What am I proud of today?" or "What gave me energy this week?"',
        timestamp: '8:29 PM'
      },
      {
        id: '17',
        type: 'user',
        content: 'Honestly… I don\'t think I\'ve ever asked myself that.',
        timestamp: '8:30 PM'
      },
      {
        id: '18',
        type: 'assistant',
        content: 'That could be a starting point. How would it feel to try journaling one of those tonight instead of scrolling Grindr?',
        timestamp: '8:31 PM'
      },
      {
        id: '19',
        type: 'user',
        content: 'Weird… but maybe better than another empty convo.',
        timestamp: '8:32 PM'
      },
      {
        id: '20',
        type: 'assistant',
        content: 'That\'s the shift—building connection inward so you\'re not waiting for strangers to give it to you.',
        timestamp: '8:33 PM'
      },
      {
        id: '21',
        type: 'user',
        content: 'That actually makes sense.',
        timestamp: '8:34 PM'
      },
      {
        id: '22',
        type: 'assistant',
        content: 'You deserve to feel seen—starting with yourself.',
        timestamp: '8:35 PM'
      }
    ]
  },
  {
    id: 'new-baby-closeness',
    title: 'new baby, less closeness',
    theme: 'parenthood & connection',
    userName: 'Marcus',
    coachName: 'kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'kai, I feel like I lost my wife since the baby came.',
        timestamp: '9:15 PM'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'That\'s tough. What feels most different between you now?',
        timestamp: '9:16 PM'
      },
      {
        id: '3',
        type: 'user',
        content: 'We don\'t talk the same. We\'re always tired. No intimacy.',
        timestamp: '9:17 PM'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'So the exhaustion is taking space away from connection. How does that land for you?',
        timestamp: '9:18 PM'
      },
      {
        id: '5',
        type: 'user',
        content: 'Exactly. I miss her. But I don\'t want to pressure her.',
        timestamp: '9:19 PM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'That\'s thoughtful. What would closeness look like for you right now—physical, emotional, or both?',
        timestamp: '9:20 PM'
      },
      {
        id: '7',
        type: 'user',
        content: 'Honestly… just time together. Even 15 minutes without the baby.',
        timestamp: '9:21 PM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'When was the last time you had that kind of moment?',
        timestamp: '9:22 PM'
      },
      {
        id: '9',
        type: 'user',
        content: 'Weeks ago. We\'re in survival mode.',
        timestamp: '9:23 PM'
      },
      {
        id: '10',
        type: 'assistant',
        content: 'Understandable. What small step could create a pocket of connection this week?',
        timestamp: '9:24 PM'
      },
      {
        id: '11',
        type: 'user',
        content: 'Maybe asking her if we can sit outside after bedtime. Just us.',
        timestamp: '9:25 PM'
      },
      {
        id: '12',
        type: 'assistant',
        content: 'That\'s gentle and doable. How would it feel to tell her, "I miss you, and I\'d love a few minutes together tonight"?',
        timestamp: '9:26 PM'
      },
      {
        id: '13',
        type: 'user',
        content: 'That feels honest without pushing.',
        timestamp: '9:27 PM'
      },
      {
        id: '14',
        type: 'assistant',
        content: 'Exactly. Connection starts with small signals of "I still choose you."',
        timestamp: '9:28 PM'
      },
      {
        id: '15',
        type: 'user',
        content: 'Yeah. I think I can say that.',
        timestamp: '9:29 PM'
      }
    ]
  },
  {
    id: 'moving-in-together',
    title: 'moving in together',
    theme: 'commitment & timing',
    userName: 'Jordan',
    coachName: 'kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'kai, she wants us to move in together after 3 months.',
        timestamp: '2:15 PM'
      },
      {
        id: '2',
        type: 'assistant',
        content: "That's quick. How do you feel about it?",
        timestamp: '2:16 PM'
      },
      {
        id: '3',
        type: 'user',
        content: 'Excited… but scared.',
        timestamp: '2:17 PM'
      },
      {
        id: '4',
        type: 'assistant',
        content: "What's the excitement part?",
        timestamp: '2:18 PM'
      },
      {
        id: '5',
        type: 'user',
        content: 'I love being with her, it feels easy.',
        timestamp: '2:19 PM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'And the scared part?',
        timestamp: '2:20 PM'
      },
      {
        id: '7',
        type: 'user',
        content: "What if it's too soon and we crash?",
        timestamp: '2:21 PM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'Valid concern. What would moving in symbolize for you—commitment, stability, risk?',
        timestamp: '2:22 PM'
      },
      {
        id: '9',
        type: 'user',
        content: 'Commitment. Like forever.',
        timestamp: '2:23 PM'
      },
      {
        id: '10',
        type: 'assistant',
        content: 'And for her?',
        timestamp: '2:24 PM'
      },
      {
        id: '11',
        type: 'user',
        content: 'I think… closeness. She hates distance.',
        timestamp: '2:25 PM'
      },
      {
        id: '12',
        type: 'assistant',
        content: "So you're bringing different meanings to the same step.",
        timestamp: '2:26 PM'
      },
      {
        id: '13',
        type: 'user',
        content: 'Yeah, that sounds right.',
        timestamp: '2:27 PM'
      },
      {
        id: '14',
        type: 'assistant',
        content: 'If you slowed the timeline but deepened closeness in other ways, how would that feel?',
        timestamp: '2:28 PM'
      },
      {
        id: '15',
        type: 'user',
        content: 'Better. Safer.',
        timestamp: '2:29 PM'
      },
      {
        id: '16',
        type: 'assistant',
        content: "Want me to help you phrase that to her so it doesn't sound like rejection?",
        timestamp: '2:30 PM'
      },
      {
        id: '17',
        type: 'user',
        content: 'Yes, please.',
        timestamp: '2:31 PM'
      }
    ]
  },
  {
    id: 'money-conflict',
    title: 'money talks',
    theme: 'financial communication',
    userName: 'Sarah',
    coachName: 'kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'We keep fighting about money.',
        timestamp: '3:15 PM'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'What\'s the fight usually about—spending, saving, or something else?',
        timestamp: '3:16 PM'
      },
      {
        id: '3',
        type: 'user',
        content: 'Mostly spending. He thinks I waste money.',
        timestamp: '3:17 PM'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'How does it feel to hear that word, "waste"?',
        timestamp: '3:18 PM'
      },
      {
        id: '5',
        type: 'user',
        content: 'Judgy. Like I\'m irresponsible.',
        timestamp: '3:19 PM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'And what does money mean to you—freedom, security, joy?',
        timestamp: '3:20 PM'
      },
      {
        id: '7',
        type: 'user',
        content: 'Freedom. I didn\'t grow up with much.',
        timestamp: '3:21 PM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'And what does it mean to him?',
        timestamp: '3:22 PM'
      },
      {
        id: '9',
        type: 'user',
        content: 'Security. He\'s terrified of not having enough.',
        timestamp: '3:23 PM'
      },
      {
        id: '10',
        type: 'assistant',
        content: 'So it\'s not just numbers—it\'s two different stories about safety.',
        timestamp: '3:24 PM'
      },
      {
        id: '11',
        type: 'user',
        content: 'Yeah… that makes sense.',
        timestamp: '3:25 PM'
      },
      {
        id: '12',
        type: 'assistant',
        content: 'If you could swap one perspective for a week, what might shift?',
        timestamp: '3:26 PM'
      },
      {
        id: '13',
        type: 'user',
        content: 'Maybe I\'d see why he saves so much.',
        timestamp: '3:27 PM'
      },
      {
        id: '14',
        type: 'assistant',
        content: 'And he might see why you value treating yourself.',
        timestamp: '3:28 PM'
      },
      {
        id: '15',
        type: 'user',
        content: 'Yeah. That could help.',
        timestamp: '3:29 PM'
      },
      {
        id: '16',
        type: 'assistant',
        content: 'Want me to draft a way to suggest that without it sounding like blame?',
        timestamp: '3:30 PM'
      },
      {
        id: '17',
        type: 'user',
        content: 'Yes. That would be amazing.',
        timestamp: '3:31 PM'
      }
    ]
  }
];
