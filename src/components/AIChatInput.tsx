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
    
    // Keep focus in the textarea after sending
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
    <div className={`flex gap-3 items-end ${readOnly ? 'group' : ''}`}>
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
          className={`border-2 rounded-2xl px-4 py-3 text-sm resize-none min-h-[50px] max-h-[100px] backdrop-blur-sm transition-all duration-300 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 ${
            readOnly 
              ? 'cursor-pointer border-white/20 brand-gradient-soft text-white placeholder:text-white/90 caret-white motion-safe:animate-bounce-gentle hover:animate-none focus:animate-none hover:brand-gradient-soft-hover hover:brightness-105 hover:scale-[1.02] hover:shadow-md focus:shadow-md transform-gpu group-hover:brightness-110 group-hover:shadow-lg group-hover:shadow-white/10 group-hover:-translate-y-px group-hover:backdrop-blur-md group-hover:scale-[1.02]' 
              : 'border-white/15 bg-white/5 supports-[backdrop-filter]:backdrop-blur-md text-white placeholder:text-white/75 caret-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] focus:border-white/25 cursor-text'
          }`}
          rows={1}
        />
      </div>
      
      <Button
        onClick={sendMessage}
        className={`rounded-2xl w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-white transform-gpu focus-visible:ring-0 focus-visible:ring-offset-0 ${
          readOnly 
            ? 'brand-gradient-soft hover:brand-gradient-soft-hover hover:brightness-105 group-hover:scale-110 group-hover:-translate-y-px' 
            : 'brand-gradient hover:brand-gradient-hover'
        }`}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AIChatInput;
