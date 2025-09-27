import UnifiedNavigation from './UnifiedNavigation';
interface DashboardNavigationProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  compact?: boolean;
}

const DashboardNavigation = ({ activeTab, onValueChange, compact = false }: DashboardNavigationProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className={`flex justify-start ${compact ? 'pb-2' : 'pb-4'}`}>
        <div className="w-full max-w-4xl">
          <UnifiedNavigation 
            activeTab={activeTab}
            onValueChange={onValueChange}
            variant="vertical"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;
