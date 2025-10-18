import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminCostAnalytics } from '@/hooks/useAdminCostAnalytics';
import { useIsAdmin } from '@/hooks/useUserRole';
import { Navigate } from 'react-router-dom';
import { formatCost } from '@/utils/modelPricing';
import { TrendingUp, DollarSign, MessageSquare, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminCostDashboard = () => {
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { data: analytics, isLoading: analyticsLoading } = useAdminCostAnalytics();

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  if (analyticsLoading || !analytics) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Cost Analytics Dashboard</h1>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-24" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-32 mb-2" />
                  <div className="h-3 bg-muted rounded w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Cost Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor Claude API spending across all users
          </p>
        </div>

        {/* Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend (All Time)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCost(analytics.totalCost)}</div>
              <p className="text-xs text-muted-foreground">
                Across {analytics.totalMessages.toLocaleString()} messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCost(analytics.last30Days.totalCost)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.last30Days.totalMessages.toLocaleString()} messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCost(analytics.thisMonth.totalCost)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.thisMonth.totalMessages.toLocaleString()} messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Cost/Message</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCost(analytics.averageCostPerMessage)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalInputTokens.toLocaleString()} in + {analytics.totalOutputTokens.toLocaleString()} out tokens
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Spending Trend (Last 30 Days)</CardTitle>
            <CardDescription>Cost and message volume over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailySpending}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === 'cost' ? formatCost(value) : value,
                    name === 'cost' ? 'Cost' : 'Messages'
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" name="cost" strokeWidth={2} />
                <Line type="monotone" dataKey="messages" stroke="hsl(var(--secondary))" name="messages" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cost by Model</CardTitle>
              <CardDescription>Spending breakdown by Claude model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.modelBreakdown.map((model) => (
                  <div key={model.model} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{model.model}</span>
                      <span className="text-sm font-bold">{formatCost(model.cost)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{model.messages.toLocaleString()} messages</span>
                      <span>{model.percentage.toFixed(1)}% of total</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${model.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Distribution</CardTitle>
              <CardDescription>Message volume by model</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.modelBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="model" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="messages" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Cost</CardTitle>
            <CardDescription>Users with highest Claude API spending</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Messages</TableHead>
                  <TableHead className="text-right">Avg Cost/Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="text-right font-mono">{formatCost(user.totalCost)}</TableCell>
                    <TableCell className="text-right">{user.messages.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{formatCost(user.averageCostPerMessage)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCostDashboard;
