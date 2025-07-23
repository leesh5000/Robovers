'use client';

import { Robot } from '@/lib/types';

interface RobotSpecsProps {
  specifications: Robot['specifications'];
}

export default function RobotSpecs({ specifications }: RobotSpecsProps) {
  const specs = [
    { label: '높이', value: specifications.height, icon: '📏' },
    { label: '무게', value: specifications.weight, icon: '⚖️' },
    { label: '배터리 수명', value: specifications.batteryLife, icon: '🔋' },
    { label: '최고 속도', value: specifications.speed, icon: '⚡' },
    { label: '최대 적재량', value: specifications.payload, icon: '📦' },
  ].filter(spec => spec.value);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">기본 사양</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{spec.icon}</span>
              <h4 className="text-lg font-medium text-gray-900">{spec.label}</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{spec.value}</p>
          </div>
        ))}
      </div>

      {/* 상세 비교 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3">
          <h4 className="text-lg font-medium text-gray-900">상세 사양</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {specs.map((spec, index) => (
            <div key={index} className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-lg mr-3">{spec.icon}</span>
                <span className="font-medium text-gray-900">{spec.label}</span>
              </div>
              <span className="text-gray-700 font-mono">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}