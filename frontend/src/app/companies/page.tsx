'use client';

import { useState } from 'react';
import CompanyList from '@/components/company/CompanyList';
import CompanyFilter from '@/components/company/CompanyFilter';
import { CompanyFilterOptions, CompanySector } from '@/lib/types';

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CompanyFilterOptions>({
    sortBy: 'marketCap',
  });

  const handleSectorChange = (sector?: CompanySector) => {
    setFilters((prev) => ({ ...prev, sector }));
  };

  const handleCountryChange = (country?: string) => {
    setFilters((prev) => ({ ...prev, country }));
  };

  const handlePublicChange = (isPublic?: boolean) => {
    setFilters((prev) => ({ ...prev, isPublic }));
  };

  const handleSortChange = (sortBy: CompanyFilterOptions['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">기업 & 주가</h1>
        <p className="text-gray-600">
          휴머노이드 로봇을 개발하는 주요 기업들의 정보와 실시간 주가를 확인하세요
        </p>
      </div>

      {/* 상단 컨트롤 영역 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* 검색바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="기업명, 티커, 로봇 프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 필터 컨트롤 */}
          <CompanyFilter
            sector={filters.sector}
            country={filters.country}
            isPublic={filters.isPublic}
            sortBy={filters.sortBy}
            onSectorChange={handleSectorChange}
            onCountryChange={handleCountryChange}
            onPublicChange={handlePublicChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* 주요 지표 요약 (선택사항) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">전체 기업 수</p>
          <p className="text-2xl font-bold text-gray-900">10개</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">상장 기업</p>
          <p className="text-2xl font-bold text-gray-900">5개</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">총 시가총액</p>
          <p className="text-2xl font-bold text-gray-900">$10.5T</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">평균 변동률</p>
          <p className="text-2xl font-bold text-green-600">+1.24%</p>
        </div>
      </div>

      {/* 기업 목록 */}
      <CompanyList filters={filters} searchQuery={searchQuery} />

      {/* 면책 조항 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>면책 조항:</strong> 표시된 주가 정보는 예시 데이터이며 실제 시장 가격과 다를 수 있습니다. 
          투자 결정을 내리기 전에 반드시 공식적인 금융 정보원을 확인하시기 바랍니다.
        </p>
      </div>
    </div>
  );
}