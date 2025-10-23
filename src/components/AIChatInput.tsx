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
    
    // Let iOS handle keyboard naturally - don't force refocus
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
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

  // Handle focus to scroll input into view on mobile
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onInputFocus?.();
    
    // On mobile, scroll input into view instantly for better responsiveness
    if (window.innerWidth < 768 && textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current?.scrollIntoView({
          behavior: 'instant',
          block: 'center'
        });
      });
    }
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
    <div className={`flex gap-2 md:gap-3 items-center px-3 md:px-0 touch-action-manipulation pointer-events-auto cursor-text ${readOnly ? 'group' : ''}`} style={{ minHeight: (readOnly && window.innerWidth < 768) ? '52px' : '44px' }}>
      <div className={`flex-1 relative isolate rounded-2xl overflow-hidden ${
        readOnly 
          ? `brand-gradient-soft border-2 border-white/35 ring-2 ring-white/15 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] ${
              atLimit 
                ? 'shadow-coral-500/40 hover:shadow-pink-500/40 transition-all duration-300' 
                : ''
            }` 
          : 'bg-burgundy-800/40 backdrop-blur-xl border-2 border-white/35 ring-2 ring-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)] focus-within:ring-4 focus-within:ring-transparent focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(255,107,157,0.4),0_0_40px_rgba(255,138,80,0.3)] transition-all duration-300'
      }`}>
        <Textarea
          unstyled
          ref={textareaRef}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onClick={() => onInputFocus?.()}
          placeholder={placeholder ?? (readOnly ? "👤 Complete your profile to start chatting..." : (chatHistory.length === 0 ? "What's up?" : ""))}
          readOnly={readOnly || disabled}
          aria-label={readOnly ? "Click to complete your profile to unlock AI chat" : undefined}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
          autoComplete="off"
          spellCheck={true}
          enterKeyHint="send"
          className={`w-full bg-transparent border-0 px-3 ${readOnly ? 'py-2' : 'py-1'} md:px-4 md:py-[8px] text-sm resize-none ${readOnly ? 'min-h-[44px]' : 'min-h-[36px]'} md:min-h-[36px] max-h-[60px] md:max-h-[60px] leading-[20px] text-left text-white placeholder:text-left placeholder:text-white/90 caret-white ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 ring-transparent focus:ring-transparent focus-visible:ring-transparent outline-none focus:outline-none focus-visible:outline-none shadow-none focus:shadow-none focus-visible:shadow-none appearance-none mobile-chat-input`}
          style={{ 
            WebkitTapHighlightColor: 'transparent', 
            WebkitAppearance: 'none',
            textAlign: 'left',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
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
        className={`rounded-2xl ${readOnly ? 'w-9 h-9' : 'w-8 h-8'} md:w-9 md:h-9 p-0 shadow-2xl shadow-black/50 text-white focus-visible:ring-0 focus-visible:ring-offset-0 border-2 border-white/20 ${
          readOnly 
            ? 'brand-gradient-soft' 
            : 'brand-gradient'
        }`}
      >
        <Send className={`${readOnly ? 'w-3 h-3' : 'w-2 h-2'} md:w-3 md:h-3`} />
      </Button>
    </div>
  );
};

export default AIChatInput;
