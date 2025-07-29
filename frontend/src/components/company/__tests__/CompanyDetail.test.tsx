import React from 'react';
import { render, screen } from '@testing-library/react';
import CompanyDetail from '../CompanyDetail';
import { Company } from '@/lib/types';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, ...props }: any) {
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

// Mock child components
jest.mock('../LazyStockChart', () => {
  return function MockLazyStockChart({ companyId, companyName }: any) {
    return (
      <div data-testid="stock-chart">
        <div>Stock Chart for {companyName}</div>
        <div>Company ID: {companyId}</div>
      </div>
    );
  };
});

jest.mock('../CompanyFinancials', () => {
  return function MockCompanyFinancials({ company }: any) {
    return (
      <div data-testid="company-financials">
        <div>Financials for {company.name}</div>
      </div>
    );
  };
});

describe('CompanyDetail', () => {
  const publicCompany: Company = {
    id: '1',
    name: 'Tesla Inc',
    symbol: 'TSLA',
    currentPrice: 250.75,
    changePercent: 3.45,
    changeAmount: 8.36,
    logoUrl: 'https://example.com/tesla-logo.png',
    marketCap: 800000000000,
    description: '전기차 및 에너지 저장 시스템을 제조하는 혁신적인 기업',
    foundedYear: 2003,
    country: '미국',
    employeeCount: 100000,
    isPublic: true,
    mainProducts: ['Model S', 'Model 3', 'Model X'],
    robotProjects: ['Optimus', 'Autopilot AI'],
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
    description: '고급 로봇 기술을 연구 개발하는 선도적인 회사',
    foundedYear: 1992,
    country: '미국',
    employeeCount: 500,
    isPublic: false,
    robotProjects: ['Atlas', 'Spot', 'Handle'],
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
    description: '전자 제품 및 반도체를 제조하는 글로벌 기업',
    foundedYear: 1969,
    country: '한국',
    employeeCount: 280000,
    isPublic: true,
    sector: 'technology',
    website: 'https://samsung.com/kr',
  };

  describe('Basic Header Information', () => {
    it('should render company name and symbol', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tesla Inc');
      expect(screen.getByText('(TSLA)')).toBeInTheDocument();
    });

    it('should render company description', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('전기차 및 에너지 저장 시스템을 제조하는 혁신적인 기업')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const companyWithoutDescription = { ...publicCompany, description: undefined };
      render(<CompanyDetail company={companyWithoutDescription} />);
      
      expect(screen.queryByText('전기차 및 에너지 저장 시스템을 제조하는 혁신적인 기업')).not.toBeInTheDocument();
    });

    it('should render sector, country, and founded year', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('자동차')).toBeInTheDocument();
      expect(screen.getByText('미국')).toBeInTheDocument();
      expect(screen.getByText('창립: 2003')).toBeInTheDocument();
    });

    it('should handle missing founded year', () => {
      const companyWithoutYear = { ...publicCompany, foundedYear: undefined };
      render(<CompanyDetail company={companyWithoutYear} />);
      
      expect(screen.getByText('창립: -')).toBeInTheDocument();
    });
  });

  describe('Logo Rendering', () => {
    it('should render company logo when logoUrl is provided', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const logo = screen.getByTestId('company-logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'https://example.com/tesla-logo.png');
      expect(logo).toHaveAttribute('alt', 'Tesla Inc logo');
    });

    it('should render fallback when no logoUrl is provided', () => {
      const companyWithoutLogo = { ...publicCompany, logoUrl: undefined };
      render(<CompanyDetail company={companyWithoutLogo} />);
      
      expect(screen.queryByTestId('company-logo')).not.toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument(); // First letter fallback
    });

    it('should handle image error by setting fallback src', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const logo = screen.getByTestId('company-logo');
      const errorEvent = { currentTarget: { src: '' } } as any;
      
      // Simulate image error
      if (logo.onerror) {
        logo.onerror(errorEvent);
      }
      
      expect(errorEvent.currentTarget.src).toBe('https://via.placeholder.com/96x96?text=T');
    });
  });

  describe('Stock Information (Public Companies)', () => {
    it('should display stock price for public companies', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('현재 주가')).toBeInTheDocument();
      expect(screen.getByText('$250.75')).toBeInTheDocument();
    });

    it('should display positive price changes with green color', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const percentChange = screen.getByText('▲ 3.45%');
      const amountChange = screen.getByText('(+$8.36)');
      
      expect(percentChange).toHaveClass('text-green-600');
      expect(amountChange).toHaveClass('text-green-600');
    });

    it('should display negative price changes with red color', () => {
      render(<CompanyDetail company={koreanCompany} />);
      
      const percentChange = screen.getByText('▼ 1.50%');
      const amountChange = screen.getByText('(-₩1,125)');
      
      expect(percentChange).toHaveClass('text-red-600');
      expect(amountChange).toHaveClass('text-red-600');
    });

    it('should format prices according to country', () => {
      render(<CompanyDetail company={koreanCompany} />);
      
      expect(screen.getByText('₩75,000')).toBeInTheDocument();
      expect(screen.getByText('(-₩1,125)')).toBeInTheDocument();
    });

    it('should display market cap', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('시가총액:')).toBeInTheDocument();
      expect(screen.getByText('$800.0B')).toBeInTheDocument();
    });

    it('should not display stock info for private companies', () => {
      render(<CompanyDetail company={privateCompany} />);
      
      expect(screen.queryByText('현재 주가')).not.toBeInTheDocument();
      expect(screen.queryByText(/\$.*\.\d{2}/)).not.toBeInTheDocument();
    });

    it('should not display stock info when price is 0', () => {
      const companyWithZeroPrice = { ...publicCompany, currentPrice: 0 };
      render(<CompanyDetail company={companyWithZeroPrice} />);
      
      expect(screen.queryByText('현재 주가')).not.toBeInTheDocument();
    });
  });

  describe('Robot Projects Section', () => {
    it('should render robot projects when available', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('휴머노이드 로봇 프로젝트')).toBeInTheDocument();
      expect(screen.getByText('Optimus')).toBeInTheDocument();
      expect(screen.getByText('Autopilot AI')).toBeInTheDocument();
    });

    it('should render robot project cards with proper styling', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const optimusCard = screen.getByText('Optimus').closest('div');
      expect(optimusCard).toHaveClass('bg-gray-50', 'rounded-lg', 'p-4', 'border', 'border-gray-200');
      
      // Should have robot emoji
      expect(screen.getAllByText('🤖')).toHaveLength(2); // One for each project
    });

    it('should not render robot projects section when empty', () => {
      const companyWithoutProjects = { ...publicCompany, robotProjects: [] };
      render(<CompanyDetail company={companyWithoutProjects} />);
      
      expect(screen.queryByText('휴머노이드 로봇 프로젝트')).not.toBeInTheDocument();
    });

    it('should not render robot projects section when undefined', () => {
      const companyWithoutProjects = { ...publicCompany, robotProjects: undefined };
      render(<CompanyDetail company={companyWithoutProjects} />);
      
      expect(screen.queryByText('휴머노이드 로봇 프로젝트')).not.toBeInTheDocument();
    });

    it('should render all robot projects in grid layout', () => {
      render(<CompanyDetail company={privateCompany} />);
      
      expect(screen.getByText('Atlas')).toBeInTheDocument();
      expect(screen.getByText('Spot')).toBeInTheDocument();
      expect(screen.getByText('Handle')).toBeInTheDocument();
      
      const projectsContainer = screen.getByText('Atlas').closest('div')?.parentElement;
      expect(projectsContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    });
  });

  describe('Stock Chart Section', () => {
    it('should render stock chart for public companies', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByTestId('stock-chart')).toBeInTheDocument();
      expect(screen.getByText('Stock Chart for Tesla Inc')).toBeInTheDocument();
      expect(screen.getByText('Company ID: 1')).toBeInTheDocument();
    });

    it('should not render stock chart for private companies', () => {
      render(<CompanyDetail company={privateCompany} />);
      
      expect(screen.queryByTestId('stock-chart')).not.toBeInTheDocument();
    });

    it('should not render stock chart when price is 0', () => {
      const companyWithZeroPrice = { ...publicCompany, currentPrice: 0 };
      render(<CompanyDetail company={companyWithZeroPrice} />);
      
      expect(screen.queryByTestId('stock-chart')).not.toBeInTheDocument();
    });
  });

  describe('Company Financials Section', () => {
    it('should always render company financials', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByTestId('company-financials')).toBeInTheDocument();
      expect(screen.getByText('Financials for Tesla Inc')).toBeInTheDocument();
    });

    it('should render financials for private companies too', () => {
      render(<CompanyDetail company={privateCompany} />);
      
      expect(screen.getByTestId('company-financials')).toBeInTheDocument();
      expect(screen.getByText('Financials for Boston Dynamics')).toBeInTheDocument();
    });
  });

  describe('Website Link Section', () => {
    it('should render website link when available', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('추가 정보')).toBeInTheDocument();
      
      const websiteLink = screen.getByRole('link', { name: /공식 웹사이트 방문/ });
      expect(websiteLink).toBeInTheDocument();
      expect(websiteLink).toHaveAttribute('href', 'https://tesla.com');
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not render website section when not available', () => {
      render(<CompanyDetail company={privateCompany} />);
      
      expect(screen.queryByText('추가 정보')).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /공식 웹사이트 방문/ })).not.toBeInTheDocument();
    });

    it('should have proper external link styling', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const websiteLink = screen.getByRole('link', { name: /공식 웹사이트 방문/ });
      expect(websiteLink).toHaveClass('text-blue-600', 'hover:text-blue-700');
    });
  });

  describe('Sector Label Mapping', () => {
    it('should map robotics sector correctly', () => {
      render(<CompanyDetail company={privateCompany} />);
      
      expect(screen.getByText('로봇')).toBeInTheDocument();
    });

    it('should map automotive sector correctly', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('자동차')).toBeInTheDocument();
    });

    it('should map technology sector correctly', () => {
      render(<CompanyDetail company={koreanCompany} />);
      
      expect(screen.getByText('기술')).toBeInTheDocument();
    });

    it('should handle unknown sectors', () => {
      const companyWithUnknownSector = { ...publicCompany, sector: 'unknown' as any };
      render(<CompanyDetail company={companyWithUnknownSector} />);
      
      expect(screen.getByText('unknown')).toBeInTheDocument();
    });

    it('should handle undefined sector', () => {
      const companyWithoutSector = { ...publicCompany, sector: undefined };
      render(<CompanyDetail company={companyWithoutSector} />);
      
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Price and Market Cap Formatting', () => {
    it('should format US prices correctly', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('$250.75')).toBeInTheDocument();
      expect(screen.getByText('(+$8.36)')).toBeInTheDocument();
    });

    it('should format Korean prices correctly', () => {
      render(<CompanyDetail company={koreanCompany} />);
      
      expect(screen.getByText('₩75,000')).toBeInTheDocument();
      expect(screen.getByText('(-₩1,125)')).toBeInTheDocument();
    });

    it('should format Japanese prices correctly', () => {
      const japaneseCompany = {
        ...publicCompany,
        currentPrice: 1250,
        changeAmount: -25,
        country: '일본'
      };
      
      render(<CompanyDetail company={japaneseCompany} />);
      
      expect(screen.getByText('¥1,250')).toBeInTheDocument();
      expect(screen.getByText('(-¥25)')).toBeInTheDocument();
    });

    it('should format trillion market cap correctly', () => {
      const trillionCompany = { ...publicCompany, marketCap: 2500000000000 };
      render(<CompanyDetail company={trillionCompany} />);
      
      expect(screen.getByText('$2.5T')).toBeInTheDocument();
    });

    it('should format billion market cap correctly', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      expect(screen.getByText('$800.0B')).toBeInTheDocument();
    });

    it('should format million market cap correctly', () => {
      const millionCompany = { ...publicCompany, marketCap: 500000000 };
      render(<CompanyDetail company={millionCompany} />);
      
      expect(screen.getByText('$500.0M')).toBeInTheDocument();
    });

    it('should handle zero market cap', () => {
      const zeroMarketCapCompany = { ...publicCompany, marketCap: 0 };
      render(<CompanyDetail company={zeroMarketCapCompany} />);
      
      expect(screen.getByText('비상장')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimal company data', () => {
      const minimalCompany: Company = {
        id: '4',
        name: 'Minimal Corp',
        symbol: 'MIN',
        currentPrice: 0,
        changePercent: 0,
        changeAmount: 0,
        isPublic: false,
      };
      
      render(<CompanyDetail company={minimalCompany} />);
      
      expect(screen.getByText('Minimal Corp')).toBeInTheDocument();
      expect(screen.getByText('(MIN)')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument(); // Fallback logo
      expect(screen.getByText('-')).toBeInTheDocument(); // Missing sector
      expect(screen.getByText('창립: -')).toBeInTheDocument(); // Missing founded year
    });

    it('should handle zero price changes', () => {
      const noChangeCompany = {
        ...publicCompany,
        changePercent: 0,
        changeAmount: 0
      };
      
      render(<CompanyDetail company={noChangeCompany} />);
      
      expect(screen.getByText('▲ 0.00%')).toBeInTheDocument();
      expect(screen.getByText('(+$0.00)')).toBeInTheDocument();
    });

    it('should handle special characters in company name', () => {
      const specialCharCompany = {
        ...publicCompany,
        name: 'AT&T Inc.'
      };
      
      render(<CompanyDetail company={specialCharCompany} />);
      
      expect(screen.getByText('AT&T Inc.')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument(); // First character for fallback logo
    });

    it('should handle very long descriptions', () => {
      const longDescCompany = {
        ...publicCompany,
        description: 'This is a very long company description that should be displayed properly without breaking the layout and should maintain readability throughout the entire text content.'
      };
      
      render(<CompanyDetail company={longDescCompany} />);
      
      expect(screen.getByText(/This is a very long company description/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Tesla Inc');
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('should have proper alt text for logo', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const logo = screen.getByTestId('company-logo');
      expect(logo).toHaveAttribute('alt', 'Tesla Inc logo');
    });

    it('should have proper external link attributes', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const websiteLink = screen.getByRole('link', { name: /공식 웹사이트 방문/ });
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper main container spacing', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
      expect(mainContainer).toHaveClass('space-y-8');
    });

    it('should have responsive layout for header section', () => {
      render(<CompanyDetail company={publicCompany} />);
      
      const headerContent = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
      expect(headerContent).toHaveClass('flex', 'flex-col', 'lg:flex-row');
    });
  });
});