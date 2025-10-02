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
  }
];
