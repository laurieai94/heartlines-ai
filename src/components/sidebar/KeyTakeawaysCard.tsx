
import { Card } from "@/components/ui/card";
import { Target, BookOpen } from "lucide-react";

interface KeyTakeawaysCardProps {
  chatHistory: any[];
}

const KeyTakeawaysCard = ({ chatHistory }: KeyTakeawaysCardProps) => {
  const extractTakeaways = () => {
    if (chatHistory.length === 0) return [];
    
    const aiMessages = chatHistory.filter(msg => msg.type === 'ai');
    const takeaways = [];
    
    aiMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      if (content.includes('pattern') || content.includes('notice') || content.includes('sounds like')) {
        const sentences = msg.content.split('.').filter(s => s.length > 20);
        if (sentences.length > 0) {
          takeaways.push({
            id: msg.id,
            insight: sentences[0].trim() + '.',
            timestamp: msg.timestamp
          });
        }
      }
    });
    
    return takeaways.slice(0, 4);
  };

  const takeaways = extractTakeaways();

  return (
    <Card className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg animate-slide-up" style={{animationDelay: '0.3s'}}>
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-3 h-3 text-orange-300" />
        <h3 className="text-sm font-medium text-white">Key Takeaways</h3>
      </div>
      <div className="space-y-1">
        {chatHistory.length === 0 ? (
          <p className="text-xs text-pink-200/80">Your insights and discoveries will appear here</p>
        ) : takeaways.length > 0 ? (
          <>
            <div className="space-y-2">
              {takeaways.map((takeaway, index) => (
                <div 
                  key={takeaway.id}
                  className="p-2 bg-white/5 rounded text-xs text-pink-200/90 border border-white/10 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-3 h-3 text-orange-300 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{takeaway.insight}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 p-2 bg-white/5 rounded text-xs text-pink-200/80 animate-fade-in">
              <strong>Growing together:</strong> These insights help build stronger connection and understanding
            </div>
          </>
        ) : (
          <p className="text-xs text-pink-200/80">Keep exploring together - insights will emerge as we talk</p>
        )}
      </div>
    </Card>
  );
};

export default KeyTakeawaysCard;
