'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanySector } from '@/lib/types';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

export default function NewCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    currentPrice: '',
    changePercent: '',
    changeAmount: '',
    logoUrl: '',
    marketCap: '',
    description: '',
    foundedYear: '',
    country: '',
    employeeCount: '',
    isPublic: true,
    mainProducts: '',
    robotProjects: '',
    website: '',
    sector: 'robotics' as CompanySector,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectorOptions: DropdownOption[] = [
    { value: 'robotics', label: '로봇' },
    { value: 'automotive', label: '자동차' },
    { value: 'technology', label: '기술' },
    { value: 'defense', label: '방위' },
    { value: 'research', label: '연구' },
    { value: 'consumer', label: '소비자' },
  ];

  const countryOptions: DropdownOption[] = [
    { value: '미국', label: '미국' },
    { value: '한국', label: '한국' },
    { value: '일본', label: '일본' },
    { value: '중국', label: '중국' },
    { value: '독일', label: '독일' },
    { value: '영국', label: '영국' },
    { value: '프랑스', label: '프랑스' },
    { value: '캐나다', label: '캐나다' },
    { value: '노르웨이', label: '노르웨이' },
    { value: '기타', label: '기타' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 더미 저장 처리
    setTimeout(() => {
      console.log('새 기업:', formData);
      alert('기업 정보가 성공적으로 등록되었습니다!');
      router.push('/admin/companies');
    }, 1000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, logoUrl: fakeUrl });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">새 기업 등록</h1>
        <p className="mt-2 text-gray-600">휴머노이드 로봇 개발 기업의 정보를 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                기업명 *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
                티커 심볼 *
              </label>
              <input
                type="text"
                id="symbol"
                required
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="예: TSLA, PRIVATE"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              기업 설명
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              로고
            </label>
            <div className="flex items-start gap-4">
              {formData.logoUrl && (
                <img
                  src={formData.logoUrl}
                  alt="기업 로고"
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  로고 업로드
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  또는 URL 직접 입력:
                </p>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="mt-1 w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://logo.clearbit.com/company.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                섹터 *
              </label>
              <Dropdown
                options={sectorOptions}
                value={formData.sector}
                onChange={(value) => setFormData({ ...formData, sector: value as CompanySector })}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                국가 *
              </label>
              <Dropdown
                options={countryOptions}
                value={formData.country}
                onChange={(value) => setFormData({ ...formData, country: value })}
                placeholder="선택하세요"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-2">
                설립연도
              </label>
              <input
                type="number"
                id="foundedYear"
                min="1900"
                max="2100"
                value={formData.foundedYear}
                onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="2003"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                직원수
              </label>
              <input
                type="number"
                id="employeeCount"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="500"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                웹사이트
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* 상장 정보 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">상장 정보</h2>
          
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">상장 기업</span>
            </label>
          </div>

          {formData.isPublic && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  현재 주가
                </label>
                <input
                  type="number"
                  id="currentPrice"
                  step="0.01"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="245.32"
                />
              </div>

              <div>
                <label htmlFor="changePercent" className="block text-sm font-medium text-gray-700 mb-2">
                  변동률 (%)
                </label>
                <input
                  type="number"
                  id="changePercent"
                  step="0.01"
                  value={formData.changePercent}
                  onChange={(e) => setFormData({ ...formData, changePercent: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="2.45"
                />
              </div>

              <div>
                <label htmlFor="changeAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  변동액
                </label>
                <input
                  type="number"
                  id="changeAmount"
                  step="0.01"
                  value={formData.changeAmount}
                  onChange={(e) => setFormData({ ...formData, changeAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="5.87"
                />
              </div>

              <div>
                <label htmlFor="marketCap" className="block text-sm font-medium text-gray-700 mb-2">
                  시가총액
                </label>
                <input
                  type="number"
                  id="marketCap"
                  value={formData.marketCap}
                  onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="779000000000"
                />
              </div>
            </div>
          )}

          {!formData.isPublic && (
            <div>
              <label htmlFor="marketCapPrivate" className="block text-sm font-medium text-gray-700 mb-2">
                추정 기업가치
              </label>
              <input
                type="number"
                id="marketCapPrivate"
                value={formData.marketCap}
                onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1000000000"
              />
            </div>
          )}
        </div>

        {/* 제품 및 프로젝트 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제품 및 프로젝트</h2>
          
          <div>
            <label htmlFor="mainProducts" className="block text-sm font-medium text-gray-700 mb-2">
              주요 제품
            </label>
            <input
              type="text"
              id="mainProducts"
              value={formData.mainProducts}
              onChange={(e) => setFormData({ ...formData, mainProducts: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="예: 전기차, 에너지 저장 시스템, 태양광 패널 (쉼표로 구분)"
            />
          </div>

          <div>
            <label htmlFor="robotProjects" className="block text-sm font-medium text-gray-700 mb-2">
              로봇 프로젝트 *
            </label>
            <input
              type="text"
              id="robotProjects"
              required
              value={formData.robotProjects}
              onChange={(e) => setFormData({ ...formData, robotProjects: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="예: Optimus, Tesla Bot (쉼표로 구분)"
            />
            <p className="mt-1 text-sm text-gray-500">
              이 기업이 개발 중인 휴머노이드 로봇 프로젝트를 입력하세요.
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '기업 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}