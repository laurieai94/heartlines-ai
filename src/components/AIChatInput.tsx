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
  chatHistory = []
}: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;

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
      const maxHeight = window.innerWidth < 768 ? 88 : 100; // Match max-h classes
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
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

  return (
    <div className={`flex gap-2 md:gap-3 items-end px-0 md:px-0 ${readOnly ? 'group' : ''}`}>
      <div className={`flex-1 rounded-2xl overflow-hidden ${
        readOnly 
          ? 'brand-gradient-soft md:border-2 md:border-white/20 md:backdrop-blur-sm' 
          : 'bg-white/5 md:supports-[backdrop-filter]:backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] md:border-2 md:border-white/15'
      }`}>
        <Textarea
          ref={textareaRef}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={onInputFocus}
          onClick={() => onInputFocus?.()}
          placeholder={placeholder ?? (chatHistory.length === 0 ? "Let's dive in..." : "Continue the conversation...")}
          readOnly={readOnly || disabled}
          aria-label={readOnly ? "Click to complete your profile" : undefined}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
          autoComplete="off"
          spellCheck={true}
          enterKeyHint="send"
          className="rounded-none bg-transparent border-0 shadow-none px-2 py-2 md:px-4 md:py-3 text-base md:text-sm resize-none min-h-[44px] md:min-h-[50px] max-h-[88px] md:max-h-[100px] leading-relaxed focus-visible:ring-0 focus:outline-none text-white placeholder:text-white/90 caret-white"
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
        className={`rounded-2xl w-10 h-10 md:w-12 md:h-12 p-0 shadow-lg text-white focus-visible:ring-0 focus-visible:ring-offset-0 ${
          readOnly 
            ? 'brand-gradient-soft' 
            : 'brand-gradient'
        }`}
      >
        <Send className="w-2.5 h-2.5 md:w-4 md:h-4" />
      </Button>
    </div>
  );
};

export default AIChatInput;
