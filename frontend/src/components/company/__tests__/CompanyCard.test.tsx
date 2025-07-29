import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyCard from '../CompanyCard';
import { Company } from '@/lib/types';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, ...props }: {
    src: string;
    alt: string;
    onError?: (e: any) => void;
    [key: string]: any;
  }) {
    return (
      <img
        src={src}
        alt={alt}
        onError={onError}
        data-testid="company-logo"
        {...props}
      />
    );
  };
});

describe('CompanyCard', () => {
  const mockOnClick = jest.fn();

  const publicCompany: Company = {
    id: '1',
    name: 'Tesla Inc',
    symbol: 'TSLA',
    currentPrice: 250.75,
    changePercent: 3.45,
    changeAmount: 8.36,
    logoUrl: 'https://example.com/tesla-logo.png',
    marketCap: 800000000000,
    description: '전기차 및 에너지 저장 시스템 제조업체',
    foundedYear: 2003,
    country: '미국',
    employeeCount: 100000,
    isPublic: true,
    mainProducts: ['Model S', 'Model 3', 'Model X'],
    robotProjects: ['Optimus', 'Autopilot AI', 'Dojo Training'],
    website: 'https://tesla.com',
    sector: 'automotive',
  };

  const privateCompany: Company = {
    id: '2',
    name: 'Boston Dynamics',
    symbol: 'BD',
    currentPrice: 0,
    changePercent: 0,
    changeAmount: 0,
    marketCap: 5000000000,
    description: '고급 로봇 기술 연구 개발 회사',
    foundedYear: 1992,
    country: '미국',
    employeeCount: 500,
    isPublic: false,
    robotProjects: ['Atlas', 'Spot', 'Handle', 'Pick'],
    sector: 'robotics',
  };

  const koreanCompany: Company = {
    id: '3',
    name: '삼성전자',
    symbol: '005930',
    currentPrice: 75000,
    changePercent: -1.5,
    changeAmount: -1125,
    marketCap: 400000000000,
    description: '전자 제품 및 반도체 제조업체',
    foundedYear: 1969,
    country: '한국',
    employeeCount: 280000,
    isPublic: true,
    sector: 'technology',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render company name and symbol', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('Tesla Inc')).toBeInTheDocument();
      expect(screen.getByText('TSLA')).toBeInTheDocument();
    });

    it('should render company description', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('전기차 및 에너지 저장 시스템 제조업체')).toBeInTheDocument();
    });

    it('should render sector badge when provided', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const sectorBadge = screen.getByText('automotive');
      expect(sectorBadge).toBeInTheDocument();
      expect(sectorBadge).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('should not render sector badge when not provided', () => {
      const companyWithoutSector = { ...publicCompany, sector: undefined };
      render(<CompanyCard company={companyWithoutSector} onClick={mockOnClick} />);
      
      expect(screen.queryByText('automotive')).not.toBeInTheDocument();
    });

    it('should render country and founded year', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('미국')).toBeInTheDocument();
      expect(screen.getByText('창립: 2003')).toBeInTheDocument();
    });

    it('should handle missing founded year', () => {
      const companyWithoutYear = { ...publicCompany, foundedYear: undefined };
      render(<CompanyCard company={companyWithoutYear} onClick={mockOnClick} />);
      
      expect(screen.getByText('창립: -')).toBeInTheDocument();
    });
  });

  describe('Logo Rendering', () => {
    it('should render company logo when logoUrl is provided', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const logo = screen.getByTestId('company-logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'https://example.com/tesla-logo.png');
      expect(logo).toHaveAttribute('alt', 'Tesla Inc logo');
    });

    it('should render fallback when no logoUrl is provided', () => {
      const companyWithoutLogo = { ...publicCompany, logoUrl: undefined };
      render(<CompanyCard company={companyWithoutLogo} onClick={mockOnClick} />);
      
      expect(screen.queryByTestId('company-logo')).not.toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument(); // First letter fallback
    });

    it('should handle image error by setting fallback src', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const logo = screen.getByTestId('company-logo');
      const errorEvent = { currentTarget: { src: '' } } as any;
      
      // Simulate image error
      if (logo.onerror) {
        logo.onerror(errorEvent);
      }
      
      expect(errorEvent.currentTarget.src).toBe('https://via.placeholder.com/48x48?text=T');
    });
  });

  describe('Public Company Display', () => {
    it('should display stock price and changes for public companies', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('$250.75')).toBeInTheDocument();
      expect(screen.getByText('+3.45%')).toBeInTheDocument();
      expect(screen.getByText('(+$8.36)')).toBeInTheDocument();
    });

    it('should display market cap for public companies', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('시가총액: $800.0B')).toBeInTheDocument();
    });

    it('should show green color for positive changes', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const percentChange = screen.getByText('+3.45%');
      const amountChange = screen.getByText('(+$8.36)');
      
      expect(percentChange).toHaveClass('text-green-600');
      expect(amountChange).toHaveClass('text-green-600');
    });

    it('should show red color for negative changes', () => {
      render(<CompanyCard company={koreanCompany} onClick={mockOnClick} />);
      
      const percentChange = screen.getByText('-1.50%');
      const amountChange = screen.getByText('(-₩1,125)');
      
      expect(percentChange).toHaveClass('text-red-600');
      expect(amountChange).toHaveClass('text-red-600');
    });

    it('should not show stock info when price is 0', () => {
      const companyWithZeroPrice = { ...publicCompany, currentPrice: 0 };
      render(<CompanyCard company={companyWithZeroPrice} onClick={mockOnClick} />);
      
      expect(screen.getByText('비상장 기업')).toBeInTheDocument();
      expect(screen.queryByText('$250.75')).not.toBeInTheDocument();
    });
  });

  describe('Private Company Display', () => {
    it('should display private company info', () => {
      render(<CompanyCard company={privateCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('비상장 기업')).toBeInTheDocument();
      expect(screen.getByText('추정 가치: $5.0B')).toBeInTheDocument();
    });

    it('should not display stock price for private companies', () => {
      render(<CompanyCard company={privateCompany} onClick={mockOnClick} />);
      
      expect(screen.queryByText(/\$.*\.\d{2}/)).not.toBeInTheDocument();
      expect(screen.queryByText(/[+-]\d+\.\d{2}%/)).not.toBeInTheDocument();
    });
  });

  describe('Price Formatting', () => {
    it('should format US prices in dollars', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('$250.75')).toBeInTheDocument();
    });

    it('should format Korean prices in won', () => {
      render(<CompanyCard company={koreanCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('₩75,000')).toBeInTheDocument();
    });

    it('should format Japanese prices in yen', () => {
      const japaneseCompany = { 
        ...publicCompany, 
        currentPrice: 1250,
        country: '일본',
        changeAmount: -25
      };
      render(<CompanyCard company={japaneseCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('¥1,250')).toBeInTheDocument();
      expect(screen.getByText('(-¥25)')).toBeInTheDocument();
    });

    it('should return dash for zero price', () => {
      const zeroPrice = { ...publicCompany, currentPrice: 0 };
      render(<CompanyCard company={zeroPrice} onClick={mockOnClick} />);
      
      // Since it's a "public" company but price is 0, it should show private company info
      expect(screen.getByText('비상장 기업')).toBeInTheDocument();
    });
  });

  describe('Market Cap Formatting', () => {
    it('should format trillion-dollar market cap', () => {
      const trillionCompany = { ...publicCompany, marketCap: 2500000000000 };
      render(<CompanyCard company={trillionCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('시가총액: $2.5T')).toBeInTheDocument();
    });

    it('should format billion-dollar market cap', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('시가총액: $800.0B')).toBeInTheDocument();
    });

    it('should format million-dollar market cap', () => {
      const millionCompany = { ...publicCompany, marketCap: 500000000 };
      render(<CompanyCard company={millionCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('시가총액: $500.0M')).toBeInTheDocument();
    });

    it('should format smaller market cap with commas', () => {
      const smallCompany = { ...publicCompany, marketCap: 150000 };
      render(<CompanyCard company={smallCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('시가총액: $150,000')).toBeInTheDocument();
    });

    it('should show 비상장 for zero or undefined market cap', () => {
      const noMarketCapCompany = { ...publicCompany, marketCap: 0 };
      render(<CompanyCard company={noMarketCapCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('추정 가치: 비상장')).toBeInTheDocument();
    });
  });

  describe('Robot Projects', () => {
    it('should display up to 3 robot projects', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('Optimus')).toBeInTheDocument();
      expect(screen.getByText('Autopilot AI')).toBeInTheDocument();
      expect(screen.getByText('Dojo Training')).toBeInTheDocument();
    });

    it('should show +N indicator when more than 3 projects', () => {
      render(<CompanyCard company={privateCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('Atlas')).toBeInTheDocument();
      expect(screen.getByText('Spot')).toBeInTheDocument();
      expect(screen.getByText('Handle')).toBeInTheDocument();
      expect(screen.getByText('+1')).toBeInTheDocument(); // 4 projects total, showing +1
    });

    it('should not show +N indicator when exactly 3 projects', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
    });

    it('should handle companies with no robot projects', () => {
      const companyWithoutProjects = { ...publicCompany, robotProjects: undefined };
      render(<CompanyCard company={companyWithoutProjects} onClick={mockOnClick} />);
      
      expect(screen.queryByText('Optimus')).not.toBeInTheDocument();
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
    });

    it('should handle companies with empty robot projects array', () => {
      const companyWithEmptyProjects = { ...publicCompany, robotProjects: [] };
      render(<CompanyCard company={companyWithEmptyProjects} onClick={mockOnClick} />);
      
      expect(screen.queryByText('Optimus')).not.toBeInTheDocument();
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick handler when card is clicked', async () => {
      const user = userEvent.setup();
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const card = screen.getByText('Tesla Inc').closest('div');
      await user.click(card!);
      
      expect(mockOnClick).toHaveBeenCalledWith(publicCompany);
    });

    it('should not crash when onClick is not provided', async () => {
      const user = userEvent.setup();
      render(<CompanyCard company={publicCompany} />);
      
      const card = screen.getByText('Tesla Inc').closest('div');
      await user.click(card!);
      
      // Should not throw any errors
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle company with minimal data', () => {
      const minimalCompany: Company = {
        id: '4',
        name: 'Test Company',
        symbol: 'TEST',
        currentPrice: 0,
        changePercent: 0,
        changeAmount: 0,
        isPublic: false,
      };
      
      render(<CompanyCard company={minimalCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument(); // Fallback logo
      expect(screen.getByText('비상장 기업')).toBeInTheDocument();
    });

    it('should handle very long company names', () => {
      const longNameCompany = {
        ...publicCompany,
        name: 'Very Long Company Name That Might Overflow The Container Width'
      };
      
      render(<CompanyCard company={longNameCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('Very Long Company Name That Might Overflow The Container Width')).toBeInTheDocument();
    });

    it('should handle very long descriptions with line-clamp', () => {
      const longDescCompany = {
        ...publicCompany,
        description: 'This is a very long description that should be clamped to two lines maximum to prevent the card from becoming too tall and maintaining consistent layout across the grid of company cards.'
      };
      
      render(<CompanyCard company={longDescCompany} onClick={mockOnClick} />);
      
      const description = screen.getByText(/This is a very long description/);
      expect(description).toHaveClass('line-clamp-2');
    });

    it('should handle special characters in company name', () => {
      const specialCharCompany = {
        ...publicCompany,
        name: 'AT&T Inc.',
        symbol: 'T'
      };
      
      render(<CompanyCard company={specialCharCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('AT&T Inc.')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument(); // First character for fallback logo
    });

    it('should handle zero change amounts', () => {
      const noChangeCompany = {
        ...publicCompany,
        changePercent: 0,
        changeAmount: 0
      };
      
      render(<CompanyCard company={noChangeCompany} onClick={mockOnClick} />);
      
      expect(screen.getByText('+0.00%')).toBeInTheDocument();
      expect(screen.getByText('(+$0.00)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const companyName = screen.getByRole('heading', { level: 3 });
      expect(companyName).toHaveTextContent('Tesla Inc');
    });

    it('should have proper alt text for logo', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const logo = screen.getByTestId('company-logo');
      expect(logo).toHaveAttribute('alt', 'Tesla Inc logo');
    });

    it('should be keyboard accessible (clickable)', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const card = screen.getByText('Tesla Inc').closest('div');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Visual States', () => {
    it('should have hover effect classes', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const card = screen.getByText('Tesla Inc').closest('div');
      expect(card).toHaveClass('hover:shadow-lg', 'transition-all');
    });

    it('should have proper color coding for price changes', () => {
      render(<CompanyCard company={publicCompany} onClick={mockOnClick} />);
      
      const positiveChange = screen.getByText('+3.45%');
      expect(positiveChange).toHaveClass('text-green-600');
      
      render(<CompanyCard company={koreanCompany} onClick={mockOnClick} />);
      
      const negativeChange = screen.getByText('-1.50%');
      expect(negativeChange).toHaveClass('text-red-600');
    });
  });
});