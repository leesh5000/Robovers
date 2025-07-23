'use client';

import { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
  onClick?: (company: Company) => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
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

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onClick?.(company)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-12 h-12 object-contain rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48x48?text=' + company.name.charAt(0);
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.symbol}</p>
          </div>
        </div>
        {company.sector && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {company.sector}
          </span>
        )}
      </div>

      {company.isPublic && company.currentPrice > 0 ? (
        <div className="mb-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(company.currentPrice, company.country)}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  company.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {company.changePercent >= 0 ? '+' : ''}
                {company.changePercent.toFixed(2)}%
              </span>
              <span
                className={`text-sm ${
                  company.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ({company.changeAmount >= 0 ? '+' : ''}
                {formatPrice(Math.abs(company.changeAmount), company.country)})
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            시가총액: {formatMarketCap(company.marketCap)}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-lg font-medium text-gray-700">비상장 기업</p>
          <p className="text-sm text-gray-500">
            추정 가치: {formatMarketCap(company.marketCap)}
          </p>
        </div>
      )}

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {company.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {company.robotProjects?.slice(0, 3).map((project) => (
          <span
            key={project}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
          >
            {project}
          </span>
        ))}
        {company.robotProjects && company.robotProjects.length > 3 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            +{company.robotProjects.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {company.country}
        </span>
        <span>창립: {company.foundedYear || '-'}</span>
      </div>
    </div>
  );
}