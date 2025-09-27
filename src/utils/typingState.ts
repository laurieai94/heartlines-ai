// Enhanced global typing state to prevent interruptions during user input
let globalTypingState = {
  isTyping: false,
  lastActivity: 0,
  activeElement: null as HTMLElement | null,
  isExternalInput: false
};

// Enhanced input detection function
const isInputElement = (element: Element | null): boolean => {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
  const isContentEditable = element.getAttribute('contenteditable') === 'true';
  const isInForm = element.closest('form') !== null;
  const hasInputRole = element.getAttribute('role') === 'textbox' || 
                      element.getAttribute('role') === 'combobox';
  
  return isInput || isContentEditable || isInForm || hasInputRole;
};

// Enhanced function to detect if user is actively typing anywhere
const detectActiveInput = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  
  // Check if it's any kind of input
  if (isInputElement(activeElement)) {
    return true;
  }
  
  // Check for shadow DOM inputs or embedded content
  const isInIframe = activeElement.tagName.toLowerCase() === 'iframe';
  const isInShadowRoot = activeElement.shadowRoot !== null;
  
  return isInIframe || isInShadowRoot;
};

export const setGlobalTypingState = (isTyping: boolean, element?: HTMLElement) => {
  const now = Date.now();
  const isExternalInput = element ? !element.closest('[data-chat-container]') : false;
  
  globalTypingState.isTyping = isTyping;
  globalTypingState.lastActivity = now;
  globalTypingState.isExternalInput = isExternalInput;
  
  if (element) {
    globalTypingState.activeElement = element;
  }
  
  // Also check for any active input in the document
  if (detectActiveInput()) {
    globalTypingState.isTyping = true;
    globalTypingState.lastActivity = now;
  }
};

export const isUserTyping = (): boolean => {
  const timeSinceActivity = Date.now() - globalTypingState.lastActivity;
  const recentActivity = timeSinceActivity < 3000; // Increased to 3 seconds
  
  // Always check current document state as well
  const currentlyTyping = detectActiveInput();
  
  return (globalTypingState.isTyping && recentActivity) || currentlyTyping;
};

export const isUserTypingExternally = (): boolean => {
  return globalTypingState.isExternalInput && isUserTyping();
};

export const shouldPreventNavigation = (): boolean => {
  return isUserTyping();
};

export const shouldPreventFocusManagement = (): boolean => {
  return isUserTyping() || isUserTypingExternally();
};