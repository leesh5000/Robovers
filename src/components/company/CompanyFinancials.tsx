'use client';

import { Company } from '@/lib/types';

interface CompanyFinancialsProps {
  company: Company;
}

export default function CompanyFinancials({ company }: CompanyFinancialsProps) {
  const formatNumber = (num?: number) => {
    if (!num) return '-';
    return num.toLocaleString();
  };

  const financialItems = [
    {
      label: '직원 수',
      value: company.employeeCount ? `${formatNumber(company.employeeCount)}명` : '-',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: '설립연도',
      value: company.foundedYear ? `${company.foundedYear}년` : '-',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: '본사 위치',
      value: company.country || '-',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: '상장 여부',
      value: company.isPublic ? '상장' : '비상장',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 재무 정보 카드 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">기업 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financialItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-lg font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 제품 */}
      {company.mainProducts && company.mainProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">주요 제품 및 서비스</h2>
          <div className="flex flex-wrap gap-2">
            {company.mainProducts.map((product, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 투자 정보 (비상장 기업) */}
      {!company.isPublic && company.marketCap && company.marketCap > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">비상장 기업 정보</h3>
              <p className="text-sm text-amber-800">
                이 기업은 현재 비상장 상태입니다. 표시된 추정 가치는 최근 투자 라운드나 
                시장 분석을 기반으로 한 것이며, 실제 기업 가치와 다를 수 있습니다.
              </p>
              {company.marketCap > 0 && (
                <p className="text-sm text-amber-800 mt-2">
                  추정 기업 가치: <span className="font-semibold">${(company.marketCap / 1000000000).toFixed(1)}B</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}