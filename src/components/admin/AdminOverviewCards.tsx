import { Users, Activity, MessageSquare, DollarSign, ArrowDown, ArrowUp, MessageCircle, Clock, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminOverviewCardsProps {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  totalCost: number;
  avgInputTokens: number;
  avgOutputTokens: number;
  avgMessagesPerConversation: number;
  avgConversationDuration: number;
  avgSessionDuration: number;
}

const AdminOverviewCards = ({ 
  totalUsers, 
  activeUsers, 
  totalMessages, 
  totalCost, 
  avgInputTokens, 
  avgOutputTokens,
  avgMessagesPerConversation,
  avgConversationDuration,
  avgSessionDuration
}: AdminOverviewCardsProps) => {
  const cards = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-pink-500 to-coral-500"
    },
    {
      title: "Active Users (30d)",
      value: activeUsers.toLocaleString(),
      icon: Activity,
      gradient: "from-coral-500 to-orange-500"
    },
    {
      title: "Messages This Month",
      value: totalMessages.toLocaleString(),
      icon: MessageSquare,
      gradient: "from-orange-500 to-pink-500"
    },
    {
      title: "Cost Last 30 Days",
      value: `$${totalCost.toFixed(4)}`,
      icon: DollarSign,
      gradient: "from-pink-500 to-burgundy-500"
    },
    {
      title: "Avg Input Tokens",
      value: Math.round(avgInputTokens).toLocaleString(),
      icon: ArrowDown,
      gradient: "from-coral-500 to-pink-500"
    },
    {
      title: "Avg Output Tokens",
      value: Math.round(avgOutputTokens).toLocaleString(),
      icon: ArrowUp,
      gradient: "from-pink-500 to-coral-500"
    },
    {
      title: "Avg Messages/Chat",
      value: Math.round(avgMessagesPerConversation).toLocaleString(),
      icon: MessageCircle,
      gradient: "from-orange-500 to-pink-500"
    },
    {
      title: "Avg Chat Duration",
      value: `${Math.round(avgConversationDuration)}m`,
      icon: Clock,
      gradient: "from-pink-500 to-coral-500"
    },
    {
      title: "Avg Session Time",
      value: `${Math.round(avgSessionDuration)}m`,
      icon: Timer,
      gradient: "from-coral-500 to-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border-pink-400/20 hover:border-pink-400/40 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90 mb-1">{card.title}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-200 to-coral-200 bg-clip-text text-transparent">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} opacity-20`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminOverviewCards;
