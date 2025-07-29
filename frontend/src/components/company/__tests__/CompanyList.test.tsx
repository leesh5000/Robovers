import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyList from '../CompanyList';
import { Company, CompanyFilterOptions } from '@/lib/types';

// Mock dependencies
jest.mock('@/lib/dummy-data', () => ({
  getDummyCompanies: jest.fn(),
}));

jest.mock('../CompanyCard', () => {
  return function MockCompanyCard({ company, onClick }: any) {
    return (
      <div data-testid={`company-card-${company.id}`} onClick={() => onClick(company)}>
        <div>{company.name}</div>
        <div>{company.symbol}</div>
        <div>{company.sector}</div>
        <div>{company.country}</div>
        <div>{company.marketCap}</div>
        <div>{company.changePercent}</div>
        <div>{company.employeeCount}</div>
      </div>
    );
  };
});

// Mock window.location.href
delete (window as any).location;
(window as any).location = { href: '' };
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('CompanyList', () => {
  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'Tesla Inc',
      symbol: 'TSLA',
      currentPrice: 250.75,
      changePercent: 3.45,
      changeAmount: 8.36,
      marketCap: 800000000000, // 800B
      description: '전기차 및 자율주행 기술 회사',
      foundedYear: 2003,
      country: '미국',
      employeeCount: 100000,
      isPublic: true,
      robotProjects: ['Optimus', 'Autopilot'],
      sector: 'automotive',
    },
    {
      id: '2',
      name: 'Boston Dynamics',
      symbol: 'BD',
      currentPrice: 0,
      changePercent: 0,
      changeAmount: 0,
      marketCap: 5000000000, // 5B
      description: '로봇 기술 연구 개발',
      foundedYear: 1992,
      country: '미국',
      employeeCount: 500,
      isPublic: false,
      robotProjects: ['Atlas', 'Spot'],
      sector: 'robotics',
    },
    {
      id: '3',
      name: 'SoftBank',
      symbol: '9984',
      currentPrice: 5680,
      changePercent: -2.1,
      changeAmount: -120,
      marketCap: 65000000000, // 65B
      description: '기술 투자 및 통신 회사',
      foundedYear: 1981,
      country: '일본',
      employeeCount: 50000,
      isPublic: true,
      robotProjects: ['Pepper'],
      sector: 'technology',
    },
    {
      id: '4',
      name: '삼성전자',
      symbol: '005930',
      currentPrice: 75000,
      changePercent: 1.2,
      changeAmount: 900,
      marketCap: 400000000000, // 400B
      description: '전자제품 및 반도체 제조',
      foundedYear: 1969,
      country: '한국',
      employeeCount: 280000,
      isPublic: true,
      sector: 'technology',
    },
  ];

  const getDummyCompanies = jest.requireMock('@/lib/dummy-data').getDummyCompanies;

  const defaultFilters: CompanyFilterOptions = {
    sortBy: 'name',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getDummyCompanies.mockReturnValue(mockCompanies);
    (window as any).location.href = '';
  });

  describe('Loading State', () => {
    it('should render loading skeleton initially', () => {
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      // Should show 6 loading cards
      const loadingCards = screen.getAllByTestId((id) => 
        id.includes('animate-pulse') || false
      );
      expect(loadingCards.length).toBeGreaterThan(0);
    });

    it('should hide loading state after data loads', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
      });
      
      // Loading cards should be gone
      const loadingCards = screen.queryAllByTestId((id) => 
        id.includes('animate-pulse') || false
      );
      expect(loadingCards).toHaveLength(0);
    });
  });

  describe('Company Rendering', () => {
    it('should render all companies after loading', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('company-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument();
        expect(screen.getByTestId('company-card-4')).toBeInTheDocument();
      });
    });

    it('should render companies in grid layout', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        const grid = screen.getByTestId('company-card-1').parentElement;
        expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
      });
    });

    it('should pass correct props to CompanyCard components', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByText('Tesla Inc')).toBeInTheDocument();
        expect(screen.getByText('TSLA')).toBeInTheDocument();
        expect(screen.getByText('automotive')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter companies by name', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="Tesla" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument();
      });
    });

    it('should filter companies by symbol', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="9984" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument();
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument();
      });
    });

    it('should filter companies by description', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="로봇" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-2')).toBeInTheDocument();
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument();
      });
    });

    it('should filter companies by robot projects', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="Pepper" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument();
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument();
      });
    });

    it('should be case insensitive', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="TESLA" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument();
      });
    });

    it('should show multiple results for partial matches', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="기술" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-2')).toBeInTheDocument(); // "로봇 기술"
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument(); // "기술 투자"
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument();
      });
    });
  });

  describe('Filtering', () => {
    it('should filter by sector', async () => {
      const filtersWithSector: CompanyFilterOptions = {
        sortBy: 'name',
        sector: 'technology',
      };
      
      render(<CompanyList filters={filtersWithSector} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument(); // SoftBank
        expect(screen.getByTestId('company-card-4')).toBeInTheDocument(); // 삼성전자
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument(); // Tesla (automotive)
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument(); // Boston Dynamics (robotics)
      });
    });

    it('should filter by country', async () => {
      const filtersWithCountry: CompanyFilterOptions = {
        sortBy: 'name',
        country: '미국',
      };
      
      render(<CompanyList filters={filtersWithCountry} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument(); // Tesla
        expect(screen.getByTestId('company-card-2')).toBeInTheDocument(); // Boston Dynamics
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument(); // SoftBank (일본)
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument(); // 삼성전자 (한국)
      });
    });

    it('should filter by public status', async () => {
      const filtersWithPublic: CompanyFilterOptions = {
        sortBy: 'name',
        isPublic: false,
      };
      
      render(<CompanyList filters={filtersWithPublic} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-2')).toBeInTheDocument(); // Boston Dynamics (private)
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument(); // Tesla (public)
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument(); // SoftBank (public)
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument(); // 삼성전자 (public)
      });
    });

    it('should filter by market cap range', async () => {
      const filtersWithMarketCap: CompanyFilterOptions = {
        sortBy: 'name',
        marketCapRange: {
          min: 50000000000, // 50B
          max: 100000000000, // 100B
        },
      };
      
      render(<CompanyList filters={filtersWithMarketCap} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument(); // SoftBank (65B)
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument(); // Tesla (800B - too high)
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument(); // Boston Dynamics (5B - too low)
        expect(screen.queryByTestId('company-card-4')).not.toBeInTheDocument(); // 삼성전자 (400B - too high)
      });
    });

    it('should filter by minimum market cap only', async () => {
      const filtersWithMinCap: CompanyFilterOptions = {
        sortBy: 'name',
        marketCapRange: {
          min: 100000000000, // 100B
        },
      };
      
      render(<CompanyList filters={filtersWithMinCap} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument(); // Tesla (800B)
        expect(screen.getByTestId('company-card-4')).toBeInTheDocument(); // 삼성전자 (400B)
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument(); // Boston Dynamics (5B)
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument(); // SoftBank (65B)
      });
    });

    it('should filter out companies with no market cap when range is specified', async () => {
      const companiesWithNoMarketCap = [
        ...mockCompanies,
        {
          ...mockCompanies[0],
          id: '5',
          name: 'No MarketCap Corp',
          marketCap: undefined,
        }
      ];
      
      getDummyCompanies.mockReturnValue(companiesWithNoMarketCap);
      
      const filtersWithMarketCap: CompanyFilterOptions = {
        sortBy: 'name',
        marketCapRange: {
          min: 1000000, // 1M
        },
      };
      
      render(<CompanyList filters={filtersWithMarketCap} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.queryByText('No MarketCap Corp')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by name alphabetically', async () => {
      const filtersWithNameSort: CompanyFilterOptions = {
        sortBy: 'name',
      };
      
      render(<CompanyList filters={filtersWithNameSort} searchQuery="" />);
      
      await waitFor(() => {
        const companyCards = screen.getAllByTestId(/company-card-/);
        expect(companyCards[0]).toHaveAttribute('data-testid', 'company-card-2'); // Boston Dynamics
        expect(companyCards[1]).toHaveAttribute('data-testid', 'company-card-3'); // SoftBank
        expect(companyCards[2]).toHaveAttribute('data-testid', 'company-card-1'); // Tesla Inc
        expect(companyCards[3]).toHaveAttribute('data-testid', 'company-card-4'); // 삼성전자
      });
    });

    it('should sort by market cap (highest first)', async () => {
      const filtersWithMarketCapSort: CompanyFilterOptions = {
        sortBy: 'marketCap',
      };
      
      render(<CompanyList filters={filtersWithMarketCapSort} searchQuery="" />);
      
      await waitFor(() => {
        const companyCards = screen.getAllByTestId(/company-card-/);
        expect(companyCards[0]).toHaveAttribute('data-testid', 'company-card-1'); // Tesla (800B)
        expect(companyCards[1]).toHaveAttribute('data-testid', 'company-card-4'); // 삼성전자 (400B)
        expect(companyCards[2]).toHaveAttribute('data-testid', 'company-card-3'); // SoftBank (65B)
        expect(companyCards[3]).toHaveAttribute('data-testid', 'company-card-2'); // Boston Dynamics (5B)
      });
    });

    it('should sort by change percent (highest first)', async () => {
      const filtersWithChangeSort: CompanyFilterOptions = {
        sortBy: 'changePercent',
      };
      
      render(<CompanyList filters={filtersWithChangeSort} searchQuery="" />);
      
      await waitFor(() => {
        const companyCards = screen.getAllByTestId(/company-card-/);
        expect(companyCards[0]).toHaveAttribute('data-testid', 'company-card-1'); // Tesla (3.45%)
        expect(companyCards[1]).toHaveAttribute('data-testid', 'company-card-4'); // 삼성전자 (1.2%)
        expect(companyCards[2]).toHaveAttribute('data-testid', 'company-card-2'); // Boston Dynamics (0%)
        expect(companyCards[3]).toHaveAttribute('data-testid', 'company-card-3'); // SoftBank (-2.1%)
      });
    });

    it('should sort by country alphabetically', async () => {
      const filtersWithCountrySort: CompanyFilterOptions = {
        sortBy: 'country',
      };
      
      render(<CompanyList filters={filtersWithCountrySort} searchQuery="" />);
      
      await waitFor(() => {
        const companyCards = screen.getAllByTestId(/company-card-/);
        expect(companyCards[0]).toHaveAttribute('data-testid', 'company-card-1'); // 미국 (Tesla)
        expect(companyCards[1]).toHaveAttribute('data-testid', 'company-card-2'); // 미국 (Boston Dynamics)
        expect(companyCards[2]).toHaveAttribute('data-testid', 'company-card-3'); // 일본 (SoftBank)
        expect(companyCards[3]).toHaveAttribute('data-testid', 'company-card-4'); // 한국 (삼성전자)
      });
    });

    it('should sort by employee count (highest first)', async () => {
      const filtersWithEmployeeSort: CompanyFilterOptions = {
        sortBy: 'employeeCount',
      };
      
      render(<CompanyList filters={filtersWithEmployeeSort} searchQuery="" />);
      
      await waitFor(() => {
        const companyCards = screen.getAllByTestId(/company-card-/);
        expect(companyCards[0]).toHaveAttribute('data-testid', 'company-card-4'); // 삼성전자 (280,000)
        expect(companyCards[1]).toHaveAttribute('data-testid', 'company-card-1'); // Tesla (100,000)
        expect(companyCards[2]).toHaveAttribute('data-testid', 'company-card-3'); // SoftBank (50,000)
        expect(companyCards[3]).toHaveAttribute('data-testid', 'company-card-2'); // Boston Dynamics (500)
      });
    });
  });

  describe('Combined Filters and Search', () => {
    it('should apply search and filters together', async () => {
      const filtersWithSector: CompanyFilterOptions = {
        sortBy: 'name',
        sector: 'technology',
      };
      
      render(<CompanyList filters={filtersWithSector} searchQuery="삼성" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-4')).toBeInTheDocument(); // 삼성전자 (technology sector)
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument(); // SoftBank (technology but no match for "삼성")
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument();
      });
    });

    it('should handle multiple filters simultaneously', async () => {
      const multipleFilters: CompanyFilterOptions = {
        sortBy: 'name',
        sector: 'technology',
        country: '한국',
        isPublic: true,
      };
      
      render(<CompanyList filters={multipleFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-4')).toBeInTheDocument(); // 삼성전자 (all criteria match)
        expect(screen.queryByTestId('company-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('company-card-3')).not.toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no companies match filters', async () => {
      const filtersWithNoMatches: CompanyFilterOptions = {
        sortBy: 'name',
        sector: 'nonexistent' as any,
      };
      
      render(<CompanyList filters={filtersWithNoMatches} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
        expect(screen.getByText('다른 검색어나 필터를 사용해보세요.')).toBeInTheDocument();
      });
    });

    it('should show empty state when search query has no matches', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="nonexistent company" />);
      
      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
        expect(screen.getByText('다른 검색어나 필터를 사용해보세요.')).toBeInTheDocument();
      });
    });

    it('should render empty state with proper styling', async () => {
      render(<CompanyList filters={defaultFilters} searchQuery="nonexistent" />);
      
      await waitFor(() => {
        const emptyState = screen.getByText('검색 결과가 없습니다').closest('div');
        expect(emptyState).toHaveClass('text-center', 'py-12');
      });
    });
  });

  describe('Company Click Handler', () => {
    it('should navigate to company detail page when company is clicked', async () => {
      const user = userEvent.setup();
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
      });
      
      await user.click(screen.getByTestId('company-card-1'));
      
      expect((window as any).location.href).toBe('/companies/1');
    });

    it('should use correct company ID in URL', async () => {
      const user = userEvent.setup();
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument();
      });
      
      await user.click(screen.getByTestId('company-card-3'));
      
      expect((window as any).location.href).toBe('/companies/3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty dummy data', async () => {
      getDummyCompanies.mockReturnValue([]);
      
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
      });
    });

    it('should handle companies with missing fields', async () => {
      const companiesWithMissingFields = [
        {
          id: '1',
          name: 'Minimal Company',
          symbol: 'MIN',
          currentPrice: 0,
          changePercent: 0,
          changeAmount: 0,
          isPublic: false,
        }
      ];
      
      getDummyCompanies.mockReturnValue(companiesWithMissingFields);
      
      render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
      });
    });

    it('should handle undefined search query gracefully', async () => {
      const filtersWithUndefined: CompanyFilterOptions = {
        sortBy: 'name',
        sector: undefined,
        country: undefined,
        isPublic: undefined,
      };
      
      render(<CompanyList filters={filtersWithUndefined} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('company-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('company-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('company-card-3')).toBeInTheDocument();
        expect(screen.getByTestId('company-card-4')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should re-filter when filters change', async () => {
      const { rerender } = render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getAllByTestId(/company-card-/)).toHaveLength(4);
      });
      
      const newFilters: CompanyFilterOptions = {
        sortBy: 'name',
        sector: 'technology',
      };
      
      rerender(<CompanyList filters={newFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getAllByTestId(/company-card-/)).toHaveLength(2); // Only technology companies
      });
    });

    it('should re-filter when search query changes', async () => {
      const { rerender } = render(<CompanyList filters={defaultFilters} searchQuery="" />);
      
      await waitFor(() => {
        expect(screen.getAllByTestId(/company-card-/)).toHaveLength(4);
      });
      
      rerender(<CompanyList filters={defaultFilters} searchQuery="Tesla" />);
      
      await waitFor(() => {
        expect(screen.getAllByTestId(/company-card-/)).toHaveLength(1); // Only Tesla
      });
    });
  });
});