
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useConversationTopics } from "@/hooks/useConversationTopics";

interface ConversationTopicsCardProps {
  chatHistory: any[];
}

const ConversationTopicsCard = ({ chatHistory }: ConversationTopicsCardProps) => {
  const { topics, loading } = useConversationTopics();

  const sortedTopics = topics.sort((a, b) => {
    if (a.frequency !== b.frequency) {
      return b.frequency - a.frequency;
    }
    return new Date(b.mentioned_at).getTime() - new Date(a.mentioned_at).getTime();
  });

  return (
    <Card className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm animate-slide-up" style={{animationDelay: '0.2s'}}>
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-3 h-3 text-orange-300" />
        <h3 className="text-sm font-medium text-white">What We've Covered</h3>
      </div>
      <div className="space-y-1">
        {loading ? (
          <p className="text-xs text-pink-200/60">Loading topics...</p>
        ) : chatHistory.length === 0 ? (
          <p className="text-xs text-pink-200/60">Start chatting and I'll track our conversation themes</p>
        ) : sortedTopics.length > 0 ? (
          <>
            <div className="space-y-1">
              {sortedTopics.slice(0, 4).map((topic, index) => (
                <Badge 
                  key={topic.id} 
                  variant="outline" 
                  className="w-full justify-between border-white/30 text-white bg-white/10 text-xs h-6 hover:bg-white/20 transition-all duration-200 hover:scale-105 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-2 h-2" />
                    <span className="truncate text-xs">{topic.topic}</span>
                  </div>
                  {topic.frequency > 1 && (
                    <span className="bg-orange-300 text-black px-1 py-0.5 rounded-full text-xs font-medium">
                      {topic.frequency}x
                    </span>
                  )}
                </Badge>
              ))}
            </div>
            {sortedTopics.length > 4 && (
              <p className="text-xs text-pink-200/60 mt-1">
                +{sortedTopics.length - 4} more topics discussed
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-pink-200/60">Keep chatting and I'll identify conversation themes</p>
        )}
      </div>
    </Card>
  );
};

export default ConversationTopicsCard;
