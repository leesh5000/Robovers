'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RobotCategory, RobotStatus } from '@/lib/types';

export default function NewRobotPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    imageUrl: '',
    description: '',
    specifications: {
      height: '',
      weight: '',
      batteryLife: '',
      speed: '',
      payload: '',
    },
    features: '',
    developmentStatus: 'prototype' as RobotStatus,
    category: 'research' as RobotCategory,
    releaseYear: new Date().getFullYear(),
    price: {
      amount: '',
      currency: 'USD',
      availability: '',
    },
    applications: '',
    technicalSpecs: {
      sensors: '',
      actuators: '',
      connectivity: '',
      operatingSystem: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { value: RobotCategory; label: string }[] = [
    { value: 'industrial', label: '산업용' },
    { value: 'domestic', label: '가정용' },
    { value: 'research', label: '연구용' },
    { value: 'military', label: '군사용' },
    { value: 'healthcare', label: '의료용' },
    { value: 'entertainment', label: '엔터테인먼트' },
    { value: 'service', label: '서비스' },
  ];

  const statuses: { value: RobotStatus; label: string }[] = [
    { value: 'concept', label: '컨셉' },
    { value: 'prototype', label: '프로토타입' },
    { value: 'development', label: '개발중' },
    { value: 'research', label: '연구중' },
    { value: 'testing', label: '테스트' },
    { value: 'production', label: '생산' },
    { value: 'commercial', label: '상용화' },
    { value: 'discontinued', label: '단종' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 더미 저장 처리
    setTimeout(() => {
      console.log('새 로봇:', formData);
      alert('로봇 정보가 성공적으로 등록되었습니다!');
      router.push('/admin/robots');
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: fakeUrl });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">새 로봇 등록</h1>
        <p className="mt-2 text-gray-600">휴머노이드 로봇의 상세 정보를 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                로봇명 *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
                제조사 *
              </label>
              <input
                type="text"
                id="manufacturer"
                required
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              설명 *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대표 이미지
            </label>
            <div className="flex items-start gap-4">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="로봇 이미지"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="robot-image-upload"
                />
                <label
                  htmlFor="robot-image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  이미지 업로드
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as RobotCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                개발 상태 *
              </label>
              <select
                id="status"
                value={formData.developmentStatus}
                onChange={(e) => setFormData({ ...formData, developmentStatus: e.target.value as RobotStatus })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-2">
                출시년도
              </label>
              <input
                type="number"
                id="releaseYear"
                min="1900"
                max="2100"
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* 사양 정보 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">사양 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                높이
              </label>
              <input
                type="text"
                id="height"
                value={formData.specifications.height}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, height: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 1.5m"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                무게
              </label>
              <input
                type="text"
                id="weight"
                value={formData.specifications.weight}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, weight: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 75kg"
              />
            </div>

            <div>
              <label htmlFor="batteryLife" className="block text-sm font-medium text-gray-700 mb-2">
                배터리 수명
              </label>
              <input
                type="text"
                id="batteryLife"
                value={formData.specifications.batteryLife}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, batteryLife: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 8시간"
              />
            </div>

            <div>
              <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-2">
                이동 속도
              </label>
              <input
                type="text"
                id="speed"
                value={formData.specifications.speed}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, speed: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 1.5m/s"
              />
            </div>

            <div>
              <label htmlFor="payload" className="block text-sm font-medium text-gray-700 mb-2">
                적재 하중
              </label>
              <input
                type="text"
                id="payload"
                value={formData.specifications.payload}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, payload: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 20kg"
              />
            </div>
          </div>
        </div>

        {/* 기술 사양 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">기술 사양</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sensors" className="block text-sm font-medium text-gray-700 mb-2">
                센서
              </label>
              <input
                type="text"
                id="sensors"
                value={formData.technicalSpecs.sensors}
                onChange={(e) => setFormData({
                  ...formData,
                  technicalSpecs: { ...formData.technicalSpecs, sensors: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: LIDAR, RGB 카메라, IMU (쉼표로 구분)"
              />
            </div>

            <div>
              <label htmlFor="actuators" className="block text-sm font-medium text-gray-700 mb-2">
                액추에이터
              </label>
              <input
                type="text"
                id="actuators"
                value={formData.technicalSpecs.actuators}
                onChange={(e) => setFormData({
                  ...formData,
                  technicalSpecs: { ...formData.technicalSpecs, actuators: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 28개 관절, 유압 액추에이터"
              />
            </div>

            <div>
              <label htmlFor="connectivity" className="block text-sm font-medium text-gray-700 mb-2">
                연결성
              </label>
              <input
                type="text"
                id="connectivity"
                value={formData.technicalSpecs.connectivity}
                onChange={(e) => setFormData({
                  ...formData,
                  technicalSpecs: { ...formData.technicalSpecs, connectivity: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: WiFi, 5G, Bluetooth"
              />
            </div>

            <div>
              <label htmlFor="os" className="block text-sm font-medium text-gray-700 mb-2">
                운영체제
              </label>
              <input
                type="text"
                id="os"
                value={formData.technicalSpecs.operatingSystem}
                onChange={(e) => setFormData({
                  ...formData,
                  technicalSpecs: { ...formData.technicalSpecs, operatingSystem: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: ROS, Custom Linux"
              />
            </div>
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
              주요 기능
            </label>
            <input
              type="text"
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="예: 물체 인식, 자율 내비게이션, 음성 인식 (쉼표로 구분)"
            />
          </div>

          <div>
            <label htmlFor="applications" className="block text-sm font-medium text-gray-700 mb-2">
              응용 분야
            </label>
            <input
              type="text"
              id="applications"
              value={formData.applications}
              onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="예: 제조업, 물류, 의료 (쉼표로 구분)"
            />
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">가격 정보 (선택)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                가격
              </label>
              <input
                type="number"
                id="price"
                value={formData.price.amount}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, amount: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="20000"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                통화
              </label>
              <select
                id="currency"
                value={formData.price.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, currency: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="USD">USD</option>
                <option value="KRW">KRW</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </select>
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                구매 가능 여부
              </label>
              <input
                type="text"
                id="availability"
                value={formData.price.availability}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, availability: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 2025년 예정"
              />
            </div>
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '로봇 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}