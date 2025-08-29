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
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };


  // Auto-focus the textarea when component mounts and after interactions
  useEffect(() => {
    if (textareaRef.current && !loading && !disabled && !readOnly) {
      textareaRef.current.focus();
    }
  }, [loading, disabled, readOnly]);

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={onInputFocus}
          onClick={() => onInputFocus?.()}
          placeholder={placeholder ?? (chatHistory.length === 0 ? "Let's dive in..." : "Continue the conversation...")}
          disabled={readOnly ? false : (loading || disabled)}
          readOnly={readOnly}
          aria-label={readOnly ? "Click to complete your profile" : undefined}
          className={`border-2 rounded-2xl px-4 py-3 text-sm resize-none min-h-[50px] max-h-[100px] backdrop-blur-sm transition-all duration-300 leading-relaxed ${
            readOnly 
              ? 'cursor-pointer border-coral-300 bg-gradient-to-r from-coral-50 to-peach-50 hover:from-coral-100 hover:to-peach-100 focus:ring-4 focus:ring-coral-200/50 hover:border-coral-400 text-coral-600 placeholder:text-coral-500 hover:shadow-lg hover:shadow-coral-200/30 focus:shadow-lg focus:shadow-coral-200/30' 
              : 'border-coral-200/50 focus:border-coral-300 focus:ring-2 focus:ring-coral-200/30 bg-white/70 focus:shadow-lg focus:bg-white'
          }`}
          rows={1}
        />
      </div>
      
      <Button
        onClick={sendMessage}
        disabled={!currentMessage.trim() || loading || !!disabled}
        className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 rounded-2xl w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AIChatInput;
