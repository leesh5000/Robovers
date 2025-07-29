import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RobotCard from '../RobotCard';
import { Robot, RobotCategory, RobotStatus } from '@/lib/types';

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

const mockRobot: Robot = {
  id: '1',
  name: 'Atlas',
  manufacturer: 'Boston Dynamics',
  category: 'research' as RobotCategory,
  imageUrl: '/images/atlas.jpg',
  description: 'Advanced humanoid robot with exceptional mobility',
  specifications: {
    height: '1.5m',
    weight: '80kg',
    batteryLife: '60분',
    speed: '2.5m/s',
    payload: '11kg'
  },
  developmentStatus: 'production' as RobotStatus,
  releaseYear: 2013,
  price: {
    amount: 2000000,
    currency: 'USD',
    availability: 'Contact for pricing'
  },
  features: ['Running', 'Jumping', 'Backflips'],
  applications: ['Research', 'Entertainment'],
  technicalSpecs: {
    sensors: ['LiDAR', 'Stereo Vision', 'IMU'],
    actuators: ['28 Electric Motors'],
    connectivity: ['WiFi', 'Ethernet'],
    operatingSystem: 'Proprietary'
  }
};

describe('RobotCard', () => {
  describe('rendering', () => {
    it('should render robot basic information', () => {
      render(<RobotCard robot={mockRobot} />);

      expect(screen.getByText('Atlas')).toBeInTheDocument();
      expect(screen.getByText('Boston Dynamics')).toBeInTheDocument();
      expect(screen.getByText('연구용')).toBeInTheDocument(); // category translated
    });

    it('should render robot image with correct attributes', () => {
      render(<RobotCard robot={mockRobot} />);

      const image = screen.getByAltText('Atlas');
      expect(image).toBeInTheDocument();
      // Next.js Image component transforms the src
      const src = image.getAttribute('src');
      expect(src).toContain('images%2Fatlas.jpg');
    });

    it('should render price information', () => {
      render(<RobotCard robot={mockRobot} />);

      expect(screen.getByText('$2,000,000')).toBeInTheDocument();
    });

    it('should render robot status', () => {
      render(<RobotCard robot={mockRobot} />);

      expect(screen.getByText('생산중')).toBeInTheDocument(); // status translated
    });

    it('should render robot specifications', () => {
      render(<RobotCard robot={mockRobot} />);

      expect(screen.getByText('1.5m')).toBeInTheDocument();
      expect(screen.getByText('80kg')).toBeInTheDocument();
      expect(screen.getByText('60분')).toBeInTheDocument();
    });

    it('should render main features', () => {
      render(<RobotCard robot={mockRobot} />);

      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Jumping')).toBeInTheDocument();
      expect(screen.getByText('Backflips')).toBeInTheDocument();
    });


    it('should render default image when imageUrl is not provided', () => {
      const robotWithoutImage = { ...mockRobot, imageUrl: undefined };
      render(<RobotCard robot={robotWithoutImage} />);

      const defaultImage = screen.getByText('🤖');
      expect(defaultImage).toBeInTheDocument();
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalRobot: Robot = {
        ...mockRobot,
        price: undefined,
        specifications: {
          height: '0m',
          weight: '0kg'
        }
      };

      render(<RobotCard robot={minimalRobot} />);

      // Price section should not be rendered when price is undefined
      expect(screen.queryByText('가격')).not.toBeInTheDocument();
    });
  });

  describe('category badge', () => {
    it('should apply correct color for research category', () => {
      render(<RobotCard robot={mockRobot} />);

      const badge = screen.getByText('연구용');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('should apply correct color for service category', () => {
      const serviceRobot = { ...mockRobot, category: 'service' as const };
      render(<RobotCard robot={serviceRobot} />);

      const badge = screen.getByText('서비스');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('should apply correct color for industrial category', () => {
      const industrialRobot = { ...mockRobot, category: 'industrial' as const };
      render(<RobotCard robot={industrialRobot} />);

      const badge = screen.getByText('산업용');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });
  });

  describe('status indicator', () => {
    it('should show correct status for production', () => {
      render(<RobotCard robot={mockRobot} />);

      expect(screen.getByText('생산중')).toBeInTheDocument();
    });

    it('should show correct status for prototype', () => {
      const prototypeRobot = { ...mockRobot, developmentStatus: 'prototype' as RobotStatus };
      render(<RobotCard robot={prototypeRobot} />);

      expect(screen.getByText('프로토타입')).toBeInTheDocument();
    });

    it('should show correct status for discontinued', () => {
      const discontinuedRobot = { ...mockRobot, developmentStatus: 'discontinued' as RobotStatus };
      render(<RobotCard robot={discontinuedRobot} />);

      expect(screen.getByText('단종')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should call onClick handler when clicked', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();
      
      render(<RobotCard robot={mockRobot} onClick={mockOnClick} />);

      const card = screen.getByText('Atlas').closest('div')?.parentElement?.parentElement;
      await user.click(card!);

      expect(mockOnClick).toHaveBeenCalledWith(mockRobot);
    });
  });

  describe('hover effects', () => {
    it('should have hover classes on card', () => {
      render(<RobotCard robot={mockRobot} />);

      const card = screen.getByText('Atlas').closest('.bg-white');
      expect(card).toHaveClass('hover:shadow-md', 'cursor-pointer');
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<RobotCard robot={mockRobot} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Atlas');
    });

    it('should have descriptive alt text for images', () => {
      render(<RobotCard robot={mockRobot} />);

      const image = screen.getByAltText('Atlas');
      expect(image).toBeInTheDocument();
    });
  });

  describe('formatting', () => {
    it('should format large price correctly', () => {
      const robotWithLargePrice = {
        ...mockRobot,
        price: {
          amount: 10000000,
          currency: 'USD',
          availability: 'Contact for pricing'
        }
      };
      render(<RobotCard robot={robotWithLargePrice} />);

      expect(screen.getByText('$10,000,000')).toBeInTheDocument();
    });

    it('should format price with USD currency', () => {
      render(<RobotCard robot={mockRobot} />);

      const price = screen.getByText('$2,000,000');
      expect(price).toBeInTheDocument();
    });
  });
});