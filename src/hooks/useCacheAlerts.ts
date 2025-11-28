import { useMemo } from 'react';
import { useAdminCacheMetrics, DailyCacheMetrics } from './useAdminCacheMetrics';

const CACHE_ALERT_CONFIG = {
  criticalThreshold: 50,  // < 50% = critical
  warningThreshold: 70,   // < 70% = warning
  minRequestsForAlert: 10, // Need at least 10 requests to trigger alert
  alertWindowHours: 24,   // Analyze last 24 hours of data
  anomalyDropPercent: 20  // Alert if rate drops 20% below average
};

export type AlertLevel = 'healthy' | 'warning' | 'critical';

export interface CacheAlert {
  level: AlertLevel;
  message: string;
  currentRate: number;
  expectedRate: number;
  totalRequests: number;
  recommendations: string[];
}

export const useCacheAlerts = () => {
  const { data: metrics, isLoading } = useAdminCacheMetrics();

  const alert = useMemo((): CacheAlert | null => {
    if (isLoading || !metrics || metrics.length === 0) {
      return null;
    }

    // Get last 24 hours data (first entry in ordered list)
    const last24Hours = metrics[0];
    
    // Get 7-day average (all available data)
    const sevenDayAverage = metrics.reduce((sum, m) => 
      sum + (m.cache_hit_rate_percent || 0), 0
    ) / metrics.length;

    const currentRate = last24Hours.cache_hit_rate_percent || 0;
    const requestCount = last24Hours.request_count || 0;

    // Not enough requests to trigger alert
    if (requestCount < CACHE_ALERT_CONFIG.minRequestsForAlert) {
      return null;
    }

    // Check for critical threshold
    if (currentRate < CACHE_ALERT_CONFIG.criticalThreshold) {
      return {
        level: 'critical',
        message: 'Critical: Cache hit rate is dangerously low',
        currentRate,
        expectedRate: CACHE_ALERT_CONFIG.warningThreshold,
        totalRequests: requestCount,
        recommendations: [
          'Check if static prompt has changed (cache hash mismatch)',
          'Verify cache_control headers are being sent in API calls',
          'Ensure minimum 1024 tokens in cached section',
          'Check Anthropic API status page for issues'
        ]
      };
    }

    // Check for warning threshold
    if (currentRate < CACHE_ALERT_CONFIG.warningThreshold) {
      return {
        level: 'warning',
        message: 'Warning: Cache hit rate is below optimal threshold',
        currentRate,
        expectedRate: CACHE_ALERT_CONFIG.warningThreshold,
        totalRequests: requestCount,
        recommendations: [
          'Monitor prompt changes that may invalidate cache',
          'Verify cache expiration settings (5 min TTL)',
          'Review conversation patterns for cache misses'
        ]
      };
    }

    // Check for anomaly (sudden drop from average)
    const dropPercentage = ((sevenDayAverage - currentRate) / sevenDayAverage) * 100;
    if (dropPercentage > CACHE_ALERT_CONFIG.anomalyDropPercent) {
      return {
        level: 'warning',
        message: 'Warning: Significant drop in cache performance detected',
        currentRate,
        expectedRate: sevenDayAverage,
        totalRequests: requestCount,
        recommendations: [
          'Recent changes may have affected caching behavior',
          'Review recent prompt or system modifications',
          'Compare with historical performance patterns'
        ]
      };
    }

    // All good - healthy cache performance
    return {
      level: 'healthy',
      message: 'Cache performance is healthy',
      currentRate,
      expectedRate: CACHE_ALERT_CONFIG.warningThreshold,
      totalRequests: requestCount,
      recommendations: []
    };
  }, [metrics, isLoading]);

  return {
    alert,
    isLoading,
    config: CACHE_ALERT_CONFIG
  };
};
