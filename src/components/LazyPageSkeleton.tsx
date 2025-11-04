import React from "react";

const LazyPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-16 bg-muted/20 border-b border-border/40" />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="h-8 bg-muted/20 rounded w-1/3" />
        <div className="h-4 bg-muted/20 rounded w-2/3" />
        <div className="grid gap-4 mt-8">
          <div className="h-32 bg-muted/20 rounded" />
          <div className="h-32 bg-muted/20 rounded" />
          <div className="h-32 bg-muted/20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default LazyPageSkeleton;
