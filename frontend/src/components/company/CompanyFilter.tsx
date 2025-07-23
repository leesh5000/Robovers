'use client';

import { CompanySector, CompanySortOption } from '@/lib/types';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

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

const publicOptionsData = [
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
  // 드롭다운 옵션 변환
  const sectorOptions: DropdownOption[] = sectors.map(s => ({
    value: s.value || '',
    label: s.label
  }));

  const countryOptions: DropdownOption[] = countries.map(c => ({
    value: c.value || '',
    label: c.label
  }));

  const publicOptions: DropdownOption[] = publicOptionsData.map(p => ({
    value: p.value === undefined ? '' : p.value.toString(),
    label: p.label
  }));

  const sortOptions: DropdownOption[] = [
    { value: 'marketCap', label: '시가총액순' },
    { value: 'changePercent', label: '변동률순' },
    { value: 'name', label: '이름순' },
    { value: 'country', label: '국가순' },
    { value: 'employeeCount', label: '직원수순' },
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* 섹터 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">섹터:</label>
        <Dropdown
          options={sectorOptions}
          value={sector || ''}
          onChange={(value) => onSectorChange(value as CompanySector || undefined)}
          placeholder="섹터 선택"
          size="sm"
          className="w-32"
        />
      </div>

      {/* 국가 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">국가:</label>
        <Dropdown
          options={countryOptions}
          value={country || ''}
          onChange={(value) => onCountryChange(value || undefined)}
          placeholder="국가 선택"
          size="sm"
          className="w-32"
        />
      </div>

      {/* 상장 여부 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">상장:</label>
        <Dropdown
          options={publicOptions}
          value={isPublic === undefined ? '' : isPublic.toString()}
          onChange={(value) => {
            onPublicChange(value === '' ? undefined : value === 'true');
          }}
          placeholder="상장 여부"
          size="sm"
          className="w-32"
        />
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm font-medium text-gray-700">정렬:</label>
        <Dropdown
          options={sortOptions}
          value={sortBy}
          onChange={(value) => onSortChange(value as CompanySortOption)}
          placeholder="정렬 방식"
          size="sm"
          className="w-40"
        />
      </div>
    </div>
  );
}