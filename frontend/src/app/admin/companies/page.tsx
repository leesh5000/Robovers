'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Company, CompanySector } from '@/lib/types';
import { getDummyCompanies } from '@/lib/dummy-data';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(getDummyCompanies());
  const [selectedSector, setSelectedSector] = useState<CompanySector | 'all'>('all');
  const [selectedPublic, setSelectedPublic] = useState<'all' | 'public' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sectorOptions: DropdownOption[] = [
    { value: 'all', label: '전체' },
    { value: 'robotics', label: '로봇' },
    { value: 'automotive', label: '자동차' },
    { value: 'technology', label: '기술' },
    { value: 'defense', label: '방위' },
    { value: 'research', label: '연구' },
    { value: 'consumer', label: '소비자' },
  ];

  const publicOptions: DropdownOption[] = [
    { value: 'all', label: '전체' },
    { value: 'public', label: '상장' },
    { value: 'private', label: '비상장' },
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSector = selectedSector === 'all' || company.sector === selectedSector;
    const matchesPublic = 
      selectedPublic === 'all' || 
      (selectedPublic === 'public' && company.isPublic) ||
      (selectedPublic === 'private' && !company.isPublic);
    const matchesSearch = searchQuery === '' || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesPublic && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 기업 정보를 삭제하시겠습니까?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const handleUpdatePrice = (id: string) => {
    // 실제로는 모달을 열어서 주가 업데이트
    const newPrice = prompt('새로운 주가를 입력하세요:');
    if (newPrice) {
      setCompanies(companies.map(c => 
        c.id === id 
          ? { 
              ...c, 
              currentPrice: parseFloat(newPrice),
              changePercent: Math.random() * 10 - 5, // 임시 변동률
              changeAmount: Math.random() * 5 - 2.5, // 임시 변동액
            }
          : c
      ));
    }
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">기업 관리</h1>
        <Link
          href="/admin/companies/new"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 기업 등록
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="기업명 또는 티커 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Dropdown
            options={sectorOptions}
            value={selectedSector}
            onChange={(value) => setSelectedSector(value as CompanySector | 'all')}
            className="w-32"
          />
          <Dropdown
            options={publicOptions}
            value={selectedPublic}
            onChange={(value) => setSelectedPublic(value as 'all' | 'public' | 'private')}
            className="w-32"
          />
        </div>
      </div>

      {/* 기업 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기업
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                티커
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                현재가
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                변동률
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                시가총액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                섹터
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                국가
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {company.logoUrl && (
                      <Image
                        src={company.logoUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded object-contain mr-3"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/40x40?text=' + company.name.charAt(0);
                        }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">
                        {company.robotProjects?.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{company.symbol}</span>
                </td>
                <td className="px-6 py-4">
                  {company.isPublic && company.currentPrice > 0 ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        ${company.currentPrice.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleUpdatePrice(company.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        업데이트
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {company.isPublic && company.currentPrice > 0 ? (
                    <span className={`text-sm font-medium ${
                      company.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {company.changePercent >= 0 ? '+' : ''}{company.changePercent.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatMarketCap(company.marketCap)}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {sectorOptions.find(s => s.value === company.sector)?.label || company.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {company.country}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/companies/${company.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      편집
                    </Link>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}