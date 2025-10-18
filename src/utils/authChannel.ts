// Cross-tab communication for authentication events
const CHANNEL_NAME = 'heartlines-auth';

export type AuthMessage = {
  type: 'AUTH_SUCCESS';
  userId: string;
  timestamp: number;
};

// Broadcast authentication success to other tabs
export const broadcastAuthSuccess = (userId: string) => {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return;
  }

  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const message: AuthMessage = {
      type: 'AUTH_SUCCESS',
      userId,
      timestamp: Date.now(),
    };
    channel.postMessage(message);
    channel.close();
  } catch (error) {
    console.error('Failed to broadcast auth success:', error);
  }
};

// Listen for authentication success from other tabs
export const listenForAuthSuccess = (callback: (userId: string) => void) => {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return () => {};
  }

  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    
    channel.onmessage = (event: MessageEvent<AuthMessage>) => {
      if (event.data?.type === 'AUTH_SUCCESS' && event.data?.userId) {
        callback(event.data.userId);
      }
    };

    // Return cleanup function
    return () => {
      channel.close();
    };
  } catch (error) {
    console.error('Failed to setup auth listener:', error);
    return () => {};
  }
};
