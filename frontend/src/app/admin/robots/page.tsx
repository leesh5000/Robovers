'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Robot, RobotCategory, RobotStatus } from '@/lib/types';

// 더미 로봇 데이터 (기존 데이터 재사용)
const dummyRobots: Robot[] = [
  {
    id: '1',
    name: 'Atlas',
    manufacturer: 'Boston Dynamics',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
    description: '세계에서 가장 동적인 휴머노이드 로봇',
    specifications: {
      height: '1.5m',
      weight: '89kg',
      batteryLife: '1시간',
      speed: '2.5m/s',
      payload: '11kg'
    },
    features: ['파쿠르', '백플립', '물체 조작'],
    developmentStatus: 'testing',
    category: 'research',
    releaseYear: 2013,
    applications: ['연구', '구조 작업'],
  },
  {
    id: '2',
    name: 'Optimus',
    manufacturer: 'Tesla',
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=600',
    description: '일반 작업 환경용 범용 휴머노이드 로봇',
    specifications: {
      height: '1.73m',
      weight: '57kg',
      batteryLife: '8시간',
      speed: '1.4m/s',
      payload: '20kg'
    },
    features: ['AI 대화', '물체 인식', '정밀 조작'],
    developmentStatus: 'development',
    category: 'industrial',
    releaseYear: 2022,
    price: {
      amount: 20000,
      currency: 'USD',
      availability: '2025년 예정'
    },
    applications: ['제조업', '물류', '가정용'],
  },
];

export default function AdminRobotsPage() {
  const [robots, setRobots] = useState<Robot[]>(dummyRobots);
  const [selectedCategory, setSelectedCategory] = useState<RobotCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RobotStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { value: RobotCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'industrial', label: '산업용' },
    { value: 'domestic', label: '가정용' },
    { value: 'research', label: '연구용' },
    { value: 'military', label: '군사용' },
    { value: 'healthcare', label: '의료용' },
    { value: 'entertainment', label: '엔터테인먼트' },
    { value: 'service', label: '서비스' },
  ];

  const statuses: { value: RobotStatus | 'all'; label: string; color: string }[] = [
    { value: 'all', label: '전체', color: 'gray' },
    { value: 'concept', label: '컨셉', color: 'gray' },
    { value: 'prototype', label: '프로토타입', color: 'yellow' },
    { value: 'development', label: '개발중', color: 'blue' },
    { value: 'testing', label: '테스트', color: 'purple' },
    { value: 'production', label: '생산', color: 'green' },
    { value: 'commercial', label: '상용화', color: 'green' },
    { value: 'discontinued', label: '단종', color: 'red' },
  ];

  const filteredRobots = robots.filter(robot => {
    const matchesCategory = selectedCategory === 'all' || robot.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || robot.developmentStatus === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      robot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      robot.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 로봇 정보를 삭제하시겠습니까?')) {
      setRobots(robots.filter(r => r.id !== id));
    }
  };

  const getStatusBadge = (status: RobotStatus) => {
    const statusInfo = statuses.find(s => s.value === status);
    if (!statusInfo) return null;

    const colorClasses = {
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[statusInfo.color as keyof typeof colorClasses]}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">로봇 관리</h1>
        <Link
          href="/admin/robots/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 로봇 등록
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="로봇명 또는 제조사 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as RobotCategory | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as RobotStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 로봇 목록 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRobots.map((robot) => (
          <div key={robot.id} className="bg-white rounded-lg shadow overflow-hidden">
            {robot.imageUrl && (
              <img
                src={robot.imageUrl}
                alt={robot.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{robot.name}</h3>
                {getStatusBadge(robot.developmentStatus)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{robot.manufacturer}</p>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{robot.description}</p>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>높이:</span>
                  <span className="font-medium">{robot.specifications.height}</span>
                </div>
                <div className="flex justify-between">
                  <span>무게:</span>
                  <span className="font-medium">{robot.specifications.weight}</span>
                </div>
                {robot.price && (
                  <div className="flex justify-between">
                    <span>가격:</span>
                    <span className="font-medium">
                      ${robot.price.amount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/robots/${robot.id}/edit`}
                  className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  편집
                </Link>
                <button
                  onClick={() => handleDelete(robot.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRobots.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}