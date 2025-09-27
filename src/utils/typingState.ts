// Global typing state to prevent interruptions during user input
let globalTypingState = {
  isTyping: false,
  lastActivity: 0,
  activeElement: null as HTMLElement | null
};

export const setGlobalTypingState = (isTyping: boolean, element?: HTMLElement) => {
  globalTypingState.isTyping = isTyping;
  globalTypingState.lastActivity = Date.now();
  if (element) {
    globalTypingState.activeElement = element;
  }
};

export const isUserTyping = (): boolean => {
  const timeSinceActivity = Date.now() - globalTypingState.lastActivity;
  return globalTypingState.isTyping && timeSinceActivity < 2000;
};

export const shouldPreventNavigation = (): boolean => {
  return isUserTyping();
};