'use client';

import { CompanySector, CompanySortOption } from '@/lib/types';

interface CompanyFilterProps {
  sector?: CompanySector;
  country?: string;
  isPublic?: boolean;
  sortBy: CompanySortOption;
  onSectorChange: (sector?: CompanySector) => void;
  onCountryChange: (country?: string) => void;
  onPublicChange: (isPublic?: boolean) => void;
  onSortChange: (sortBy: CompanySortOption) => void;
}

const sectors: { value?: CompanySector; label: string }[] = [
  { value: undefined, label: '전체 섹터' },
  { value: 'robotics', label: '로봇' },
  { value: 'automotive', label: '자동차' },
  { value: 'technology', label: '기술' },
  { value: 'defense', label: '방위' },
  { value: 'research', label: '연구' },
  { value: 'consumer', label: '소비자' },
];

const countries = [
  { value: undefined, label: '전체 국가' },
  { value: '미국', label: '미국' },
  { value: '한국', label: '한국' },
  { value: '일본', label: '일본' },
  { value: '중국', label: '중국' },
  { value: '노르웨이', label: '노르웨이' },
];

const publicOptions = [
  { value: undefined, label: '전체' },
  { value: true, label: '상장' },
  { value: false, label: '비상장' },
];

export default function CompanyFilter({
  sector,
  country,
  isPublic,
  sortBy,
  onSectorChange,
  onCountryChange,
  onPublicChange,
  onSortChange,
}: CompanyFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* 섹터 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">섹터:</label>
        <select
          value={sector || ''}
          onChange={(e) => onSectorChange(e.target.value as CompanySector || undefined)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {sectors.map((s) => (
            <option key={s.label} value={s.value || ''}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* 국가 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">국가:</label>
        <select
          value={country || ''}
          onChange={(e) => onCountryChange(e.target.value || undefined)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {countries.map((c) => (
            <option key={c.label} value={c.value || ''}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 상장 여부 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">상장:</label>
        <select
          value={isPublic === undefined ? '' : isPublic.toString()}
          onChange={(e) => {
            const value = e.target.value;
            onPublicChange(value === '' ? undefined : value === 'true');
          }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {publicOptions.map((p) => (
            <option key={p.label} value={p.value === undefined ? '' : p.value.toString()}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm font-medium text-gray-700">정렬:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as CompanySortOption)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="marketCap">시가총액순</option>
          <option value="changePercent">변동률순</option>
          <option value="name">이름순</option>
          <option value="country">국가순</option>
          <option value="employeeCount">직원수순</option>
        </select>
      </div>
    </div>
  );
}