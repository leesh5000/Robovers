'use client';

import Image from 'next/image';
import { Robot } from '@/lib/types';

interface RobotCardProps {
  robot: Robot;
  onClick?: (robot: Robot) => void;
}

export default function RobotCard({ robot, onClick }: RobotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept':
        return 'bg-gray-100 text-gray-800';
      case 'prototype':
        return 'bg-yellow-100 text-yellow-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-purple-100 text-purple-800';
      case 'production':
        return 'bg-green-100 text-green-800';
      case 'commercial':
        return 'bg-emerald-100 text-emerald-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concept':
        return '컨셉';
      case 'prototype':
        return '프로토타입';
      case 'development':
        return '개발중';
      case 'testing':
        return '테스트';
      case 'production':
        return '생산중';
      case 'commercial':
        return '상용화';
      case 'discontinued':
        return '단종';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'industrial':
        return '산업용';
      case 'domestic':
        return '가정용';
      case 'research':
        return '연구용';
      case 'military':
        return '군사용';
      case 'healthcare':
        return '의료용';
      case 'entertainment':
        return '엔터테인먼트';
      case 'service':
        return '서비스';
      default:
        return category;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick?.(robot)}
    >
      {/* 로봇 이미지 */}
      <div className="relative h-48 bg-gray-100">
        {robot.imageUrl ? (
          <Image
            src={robot.imageUrl}
            alt={robot.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-6xl text-gray-400">🤖</div>
          </div>
        )}
        
        {/* 상태 배지 */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(robot.developmentStatus)}`}>
            {getStatusLabel(robot.developmentStatus)}
          </span>
        </div>
      </div>

      {/* 로봇 정보 */}
      <div className="p-4">
        {/* 헤더 */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{robot.name}</h3>
          <p className="text-sm text-gray-600">{robot.manufacturer}</p>
        </div>

        {/* 설명 */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {robot.description}
        </p>

        {/* 주요 스펙 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-sm">
            <span className="text-gray-500">높이:</span>
            <span className="ml-1 font-medium">{robot.specifications.height}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">무게:</span>
            <span className="ml-1 font-medium">{robot.specifications.weight}</span>
          </div>
          {robot.specifications.batteryLife && (
            <div className="text-sm">
              <span className="text-gray-500">배터리:</span>
              <span className="ml-1 font-medium">{robot.specifications.batteryLife}</span>
            </div>
          )}
          {robot.specifications.speed && (
            <div className="text-sm">
              <span className="text-gray-500">속도:</span>
              <span className="ml-1 font-medium">{robot.specifications.speed}</span>
            </div>
          )}
        </div>

        {/* 카테고리 */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {getCategoryLabel(robot.category)}
          </span>
        </div>

        {/* 주요 기능 태그 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {robot.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {robot.features.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{robot.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 가격 정보 */}
        {robot.price && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">가격</span>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">
                  {robot.price.currency === 'USD' ? '$' : robot.price.currency}
                  {robot.price.amount.toLocaleString()}
                </span>
                <div className="text-xs text-gray-500">{robot.price.availability}</div>
              </div>
            </div>
          </div>
        )}

        {/* 출시 연도 */}
        {robot.releaseYear && (
          <div className="text-xs text-gray-500 text-right mt-2">
            {robot.releaseYear}년 출시
          </div>
        )}
      </div>
    </div>
  );
}