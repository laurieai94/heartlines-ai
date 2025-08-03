
import KaiIntroCard from './KaiIntroCard';
import SafeSpaceCard from './SafeSpaceCard';
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
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 p-4 space-y-3">
      <KaiIntroCard />
      <SafeSpaceCard />
      <KeyTakeawaysCard chatHistory={chatHistory} />

      <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
        <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />
      </div>
    </div>
  );
};

export default SidebarContent;
