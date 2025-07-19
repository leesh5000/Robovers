'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Robot } from '@/lib/types';
import RobotSpecs from './RobotSpecs';
import RobotFeatures from './RobotFeatures';

interface RobotDetailProps {
  robot: Robot;
}

type TabType = 'overview' | 'specs' | 'technical';

export default function RobotDetail({ robot }: RobotDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [imageError, setImageError] = useState(false);

  const getStatusLabel = (status: string) => {
    const labels = {
      concept: '컨셉',
      prototype: '프로토타입',
      development: '개발 중',
      research: '연구',
      testing: '테스팅',
      production: '생산',
      commercial: '상용화',
      discontinued: '중단됨'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      concept: 'bg-gray-100 text-gray-800',
      prototype: 'bg-yellow-100 text-yellow-800',
      development: 'bg-blue-100 text-blue-800',
      research: 'bg-purple-100 text-purple-800',
      testing: 'bg-orange-100 text-orange-800',
      production: 'bg-green-100 text-green-800',
      commercial: 'bg-emerald-100 text-emerald-800',
      discontinued: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      industrial: '산업용',
      domestic: '가정용',
      research: '연구용',
      military: '군사용',
      healthcare: '의료용',
      entertainment: '엔터테인먼트',
      service: '서비스'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const formatPrice = (price: Robot['price']) => {
    if (!price) return null;
    return `$${price.amount.toLocaleString()} ${price.currency} (${price.availability})`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* 이미지 */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
              {robot.imageUrl && !imageError ? (
                <Image
                  src={robot.imageUrl}
                  alt={robot.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-gray-500">이미지를 불러올 수 없습니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{robot.name}</h1>
              <p className="text-xl text-gray-600">{robot.manufacturer}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(robot.developmentStatus)}`}>
                {getStatusLabel(robot.developmentStatus)}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {getCategoryLabel(robot.category)}
              </span>
              {robot.releaseYear && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {robot.releaseYear}년
                </span>
              )}
            </div>

            {robot.price && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-1">가격 정보</h3>
                <p className="text-green-700">{formatPrice(robot.price)}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">주요 사양</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">높이:</span>
                  <span className="ml-2 font-medium">{robot.specifications.height}</span>
                </div>
                <div>
                  <span className="text-gray-600">무게:</span>
                  <span className="ml-2 font-medium">{robot.specifications.weight}</span>
                </div>
                {robot.specifications.batteryLife && (
                  <div>
                    <span className="text-gray-600">배터리:</span>
                    <span className="ml-2 font-medium">{robot.specifications.batteryLife}</span>
                  </div>
                )}
                {robot.specifications.speed && (
                  <div>
                    <span className="text-gray-600">속도:</span>
                    <span className="ml-2 font-medium">{robot.specifications.speed}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'specs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              기본 사양
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'technical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              기술 사양
            </button>
          </nav>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">설명</h3>
                <p className="text-gray-700 leading-relaxed">{robot.description}</p>
              </div>

              <RobotFeatures features={robot.features} />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">활용 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {robot.applications.map((application, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {application}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <RobotSpecs specifications={robot.specifications} />
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              {robot.technicalSpecs && (
                <>
                  {robot.technicalSpecs.sensors && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">센서</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {robot.technicalSpecs.sensors.map((sensor, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-gray-700">{sensor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {robot.technicalSpecs.actuators && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">액추에이터</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {robot.technicalSpecs.actuators.map((actuator, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-gray-700">{actuator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {robot.technicalSpecs.connectivity && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">연결성</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {robot.technicalSpecs.connectivity.map((conn, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            <span className="text-gray-700">{conn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {robot.technicalSpecs.operatingSystem && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">운영체제</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-gray-700 font-medium">{robot.technicalSpecs.operatingSystem}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}