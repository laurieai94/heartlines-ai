import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import VoiceInterface from "../VoiceInterface";

interface ChatTextInputProps {
  currentMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onVoiceMessage: (message: string) => void;
  onSpeakResponse?: (speakFunction: (text: string) => void) => void;
  loading: boolean;
  placeholder: string;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatTextInput = ({ 
  currentMessage, 
  onMessageChange, 
  onSendMessage, 
  onVoiceMessage,
  onSpeakResponse,
  loading, 
  placeholder, 
  onKeyPress 
}: ChatTextInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(e.target.value);
  };

  const handleSend = () => {
    onSendMessage();
    // Keep focus on textarea after sending message
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleVoice = (message: string) => {
    onVoiceMessage(message);
    // Keep focus on textarea after sending voice message
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={onKeyPress}
          placeholder={placeholder}
          disabled={loading}
          className="border-2 border-coral-200/50 focus:border-coral-300 rounded-2xl px-4 py-3 text-sm resize-none min-h-[50px] max-h-[100px] focus:ring-2 focus:ring-coral-200/30 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:bg-white leading-relaxed"
          rows={1}
        />
      </div>
      
      {/* Voice Interface - Compact */}
      <VoiceInterface
        onVoiceMessage={handleVoice}
        onSpeakResponse={onSpeakResponse}
        disabled={loading}
      />
      
      <Button
        onClick={handleSend}
        disabled={!currentMessage.trim() || loading}
        className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 rounded-2xl w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};
