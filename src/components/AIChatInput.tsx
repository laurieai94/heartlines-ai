import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  userName?: string;
  partnerName?: string;
  chatHistory?: any[];
  showProfileGlow?: boolean;
  atLimit?: boolean;
}

const AIChatInput = ({ 
  onSendMessage, 
  loading, 
  disabled,
  readOnly,
  placeholder,
  inputRef,
  onInputFocus,
  onInputBlur,
  userName,
  partnerName, 
  chatHistory = [],
  showProfileGlow = false,
  atLimit = false
}: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isMobile } = useOptimizedMobile();

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    if (loading) return; // Don't send while AI is thinking
    if (disabled) {
      // If disabled, trigger onInputFocus to show auth/profile modal
      onInputFocus?.();
      return;
    }
    
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
    
      // Refocus directly to keep keyboard open
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
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

  // Handle focus - let browser handle keyboard naturally
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onInputFocus?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCurrentMessage(newValue);
    adjustTextareaHeight();
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex gap-1.5 md:gap-3 items-center px-1 md:px-0 touch-action-manipulation pointer-events-auto cursor-text ${readOnly ? 'group' : ''}`} style={{ minHeight: (readOnly && window.innerWidth < 768) ? '52px' : '44px' }}>
      <div 
        className={`flex-1 relative isolate rounded-2xl overflow-hidden cursor-text ${
          readOnly 
            ? `border-2 ${
                atLimit 
                  ? 'border-coral-400/30 shadow-[0_0_12px_rgba(251,146,60,0.25),0_0_24px_rgba(236,72,153,0.2),0_0_36px_rgba(251,113,133,0.15)] animate-pulse-glow' 
                  : 'border-pink-400/30'
              }` 
            : isMobile
              ? 'border-2 border-pink-400/30 focus-within:border-coral-400/70 focus-within:ring-2 focus-within:ring-coral-400/30 focus-within:shadow-lg transition-all duration-150'
              : 'border-2 border-pink-400/30 ring-2 ring-pink-400/10 focus-within:border-coral-400/40 focus-within:ring-4 focus-within:ring-coral-400/20 focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.2),0_0_12px_rgba(236,72,153,0.6),0_0_24px_rgba(251,113,133,0.4),0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300'
        }`}
        onClick={() => {
          if (textareaRef.current && !readOnly && !disabled) {
            textareaRef.current.focus();
          }
        }}
        onTouchEnd={(e) => {
          if (textareaRef.current && !readOnly && !disabled) {
            // Focus directly - iOS requires .focus() to be called synchronously within user gesture
            textareaRef.current.focus();
          }
        }}
      >
        <Textarea
          unstyled
          ref={textareaRef}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={() => onInputBlur?.()}
          onClick={() => onInputFocus?.()}
          placeholder={placeholder ?? (readOnly ? "👤 Complete your profile to start chatting..." : (chatHistory.length === 0 ? "What's up?" : ""))}
          readOnly={readOnly || disabled}
          aria-label={readOnly ? "Click to complete your profile to unlock AI chat" : undefined}
          name="chat-message"
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
          autoComplete="off"
          spellCheck={true}
          enterKeyHint="send"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          className={`w-full bg-transparent border-0 px-3 py-2 md:px-4 md:py-[8px] text-sm resize-none ${readOnly ? 'min-h-[44px]' : 'min-h-[36px]'} md:min-h-[36px] max-h-[60px] md:max-h-[60px] leading-[20px] text-left text-white placeholder:text-left placeholder:text-white/90 caret-white ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 ring-transparent focus:ring-transparent focus-visible:ring-transparent outline-none focus:outline-none focus-visible:outline-none shadow-none focus:shadow-none focus-visible:shadow-none appearance-none mobile-chat-input`}
          style={{ 
            WebkitTapHighlightColor: 'transparent', 
            WebkitAppearance: 'none',
            textAlign: 'left',
            caretColor: '#ffffff !important',
            WebkitTextFillColor: 'white !important',
            color: 'white !important',
            fontSize: window.innerWidth < 768 ? '14px' : '16px'
          }}
          rows={1}
        />
      </div>
      
      <Button
        onClick={sendMessage}
        onPointerDown={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        className="rounded-2xl w-9 h-9 md:w-11 md:h-11 p-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border-2 border-pink-400/30 bg-gradient-to-br from-pink-500 via-coral-500 to-orange-500 hover:from-pink-400 hover:via-coral-400 hover:to-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3),0_0_40px_rgba(236,72,153,0.3)] hover:shadow-[0_0_24px_rgba(251,146,60,0.4),0_0_48px_rgba(236,72,153,0.4)] transition-all duration-300"
      >
        <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </Button>
    </div>
  );
};

export default AIChatInput;
