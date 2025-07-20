'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Robot } from '@/lib/types';
import RobotDetail from '@/components/robot/RobotDetail';

// 목 데이터 (실제로는 API에서 가져올 데이터)
const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'Atlas',
    manufacturer: 'Boston Dynamics',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    description: '세계에서 가장 동적인 휴머노이드 로봇으로, 복잡한 지형을 뛰어넘고 백플립까지 수행할 수 있습니다. Atlas는 보스턴 다이나믹스의 수년간의 연구 개발의 결정체로, 인간과 유사한 움직임과 뛰어난 균형감각을 자랑합니다.',
    specifications: {
      height: '1.5m',
      weight: '89kg',
      batteryLife: '1시간',
      speed: '2.5m/s',
      payload: '11kg'
    },
    features: ['파쿠르', '백플립', '물체 조작', '지형 인식', '동적 균형'],
    developmentStatus: 'testing',
    category: 'research',
    releaseYear: 2013,
    applications: ['연구', '구조 작업', '군사 목적'],
    technicalSpecs: {
      sensors: ['LIDAR', 'RGB 카메라', '관성 센서'],
      actuators: ['28개 관절', '유압 액추에이터'],
      connectivity: ['WiFi', '무선 제어'],
      operatingSystem: 'Custom Linux'
    }
  },
  {
    id: '2',
    name: 'Optimus',
    manufacturer: 'Tesla',
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=800&h=600&fit=crop',
    description: '일반 작업 환경에서 인간을 대신할 수 있도록 설계된 범용 휴머노이드 로봇입니다. Tesla의 자율주행 기술과 AI를 결합하여 복잡한 작업을 수행할 수 있으며, 대량 생산을 통한 저렴한 가격을 목표로 하고 있습니다.',
    specifications: {
      height: '1.73m',
      weight: '57kg',
      batteryLife: '8시간',
      speed: '1.4m/s',
      payload: '20kg'
    },
    features: ['AI 대화', '물체 인식', '정밀 조작', '학습 능력', '자율 내비게이션'],
    developmentStatus: 'development',
    category: 'industrial',
    releaseYear: 2022,
    price: {
      amount: 20000,
      currency: 'USD',
      availability: '2025년 예정'
    },
    applications: ['제조업', '물류', '가정용'],
    technicalSpecs: {
      sensors: ['FSD 카메라', '토크 센서', '위치 센서'],
      actuators: ['40개 관절', '전기 액추에이터'],
      connectivity: ['5G', 'WiFi', 'Bluetooth'],
      operatingSystem: 'Tesla OS'
    }
  },
  {
    id: '3',
    name: 'ASIMO',
    manufacturer: 'Honda',
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=600&fit=crop',
    description: '혁신적인 이족 보행과 인간-로봇 상호작용을 선보인 선구적인 휴머노이드 로봇입니다. Honda가 30년 이상 연구한 결과물로, 현재는 개발이 중단되었지만 휴머노이드 로봇 발전에 큰 영향을 미쳤습니다.',
    specifications: {
      height: '1.3m',
      weight: '48kg',
      batteryLife: '1시간',
      speed: '1.6m/s',
      payload: '1kg'
    },
    features: ['이족 보행', '계단 오르기', '공 차기', '음성 인식', '얼굴 인식'],
    developmentStatus: 'discontinued',
    category: 'research',
    releaseYear: 2000,
    applications: ['연구', '데모', '교육'],
    technicalSpecs: {
      sensors: ['자이로스코프', '가속도계', '카메라'],
      actuators: ['26개 관절', '서보 모터'],
      connectivity: ['무선 제어'],
      operatingSystem: 'Honda OS'
    }
  },
  // 더 많은 로봇 데이터 추가 가능
];

export default function RobotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [robot, setRobot] = useState<Robot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRobot = async () => {
      setIsLoading(true);
      
      // API 호출 시뮬레이션
      setTimeout(() => {
        const foundRobot = mockRobots.find(r => r.id === params.id);
        setRobot(foundRobot || null);
        setIsLoading(false);
      }, 500);
    };

    if (params.id) {
      fetchRobot();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로봇을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">요청하신 로봇 정보가 존재하지 않습니다.</p>
          <button
            onClick={() => router.push('/robots')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            로봇 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로 가기
        </button>

        <RobotDetail robot={robot} />
      </div>
    </div>
  );
}