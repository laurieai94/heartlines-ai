import { Card } from "@/components/ui/card";
import { useAdminApiMetrics } from "@/hooks/useAdminApiMetrics";
import { Loader2, Activity, Clock, RefreshCcw, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

const AdminApiHealthChart = () => {
  const { data: metricsData, isLoading, error } = useAdminApiMetrics();

  // Calculate current health status (last 24 hours)
  const healthStatus = useMemo(() => {
    if (!metricsData || metricsData.length === 0) {
      return { status: 'unknown', successRate: 0, p95Latency: 0, totalErrors: 0 };
    }

    const last24h = metricsData[0]; // Most recent day
    const successRate = last24h.success_rate_percent;
    const p95Latency = last24h.p95_response_time_ms;
    const totalErrors = 
      last24h.rate_limit_errors + 
      last24h.timeout_errors + 
      last24h.overload_errors + 
      last24h.auth_errors;

    let status: 'healthy' | 'warning' | 'critical' | 'unknown' = 'unknown';
    if (successRate > 99 && p95Latency < 2000) {
      status = 'healthy';
    } else if (successRate > 95 && p95Latency < 5000) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return { status, successRate, p95Latency, totalErrors };
  }, [metricsData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!metricsData) return [];
    return [...metricsData].reverse().map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      successRate: day.success_rate_percent,
      p50: day.p50_response_time_ms,
      p95: day.p95_response_time_ms,
      p99: day.p99_response_time_ms,
      avgRetries: day.avg_retries,
      rateLimitErrors: day.rate_limit_errors,
      timeoutErrors: day.timeout_errors,
      overloadErrors: day.overload_errors,
      authErrors: day.auth_errors,
      totalRequests: day.total_requests,
    }));
  }, [metricsData]);

  const statusColors = {
    healthy: { bg: 'bg-green-500/20', text: 'text-green-400', pulse: 'bg-green-500' },
    warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', pulse: 'bg-yellow-500' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400', pulse: 'bg-red-500' },
    unknown: { bg: 'bg-gray-500/20', text: 'text-gray-400', pulse: 'bg-gray-500' },
  };

  const statusMessages = {
    healthy: 'Kai is healthy',
    warning: 'Kai is experiencing delays',
    critical: 'Kai is having issues',
    unknown: 'Status unknown',
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-6">
        <p className="text-red-300">Failed to load API health metrics: {error.message}</p>
      </Card>
    );
  }

  const colors = statusColors[healthStatus.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-coral-200 to-orange-200 bg-clip-text text-transparent">
          API Health & Reliability
        </h2>
        
        {/* Real-time status indicator */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${colors.bg} border border-white/10`}>
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.pulse} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${colors.pulse}`}></span>
          </div>
          <span className={`text-sm font-medium ${colors.text}`}>
            {statusMessages[healthStatus.status]}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-white/60 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">{healthStatus.successRate.toFixed(2)}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-white/60 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">{healthStatus.p95Latency}ms</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-4">
          <div className="flex items-center gap-3">
            <RefreshCcw className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-white/60 text-sm">Retry Rate</p>
              <p className="text-2xl font-bold text-white">
                {metricsData && metricsData[0] ? 
                  ((metricsData[0].requests_with_retries / metricsData[0].total_requests) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-white/60 text-sm">Total Errors (24h)</p>
              <p className="text-2xl font-bold text-white">{healthStatus.totalErrors}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Response Time Trend */}
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Response Time Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(69, 10, 10, 0.9)', 
                border: '1px solid rgba(255, 192, 203, 0.3)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="p50" stroke="#60A5FA" name="p50 (ms)" strokeWidth={2} />
            <Line type="monotone" dataKey="p95" stroke="#FBBF24" name="p95 (ms)" strokeWidth={2} />
            <Line type="monotone" dataKey="p99" stroke="#F87171" name="p99 (ms)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Success Rate Trend */}
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Success Rate Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis domain={[90, 100]} stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(69, 10, 10, 0.9)', 
                border: '1px solid rgba(255, 192, 203, 0.3)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="successRate" 
              stroke="#10B981" 
              name="Success Rate (%)" 
              strokeWidth={3} 
            />
            {/* 99% target line */}
            <Line 
              type="monotone" 
              dataKey={() => 99} 
              stroke="#F59E0B" 
              name="Target (99%)" 
              strokeDasharray="5 5" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Error Distribution */}
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Error Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(69, 10, 10, 0.9)', 
                border: '1px solid rgba(255, 192, 203, 0.3)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="rateLimitErrors" stackId="a" fill="#F59E0B" name="Rate Limit" />
            <Bar dataKey="timeoutErrors" stackId="a" fill="#EF4444" name="Timeout" />
            <Bar dataKey="overloadErrors" stackId="a" fill="#EC4899" name="Overload" />
            <Bar dataKey="authErrors" stackId="a" fill="#8B5CF6" name="Auth" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Retry Pattern */}
      <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border border-pink-400/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Average Retries per Request</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(69, 10, 10, 0.9)', 
                border: '1px solid rgba(255, 192, 203, 0.3)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="avgRetries" fill="#F472B6" name="Avg Retries" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AdminApiHealthChart;
