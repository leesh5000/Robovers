'use client';

import { useState, useEffect } from 'react';
import { Robot, RobotFilterOptions } from '@/lib/types';
import RobotCard from './RobotCard';
import RobotFilter from './RobotFilter';

interface RobotGridProps {
  robots: Robot[];
  onRobotClick?: (robot: Robot) => void;
  isLoading?: boolean;
}

export default function RobotGrid({ 
  robots, 
  onRobotClick, 
  isLoading = false 
}: RobotGridProps) {
  const [filteredRobots, setFilteredRobots] = useState<Robot[]>(robots);
  const [filters, setFilters] = useState<RobotFilterOptions>({
    sortBy: 'name'
  });

  // 제조사 목록 추출
  const manufacturers = Array.from(new Set(robots.map(robot => robot.manufacturer))).sort();

  // 필터링 로직
  useEffect(() => {
    let filtered = [...robots];

    // 텍스트 검색 (현재는 RobotFilter에서 처리하지 않음 - 추후 확장 가능)
    
    // 제조사 필터
    if (filters.manufacturer) {
      filtered = filtered.filter(robot => robot.manufacturer === filters.manufacturer);
    }

    // 카테고리 필터
    if (filters.category) {
      filtered = filtered.filter(robot => robot.category === filters.category);
    }

    // 상태 필터
    if (filters.status) {
      filtered = filtered.filter(robot => robot.developmentStatus === filters.status);
    }

    // 가격 범위 필터
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        filtered = filtered.filter(robot => 
          robot.price && robot.price.amount >= filters.priceRange!.min!
        );
      }
      if (filters.priceRange.max !== undefined) {
        filtered = filtered.filter(robot => 
          robot.price && robot.price.amount <= filters.priceRange!.max!
        );
      }
    }

    // 기능 필터
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(robot =>
        filters.features!.some(feature => 
          robot.features.some(robotFeature => 
            robotFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'manufacturer':
          return a.manufacturer.localeCompare(b.manufacturer);
        case 'releaseYear':
          const yearA = a.releaseYear || 0;
          const yearB = b.releaseYear || 0;
          return yearB - yearA; // 최신순
        case 'price':
          const priceA = a.price?.amount || 0;
          const priceB = b.price?.amount || 0;
          return priceA - priceB; // 낮은 가격순
        case 'height':
          const heightA = parseFloat(a.specifications.height) || 0;
          const heightB = parseFloat(b.specifications.height) || 0;
          return heightB - heightA; // 높은순
        case 'weight':
          const weightA = parseFloat(a.specifications.weight) || 0;
          const weightB = parseFloat(b.specifications.weight) || 0;
          return weightB - weightA; // 무거운순
        default:
          return 0;
      }
    });

    setFilteredRobots(filtered);
  }, [robots, filters]);

  const handleFiltersChange = (newFilters: RobotFilterOptions) => {
    setFilters(newFilters);
  };

  const handleRobotClick = (robot: Robot) => {
    onRobotClick?.(robot);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 필터 컴포넌트 */}
      <RobotFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={filteredRobots.length}
        manufacturers={manufacturers}
      />

      {/* 로봇 그리드 */}
      {filteredRobots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRobots.map((robot) => (
            <RobotCard
              key={robot.id}
              robot={robot}
              onClick={handleRobotClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// 로딩 스켈레톤 컴포넌트
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* 필터 스켈레톤 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
            <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-10 bg-gray-200 rounded animate-pulse w-10" />
          </div>
        </div>
      </div>

      {/* 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 빈 상태 컴포넌트
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🤖</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        조건에 맞는 로봇이 없습니다
      </h3>
      <p className="text-gray-500 mb-4">
        다른 필터 조건을 시도해보세요
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        필터 초기화
      </button>
    </div>
  );
}