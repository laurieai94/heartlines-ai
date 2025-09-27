import UnifiedNavigation from "@/components/UnifiedNavigation";
interface DashboardNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  compact?: boolean;
}

const DashboardNavigation = ({ activeTab, onValueChange, compact = false }: DashboardNavigationProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <nav className={`flex justify-start ${compact ? 'pb-2' : 'pb-4'}`}>
        <UnifiedNavigation 
          activeTab={activeTab} 
          onValueChange={onValueChange}
          className="w-auto"
        />
      </nav>
    </div>
  );
};

export default DashboardNavigation;
