'use client';

import { useEffect, useState } from 'react';
import { Company, CompanyFilterOptions } from '@/lib/types';
import { getDummyCompanies } from '@/lib/dummy-data';
import CompanyCard from './CompanyCard';

interface CompanyListProps {
  filters: CompanyFilterOptions;
  searchQuery: string;
}

export default function CompanyList({ filters, searchQuery }: CompanyListProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터 로드
    const data = getDummyCompanies();
    setCompanies(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...companies];

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.symbol.toLowerCase().includes(query) ||
          company.description?.toLowerCase().includes(query) ||
          company.robotProjects?.some((project) =>
            project.toLowerCase().includes(query)
          )
      );
    }

    // 섹터 필터링
    if (filters.sector) {
      filtered = filtered.filter((company) => company.sector === filters.sector);
    }

    // 국가 필터링
    if (filters.country) {
      filtered = filtered.filter((company) => company.country === filters.country);
    }

    // 상장 여부 필터링
    if (filters.isPublic !== undefined) {
      filtered = filtered.filter((company) => company.isPublic === filters.isPublic);
    }

    // 시가총액 범위 필터링
    if (filters.marketCapRange) {
      filtered = filtered.filter((company) => {
        if (!company.marketCap) return false;
        const { min, max } = filters.marketCapRange!;
        if (min && company.marketCap < min) return false;
        if (max && company.marketCap > max) return false;
        return true;
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'marketCap':
          return (b.marketCap || 0) - (a.marketCap || 0);
        case 'changePercent':
          return b.changePercent - a.changePercent;
        case 'country':
          return (a.country || '').localeCompare(b.country || '');
        case 'employeeCount':
          return (b.employeeCount || 0) - (a.employeeCount || 0);
        default:
          return 0;
      }
    });

    setFilteredCompanies(filtered);
  }, [companies, filters, searchQuery]);

  const handleCompanyClick = (company: Company) => {
    console.log('Company clicked:', company);
    // 추후 기업 상세 페이지로 이동하는 로직 구현
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredCompanies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-600">
          다른 검색어나 필터를 사용해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCompanies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onClick={handleCompanyClick}
        />
      ))}
    </div>
  );
}