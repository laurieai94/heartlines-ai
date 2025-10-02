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
    id: 'first-fight',
    title: 'First Fight',
    theme: 'Conflict Resolution',
    userName: 'You',
    coachName: 'Kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'We had our first fight. She wanted space.',
        timestamp: '2:30 PM'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'And that felt hard for you.',
        timestamp: '2:31 PM'
      },
      {
        id: '3',
        type: 'user',
        content: 'Yeah. Space makes me panic.',
        timestamp: '2:31 PM'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'So you need reassurance even when she needs distance.',
        timestamp: '2:32 PM'
      },
      {
        id: '5',
        type: 'user',
        content: 'Yes. Exactly.',
        timestamp: '2:32 PM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'A middle ground: set a check-in time. Like, "Let\'s take a break but reconnect tonight."',
        timestamp: '2:33 PM'
      },
      {
        id: '7',
        type: 'user',
        content: 'That would help me breathe.',
        timestamp: '2:33 PM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'Want me to suggest language you could use?',
        timestamp: '2:34 PM'
      },
      {
        id: '9',
        type: 'user',
        content: 'Please.',
        timestamp: '2:34 PM'
      },
      {
        id: '10',
        type: 'assistant',
        content: '"Take the space you need, but could we check in at 7? That would help me feel grounded."',
        timestamp: '2:35 PM'
      },
      {
        id: '11',
        type: 'user',
        content: 'That feels doable.',
        timestamp: '2:35 PM'
      },
      {
        id: '12',
        type: 'assistant',
        content: 'Healthy repair > lingering tension.',
        timestamp: '2:36 PM'
      }
    ]
  },
  {
    id: 'texting-communication',
    title: 'Texting Anxiety',
    theme: 'Communication',
    userName: 'Maya',
    coachName: 'Kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Kai, he hasn\'t texted me all day.',
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
    id: 'weekend-plans',
    title: 'Weekend Plans',
    theme: 'Planning Together',
    userName: 'You',
    coachName: 'Kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Every time I try to plan something for the weekend, he just shuts down.',
        timestamp: '9:42 AM'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'That must feel frustrating. What does "shutting down" look like for him?',
        timestamp: '9:43 AM'
      },
      {
        id: '3',
        type: 'user',
        content: 'He goes quiet, says "I don\'t know" or "whatever you want."',
        timestamp: '9:43 AM'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'Sounds like he might be overwhelmed by open-ended questions. Some people freeze when there are too many options.',
        timestamp: '9:44 AM'
      },
      {
        id: '5',
        type: 'user',
        content: 'So what do I do differently?',
        timestamp: '9:45 AM'
      },
      {
        id: '6',
        type: 'assistant',
        content: 'Try offering 2-3 specific options: "Would you rather hike, grab brunch, or stay in and watch movies?" It gives structure.',
        timestamp: '9:46 AM'
      },
      {
        id: '7',
        type: 'user',
        content: 'That makes sense. Less pressure.',
        timestamp: '9:47 AM'
      },
      {
        id: '8',
        type: 'assistant',
        content: 'Exactly. You\'re making it easier for him to engage instead of shutting down.',
        timestamp: '9:48 AM'
      }
    ]
  },
  {
    id: 'grindr-connection',
    title: 'Dating App Fatigue',
    theme: 'Self-Worth & Connection',
    userName: 'Alex',
    coachName: 'Kai',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Kai, I\'m so drained from Grindr. Same cycle every night.',
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
  }
];
