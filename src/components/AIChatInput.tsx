import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  onInputFocus?: () => void;
  onTypingChange?: (typing: boolean) => void;
  userName?: string;
  partnerName?: string;
  chatHistory?: any[];
  showProfileGlow?: boolean;
}

const AIChatInput = ({ 
  onSendMessage, 
  loading, 
  disabled,
  readOnly,
  placeholder,
  inputRef,
  onInputFocus,
  onTypingChange,
  userName, 
  partnerName, 
  chatHistory = [],
  showProfileGlow = false
}: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const focusKeeperRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveFocusRef = useRef(false);
  const cursorPositionRef = useRef<HTMLDivElement>(null);

  // Calculate cursor position based on text content - now enabled for all devices
  const updateCursorPosition = () => {
    if (!textareaRef.current || !cursorPositionRef.current) return;

    const textarea = textareaRef.current;
    const text = textarea.value;
    const computedStyle = window.getComputedStyle(textarea);
    
    // Create a temporary element to measure text width
    const measurer = document.createElement('div');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'pre';
    measurer.style.font = computedStyle.font;
    measurer.style.fontSize = computedStyle.fontSize;
    measurer.style.fontFamily = computedStyle.fontFamily;
    measurer.style.padding = computedStyle.padding;
    measurer.textContent = text;
    
    document.body.appendChild(measurer);
    const textWidth = measurer.offsetWidth;
    document.body.removeChild(measurer);
    
    // Calculate cursor position (account for padding)
    const paddingLeft = Math.max(parseInt(computedStyle.paddingLeft || '8', 10), 8);
    const paddingTop = Math.max(parseInt(computedStyle.paddingTop || '8', 10), 8);
    const cursorLeft = paddingLeft + (text.length === 0 ? 0 : Math.max(textWidth, 0));
    
    // Center cursor vertically within textarea, accounting for padding
    const textareaHeight = textarea.offsetHeight;
    const lineHeight = Math.max(parseInt(computedStyle.lineHeight || '20', 10), 18);
    const cursorTop = paddingTop + Math.max(((textareaHeight - paddingTop * 2 - lineHeight) / 2), 0);
    
    // Update CSS custom properties for cursor positioning with fallbacks
    cursorPositionRef.current.style.setProperty('--cursor-left', `${Math.max(cursorLeft, paddingLeft)}px`);
    cursorPositionRef.current.style.setProperty('--cursor-top', `${Math.max(cursorTop, paddingTop)}px`);
    cursorPositionRef.current.style.setProperty('--cursor-height', `${lineHeight}px`);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    if (loading) return; // Don't send while AI is thinking
    if (disabled) {
      // If disabled, trigger onInputFocus to show auth/profile modal
      onInputFocus?.();
      return;
    }
    
    // Clear typing indicator when sending
    if (onTypingChange) {
      onTypingChange(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
    
    // Keep focus in the textarea after sending - strengthen for mobile
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus({ preventScroll: true } as any);
        // Additional focus attempt for mobile keyboards
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus({ preventScroll: true } as any);
          }
        }, 50);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (loading) {
        // Prevent Enter from creating newlines while AI is thinking
        e.preventDefault();
        return;
      }
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = window.innerWidth < 768 ? 60 : 60; // Match max-h classes
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCurrentMessage(newValue);
    adjustTextareaHeight();
    
    // Track last input time to prevent aggressive focus stealing
    if (textareaRef.current) {
      textareaRef.current.dataset.lastInput = Date.now().toString();
    }
    
    // Always update cursor position for persistent blinking cursor
    updateCursorPosition();
    requestAnimationFrame(() => updateCursorPosition());
    
    // Handle typing indicator
    if (onTypingChange) {
      const isTyping = newValue.trim().length > 0;
      onTypingChange(isTyping);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing after inactivity
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          onTypingChange(false);
        }, 3000);
      }
    }
  };


  // Gentle focus management - respect user input activity
  const maintainFocus = () => {
    if (textareaRef.current && !disabled && !readOnly) {
      const activeElement = document.activeElement;
      const isTypingElsewhere = activeElement?.tagName === 'INPUT' || 
                               activeElement?.tagName === 'TEXTAREA' ||
                               activeElement?.getAttribute('contenteditable') === 'true';
      
      // More conservative focus management - only focus if no input is active
      if (!isTypingElsewhere && activeElement !== textareaRef.current) {
        // Add check for user input activity within last 3 seconds
        const lastInputTime = textareaRef.current.dataset.lastInput ? 
          parseInt(textareaRef.current.dataset.lastInput) : 0;
        const timeSinceInput = Date.now() - lastInputTime;
        
        // Don't steal focus if user was recently typing (within 3 seconds)
        if (timeSinceInput > 3000) {
          textareaRef.current.focus({ preventScroll: true });
        }
      }
    }
  };

  // Auto-focus the textarea when component mounts and maintain focus aggressively
  useEffect(() => {
    if (textareaRef.current && !disabled && !readOnly) {
      // Initial focus with delay to avoid conflicts
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          adjustTextareaHeight();
          updateCursorPosition();
        }
      }, 100);

      // Reduced focus keeper - less aggressive to prevent typing interruption
      const focusKeeper = setInterval(() => {
        maintainFocus();
      }, 10000); // Much less frequent - 10 seconds

      // Reduced click-to-refocus behavior to prevent typing interruption
      const handleChatAreaClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const isInChatArea = target.closest('[data-chat-container]') || 
                            target.closest('.chat-input-area');
        
        // Only restore focus if explicitly clicking the textarea itself
        if (isInChatArea && target === textareaRef.current) {
          setTimeout(() => maintainFocus(), 100);
        }
      };

      // Always update cursor position for persistent blinking
      const handleUpdate = () => {
        requestAnimationFrame(() => updateCursorPosition());
      };

      document.addEventListener('click', handleChatAreaClick);
      window.addEventListener('resize', handleUpdate);
      window.addEventListener('focus', handleUpdate);

      return () => {
        clearInterval(focusKeeper);
        document.removeEventListener('click', handleChatAreaClick);
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('focus', handleUpdate);
      };
    }
  }, [disabled, readOnly]);

  // Always update cursor position for persistent blinking
  useEffect(() => {
    updateCursorPosition();
    // Ensure cursor position updates after content changes
    const updateTimer = setTimeout(() => updateCursorPosition(), 50);
    
    return () => {
      clearTimeout(updateTimer);
    };
  }, [currentMessage]);

  // Adjust height on message clear
  useEffect(() => {
    adjustTextareaHeight();
  }, [currentMessage]);

  // Cleanup timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      isActiveFocusRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (focusKeeperRef.current) {
        clearInterval(focusKeeperRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex gap-2 md:gap-3 items-center px-0 md:px-0 ${readOnly ? 'group' : ''}`}>
      <div 
        ref={cursorPositionRef}
        className={`flex-1 relative isolate rounded-2xl overflow-hidden ${
          readOnly 
            ? 'brand-gradient-soft md:border-2 md:border-white/20 md:backdrop-blur-sm animate-bounce-gentle' 
            : 'bg-white/5 md:supports-[backdrop-filter]:backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] md:border-2 md:border-white/15'
        } ${showProfileGlow && readOnly ? 'animate-profile-glow animate-glow-pulse' : ''}`}>
        <Textarea
          unstyled
          ref={textareaRef}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={onInputFocus}
          onClick={() => onInputFocus?.()}
          placeholder={placeholder ?? (readOnly ? "👤 Complete your profile to start chatting..." : "")}
          readOnly={readOnly || disabled}
          aria-label={readOnly ? "Click to complete your profile to unlock AI chat" : undefined}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
          autoComplete="off"
          spellCheck={true}
          enterKeyHint="send"
          className="w-full bg-transparent border-0 px-2 py-2 md:px-3 md:py-2 text-sm resize-none min-h-[36px] md:min-h-[36px] max-h-[60px] md:max-h-[60px] leading-[20px] flex items-center text-left text-white placeholder:text-left placeholder:text-white/90 caret-white ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 ring-transparent focus:ring-transparent focus-visible:ring-transparent outline-none focus:outline-none focus-visible:outline-none shadow-none focus:shadow-none focus-visible:shadow-none appearance-none persistent-cursor"
          style={{ 
            WebkitTapHighlightColor: 'transparent', 
            WebkitAppearance: 'none',
            textAlign: 'left',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}
          rows={1}
        />
      </div>
      
      <Button
        onClick={sendMessage}
        onPointerDown={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => {
          e.preventDefault();
          // Immediately re-focus textarea on mobile
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
        className={`rounded-2xl w-8 h-8 md:w-9 md:h-9 p-0 shadow-lg text-white focus-visible:ring-0 focus-visible:ring-offset-0 ${
          readOnly 
            ? 'brand-gradient-soft' 
            : 'brand-gradient'
        }`}
      >
        <Send className="w-2 h-2 md:w-3 md:h-3" />
      </Button>
    </div>
  );
};

export default AIChatInput;
