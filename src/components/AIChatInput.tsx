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
  onTypingChange,
  userName, 
  partnerName, 
  chatHistory = [],
  showProfileGlow = false,
  atLimit = false
}: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex gap-2 md:gap-3 items-center px-3 md:px-0 touch-action-manipulation pointer-events-auto cursor-text ${readOnly ? 'group' : ''}`} style={{ minHeight: (readOnly && window.innerWidth < 768) ? '52px' : '44px' }}>
      {/* Gradient border wrapper */}
      <div className={`flex-1 rounded-2xl transition-all duration-300 ${
        readOnly 
          ? `p-[2px] ${atLimit ? 'bg-gradient-to-r from-orange-500/70 via-rose-500/70 to-pink-600/70' : 'bg-gradient-to-r from-orange-400/40 via-rose-500/40 to-pink-500/40'} ring-2 ${atLimit ? 'ring-orange-400/30' : 'ring-orange-300/20'} ${
              atLimit 
                ? 'shadow-[0_0_30px_rgba(255,138,80,0.6),0_0_50px_rgba(255,107,157,0.4),0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,138,80,0.7),0_0_60px_rgba(255,107,157,0.5),0_4px_24px_rgba(0,0,0,0.4)] animate-pulse-subtle cursor-pointer' 
                : 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            }` 
          : 'p-[2px] bg-gradient-to-r from-orange-400/40 via-rose-500/40 to-pink-500/40 ring-2 ring-orange-300/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] focus-within:from-orange-400/60 focus-within:via-rose-500/60 focus-within:to-pink-500/60 focus-within:ring-orange-400/30 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:shadow-orange-400/20'
      }`}>
        {/* Inner container - transparent to show burgundy background */}
        <div className="relative isolate rounded-[14px] overflow-hidden">
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
