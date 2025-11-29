import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import type { SubscriptionAnalyticsSummary } from '@/types/admin';

interface AdminRevenueCardsProps {
  data: SubscriptionAnalyticsSummary | null;
  isLoading: boolean;
  error: Error | null;
}

export const AdminRevenueCards = ({ data, isLoading, error }: AdminRevenueCardsProps) => {
  if (error) {
    return (
      <div className="text-destructive text-sm">
        Error loading revenue metrics: {error.message}
      </div>
    );
  }

  const churnRate = data && data.total_paid_subscribers > 0
    ? ((data.cancellations_this_month / data.total_paid_subscribers) * 100).toFixed(2)
    : '0.00';

  const cards = [
    {
      title: 'Monthly Recurring Revenue',
      value: data ? `$${data.monthly_recurring_revenue.toFixed(2)}` : '$0.00',
      icon: DollarSign,
      loading: isLoading,
    },
    {
      title: 'Annual Run Rate',
      value: data ? `$${data.annual_recurring_revenue.toFixed(2)}` : '$0.00',
      icon: TrendingUp,
      loading: isLoading,
    },
    {
      title: 'Avg Revenue Per User',
      value: data ? `$${data.average_revenue_per_user.toFixed(2)}` : '$0.00',
      icon: Users,
      loading: isLoading,
    },
    {
      title: 'Conversion Rate',
      value: data ? `${data.conversion_rate_percentage}%` : '0%',
      icon: Target,
      loading: isLoading,
    },
    {
      title: 'Total Paid Subscribers',
      value: data?.total_paid_subscribers?.toString() || '0',
      icon: Users,
      loading: isLoading,
    },
    {
      title: 'Churn Rate',
      value: `${churnRate}%`,
      icon: TrendingUp,
      loading: isLoading,
    },
    {
      title: 'Avg Cost Per Trial',
      value: data ? `$${data.avg_cost_per_trial_user.toFixed(4)}` : '$0.0000',
      icon: DollarSign,
      loading: isLoading,
    },
    {
      title: 'Total Trial Users',
      value: data?.total_trial_users?.toString() || '0',
      icon: Users,
      loading: isLoading,
    },
    {
      title: 'CAC (Cost/Conversion)',
      value: data ? `$${data.cac_per_conversion.toFixed(4)}` : '$0.0000',
      icon: DollarSign,
      loading: isLoading,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.loading ? '...' : card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
