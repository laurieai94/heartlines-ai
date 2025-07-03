
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
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-burgundy-400" />
        Relationship Insights
      </h3>
      
      {alerts.map((alert) => {
        const IconComponent = alert.icon;
        return (
          <Card key={alert.id} className="p-8 glass-slate border border-burgundy-500/25 shadow-burgundy rounded-2xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 burgundy-sheen rounded-2xl flex items-center justify-center flex-shrink-0 shadow-burgundy">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-3 text-xl">{alert.title}</h4>
                <p className="text-champagne-200/90 mb-6 text-lg">{alert.description}</p>
                <Button 
                  size="lg" 
                  className="burgundy-sheen hover:shadow-burgundy text-white border-0 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-300"
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
