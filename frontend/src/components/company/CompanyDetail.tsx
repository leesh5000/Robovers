'use client';

import { Company } from '@/lib/types';
import LazyStockChart from './LazyStockChart';
import CompanyFinancials from './CompanyFinancials';

interface CompanyDetailProps {
  company: Company;
}

export default function CompanyDetail({ company }: CompanyDetailProps) {
  const formatPrice = (price: number, country?: string) => {
    if (price === 0) return '-';
    if (country === '한국') {
      return `₩${price.toLocaleString()}`;
    }
    if (country === '일본') {
      return `¥${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap || marketCap === 0) return '비상장';
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    }
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    }
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const getSectorLabel = (sector?: string) => {
    const labels: Record<string, string> = {
      robotics: '로봇',
      automotive: '자동차',
      technology: '기술',
      defense: '방위',
      research: '연구',
      consumer: '소비자',
    };
    return sector ? labels[sector] || sector : '-';
  };

  return (
    <div className="space-y-8">
      {/* 기업 헤더 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* 로고 및 기본 정보 */}
          <div className="flex items-start gap-6">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-24 h-24 object-contain rounded-lg border border-gray-200 p-2"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/96x96?text=' + company.name.charAt(0);
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-600">
                  {company.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <span className="text-xl text-gray-500">({company.symbol})</span>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                  {getSectorLabel(company.sector)}
                </span>
                <span className="text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.country}
                </span>
                <span className="text-gray-600">
                  창립: {company.foundedYear || '-'}
                </span>
              </div>

              {company.description && (
                <p className="text-gray-700 leading-relaxed">{company.description}</p>
              )}
            </div>
          </div>

          {/* 주가 정보 (상장 기업만) */}
          {company.isPublic && company.currentPrice > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 min-w-[300px]">
              <div className="text-sm text-gray-600 mb-2">현재 주가</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(company.currentPrice, company.country)}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-lg font-medium ${
                    company.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {company.changePercent >= 0 ? '▲' : '▼'} {Math.abs(company.changePercent).toFixed(2)}%
                </span>
                <span
                  className={`text-sm ${
                    company.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ({company.changeAmount >= 0 ? '+' : ''}{formatPrice(company.changeAmount, company.country)})
                </span>
              </div>
              <div className="text-sm text-gray-600">
                시가총액: <span className="font-semibold text-gray-900">{formatMarketCap(company.marketCap)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 로봇 프로젝트 */}
      {company.robotProjects && company.robotProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">휴머노이드 로봇 프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.robotProjects.map((project, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project}</h3>
                    <p className="text-sm text-gray-600">휴머노이드 로봇</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 주가 차트 (상장 기업만) */}
      {company.isPublic && company.currentPrice > 0 && (
        <LazyStockChart companyId={company.id} companyName={company.name} />
      )}

      {/* 재무 정보 및 추가 정보 */}
      <CompanyFinancials company={company} />

      {/* 외부 링크 */}
      {company.website && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">추가 정보</h2>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            공식 웹사이트 방문
          </a>
        </div>
      )}
    </div>
  );
}