import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { MonthlyRevenueSnapshot } from '@/types/admin';
import { format } from 'date-fns';

interface AdminRevenueChartProps {
  data: MonthlyRevenueSnapshot[];
  isLoading: boolean;
  error: Error | null;
}

export const AdminRevenueChart = ({ data, isLoading, error }: AdminRevenueChartProps) => {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">
            Error loading revenue trend: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No historical revenue data yet. Monthly snapshots will appear here once captured.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Reverse data for chronological order (oldest to newest)
  const chartData = [...data].reverse().map(snapshot => ({
    month: format(new Date(snapshot.snapshot_month), 'MMM yyyy'),
    mrr: snapshot.mrr,
    subscribers: snapshot.total_subscribers,
  }));

  const chartConfig = {
    mrr: {
      label: 'MRR',
      color: 'hsl(var(--chart-1))',
    },
    subscribers: {
      label: 'Subscribers',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="var(--color-mrr)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-mrr)' }}
                name="MRR ($)"
              />
              <Line
                type="monotone"
                dataKey="subscribers"
                stroke="var(--color-subscribers)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-subscribers)' }}
                name="Subscribers"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
