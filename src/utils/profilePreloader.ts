// Intelligent preloading system for profile components and data
import { logger } from './logger';
import { performanceMonitor } from './performanceMonitor';

class ProfilePreloader {
  private preloadCache = new Map<string, Promise<any>>();
  private componentCache = new Map<string, any>();
  private prefetchThreshold = 70; // Prefetch partner when personal is 70% complete

  // Preload critical profile components
  async preloadCriticalComponents() {
    const components = [
      'NewPersonalQuestionnaire',
      'NewPartnerProfile', 
      'ProfileBuilder'
    ];

    const preloadPromises = components.map(async (componentName) => {
      if (this.componentCache.has(componentName)) return;

      try {
        performanceMonitor.mark(`preload-${componentName}`);
        
        let component;
        switch (componentName) {
          case 'NewPersonalQuestionnaire':
            component = await import('@/components/NewPersonalQuestionnaire');
            break;
          case 'NewPartnerProfile':
            component = await import('@/components/NewPartnerProfile');
            break;
          case 'ProfileBuilder':
            component = await import('@/components/ProfileBuilder');
            break;
        }
        
        this.componentCache.set(componentName, component);
        performanceMonitor.measure(`preload-${componentName}`, 50);
        
        logger.info(`[Preloader] Loaded ${componentName}`);
      } catch (error) {
        logger.warn(`[Preloader] Failed to preload ${componentName}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  // Predictive prefetching based on user progress
  async predictivePrefetch(personalCompletion: number, hasPartnerProfile: boolean) {
    // Prefetch partner profile components when personal profile is mostly complete
    if (personalCompletion >= this.prefetchThreshold && !hasPartnerProfile) {
      await this.prefetchPartnerComponents();
    }

    // Prefetch coaching components when profiles are complete
    if (personalCompletion >= 90) {
      await this.prefetchCoachingComponents();
    }
  }

  // Prefetch partner profile related components
  private async prefetchPartnerComponents() {
    const cacheKey = 'partner-components';
    if (this.preloadCache.has(cacheKey)) return;

    const prefetchPromise = this.batchImport([
      () => import('@/components/NewPartnerProfile'),
      () => import('@/components/NewPartnerProfile/components/PartnerQuestionnaireLayout'),
      () => import('@/components/NewPartnerProfile/components/sections/PartnerBasics'),
      () => import('@/hooks/usePartnerProfileData')
    ], 'partner-components');

    this.preloadCache.set(cacheKey, prefetchPromise);
    await prefetchPromise;
  }

  // Prefetch coaching components when profiles are nearly complete
  private async prefetchCoachingComponents() {
    const cacheKey = 'coaching-components';
    if (this.preloadCache.has(cacheKey)) return;

    const prefetchPromise = this.batchImport([
      () => import('@/components/AIChat'),
      () => import('@/components/AIChatInput'),
      () => import('@/components/ConversationStarters'),
      () => import('@/components/ThoughtfulActions')
    ], 'coaching-components');

    this.preloadCache.set(cacheKey, prefetchPromise);
    await prefetchPromise;
  }

  // Batch import with performance monitoring
  private async batchImport(importFunctions: (() => Promise<any>)[], batchName: string) {
    performanceMonitor.mark(`batch-${batchName}`);
    
    try {
      await Promise.allSettled(
        importFunctions.map((importFn, index) => 
          this.delayedImport(importFn, index * 100) // Stagger imports
        )
      );
      
      performanceMonitor.measure(`batch-${batchName}`, 200);
      logger.info(`[Preloader] Batch ${batchName} completed`);
    } catch (error) {
      logger.warn(`[Preloader] Batch ${batchName} failed:`, error);
    }
  }

  // Import with delay to prevent overwhelming the network
  private async delayedImport(importFn: () => Promise<any>, delay: number) {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return importFn();
  }

  // Session-based memory cache for ultra-fast repeated access
  private sessionCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // Cache profile data in memory for current session
  cacheProfileData(profileType: string, data: any, ttlMs = 5 * 60 * 1000) {
    this.sessionCache.set(profileType, {
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  // Get cached profile data if still valid
  getCachedProfileData(profileType: string): any | null {
    const cached = this.sessionCache.get(profileType);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.sessionCache.delete(profileType);
      return null;
    }

    return JSON.parse(JSON.stringify(cached.data)); // Return deep clone
  }

  // Warm up the cache with default data
  warmupCache() {
    // Pre-warm with empty structures to eliminate first-load delays
    this.cacheProfileData('personal-defaults', {
      name: '', age: '', gender: [], orientation: [],
      relationshipStatus: '', loveLanguage: [], conflictStyle: []
    });

    this.cacheProfileData('partner-defaults', {
      partnerName: '', partnerAge: '', partnerGender: [], partnerOrientation: '',
      partnerLoveLanguage: [], partnerConflictStyle: []
    });
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, cached] of this.sessionCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.sessionCache.delete(key);
      }
    }
  }

  // Get preloader statistics
  getStats() {
    return {
      componentsCached: this.componentCache.size,
      preloadPromises: this.preloadCache.size,
      sessionCacheSize: this.sessionCache.size,
      cacheKeys: Array.from(this.sessionCache.keys())
    };
  }
}

export const profilePreloader = new ProfilePreloader();

// Initialize preloader
if (typeof window !== 'undefined') {
  // Warm up cache immediately
  profilePreloader.warmupCache();
  
  // Preload critical components after page load
  if (document.readyState === 'complete') {
    profilePreloader.preloadCriticalComponents();
  } else {
    window.addEventListener('load', () => {
      profilePreloader.preloadCriticalComponents();
    }, { once: true });
  }

  // Clean up expired cache every 5 minutes
  setInterval(() => {
    profilePreloader.clearExpiredCache();
  }, 5 * 60 * 1000);
}