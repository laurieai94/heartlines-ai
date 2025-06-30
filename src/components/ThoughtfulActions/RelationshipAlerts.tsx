
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Heart, Calendar, MessageSquare } from "lucide-react";

interface ProfileData {
  your: any[];
  partner: any[];
}

interface DemographicsData {
  your: any;
  partner: any;
}

interface RelationshipAlertsProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
}

const RelationshipAlerts = ({ profiles, demographicsData }: RelationshipAlertsProps) => {
  // Sample alerts based on profile data
  const alerts = [];

  // Check if partner has been stressed lately (this would be based on real data)
  const partnerName = demographicsData.partner?.name || 'your partner';
  
  // Add sample alert if profiles exist
  if (profiles.partner.length > 0) {
    alerts.push({
      id: 1,
      type: 'attention',
      icon: Heart,
      title: `${partnerName} might need extra support`,
      description: `Based on their communication style, they may appreciate direct check-ins during stressful times.`,
      action: 'Send a supportive message',
      priority: 'medium'
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        Relationship Insights
      </h3>
      
      {alerts.map((alert) => {
        const IconComponent = alert.icon;
        return (
          <Card key={alert.id} className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 backdrop-blur-sm rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-2">{alert.title}</h4>
                <p className="text-slate-300 mb-4">{alert.description}</p>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl"
                >
                  {alert.action}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default RelationshipAlerts;
