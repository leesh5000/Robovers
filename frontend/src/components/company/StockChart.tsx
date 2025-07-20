'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { StockPriceHistory } from '@/lib/types';
import { getDummyStockHistory } from '@/lib/dummy-data-stock';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  companyId: string;
  companyName: string;
}

export default function StockChart({ companyId, companyName }: StockChartProps) {
  const [priceHistory, setPriceHistory] = useState<StockPriceHistory[]>([]);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터 로드
    setIsLoading(true);
    setTimeout(() => {
      const history = getDummyStockHistory(companyId, timeRange);
      setPriceHistory(history);
      setIsLoading(false);
    }, 300);
  }, [companyId, timeRange]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: priceHistory.map(item => {
      const date = new Date(item.date);
      if (timeRange === '1M' || timeRange === '3M') {
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      }
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: '주가',
        data: priceHistory.map(item => item.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
        },
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const timeRangeButtons = [
    { value: '1M', label: '1개월' },
    { value: '3M', label: '3개월' },
    { value: '6M', label: '6개월' },
    { value: '1Y', label: '1년' },
    { value: 'ALL', label: '전체' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">주가 차트</h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {timeRangeButtons.map((button) => (
            <button
              key={button.value}
              onClick={() => setTimeRange(button.value as typeof timeRange)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                timeRange === button.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80">
        <Line data={chartData} options={options} />
      </div>

      {/* 거래량 정보 (선택사항) */}
      {priceHistory.length > 0 && priceHistory[0].volume && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">평균 거래량</span>
            <span className="font-medium text-gray-900">
              {Math.round(
                priceHistory.reduce((sum, item) => sum + (item.volume || 0), 0) / priceHistory.length
              ).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}