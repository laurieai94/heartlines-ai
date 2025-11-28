import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, TrendingUp, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { useAdminCacheMetrics } from "@/hooks/useAdminCacheMetrics";
import { useCacheAlerts } from "@/hooks/useCacheAlerts";

const AdminCacheMetricsChart = () => {
  const { data: cacheData, isLoading } = useAdminCacheMetrics();
  const { alert } = useCacheAlerts();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-coral-400" />
            Prompt Cache Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-white/60">
            Loading cache metrics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cacheData || cacheData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-coral-400" />
            Prompt Cache Performance
          </CardTitle>
          <CardDescription className="text-white/60">
            Track prompt caching efficiency and cost savings over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-white/60">
            No cache metrics available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary statistics
  const totalRequests = cacheData.reduce((sum, day) => sum + (day.request_count || 0), 0);
  const totalCacheSavings = cacheData.reduce((sum, day) => sum + (day.total_cost_savings || 0), 0);
  const avgCacheHitRate = cacheData.length > 0
    ? cacheData.reduce((sum, day) => sum + (day.cache_hit_rate_percent || 0), 0) / cacheData.length
    : 0;

  // Format data for chart (reverse to show oldest to newest)
  const chartData = [...cacheData].reverse().map(item => ({
    date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown',
    hitRate: item.cache_hit_rate_percent || 0,
    requests: item.request_count || 0,
    savings: item.total_cost_savings || 0
  }));

  return (
    <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-coral-400" />
              Prompt Cache Performance
            </CardTitle>
            <CardDescription className="text-white/60">
              Last 30 days of caching efficiency and cost savings
            </CardDescription>
          </div>
          {alert && (
            <div className="flex items-center gap-2">
              {alert.level === 'critical' && (
                <div className="flex items-center gap-2 text-red-400 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Critical</span>
                </div>
              )}
              {alert.level === 'warning' && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Warning</span>
                </div>
              )}
              {alert.level === 'healthy' && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Healthy</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-burgundy-900/40 rounded-lg p-4 border border-pink-400/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Avg Cache Hit Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {avgCacheHitRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400/60" />
            </div>
          </div>

          <div className="bg-burgundy-900/40 rounded-lg p-4 border border-pink-400/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Cost Savings</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${totalCacheSavings.toFixed(2)}
                </p>
              </div>
              <Zap className="w-8 h-8 text-coral-400/60" />
            </div>
          </div>

          <div className="bg-burgundy-900/40 rounded-lg p-4 border border-pink-400/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalRequests.toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-pink-400/60" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
              label={{ value: 'Cache Hit Rate (%)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.6)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(88, 0, 32, 0.95)',
                border: '1px solid rgba(255, 182, 193, 0.2)',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'hitRate') return [`${value.toFixed(1)}%`, 'Cache Hit Rate'];
                if (name === 'savings') return [`$${value.toFixed(4)}`, 'Cost Savings'];
                return [value, name];
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'rgba(255, 255, 255, 0.8)' }}
              formatter={(value) => {
                if (value === 'hitRate') return 'Cache Hit Rate (%)';
                if (value === 'savings') return 'Daily Savings ($)';
                return value;
              }}
            />
            
            {/* Warning threshold line at 70% */}
            <ReferenceLine 
              y={70} 
              stroke="#eab308" 
              strokeDasharray="3 3"
              label={{ 
                value: 'Warning (70%)', 
                position: 'insideTopLeft',
                fill: '#eab308',
                fontSize: 11
              }}
            />
            
            <Line 
              type="monotone" 
              dataKey="hitRate" 
              stroke="#ff6b9d" 
              strokeWidth={2}
              dot={(props: any) => {
                const value = props.payload?.hitRate || 0;
                const color = value < 50 ? '#ef4444' : 
                             value < 70 ? '#eab308' : 
                             '#22c55e';
                return <circle {...props} fill={color} r={4} />;
              }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#ff9966" 
              strokeWidth={2}
              dot={{ fill: '#ff9966', r: 4 }}
              activeDot={{ r: 6 }}
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Info Text */}
        <p className="text-white/40 text-sm mt-4 text-center">
          Cache hits reduce input token costs by ~90%, resulting in significant cost savings
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminCacheMetricsChart;
