'use client';

import { useState } from 'react';
import { RobotFilterOptions, RobotCategory, RobotStatus, RobotSortOption } from '@/lib/types';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

interface RobotFilterProps {
  filters: RobotFilterOptions;
  onFiltersChange: (filters: RobotFilterOptions) => void;
  totalCount: number;
  manufacturers: string[];
}

export default function RobotFilter({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  manufacturers 
}: RobotFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (key: keyof RobotFilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'name'
    });
    setSearchQuery('');
  };

  const getCategoryLabel = (category: RobotCategory) => {
    const labels: Record<RobotCategory, string> = {
      industrial: '산업용',
      domestic: '가정용',
      research: '연구용',
      military: '군사용',
      healthcare: '의료용',
      entertainment: '엔터테인먼트',
      service: '서비스'
    };
    return labels[category];
  };

  const getStatusLabel = (status: RobotStatus) => {
    const labels: Record<RobotStatus, string> = {
      concept: '컨셉',
      prototype: '프로토타입',
      development: '개발중',
      research: '연구중',
      testing: '테스트',
      production: '생산중',
      commercial: '상용화',
      discontinued: '단종'
    };
    return labels[status];
  };

  const getSortLabel = (sort: RobotSortOption) => {
    const labels: Record<RobotSortOption, string> = {
      name: '이름순',
      manufacturer: '제조사순',
      releaseYear: '출시연도순',
      price: '가격순',
      height: '높이순',
      weight: '무게순'
    };
    return labels[sort];
  };

  const categories: RobotCategory[] = [
    'industrial', 'domestic', 'research', 'military', 
    'healthcare', 'entertainment', 'service'
  ];

  const statuses: RobotStatus[] = [
    'concept', 'prototype', 'development', 'research', 'testing', 
    'production', 'commercial', 'discontinued'
  ];

  const sortOptions: RobotSortOption[] = [
    'name', 'manufacturer', 'releaseYear', 'price', 'height', 'weight'
  ];

  // 드롭다운 옵션 변환 함수들
  const getSortDropdownOptions = (): DropdownOption[] => 
    sortOptions.map(option => ({
      value: option,
      label: getSortLabel(option)
    }));

  const getManufacturerDropdownOptions = (): DropdownOption[] => [
    { value: '', label: '전체' },
    ...manufacturers.map(manufacturer => ({
      value: manufacturer,
      label: manufacturer
    }))
  ];

  const getCategoryDropdownOptions = (): DropdownOption[] => [
    { value: '', label: '전체' },
    ...categories.map(category => ({
      value: category,
      label: getCategoryLabel(category)
    }))
  ];

  const getStatusDropdownOptions = (): DropdownOption[] => [
    { value: '', label: '전체' },
    ...statuses.map(status => ({
      value: status,
      label: getStatusLabel(status)
    }))
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 기본 필터 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">로봇 정보</h2>
            <span className="text-sm text-gray-500">{totalCount}개의 로봇</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 검색 */}
            <div className="relative">
              <input
                type="text"
                placeholder="로봇 이름 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 정렬 */}
            <Dropdown
              options={getSortDropdownOptions()}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value as RobotSortOption)}
              size="sm"
              className="w-32"
            />

            {/* 필터 토글 */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <svg className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 상세 필터 */}
      {isExpanded && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 제조사 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제조사</label>
              <Dropdown
                options={getManufacturerDropdownOptions()}
                value={filters.manufacturer || ''}
                onChange={(value) => handleFilterChange('manufacturer', value || undefined)}
                placeholder="제조사 선택"
                className="w-full"
              />
            </div>

            {/* 카테고리 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <Dropdown
                options={getCategoryDropdownOptions()}
                value={filters.category || ''}
                onChange={(value) => handleFilterChange('category', value || undefined)}
                placeholder="카테고리 선택"
                className="w-full"
              />
            </div>

            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">개발 상태</label>
              <Dropdown
                options={getStatusDropdownOptions()}
                value={filters.status || ''}
                onChange={(value) => handleFilterChange('status', value || undefined)}
                placeholder="상태 선택"
                className="w-full"
              />
            </div>

            {/* 가격 범위 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">가격 범위 (USD)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="최소"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="최대"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: e.target.value ? Number(e.target.value) : undefined
                  })}
                  className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}