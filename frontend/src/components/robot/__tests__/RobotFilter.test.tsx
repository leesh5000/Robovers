import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RobotFilter from '../RobotFilter';
import { RobotFilterOptions } from '@/lib/types';

// Mock dependencies
jest.mock('@/components/ui/Dropdown', () => {
  return function MockDropdown({ options, value, onChange, placeholder, className, size }: any) {
    return (
      <select
        data-testid="dropdown"
        data-placeholder={placeholder}
        data-class={className}
        data-size={size}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('@/components/ui/SearchBar', () => {
  return function MockSearchBar({ placeholder, value, onChange }: any) {
    return (
      <input
        data-testid="search-bar"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

describe('RobotFilter', () => {
  const mockOnFiltersChange = jest.fn();
  const mockManufacturers = ['Boston Dynamics', 'Honda', 'Toyota', 'Tesla'];
  
  const defaultFilters: RobotFilterOptions = {
    sortBy: 'name',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render basic header components', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={25}
          manufacturers={mockManufacturers}
        />
      );

      expect(screen.getByText('로봇 정보')).toBeInTheDocument();
      expect(screen.getByText('25개의 로봇')).toBeInTheDocument();
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getAllByTestId('dropdown')).toHaveLength(1); // Sort dropdown only
    });

    it('should render search bar with correct placeholder', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const searchBar = screen.getByTestId('search-bar');
      expect(searchBar).toHaveAttribute('placeholder', '로봇 이름 검색...');
    });

    it('should render sort dropdown with correct options', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const sortDropdown = screen.getByTestId('dropdown');
      const options = sortDropdown.querySelectorAll('option');
      
      expect(options).toHaveLength(6);
      expect(options[0]).toHaveTextContent('이름순');
      expect(options[1]).toHaveTextContent('제조사순');
      expect(options[2]).toHaveTextContent('출시연도순');
      expect(options[3]).toHaveTextContent('가격순');
      expect(options[4]).toHaveTextContent('높이순');
      expect(options[5]).toHaveTextContent('무게순');
    });

    it('should render filter toggle button', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton.querySelector('svg')).toBeInTheDocument();
    });

    it('should not render expanded filters initially', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      expect(screen.queryByText('제조사')).not.toBeInTheDocument();
      expect(screen.queryByText('카테고리')).not.toBeInTheDocument();
      expect(screen.queryByText('개발 상태')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input changes', async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const searchBar = screen.getByTestId('search-bar');
      await user.type(searchBar, 'Atlas');

      expect(searchBar).toHaveValue('Atlas');
    });
  });

  describe('Sort Functionality', () => {
    it('should handle sort option changes', async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const sortDropdown = screen.getByTestId('dropdown');
      await user.selectOptions(sortDropdown, 'manufacturer');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'manufacturer',
      });
    });

    it('should display current sort value', () => {
      const filtersWithSort: RobotFilterOptions = {
        sortBy: 'price',
      };

      render(
        <RobotFilter
          filters={filtersWithSort}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const sortDropdown = screen.getByTestId('dropdown');
      expect(sortDropdown).toHaveValue('price');
    });

    it('should have correct sort dropdown size and class', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const sortDropdown = screen.getByTestId('dropdown');
      expect(sortDropdown).toHaveAttribute('data-size', 'sm');
      expect(sortDropdown).toHaveAttribute('data-class', 'w-32');
    });
  });

  describe('Filter Toggle', () => {
    it('should expand filters when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
        expect(screen.getByText('카테고리')).toBeInTheDocument();
        expect(screen.getByText('개발 상태')).toBeInTheDocument();
        expect(screen.getByText('가격 범위 (USD)')).toBeInTheDocument();
      });

      // Should have 4 more dropdowns (manufacturer, category, status) + initial sort dropdown
      expect(screen.getAllByTestId('dropdown')).toHaveLength(4);
    });

    it('should collapse filters when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      
      // Expand
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });

      // Collapse
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.queryByText('제조사')).not.toBeInTheDocument();
      });
    });

    it('should rotate toggle button icon when expanded', async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      const icon = toggleButton.querySelector('svg');
      
      expect(icon).not.toHaveClass('rotate-180');

      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(icon).toHaveClass('rotate-180');
      });
    });
  });

  describe('Expanded Filters', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });
    });

    it('should render manufacturer dropdown with correct options', () => {
      const dropdowns = screen.getAllByTestId('dropdown');
      const manufacturerDropdown = dropdowns[1]; // First is sort, second is manufacturer
      
      const options = manufacturerDropdown.querySelectorAll('option');
      expect(options).toHaveLength(5); // "전체" + 4 manufacturers
      expect(options[0]).toHaveTextContent('전체');
      expect(options[1]).toHaveTextContent('Boston Dynamics');
      expect(options[2]).toHaveTextContent('Honda');
      expect(options[3]).toHaveTextContent('Toyota');
      expect(options[4]).toHaveTextContent('Tesla');
    });

    it('should render category dropdown with correct options', () => {
      const dropdowns = screen.getAllByTestId('dropdown');
      const categoryDropdown = dropdowns[2]; // Third dropdown is category
      
      const options = categoryDropdown.querySelectorAll('option');
      expect(options).toHaveLength(8); // "전체" + 7 categories
      expect(options[0]).toHaveTextContent('전체');
      expect(options[1]).toHaveTextContent('산업용');
      expect(options[2]).toHaveTextContent('가정용');
      expect(options[3]).toHaveTextContent('연구용');
      expect(options[4]).toHaveTextContent('군사용');
      expect(options[5]).toHaveTextContent('의료용');
      expect(options[6]).toHaveTextContent('엔터테인먼트');
      expect(options[7]).toHaveTextContent('서비스');
    });

    it('should render status dropdown with correct options', () => {
      const dropdowns = screen.getAllByTestId('dropdown');
      const statusDropdown = dropdowns[3]; // Fourth dropdown is status
      
      const options = statusDropdown.querySelectorAll('option');
      expect(options).toHaveLength(9); // "전체" + 8 statuses
      expect(options[0]).toHaveTextContent('전체');
      expect(options[1]).toHaveTextContent('컨셉');
      expect(options[2]).toHaveTextContent('프로토타입');
      expect(options[3]).toHaveTextContent('개발중');
      expect(options[4]).toHaveTextContent('연구중');
      expect(options[5]).toHaveTextContent('테스트');
      expect(options[6]).toHaveTextContent('생산중');
      expect(options[7]).toHaveTextContent('상용화');
      expect(options[8]).toHaveTextContent('단종');
    });

    it('should render price range inputs', () => {
      const minPriceInput = screen.getByPlaceholderText('최소');
      const maxPriceInput = screen.getByPlaceholderText('최대');
      
      expect(minPriceInput).toBeInTheDocument();
      expect(maxPriceInput).toBeInTheDocument();
      expect(minPriceInput).toHaveAttribute('type', 'number');
      expect(maxPriceInput).toHaveAttribute('type', 'number');
    });

    it('should render clear filters button', () => {
      const clearButton = screen.getByRole('button', { name: '필터 초기화' });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Filter Changes', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });
    });

    it('should handle manufacturer filter change', async () => {
      const user = userEvent.setup();
      const dropdowns = screen.getAllByTestId('dropdown');
      const manufacturerDropdown = dropdowns[1];

      await user.selectOptions(manufacturerDropdown, 'Boston Dynamics');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        manufacturer: 'Boston Dynamics',
      });
    });

    it('should handle category filter change', async () => {
      const user = userEvent.setup();
      const dropdowns = screen.getAllByTestId('dropdown');
      const categoryDropdown = dropdowns[2];

      await user.selectOptions(categoryDropdown, 'industrial');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        category: 'industrial',
      });
    });

    it('should handle status filter change', async () => {
      const user = userEvent.setup();
      const dropdowns = screen.getAllByTestId('dropdown');
      const statusDropdown = dropdowns[3];

      await user.selectOptions(statusDropdown, 'commercial');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        status: 'commercial',
      });
    });

    it('should handle minimum price change', async () => {
      const user = userEvent.setup();
      const minPriceInput = screen.getByPlaceholderText('최소');

      await user.type(minPriceInput, '1000');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        priceRange: {
          min: 1000,
        },
      });
    });

    it('should handle maximum price change', async () => {
      const user = userEvent.setup();
      const maxPriceInput = screen.getByPlaceholderText('최대');

      await user.type(maxPriceInput, '5000');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        priceRange: {
          max: 5000,
        },
      });
    });

    it('should handle both min and max price changes', async () => {
      const user = userEvent.setup();
      const filtersWithPrice: RobotFilterOptions = {
        sortBy: 'name',
        priceRange: { min: 1000 },
      };

      // Re-render with existing price range
      render(
        <RobotFilter
          filters={filtersWithPrice}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('가격 범위 (USD)')).toBeInTheDocument();
      });

      const maxPriceInput = screen.getByPlaceholderText('최대');
      await user.type(maxPriceInput, '5000');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        priceRange: {
          min: 1000,
          max: 5000,
        },
      });
    });

    it('should clear price range when empty string is entered', async () => {
      const user = userEvent.setup();
      const filtersWithPrice: RobotFilterOptions = {
        sortBy: 'name',
        priceRange: { min: 1000 },
      };

      render(
        <RobotFilter
          filters={filtersWithPrice}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('가격 범위 (USD)')).toBeInTheDocument();
      });

      const minPriceInput = screen.getByPlaceholderText('최소');
      await user.clear(minPriceInput);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        priceRange: {
          min: undefined,
        },
      });
    });
  });

  describe('Clear Filters', () => {
    it('should clear all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      const filtersWithValues: RobotFilterOptions = {
        sortBy: 'price',
        manufacturer: 'Honda',
        category: 'industrial',
        status: 'commercial',
        priceRange: { min: 1000, max: 5000 },
      };

      render(
        <RobotFilter
          filters={filtersWithValues}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });

      const clearButton = screen.getByRole('button', { name: '필터 초기화' });
      await user.click(clearButton);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
      });
    });
  });

  describe('Filter Values Display', () => {
    it('should display current filter values correctly', async () => {
      const user = userEvent.setup();
      const filtersWithValues: RobotFilterOptions = {
        sortBy: 'manufacturer',
        manufacturer: 'Tesla',
        category: 'domestic',
        status: 'testing',
        priceRange: { min: 2000, max: 8000 },
      };

      render(
        <RobotFilter
          filters={filtersWithValues}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      // Check sort dropdown value
      const sortDropdown = screen.getByTestId('dropdown');
      expect(sortDropdown).toHaveValue('manufacturer');

      // Expand filters
      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });

      // Check filter values
      const dropdowns = screen.getAllByTestId('dropdown');
      expect(dropdowns[1]).toHaveValue('Tesla'); // Manufacturer
      expect(dropdowns[2]).toHaveValue('domestic'); // Category
      expect(dropdowns[3]).toHaveValue('testing'); // Status

      // Check price range values
      const minPriceInput = screen.getByPlaceholderText('최소');
      const maxPriceInput = screen.getByPlaceholderText('최대');
      expect(minPriceInput).toHaveValue(2000);
      expect(maxPriceInput).toHaveValue(8000);
    });

    it('should handle empty filter values', async () => {
      const user = userEvent.setup();
      const emptyFilters: RobotFilterOptions = {
        sortBy: 'name',
      };

      render(
        <RobotFilter
          filters={emptyFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });

      const dropdowns = screen.getAllByTestId('dropdown');
      expect(dropdowns[1]).toHaveValue(''); // Manufacturer
      expect(dropdowns[2]).toHaveValue(''); // Category
      expect(dropdowns[3]).toHaveValue(''); // Status

      const minPriceInput = screen.getByPlaceholderText('최소');
      const maxPriceInput = screen.getByPlaceholderText('최대');
      expect(minPriceInput).toHaveValue('');
      expect(maxPriceInput).toHaveValue('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty manufacturers array', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={0}
          manufacturers={[]}
        />
      );

      expect(screen.getByText('0개의 로봇')).toBeInTheDocument();
    });

    it('should handle zero total count', () => {
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={0}
          manufacturers={mockManufacturers}
        />
      );

      expect(screen.getByText('0개의 로봇')).toBeInTheDocument();
    });

    it('should handle undefined filter values', async () => {
      const user = userEvent.setup();
      const filtersWithUndefined: RobotFilterOptions = {
        sortBy: 'name',
        manufacturer: undefined,
        category: undefined,
        status: undefined,
        priceRange: undefined,
      };

      render(
        <RobotFilter
          filters={filtersWithUndefined}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });

      // Should not throw any errors and display correctly
      const dropdowns = screen.getAllByTestId('dropdown');
      expect(dropdowns[1]).toHaveValue(''); // Manufacturer
      expect(dropdowns[2]).toHaveValue(''); // Category
      expect(dropdowns[3]).toHaveValue(''); // Status
    });

    it('should handle empty string selection for filters', async () => {
      const user = userEvent.setup();
      render(
        <RobotFilter
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          totalCount={10}
          manufacturers={mockManufacturers}
        />
      );

      const toggleButton = screen.getByRole('button', { expanded: false });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('제조사')).toBeInTheDocument();
      });

      const dropdowns = screen.getAllByTestId('dropdown');
      const manufacturerDropdown = dropdowns[1];

      // Select empty string (전체)
      await user.selectOptions(manufacturerDropdown, '');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        sortBy: 'name',
        manufacturer: undefined,
      });
    });
  });
});