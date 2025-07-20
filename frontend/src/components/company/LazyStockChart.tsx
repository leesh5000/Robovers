'use client';

import { memo, Suspense, lazy } from 'react';

const StockChart = lazy(() => import('./StockChart'));

interface LazyStockChartProps {
  companyId: string;
  companyName: string;
}

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
});

const LazyStockChart = memo(function LazyStockChart({ companyId, companyName }: LazyStockChartProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StockChart companyId={companyId} companyName={companyName} />
    </Suspense>
  );
});

export default LazyStockChart;