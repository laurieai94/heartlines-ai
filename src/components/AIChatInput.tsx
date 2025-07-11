import { useState } from "react";
import { ConversationStarters } from "./chat-input/ConversationStarters";
import { ChatTypingIndicator } from "./chat-input/ChatTypingIndicator";
import { ChatTextInput } from "./chat-input/ChatTextInput";
import { useTypingIndicator } from "./chat-input/useTypingIndicator";

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName?: string;
  partnerName?: string;
  chatHistory?: any[];
  onSpeakResponse?: (speakFunction: (text: string) => void) => void;
}

const AIChatInput = ({ 
  onSendMessage, 
  loading, 
  userName, 
  partnerName, 
  chatHistory = [],
  onSpeakResponse 
}: AIChatInputProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const { isTyping, handleInputChange } = useTypingIndicator(currentMessage);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMessageChange = (value: string) => {
    setCurrentMessage(value);
    handleInputChange(value);
  };

  const handleQuickStarter = (starter: string) => {
    onSendMessage(starter);
  };

  const handleVoiceMessage = (message: string) => {
    onSendMessage(message);
  };

  const showQuickStarters = chatHistory.length === 0;
  const placeholder = chatHistory.length === 0 ? "Let's dive in..." : "Continue the conversation...";

  return (
    <div className="space-y-3">
      {/* Kai is Listening Indicator */}
      <ChatTypingIndicator isTyping={isTyping} currentMessage={currentMessage} />

      {/* Conversation Starters */}
      {showQuickStarters && (
        <ConversationStarters onSelectStarter={handleQuickStarter} />
      )}

      {/* Chat Input */}
      <ChatTextInput
        currentMessage={currentMessage}
        onMessageChange={handleMessageChange}
        onSendMessage={sendMessage}
        onVoiceMessage={handleVoiceMessage}
        onSpeakResponse={onSpeakResponse}
        loading={loading}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default AIChatInput;