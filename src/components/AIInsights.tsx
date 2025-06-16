
import { useState } from "react";
import { ChatMessage, AIInsightsProps } from "@/types/AIInsights";
import AIChat from "./AIChat";
import AISidebar from "./AISidebar";

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <AIChat 
        profiles={profiles}
        demographicsData={demographicsData}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
      />
      <AISidebar 
        profiles={profiles}
        demographicsData={demographicsData}
        chatHistory={chatHistory}
      />
    </div>
  );
};

export default AIInsights;
