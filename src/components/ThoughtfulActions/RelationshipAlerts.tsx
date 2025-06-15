
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart, Sparkles, Calendar, MessageSquare, Bell, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const RELATIONSHIP_ALERTS = [
  {
    id: 1,
    title: "Daily Check-in",
    message: "Ask your partner how they're feeling today",
    frequency: "Daily",
    icon: Heart,
    completed: false
  },
  {
    id: 2,
    title: "Express Gratitude",
    message: "Tell your partner one thing you appreciate about them",
    frequency: "Daily",
    icon: Sparkles,
    completed: false
  },
  {
    id: 3,
    title: "Quality Time",
    message: "Plan 15 minutes of phone-free time together",
    frequency: "Daily",
    icon: Calendar,
    completed: false
  },
  {
    id: 4,
    title: "Physical Affection",
    message: "Give your partner a hug or kiss without expecting anything in return",
    frequency: "Daily",
    icon: Heart,
    completed: false
  },
  {
    id: 5,
    title: "Active Listening",
    message: "Ask your partner about their day and really listen to their response",
    frequency: "Daily",
    icon: MessageSquare,
    completed: false
  }
];

const RelationshipAlerts = () => {
  const [alerts, setAlerts] = useState(RELATIONSHIP_ALERTS);

  const toggleAlert = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, completed: !alert.completed }
        : alert
    ));
    
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.completed) {
      toast.success(`Great job! You completed: ${alert.title}`);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200/50">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-pink-600" />
        <h3 className="text-lg font-semibold text-gray-900">Daily Relationship Reminders</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const IconComponent = alert.icon;
          return (
            <Alert key={alert.id} className={`transition-all duration-200 ${
              alert.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-pink-200 hover:border-pink-300'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert.completed 
                    ? 'bg-green-100' 
                    : 'bg-pink-100'
                }`}>
                  {alert.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <IconComponent className="w-4 h-4 text-pink-600" />
                  )}
                </div>
                <div className="flex-1">
                  <AlertTitle className={alert.completed ? 'text-green-900 line-through' : 'text-gray-900'}>
                    {alert.title}
                  </AlertTitle>
                  <AlertDescription className={alert.completed ? 'text-green-700 line-through' : 'text-gray-600'}>
                    {alert.message}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAlert(alert.id)}
                  className={alert.completed ? 'text-green-600 hover:text-green-700' : 'text-pink-600 hover:text-pink-700'}
                >
                  {alert.completed ? 'Undo' : 'Done'}
                </Button>
              </div>
            </Alert>
          );
        })}
      </div>
    </Card>
  );
};

export default RelationshipAlerts;
