
import KaiIntroCard from './KaiIntroCard';
import SafeSpaceCard from './SafeSpaceCard';

interface SidebarContentProps {
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
}

const SidebarContent = ({ 
  isConfigured, 
  onSupabaseConfigured 
}: SidebarContentProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 p-4 space-y-3">
      <KaiIntroCard />
      <SafeSpaceCard />
    </div>
  );
};

export default SidebarContent;
