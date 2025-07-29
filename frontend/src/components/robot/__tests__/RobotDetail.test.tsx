import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RobotDetail from '../RobotDetail';
import { Robot, RobotStatus, RobotCategory } from '@/lib/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, className, onError }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        data-testid="robot-image"
      />
    );
  },
}));

// Mock child components
jest.mock('../RobotSpecs', () => {
  return function MockRobotSpecs({ specifications }: any) {
    return (
      <div data-testid="robot-specs">
        <div>Height: {specifications.height}</div>
        <div>Weight: {specifications.weight}</div>
      </div>
    );
  };
});

jest.mock('../RobotFeatures', () => {
  return function MockRobotFeatures({ features }: any) {
    return (
      <div data-testid="robot-features">
        {features.map((feature: string, index: number) => (
          <div key={index}>{feature}</div>
        ))}
      </div>
    );
  };
});

const mockRobot: Robot = {
  id: '1',
  name: 'Atlas',
  manufacturer: 'Boston Dynamics',
  category: 'research',
  developmentStatus: 'testing',
  description: '휴머노이드 로봇 Atlas는 다양한 환경에서 작업할 수 있는 청늨 이빙 로봇입니다.',
  imageUrl: '/images/atlas.jpg',
  releaseYear: 2023,
  price: {
    amount: 2000000,
    currency: 'USD',
    availability: '연구용',
  },
  specifications: {
    height: '150cm',
    weight: '80kg',
    batteryLife: '1시간',
    speed: '2.5m/s',
    payload: '11kg',
  },
  features: ['이족보행', '작업 수행', '자율 내비게이션'],
  applications: ['산업 현장', '구조 작업', '연구 개발'],
  technicalSpecs: {
    sensors: ['LIDAR', 'IMU', '스테레오 카메라'],
    actuators: ['유압식 액츄에이터', '전기 모터'],
    connectivity: ['Wi-Fi', 'Ethernet', 'Bluetooth'],
    operatingSystem: 'ROS 2',
  },
};

const mockRobotWithoutOptionalFields: Robot = {
  ...mockRobot,
  imageUrl: undefined,
  releaseYear: undefined,
  price: undefined,
  technicalSpecs: undefined,
  specifications: {
    height: '150cm',
    weight: '80kg',
  },
};

describe('RobotDetail', () => {
  describe('Rendering', () => {
    it('should render robot basic information', () => {
      render(<RobotDetail robot={mockRobot} />);

      expect(screen.getByText('Atlas')).toBeInTheDocument();
      expect(screen.getByText('Boston Dynamics')).toBeInTheDocument();
      expect(screen.getByText(mockRobot.description)).toBeInTheDocument();
    });

    it('should render robot image', () => {
      render(<RobotDetail robot={mockRobot} />);

      const image = screen.getByTestId('robot-image');
      expect(image).toHaveAttribute('src', '/images/atlas.jpg');
      expect(image).toHaveAttribute('alt', 'Atlas');
    });

    it('should render status badge with correct label and color', () => {
      render(<RobotDetail robot={mockRobot} />);

      const statusBadge = screen.getByText('테스팅');
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveClass('bg-orange-100', 'text-orange-800');
    });

    it('should render category badge with correct label', () => {
      render(<RobotDetail robot={mockRobot} />);

      const categoryBadge = screen.getByText('연구용');
      expect(categoryBadge).toBeInTheDocument();
      expect(categoryBadge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('should render release year when provided', () => {
      render(<RobotDetail robot={mockRobot} />);

      expect(screen.getByText('2023년')).toBeInTheDocument();
    });

    it('should not render release year when not provided', () => {
      render(<RobotDetail robot={mockRobotWithoutOptionalFields} />);

      expect(screen.queryByText(/년$/)).not.toBeInTheDocument();
    });

    it('should render price information when provided', () => {
      render(<RobotDetail robot={mockRobot} />);

      expect(screen.getByText('가격 정보')).toBeInTheDocument();
      expect(screen.getByText('$2,000,000 USD (연구용)')).toBeInTheDocument();
    });

    it('should not render price information when not provided', () => {
      render(<RobotDetail robot={mockRobotWithoutOptionalFields} />);

      expect(screen.queryByText('가격 정보')).not.toBeInTheDocument();
    });

    it('should render main specifications', () => {
      render(<RobotDetail robot={mockRobot} />);

      expect(screen.getByText('높이:')).toBeInTheDocument();
      expect(screen.getAllByText('150cm')[0]).toBeInTheDocument();
      expect(screen.getByText('무게:')).toBeInTheDocument();
      expect(screen.getAllByText('80kg')[0]).toBeInTheDocument();
      expect(screen.getByText('배터리:')).toBeInTheDocument();
      expect(screen.getByText('1시간')).toBeInTheDocument();
      expect(screen.getByText('속도:')).toBeInTheDocument();
      expect(screen.getByText('2.5m/s')).toBeInTheDocument();
    });

    it('should render only required specifications when optional ones are not provided', () => {
      render(<RobotDetail robot={mockRobotWithoutOptionalFields} />);

      expect(screen.getByText('높이:')).toBeInTheDocument();
      expect(screen.getByText('150cm')).toBeInTheDocument();
      expect(screen.getByText('무게:')).toBeInTheDocument();
      expect(screen.getByText('80kg')).toBeInTheDocument();
      expect(screen.queryByText('배터리:')).not.toBeInTheDocument();
      expect(screen.queryByText('속도:')).not.toBeInTheDocument();
    });
  });

  describe('Tab navigation', () => {
    it('should render all tab buttons', () => {
      render(<RobotDetail robot={mockRobot} />);

      expect(screen.getByRole('button', { name: '개요' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '기본 사양' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '기술 사양' })).toBeInTheDocument();
    });

    it('should show overview tab content by default', () => {
      render(<RobotDetail robot={mockRobot} />);

      expect(screen.getByText('설명')).toBeInTheDocument();
      expect(screen.getByText(mockRobot.description)).toBeInTheDocument();
      expect(screen.getByTestId('robot-features')).toBeInTheDocument();
      expect(screen.getByText('활용 분야')).toBeInTheDocument();
    });

    it('should switch to specs tab when clicked', async () => {
      const user = userEvent.setup();
      render(<RobotDetail robot={mockRobot} />);

      const specsTab = screen.getByRole('button', { name: '기본 사양' });
      await user.click(specsTab);

      expect(specsTab).toHaveClass('border-blue-500', 'text-blue-600');
      expect(screen.getByTestId('robot-specs')).toBeInTheDocument();
    });

    it('should switch to technical tab when clicked', async () => {
      const user = userEvent.setup();
      render(<RobotDetail robot={mockRobot} />);

      const technicalTab = screen.getByRole('button', { name: '기술 사양' });
      await user.click(technicalTab);

      expect(technicalTab).toHaveClass('border-blue-500', 'text-blue-600');
      expect(screen.getByText('센서')).toBeInTheDocument();
      expect(screen.getByText('LIDAR')).toBeInTheDocument();
    });

    it('should highlight active tab correctly', async () => {
      const user = userEvent.setup();
      render(<RobotDetail robot={mockRobot} />);

      const overviewTab = screen.getByRole('button', { name: '개요' });
      const specsTab = screen.getByRole('button', { name: '기본 사양' });
      const technicalTab = screen.getByRole('button', { name: '기술 사양' });

      // Initially overview tab is active
      expect(overviewTab).toHaveClass('border-blue-500', 'text-blue-600');
      expect(specsTab).toHaveClass('border-transparent', 'text-gray-500');
      expect(technicalTab).toHaveClass('border-transparent', 'text-gray-500');

      // Click specs tab
      await user.click(specsTab);
      expect(overviewTab).toHaveClass('border-transparent', 'text-gray-500');
      expect(specsTab).toHaveClass('border-blue-500', 'text-blue-600');
      expect(technicalTab).toHaveClass('border-transparent', 'text-gray-500');
    });
  });

  describe('Tab content', () => {
    it('should render overview tab content correctly', () => {
      render(<RobotDetail robot={mockRobot} />);

      // Description
      expect(screen.getByText('설명')).toBeInTheDocument();
      expect(screen.getByText(mockRobot.description)).toBeInTheDocument();

      // Features (mocked component)
      expect(screen.getByTestId('robot-features')).toBeInTheDocument();
      mockRobot.features.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });

      // Applications
      expect(screen.getByText('활용 분야')).toBeInTheDocument();
      mockRobot.applications.forEach(app => {
        expect(screen.getByText(app)).toBeInTheDocument();
      });
    });

    it('should render technical tab content correctly', async () => {
      const user = userEvent.setup();
      render(<RobotDetail robot={mockRobot} />);

      await user.click(screen.getByRole('button', { name: '기술 사양' }));

      // Sensors
      expect(screen.getByText('센서')).toBeInTheDocument();
      mockRobot.technicalSpecs!.sensors!.forEach(sensor => {
        expect(screen.getByText(sensor)).toBeInTheDocument();
      });

      // Actuators
      expect(screen.getByText('액츄에이터')).toBeInTheDocument();
      mockRobot.technicalSpecs!.actuators!.forEach(actuator => {
        expect(screen.getByText(actuator)).toBeInTheDocument();
      });

      // Connectivity
      expect(screen.getByText('연결성')).toBeInTheDocument();
      mockRobot.technicalSpecs!.connectivity!.forEach(conn => {
        expect(screen.getByText(conn)).toBeInTheDocument();
      });

      // Operating System
      expect(screen.getByText('운영체제')).toBeInTheDocument();
      expect(screen.getByText('ROS 2')).toBeInTheDocument();
    });

    it('should render empty technical tab when no technical specs', async () => {
      const user = userEvent.setup();
      render(<RobotDetail robot={mockRobotWithoutOptionalFields} />);

      await user.click(screen.getByRole('button', { name: '기술 사양' }));

      expect(screen.queryByText('센서')).not.toBeInTheDocument();
      expect(screen.queryByText('액츄에이터')).not.toBeInTheDocument();
    });
  });

  describe('Image handling', () => {
    it('should handle image load error', async () => {
      render(<RobotDetail robot={mockRobot} />);

      const image = screen.getByTestId('robot-image');
      
      // Simulate image load error
      image.dispatchEvent(new Event('error'));

      await waitFor(() => {
        expect(screen.getByText('🤖')).toBeInTheDocument();
        expect(screen.getByText('이미지를 불러올 수 없습니다')).toBeInTheDocument();
      });
    });

    it('should show placeholder when no image URL', () => {
      render(<RobotDetail robot={mockRobotWithoutOptionalFields} />);

      expect(screen.getByText('🤖')).toBeInTheDocument();
      expect(screen.getByText('이미지를 불러올 수 없습니다')).toBeInTheDocument();
    });
  });

  describe('Status and category labels', () => {
    const testCases = [
      { status: 'concept', label: '컨셉', colorClass: 'bg-gray-100' },
      { status: 'prototype', label: '프로토타입', colorClass: 'bg-yellow-100' },
      { status: 'development', label: '개발 중', colorClass: 'bg-blue-100' },
      { status: 'research', label: '연구', colorClass: 'bg-purple-100' },
      { status: 'testing', label: '테스팅', colorClass: 'bg-orange-100' },
      { status: 'production', label: '생산', colorClass: 'bg-green-100' },
      { status: 'commercial', label: '상용화', colorClass: 'bg-emerald-100' },
      { status: 'discontinued', label: '중단됨', colorClass: 'bg-red-100' },
    ];

    testCases.forEach(({ status, label, colorClass }) => {
      it(`should display correct label and color for ${status} status`, () => {
        const robotWithStatus = { ...mockRobot, developmentStatus: status as RobotStatus };
        render(<RobotDetail robot={robotWithStatus} />);

        const badge = screen.getByText(label);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(colorClass);
      });
    });

    const categoryTestCases = [
      { category: 'industrial', label: '산업용' },
      { category: 'domestic', label: '가정용' },
      { category: 'research', label: '연구용' },
      { category: 'military', label: '군사용' },
      { category: 'healthcare', label: '의료용' },
      { category: 'entertainment', label: '엔터테인먼트' },
      { category: 'service', label: '서비스' },
    ];

    categoryTestCases.forEach(({ category, label }) => {
      it(`should display correct label for ${category} category`, () => {
        const robotWithCategory = { ...mockRobot, category: category as RobotCategory };
        render(<RobotDetail robot={robotWithCategory} />);

        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle unknown status gracefully', () => {
      const robotWithUnknownStatus = { ...mockRobot, developmentStatus: 'unknown' as RobotStatus };
      render(<RobotDetail robot={robotWithUnknownStatus} />);

      const badge = screen.getByText('unknown');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
    });

    it('should handle unknown category gracefully', () => {
      const robotWithUnknownCategory = { ...mockRobot, category: 'unknown' as RobotCategory };
      render(<RobotDetail robot={robotWithUnknownCategory} />);

      expect(screen.getByText('unknown')).toBeInTheDocument();
    });

    it('should render correctly with minimal required fields', () => {
      const minimalRobot: Robot = {
        id: '1',
        name: 'Minimal Robot',
        manufacturer: 'Test Corp',
        category: 'research',
        developmentStatus: 'concept',
        description: 'Minimal description',
        specifications: {
          height: '100cm',
          weight: '50kg',
        },
        features: [],
        applications: [],
      };

      render(<RobotDetail robot={minimalRobot} />);

      expect(screen.getByText('Minimal Robot')).toBeInTheDocument();
      expect(screen.getByText('Test Corp')).toBeInTheDocument();
      expect(screen.getByText('Minimal description')).toBeInTheDocument();
    });
  });
});
