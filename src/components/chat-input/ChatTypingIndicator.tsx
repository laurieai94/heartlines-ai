interface ChatTypingIndicatorProps {
  isTyping: boolean;
  currentMessage: string;
}

export const ChatTypingIndicator = ({ isTyping, currentMessage }: ChatTypingIndicatorProps) => {
  if (!isTyping || !currentMessage.trim()) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 animate-fade-in">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
      <span className="text-sm text-white/70 font-light">Kai is listening...</span>
    </div>
  );
};