
import KaiIntroCard from './KaiIntroCard';
import SafeSpaceCard from './SafeSpaceCard';
import ConversationTopicsCard from './ConversationTopicsCard';
import KeyTakeawaysCard from './KeyTakeawaysCard';
import APIKeyInput from '../APIKeyInput';

interface SidebarContentProps {
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
}

const SidebarContent = ({ 
  chatHistory, 
  isConfigured, 
  onSupabaseConfigured 
}: SidebarContentProps) => {
  return (
    <div className="w-full h-full overflow-y-auto space-y-3">
      <KaiIntroCard />
      <SafeSpaceCard />
      <ConversationTopicsCard chatHistory={chatHistory} />
      <KeyTakeawaysCard chatHistory={chatHistory} />

      <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
        <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />
      </div>
    </div>
  );
};

export default SidebarContent;
