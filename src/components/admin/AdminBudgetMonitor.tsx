import { useAdminBudgetAnalytics } from '@/hooks/useAdminBudgetAnalytics';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

const AdminBudgetMonitor = () => {
  const { data, isLoading, error } = useAdminBudgetAnalytics();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-burgundy-800/60 to-burgundy-900/40 backdrop-blur-lg border border-pink-400/20 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-coral-400" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gradient-to-br from-burgundy-800/60 to-burgundy-900/40 backdrop-blur-lg border border-red-400/30 rounded-xl p-6">
        <p className="text-red-200 text-sm">Failed to load budget analytics</p>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      active 
        ? 'bg-red-500/20 text-red-300 border border-red-400/30' 
        : 'bg-green-500/20 text-green-300 border border-green-400/30'
    }`}>
      {active ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
      {label}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-burgundy-800/60 to-burgundy-900/40 backdrop-blur-lg border border-pink-400/20 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-coral-500/20 to-pink-500/20 border border-coral-400/30">
            <DollarSign className="w-5 h-5 text-coral-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Budget Monitor</h2>
            <p className="text-white/60 text-sm">Real-time spend tracking • Auto-refreshes every 60s</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 ${getHealthColor(data.budgetHealth)}`}>
          {data.budgetHealth === 'healthy' && <CheckCircle className="w-5 h-5" />}
          {data.budgetHealth === 'warning' && <AlertTriangle className="w-5 h-5" />}
          {data.budgetHealth === 'critical' && <AlertTriangle className="w-5 h-5 animate-pulse" />}
          <span className="font-medium capitalize">{data.budgetHealth}</span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Spend */}
        <Card className="bg-white/5 border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm font-medium">Today</span>
            <Zap className="w-4 h-4 text-coral-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">${data.todaySpend.toFixed(2)}</span>
              <span className="text-white/50 text-sm">/ ${data.dailyLimit}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 ${getProgressColor(data.dailyPercentUsed)} rounded-full transition-all`}
                style={{ width: `${Math.min(100, data.dailyPercentUsed)}%` }}
              />
            </div>
            <p className="text-white/50 text-xs">{data.dailyPercentUsed.toFixed(1)}% of daily limit</p>
          </div>
        </Card>

        {/* Monthly Spend */}
        <Card className="bg-white/5 border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm font-medium">This Month</span>
            <Calendar className="w-4 h-4 text-coral-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">${data.monthSpend.toFixed(2)}</span>
              <span className="text-white/50 text-sm">/ ${data.monthlyBudget}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 ${getProgressColor(data.monthlyPercentUsed)} rounded-full transition-all`}
                style={{ width: `${Math.min(100, data.monthlyPercentUsed)}%` }}
              />
            </div>
            <p className="text-white/50 text-xs">{data.monthlyPercentUsed.toFixed(1)}% of monthly budget</p>
          </div>
        </Card>

        {/* Runway */}
        <Card className="bg-white/5 border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm font-medium">Runway</span>
            <Clock className="w-4 h-4 text-coral-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">~{Math.floor(data.runwayDays)}</span>
              <span className="text-white/50 text-sm">days</span>
            </div>
            <p className="text-white/50 text-xs">at ${data.avgDailySpend.toFixed(2)}/day avg</p>
            <p className="text-white/50 text-xs">
              Projected: ${data.projectedMonthlySpend.toFixed(2)}/mo
              {data.projectedMonthlySpend <= data.monthlyBudget 
                ? <span className="text-green-400 ml-1">✓</span>
                : <span className="text-red-400 ml-1">⚠</span>
              }
            </p>
          </div>
        </Card>

        {/* Launch Status */}
        <Card className="bg-white/5 border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm font-medium">Launch Status</span>
            <Users className="w-4 h-4 text-coral-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{data.currentUserCount}</span>
              <span className="text-white/50 text-sm">/ {data.maxConcurrentUsers}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge 
                active={data.waitlistActive} 
                label={data.waitlistActive ? 'Waitlist On' : 'Open'} 
              />
              {data.autoThrottleEnabled && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <Zap className="w-3 h-3" />
                  Auto-throttle
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Capacity Estimates */}
      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-coral-400" />
          <span className="text-white/80 font-medium">Capacity Estimates</span>
          <span className="text-white/40 text-xs">(~${data.costPerTrial.toFixed(2)}/trial)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Trials left today:</span>
            <span className="text-white font-medium">~{data.trialsLeftToday}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Trials left this month:</span>
            <span className="text-white font-medium">~{data.trialsLeftMonthly}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Daily remaining:</span>
            <span className="text-white font-medium">${data.dailyRemaining.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {data.budgetHealth !== 'healthy' && (
        <div className={`rounded-lg p-4 ${
          data.budgetHealth === 'critical' 
            ? 'bg-red-500/10 border border-red-400/30' 
            : 'bg-yellow-500/10 border border-yellow-400/30'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${
              data.budgetHealth === 'critical' ? 'text-red-400' : 'text-yellow-400'
            }`} />
            <div>
              <p className={`font-medium ${
                data.budgetHealth === 'critical' ? 'text-red-200' : 'text-yellow-200'
              }`}>
                {data.budgetHealth === 'critical' 
                  ? 'Budget Critical' 
                  : 'Approaching Limit'}
              </p>
              <p className={`text-sm mt-1 ${
                data.budgetHealth === 'critical' ? 'text-red-300/70' : 'text-yellow-300/70'
              }`}>
                {data.dailyPercentUsed >= 90 
                  ? `Daily spend is at ${data.dailyPercentUsed.toFixed(0)}%. Waitlist will auto-activate at 100%.`
                  : data.monthlyPercentUsed >= 90
                    ? `Monthly budget is at ${data.monthlyPercentUsed.toFixed(0)}%. Consider upgrading Anthropic tier.`
                    : `Spend is approaching limits. Monitor closely.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBudgetMonitor;
