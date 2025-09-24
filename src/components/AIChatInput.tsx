import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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


  // Auto-focus the textarea when component mounts and after interactions
  useEffect(() => {
    if (textareaRef.current && !disabled && !readOnly) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, [disabled, readOnly]);

  // Adjust height on message clear
  useEffect(() => {
    adjustTextareaHeight();
  }, [currentMessage]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex gap-2 md:gap-3 items-center px-0 md:px-0 ${readOnly ? 'group' : ''}`}>
      <div className={`flex-1 relative isolate rounded-2xl overflow-hidden ${
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
          placeholder={placeholder ?? (readOnly ? (isMobile ? "Almost ready! Complete profile" : "👤 Complete profile to chat") : (chatHistory.length === 0 ? "Let's dive in..." : "Continue the conversation..."))}
          readOnly={readOnly || disabled}
          aria-label={readOnly ? "Click to complete your profile to unlock AI chat" : undefined}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
          autoComplete="off"
          spellCheck={true}
          enterKeyHint="send"
          className="w-full bg-transparent border-0 px-3 py-[10px] md:px-3 md:py-[8px] text-base md:text-sm resize-none min-h-[40px] md:min-h-[36px] max-h-[64px] md:max-h-[60px] leading-[22px] md:leading-[20px] text-left text-white placeholder:text-left placeholder:text-white/90 caret-white ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 ring-transparent focus:ring-transparent focus-visible:ring-transparent outline-none focus:outline-none focus-visible:outline-none shadow-none focus:shadow-none focus-visible:shadow-none appearance-none"
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
