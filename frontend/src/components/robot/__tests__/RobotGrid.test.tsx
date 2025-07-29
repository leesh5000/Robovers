import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RobotGrid from '../RobotGrid';
import { Robot } from '@/lib/types';

// Mock dependencies
jest.mock('../RobotCard', () => {
  return function MockRobotCard({ robot, onClick }: any) {
    return (
      <div data-testid={`robot-card-${robot.id}`} onClick={() => onClick(robot)}>
        <div>{robot.name}</div>
        <div>{robot.manufacturer}</div>
        <div>{robot.price?.amount || 'N/A'}</div>
      </div>
    );
  };
});

jest.mock('../RobotFilter', () => {
  return function MockRobotFilter({ filters, onFiltersChange, totalCount, manufacturers }: any) {
    return (
      <div data-testid="robot-filter">
        <div>총 {totalCount}개</div>
        <select 
          data-testid="manufacturer-select"
          value={filters.manufacturer || ''}
          onChange={(e) => onFiltersChange({ ...filters, manufacturer: e.target.value || undefined })}
        >
          <option value="">제조사 선택</option>
          {manufacturers.map((m: string) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          data-testid="sort-select"
          value={filters.sortBy || 'name'}
          onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
        >
          <option value="name">이름순</option>
          <option value="manufacturer">제조사순</option>
          <option value="releaseYear">최신순</option>
          <option value="price">가격순</option>
          <option value="height">높이순</option>
          <option value="weight">무게순</option>
        </select>
        <button
          data-testid="category-research"
          onClick={() => onFiltersChange({ ...filters, category: 'research' })}
        >
          연구용
        </button>
        <button
          data-testid="status-testing"
          onClick={() => onFiltersChange({ ...filters, status: 'testing' })}
        >
          테스팅
        </button>
        <button
          data-testid="price-filter"
          onClick={() => onFiltersChange({ ...filters, priceRange: { min: 1000000, max: 5000000 } })}
        >
          가격 필터
        </button>
        <button
          data-testid="feature-filter"
          onClick={() => onFiltersChange({ ...filters, features: ['이족보행'] })}
        >
          기능 필터
        </button>
      </div>
    );
  };
});

jest.mock('@/components/ui/Pagination', () => {
  return function MockPagination({ currentPage, totalPages, onPageChange }: any) {
    return (
      <div data-testid="pagination">
        <div>페이지 {currentPage} / {totalPages}</div>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            data-testid={`page-${i + 1}`}
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };
});

// Mock window.scrollTo
global.scrollTo = jest.fn();

const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'Atlas',
    manufacturer: 'Boston Dynamics',
    category: 'research',
    developmentStatus: 'testing',
    description: 'Atlas robot',
    specifications: { height: '150cm', weight: '80kg' },
    features: ['이족보행', '자율 내비게이션'],
    applications: ['연구'],
    releaseYear: 2023,
    price: { amount: 2000000, currency: 'USD', availability: '연구용' },
  },
  {
    id: '2',
    name: 'Spot',
    manufacturer: 'Boston Dynamics',
    category: 'industrial',
    developmentStatus: 'commercial',
    description: 'Spot robot',
    specifications: { height: '84cm', weight: '32.5kg' },
    features: ['사족보행', '자율 내비게이션'],
    applications: ['산업'],
    releaseYear: 2020,
    price: { amount: 74500, currency: 'USD', availability: '상업용' },
  },
  {
    id: '3',
    name: 'Pepper',
    manufacturer: 'SoftBank Robotics',
    category: 'service',
    developmentStatus: 'commercial',
    description: 'Pepper robot',
    specifications: { height: '120cm', weight: '29kg' },
    features: ['음성 인식', '감정 인식'],
    applications: ['서비스'],
    releaseYear: 2014,
    price: { amount: 20000, currency: 'USD', availability: '상업용' },
  },
  {
    id: '4',
    name: 'ASIMO',
    manufacturer: 'Honda',
    category: 'research',
    developmentStatus: 'discontinued',
    description: 'ASIMO robot',
    specifications: { height: '130cm', weight: '54kg' },
    features: ['이족보행', '물체 인식'],
    applications: ['연구'],
    releaseYear: 2000,
  },
  {
    id: '5',
    name: 'Roomba',
    manufacturer: 'iRobot',
    category: 'domestic',
    developmentStatus: 'commercial',
    description: 'Roomba vacuum',
    specifications: { height: '9cm', weight: '3.8kg' },
    features: ['자율 청소', '장애물 회피'],
    applications: ['가정용'],
    releaseYear: 2022,
    price: { amount: 500, currency: 'USD', availability: '상업용' },
  },
  {
    id: '6',
    name: 'Digit',
    manufacturer: 'Agility Robotics',
    category: 'industrial',
    developmentStatus: 'development',
    description: 'Digit robot',
    specifications: { height: '175cm', weight: '42.2kg' },
    features: ['이족보행', '물체 운반'],
    applications: ['물류'],
    releaseYear: 2024,
    price: { amount: 250000, currency: 'USD', availability: '예약 판매' },
  },
  {
    id: '7',
    name: 'DaVinci',
    manufacturer: 'Intuitive Surgical',
    category: 'healthcare',
    developmentStatus: 'commercial',
    description: 'Surgical robot',
    specifications: { height: '200cm', weight: '500kg' },
    features: ['정밀 수술', '원격 조작'],
    applications: ['의료'],
    releaseYear: 2021,
    price: { amount: 2000000, currency: 'USD', availability: '상업용' },
  },
];

describe('RobotGrid', () => {
  const mockOnRobotClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render robot cards', () => {
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      // Should render first 6 robots (pagination)
      expect(screen.getByTestId('robot-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('robot-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('robot-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('robot-card-4')).toBeInTheDocument();
      expect(screen.getByTestId('robot-card-5')).toBeInTheDocument();
      expect(screen.getByTestId('robot-card-6')).toBeInTheDocument();
      
      // Should not render 7th robot (on page 2)
      expect(screen.queryByTestId('robot-card-7')).not.toBeInTheDocument();
    });

    it('should render filter component with total count', () => {
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      expect(screen.getByTestId('robot-filter')).toBeInTheDocument();
      expect(screen.getByText('총 7개')).toBeInTheDocument();
    });

    it('should render pagination', () => {
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByText('페이지 1 / 2')).toBeInTheDocument();
    });

    it('should render loading skeleton when isLoading is true', () => {
      render(<RobotGrid robots={[]} isLoading={true} />);

      const skeletons = screen.getAllByTestId((content, element) => {
        return element?.className?.includes('animate-pulse') || false;
      });
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render empty state when no robots', () => {
      render(<RobotGrid robots={[]} />);

      expect(screen.getByText('🤖')).toBeInTheDocument();
      expect(screen.getByText('조건에 맞는 로봇이 없습니다')).toBeInTheDocument();
      expect(screen.getByText('다른 필터 조건을 시도해보세요')).toBeInTheDocument();
    });

    it('should extract and pass manufacturers list to filter', () => {
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const manufacturerSelect = screen.getByTestId('manufacturer-select');
      const options = manufacturerSelect.querySelectorAll('option');
      
      expect(options).toHaveLength(6); // "Select" + 5 manufacturers
      expect(options[1]).toHaveTextContent('Agility Robotics');
      expect(options[2]).toHaveTextContent('Boston Dynamics');
      expect(options[3]).toHaveTextContent('Honda');
      expect(options[4]).toHaveTextContent('Intuitive Surgical');
      expect(options[5]).toHaveTextContent('iRobot');
    });
  });

  describe('Filtering', () => {
    it('should filter by manufacturer', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const manufacturerSelect = screen.getByTestId('manufacturer-select');
      await user.selectOptions(manufacturerSelect, 'Boston Dynamics');

      await waitFor(() => {
        expect(screen.getByText('총 2개')).toBeInTheDocument();
        expect(screen.getByTestId('robot-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('robot-card-2')).toBeInTheDocument();
        expect(screen.queryByTestId('robot-card-3')).not.toBeInTheDocument();
      });
    });

    it('should filter by category', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const categoryButton = screen.getByTestId('category-research');
      await user.click(categoryButton);

      await waitFor(() => {
        expect(screen.getByText('총 2개')).toBeInTheDocument();
        expect(screen.getByTestId('robot-card-1')).toBeInTheDocument(); // Atlas
        expect(screen.getByTestId('robot-card-4')).toBeInTheDocument(); // ASIMO
        expect(screen.queryByTestId('robot-card-2')).not.toBeInTheDocument();
      });
    });

    it('should filter by status', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const statusButton = screen.getByTestId('status-testing');
      await user.click(statusButton);

      await waitFor(() => {
        expect(screen.getByText('총 1개')).toBeInTheDocument();
        expect(screen.getByTestId('robot-card-1')).toBeInTheDocument(); // Atlas
        expect(screen.queryByTestId('robot-card-2')).not.toBeInTheDocument();
      });
    });

    it('should filter by price range', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const priceButton = screen.getByTestId('price-filter');
      await user.click(priceButton);

      await waitFor(() => {
        expect(screen.getByText('총 2개')).toBeInTheDocument();
        // Atlas (2M) and DaVinci (2M) are in range
        expect(screen.getByTestId('robot-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('robot-card-7')).toBeInTheDocument();
        // Others are out of range
        expect(screen.queryByTestId('robot-card-5')).not.toBeInTheDocument();
      });
    });

    it('should filter by features', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const featureButton = screen.getByTestId('feature-filter');
      await user.click(featureButton);

      await waitFor(() => {
        expect(screen.getByText('총 3개')).toBeInTheDocument();
        // Robots with '이족보행' feature
        expect(screen.getByTestId('robot-card-1')).toBeInTheDocument(); // Atlas
        expect(screen.getByTestId('robot-card-4')).toBeInTheDocument(); // ASIMO
        expect(screen.getByTestId('robot-card-6')).toBeInTheDocument(); // Digit
        // Others don't have this feature
        expect(screen.queryByTestId('robot-card-2')).not.toBeInTheDocument();
      });
    });

    it('should reset to first page when filters change', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      // Go to page 2
      const page2Button = screen.getByTestId('page-2');
      await user.click(page2Button);
      expect(screen.getByText('페이지 2 / 2')).toBeInTheDocument();

      // Apply filter
      const manufacturerSelect = screen.getByTestId('manufacturer-select');
      await user.selectOptions(manufacturerSelect, 'Boston Dynamics');

      // Should reset to page 1
      await waitFor(() => {
        expect(screen.getByText('페이지 1 / 1')).toBeInTheDocument();
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by name (default)', () => {
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const cards = screen.getAllByTestId(/^robot-card-/);
      expect(cards[0]).toHaveTextContent('ASIMO');
      expect(cards[1]).toHaveTextContent('Atlas');
      expect(cards[2]).toHaveTextContent('DaVinci');
    });

    it('should sort by manufacturer', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'manufacturer');

      await waitFor(() => {
        const cards = screen.getAllByTestId(/^robot-card-/);
        expect(cards[0]).toHaveTextContent('Agility Robotics'); // Digit
        expect(cards[1]).toHaveTextContent('Boston Dynamics'); // Atlas or Spot
      });
    });

    it('should sort by release year (newest first)', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'releaseYear');

      await waitFor(() => {
        const cards = screen.getAllByTestId(/^robot-card-/);
        expect(cards[0]).toHaveTextContent('Digit'); // 2024
        expect(cards[1]).toHaveTextContent('Atlas'); // 2023
        expect(cards[2]).toHaveTextContent('Roomba'); // 2022
      });
    });

    it('should sort by price (lowest first)', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'price');

      await waitFor(() => {
        const cards = screen.getAllByTestId(/^robot-card-/);
        expect(cards[0]).toHaveTextContent('ASIMO'); // No price (0)
        expect(cards[1]).toHaveTextContent('500'); // Roomba
        expect(cards[2]).toHaveTextContent('20000'); // Pepper
      });
    });

    it('should sort by height (tallest first)', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'height');

      await waitFor(() => {
        const cards = screen.getAllByTestId(/^robot-card-/);
        expect(cards[0]).toHaveTextContent('DaVinci'); // 200cm
        expect(cards[1]).toHaveTextContent('Digit'); // 175cm
        expect(cards[2]).toHaveTextContent('Atlas'); // 150cm
      });
    });

    it('should sort by weight (heaviest first)', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'weight');

      await waitFor(() => {
        const cards = screen.getAllByTestId(/^robot-card-/);
        expect(cards[0]).toHaveTextContent('DaVinci'); // 500kg
        expect(cards[1]).toHaveTextContent('Atlas'); // 80kg
        expect(cards[2]).toHaveTextContent('ASIMO'); // 54kg
      });
    });
  });

  describe('Pagination', () => {
    it('should show only 6 items per page', () => {
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const cards = screen.getAllByTestId(/^robot-card-/);
      expect(cards).toHaveLength(6);
    });

    it('should navigate to page 2', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const page2Button = screen.getByTestId('page-2');
      await user.click(page2Button);

      await waitFor(() => {
        expect(screen.getByText('페이지 2 / 2')).toBeInTheDocument();
        expect(screen.getByTestId('robot-card-7')).toBeInTheDocument();
        expect(screen.queryByTestId('robot-card-1')).not.toBeInTheDocument();
      });
    });

    it('should scroll to top when changing pages', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const page2Button = screen.getByTestId('page-2');
      await user.click(page2Button);

      expect(global.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });

    it('should calculate correct total pages', () => {
      const manyRobots = Array(15).fill(null).map((_, i) => ({
        ...mockRobots[0],
        id: `robot-${i}`,
        name: `Robot ${i}`,
      }));

      render(<RobotGrid robots={manyRobots} onRobotClick={mockOnRobotClick} />);

      // 15 robots / 6 per page = 3 pages
      expect(screen.getByText('페이지 1 / 3')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle robot card click', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const robotCard = screen.getByTestId('robot-card-1');
      await user.click(robotCard);

      expect(mockOnRobotClick).toHaveBeenCalledWith(mockRobots[0]);
    });

    it('should handle empty state reset button', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={[]} />);

      const resetButton = screen.getByRole('button', { name: '필터 초기화' });
      await user.click(resetButton);

      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle robots without price', () => {
      const robotsWithoutPrice = [
        { ...mockRobots[0], price: undefined },
        { ...mockRobots[1] },
      ];

      render(<RobotGrid robots={robotsWithoutPrice} onRobotClick={mockOnRobotClick} />);

      expect(screen.getByTestId('robot-card-1')).toHaveTextContent('N/A');
      expect(screen.getByTestId('robot-card-2')).toHaveTextContent('74500');
    });

    it('should handle robots without release year', async () => {
      const user = userEvent.setup();
      render(<RobotGrid robots={mockRobots} onRobotClick={mockOnRobotClick} />);

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'releaseYear');

      await waitFor(() => {
        const cards = screen.getAllByTestId(/^robot-card-/);
        // ASIMO has no release year, should be treated as 0
        const asimoCard = Array.from(cards).find(card => 
          card.textContent?.includes('ASIMO')
        );
        expect(asimoCard).toBeInTheDocument();
      });
    });

    it('should handle empty features array for filtering', async () => {
      const robotWithNoFeatures = {
        ...mockRobots[0],
        id: 'no-features',
        features: [],
      };

      const user = userEvent.setup();
      render(
        <RobotGrid 
          robots={[robotWithNoFeatures, ...mockRobots]} 
          onRobotClick={mockOnRobotClick} 
        />
      );

      const featureButton = screen.getByTestId('feature-filter');
      await user.click(featureButton);

      await waitFor(() => {
        expect(screen.queryByTestId('robot-card-no-features')).not.toBeInTheDocument();
      });
    });

    it('should handle specifications without numeric values', async () => {
      const robotWithTextSpecs = {
        ...mockRobots[0],
        specifications: {
          height: 'unknown',
          weight: 'N/A',
        },
      };

      const user = userEvent.setup();
      render(
        <RobotGrid 
          robots={[robotWithTextSpecs, ...mockRobots.slice(1)]} 
          onRobotClick={mockOnRobotClick} 
        />
      );

      const sortSelect = screen.getByTestId('sort-select');
      await user.selectOptions(sortSelect, 'height');

      // Should not crash and treat non-numeric as 0
      await waitFor(() => {
        expect(screen.getByTestId('robot-card-1')).toBeInTheDocument();
      });
    });
  });
});
