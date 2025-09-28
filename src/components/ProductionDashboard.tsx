import React, { Suspense } from 'react';
import ProductionErrorBoundary from './ProductionErrorBoundary';
import { LoadingState } from './loading';
import { useCleanupManager } from '@/hooks/useCleanupManager';

const ProductionDashboard: React.FC = () => {
  // Use production-ready cleanup management
  useCleanupManager('ProductionDashboard');

  return (
    <ProductionErrorBoundary 
      level="page" 
      name="Dashboard"
      showToast={false}
      autoRecover={false}
    >
      <LoadingState variant="spinner" message="Loading dashboard..." fullScreen />
    </ProductionErrorBoundary>
  );
};

export default ProductionDashboard;