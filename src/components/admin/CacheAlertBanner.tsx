import { AlertTriangle, AlertCircle, CheckCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCacheAlerts } from "@/hooks/useCacheAlerts";
import { useState } from "react";

const CacheAlertBanner = () => {
  const { alert, isLoading } = useCacheAlerts();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !alert || dismissed) {
    return null;
  }

  // Don't show banner for healthy state
  if (alert.level === 'healthy') {
    return null;
  }

  const isCritical = alert.level === 'critical';
  const isWarning = alert.level === 'warning';

  return (
    <Card className={`relative border-2 ${
      isCritical 
        ? 'bg-red-950/40 border-red-400/40 animate-pulse' 
        : 'bg-yellow-950/40 border-yellow-400/40'
    } backdrop-blur-lg`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
            {isCritical ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${
                isCritical ? 'text-red-200' : 'text-yellow-200'
              }`}>
                {alert.message}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDismissed(true)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/60">Current Rate:</span>
                <span className={`ml-2 font-semibold ${
                  isCritical ? 'text-red-300' : 'text-yellow-300'
                }`}>
                  {alert.currentRate.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-white/60">Expected:</span>
                <span className="ml-2 font-semibold text-white">
                  {alert.expectedRate.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-white/60">Requests:</span>
                <span className="ml-2 font-semibold text-white">
                  {alert.totalRequests}
                </span>
              </div>
            </div>

            {/* Recommendations */}
            {alert.recommendations.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-white/80">Troubleshooting:</p>
                <ul className="text-xs text-white/70 space-y-1">
                  {alert.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-white/40">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CacheAlertBanner;
