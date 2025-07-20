'use client';

import { useRouter } from 'next/navigation';
import RobotGrid from '@/components/robot/RobotGrid';
import { Robot } from '@/lib/types';

// 목 데이터 - 주요 휴머노이드 로봇들
const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'Atlas',
    manufacturer: 'Boston Dynamics',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    description: '세계에서 가장 동적인 휴머노이드 로봇으로, 복잡한 지형을 뛰어넘고 백플립까지 수행할 수 있습니다.',
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
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=600&h=400&fit=crop',
    description: '일반 작업 환경에서 인간을 대신할 수 있도록 설계된 범용 휴머노이드 로봇입니다.',
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
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=600&h=400&fit=crop',
    description: '혁신적인 이족 보행과 인간-로봇 상호작용을 선보인 선구적인 휴머노이드 로봇입니다.',
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
  {
    id: '4',
    name: 'H1',
    manufacturer: 'Unitree',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    description: '범용 휴머노이드 로봇으로 뛰어난 이동성과 조작 능력을 갖추고 있습니다.',
    specifications: {
      height: '1.8m',
      weight: '47kg',
      batteryLife: '2시간',
      speed: '1.5m/s',
      payload: '5kg'
    },
    features: ['전신 이동', '360도 회전', '물체 조작', '균형 제어', '장애물 회피'],
    developmentStatus: 'commercial',
    category: 'research',
    releaseYear: 2023,
    price: {
      amount: 150000,
      currency: 'USD',
      availability: '주문 가능'
    },
    applications: ['연구', '교육', '개발'],
    technicalSpecs: {
      sensors: ['3D LIDAR', 'RealSense 카메라', 'IMU'],
      actuators: ['19개 관절', '고토크 액추에이터'],
      connectivity: ['WiFi', 'Ethernet'],
      operatingSystem: 'ROS'
    }
  },
  {
    id: '5',
    name: 'Digit',
    manufacturer: 'Agility Robotics',
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=600&h=400&fit=crop',
    description: '물류 및 창고 자동화에 특화된 실용적인 휴머노이드 로봇입니다.',
    specifications: {
      height: '1.6m',
      weight: '65kg',
      batteryLife: '4시간',
      speed: '1.2m/s',
      payload: '18kg'
    },
    features: ['상자 운반', '계단 이동', '좁은 공간 내비게이션', '충돌 회피', '자율 충전'],
    developmentStatus: 'commercial',
    category: 'industrial',
    releaseYear: 2020,
    price: {
      amount: 250000,
      currency: 'USD',
      availability: '리스 가능'
    },
    applications: ['물류', '창고', '배송'],
    technicalSpecs: {
      sensors: ['스테레오 카메라', 'LIDAR', '힘 센서'],
      actuators: ['20개 관절', '전기 액추에이터'],
      connectivity: ['WiFi', '4G', 'CAN'],
      operatingSystem: 'Custom Linux'
    }
  },
  {
    id: '6',
    name: 'DAL-e',
    manufacturer: 'Hyundai Motor',
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=600&h=400&fit=crop',
    description: '호텔과 공항에서 서비스 로봇으로 활용되는 한국산 휴머노이드 로봇입니다.',
    specifications: {
      height: '1.2m',
      weight: '80kg',
      batteryLife: '6시간',
      speed: '1.0m/s',
      payload: '10kg'
    },
    features: ['고객 서비스', '안내', '배송', '다국어 지원', '감정 표현'],
    developmentStatus: 'commercial',
    category: 'service',
    releaseYear: 2021,
    applications: ['호텔', '공항', '쇼핑몰', '병원'],
    technicalSpecs: {
      sensors: ['카메라', '마이크', '터치 센서'],
      actuators: ['바퀴형 이동', '팔 관절'],
      connectivity: ['WiFi', '5G', 'Bluetooth'],
      operatingSystem: 'Android'
    }
  },
  {
    id: '7',
    name: 'HUBO',
    manufacturer: 'KAIST',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    description: 'DARPA 로보틱스 챌린지 우승 로봇으로, 재해 대응 작업에 특화되었습니다.',
    specifications: {
      height: '1.8m',
      weight: '80kg',
      batteryLife: '1시간',
      speed: '0.8m/s',
      payload: '15kg'
    },
    features: ['재해 대응', '도구 사용', '차량 운전', '문 열기', '밸브 조작'],
    developmentStatus: 'research',
    category: 'research',
    releaseYear: 2004,
    applications: ['재해 대응', '연구', '교육'],
    technicalSpecs: {
      sensors: ['LIDAR', 'RGB-D 카메라', '관성 센서'],
      actuators: ['33개 관절', '전기 액추에이터'],
      connectivity: ['WiFi', '무선 제어'],
      operatingSystem: 'Real-time Linux'
    }
  },
  {
    id: '8',
    name: 'Pepper',
    manufacturer: 'SoftBank Robotics',
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=600&h=400&fit=crop',
    description: '감정을 읽고 반응하는 소셜 휴머노이드 로봇으로 고객 서비스에 활용됩니다.',
    specifications: {
      height: '1.2m',
      weight: '28kg',
      batteryLife: '12시간',
      speed: '3km/h',
      payload: '1kg'
    },
    features: ['감정 인식', '대화', '앱 실행', '춤', '태블릿 인터페이스'],
    developmentStatus: 'commercial',
    category: 'service',
    releaseYear: 2014,
    price: {
      amount: 1800,
      currency: 'USD',
      availability: '구매 가능'
    },
    applications: ['고객 서비스', '교육', '엔터테인먼트', '리셉션'],
    technicalSpecs: {
      sensors: ['카메라', '마이크', '터치 센서', '소나'],
      actuators: ['20개 관절', '바퀴형 이동'],
      connectivity: ['WiFi', 'Ethernet', 'Bluetooth'],
      operatingSystem: 'NAOqi OS'
    }
  }
];

export default function RobotsPage() {
  const router = useRouter();

  const handleRobotClick = (robot: Robot) => {
    router.push(`/robots/${robot.id}`);
  };

  return (
    <>
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 페이지 타이틀 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">로봇 정보</h1>
          <p className="text-gray-600">
            전 세계 휴머노이드 로봇들의 상세 정보를 확인해보세요. 
            각 로봇의 스펙, 기능, 개발 상태 등을 한눈에 비교할 수 있습니다.
          </p>
        </div>

        {/* 로봇 그리드 */}
        <RobotGrid 
          robots={mockRobots} 
          onRobotClick={handleRobotClick}
        />
      </main>
      
      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl font-bold text-blue-600">🤖</div>
                <span className="text-xl font-bold text-gray-900">Robovers</span>
              </div>
              <p className="text-gray-600 mb-4">
                휴머노이드 로봇의 미래를 함께 탐험하는 플랫폼입니다. 
                최신 로봇 기술 동향부터 커뮤니티 토론까지 모든 것을 한 곳에서 만나보세요.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">플랫폼</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/" className="hover:text-blue-600 transition-colors">홈</a></li>
                <li><a href="/robots" className="hover:text-blue-600 transition-colors">로봇 정보</a></li>
                <li><a href="/community" className="hover:text-blue-600 transition-colors">커뮤니티</a></li>
                <li><a href="/companies" className="hover:text-blue-600 transition-colors">기업 & 주가</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/help" className="hover:text-blue-600 transition-colors">도움말</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition-colors">문의하기</a></li>
                <li><a href="/privacy" className="hover:text-blue-600 transition-colors">개인정보처리방침</a></li>
                <li><a href="/terms" className="hover:text-blue-600 transition-colors">이용약관</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 Robovers. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}