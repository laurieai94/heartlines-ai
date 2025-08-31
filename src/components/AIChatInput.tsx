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
        textareaRef.current.focus();
        // Additional focus attempt for mobile keyboards
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };


  // Auto-focus the textarea when component mounts and after interactions
  useEffect(() => {
    if (textareaRef.current && !disabled && !readOnly) {
      textareaRef.current.focus();
    }
  }, [disabled, readOnly]);

  return (
    <div className={`flex gap-2 md:gap-3 items-end px-1 md:px-0 ${readOnly ? 'group' : ''}`}>
      <div className="flex-1">
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
          className={`rounded-2xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-sm resize-none min-h-[44px] md:min-h-[50px] max-h-[88px] md:max-h-[100px] backdrop-blur-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 ${
            readOnly 
              ? 'cursor-pointer brand-gradient-soft text-white placeholder:text-white/90 caret-white border-0 md:border-2 md:border-white/20' 
              : 'bg-white/5 supports-[backdrop-filter]:backdrop-blur-md text-white placeholder:text-white/75 caret-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] cursor-text border-0 md:border-2 md:border-white/15'
          }`}
          rows={1}
        />
      </div>
      
      <Button
        onClick={sendMessage}
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
