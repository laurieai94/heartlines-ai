import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CostData {
  date: string;
  model: string;
  total_cost: number;
  message_count: number;
}

interface AdminCostChartProps {
  data: CostData[];
}

const AdminCostChart = ({ data }: AdminCostChartProps) => {
  // Group by date and aggregate costs
  const chartData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing.cost += item.total_cost;
      existing.messages += item.message_count;
    } else {
      acc.push({
        date: item.date,
        cost: item.total_cost,
        messages: item.message_count,
        formattedDate: format(new Date(item.date), 'MMM dd')
      });
    }
    return acc;
  }, [] as { date: string; cost: number; messages: number; formattedDate: string }[])
  .reverse();

  const isEmpty = !data || data.length === 0;

  return (
    <Card className="bg-gradient-to-br from-burgundy-800/40 to-burgundy-900/30 backdrop-blur-lg border-pink-400/20">
      <CardHeader>
        <CardTitle className="text-white">Daily Cost Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-white/60 text-sm">No cost data available yet</p>
              <p className="text-white/40 text-xs">Cost tracking will appear after messages are sent</p>
            </div>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(251, 146, 60, 0.1)" />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#fff"
              opacity={0.6}
              fontSize={12}
            />
            <YAxis 
              stroke="#fff"
              opacity={0.6}
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(3)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(88, 28, 56, 0.95)',
                border: '1px solid rgba(251, 146, 60, 0.3)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => [
                name === 'cost' ? `$${value.toFixed(4)}` : value,
                name === 'cost' ? 'Cost' : 'Messages'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#FB923C" 
              strokeWidth={2}
              dot={{ fill: '#FB923C', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCostChart;
