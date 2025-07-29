import React from 'react';
import { render, screen } from '@testing-library/react';
import RobotSpecs from '../RobotSpecs';
import { Robot } from '@/lib/types';

describe('RobotSpecs', () => {
  const fullSpecifications: Robot['specifications'] = {
    height: '150cm',
    weight: '80kg',
    batteryLife: '8시간',
    speed: '5km/h',
    payload: '10kg',
  };

  const partialSpecifications: Robot['specifications'] = {
    height: '120cm',
    weight: '60kg',
    batteryLife: undefined,
    speed: undefined,
    payload: '5kg',
  };

  const emptySpecifications: Robot['specifications'] = {
    height: '',
    weight: '',
    batteryLife: undefined,
    speed: undefined,
    payload: undefined,
  };

  describe('Rendering', () => {
    it('should render component title', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      expect(screen.getByText('기본 사양')).toBeInTheDocument();
      expect(screen.getByText('기본 사양')).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
    });

    it('should render detailed specs table title', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      expect(screen.getByText('상세 사양')).toBeInTheDocument();
      expect(screen.getByText('상세 사양')).toHaveClass('text-lg', 'font-medium', 'text-gray-900');
    });

    it('should render all specifications with full data', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      // Check if all spec labels are present
      expect(screen.getAllByText('높이')).toHaveLength(2); // Card + table
      expect(screen.getAllByText('무게')).toHaveLength(2);
      expect(screen.getAllByText('배터리 수명')).toHaveLength(2);
      expect(screen.getAllByText('최고 속도')).toHaveLength(2);
      expect(screen.getAllByText('최대 적재량')).toHaveLength(2);
      
      // Check if all spec values are present
      expect(screen.getAllByText('150cm')).toHaveLength(2);
      expect(screen.getAllByText('80kg')).toHaveLength(2);
      expect(screen.getAllByText('8시간')).toHaveLength(2);
      expect(screen.getAllByText('5km/h')).toHaveLength(2);
      expect(screen.getAllByText('10kg')).toHaveLength(2);
    });

    it('should render all specification icons', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      // Each icon appears twice (card + table)
      expect(screen.getAllByText('📏')).toHaveLength(2); // 높이
      expect(screen.getAllByText('⚖️')).toHaveLength(2); // 무게
      expect(screen.getAllByText('🔋')).toHaveLength(2); // 배터리 수명
      expect(screen.getAllByText('⚡')).toHaveLength(2); // 최고 속도
      expect(screen.getAllByText('📦')).toHaveLength(2); // 최대 적재량
    });

    it('should apply correct CSS classes to spec cards', () => {
      render(<RobotSpecs specifications={{ height: '150cm', weight: '80kg' }} />);
      
      const specCard = screen.getByText('150cm').closest('div');
      expect(specCard).toHaveClass(
        'bg-gray-50',
        'rounded-lg',
        'p-6',
        'border',
        'border-gray-200'
      );
    });

    it('should apply correct CSS classes to grid container', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      const gridContainer = screen.getByText('150cm').closest('div')?.parentElement;
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3',
        'gap-6'
      );
    });

    it('should apply correct CSS classes to table rows', () => {
      render(<RobotSpecs specifications={{ height: '150cm', weight: '80kg' }} />);
      
      // Find table row by looking for the monospace value
      const tableValue = screen.getAllByText('150cm').find(el => 
        el.classList.contains('font-mono')
      );
      const tableRow = tableValue?.closest('div');
      
      expect(tableRow).toHaveClass('px-6', 'py-4', 'flex', 'justify-between', 'items-center');
    });
  });

  describe('Specification Filtering', () => {
    it('should only display specifications with values', () => {
      render(<RobotSpecs specifications={partialSpecifications} />);
      
      // Should display height, weight, payload (3 specs)
      expect(screen.getAllByText('높이')).toHaveLength(2);
      expect(screen.getAllByText('무게')).toHaveLength(2);
      expect(screen.getAllByText('최대 적재량')).toHaveLength(2);
      
      // Should not display battery life and speed
      expect(screen.queryByText('배터리 수명')).not.toBeInTheDocument();
      expect(screen.queryByText('최고 속도')).not.toBeInTheDocument();
    });

    it('should filter out undefined values', () => {
      const specsWithUndefined: Robot['specifications'] = {
        height: '150cm',
        weight: '',
        batteryLife: '8시간',
        speed: '',
        payload: '',
      };
      
      render(<RobotSpecs specifications={specsWithUndefined} />);
      
      // Only height and battery life should be displayed
      expect(screen.getAllByText('높이')).toHaveLength(2);
      expect(screen.getAllByText('배터리 수명')).toHaveLength(2);
      
      // Others should not be displayed
      expect(screen.queryByText('무게')).not.toBeInTheDocument();
      expect(screen.queryByText('최고 속도')).not.toBeInTheDocument();
      expect(screen.queryByText('최대 적재량')).not.toBeInTheDocument();
    });

    it('should filter out empty string values', () => {
      const specsWithEmptyStrings: Robot['specifications'] = {
        height: '',
        weight: '80kg',
        batteryLife: '',
        speed: '5km/h',
        payload: '',
      };
      
      render(<RobotSpecs specifications={specsWithEmptyStrings} />);
      
      // Only weight and speed should be displayed
      expect(screen.getAllByText('무게')).toHaveLength(2);
      expect(screen.getAllByText('최고 속도')).toHaveLength(2);
      
      // Others should not be displayed
      expect(screen.queryByText('높이')).not.toBeInTheDocument();
      expect(screen.queryByText('배터리 수명')).not.toBeInTheDocument();
      expect(screen.queryByText('최대 적재량')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all empty specifications', () => {
      render(<RobotSpecs specifications={emptySpecifications} />);
      
      // Should still render titles
      expect(screen.getByText('기본 사양')).toBeInTheDocument();
      expect(screen.getByText('상세 사양')).toBeInTheDocument();
      
      // Should not render any spec labels or values
      expect(screen.queryByText('높이')).not.toBeInTheDocument();
      expect(screen.queryByText('무게')).not.toBeInTheDocument();
      expect(screen.queryByText('배터리 수명')).not.toBeInTheDocument();
      expect(screen.queryByText('최고 속도')).not.toBeInTheDocument();
      expect(screen.queryByText('최대 적재량')).not.toBeInTheDocument();
      
      // Grid and table should be empty but present
      const gridContainer = screen.getByText('기본 사양').nextElementSibling;
      expect(gridContainer?.children).toHaveLength(0);
    });

    it('should handle single specification', () => {
      const singleSpec: Robot['specifications'] = {
        height: '180cm',
        weight: '',
        batteryLife: '',
        speed: '',
        payload: '',
      };
      
      render(<RobotSpecs specifications={singleSpec} />);
      
      // Should display only height
      expect(screen.getAllByText('높이')).toHaveLength(2);
      expect(screen.getAllByText('180cm')).toHaveLength(2);
      expect(screen.getAllByText('📏')).toHaveLength(2);
      
      // Should not display other specs
      expect(screen.queryByText('무게')).not.toBeInTheDocument();
      expect(screen.queryByText('배터리 수명')).not.toBeInTheDocument();
      expect(screen.queryByText('최고 속도')).not.toBeInTheDocument();
      expect(screen.queryByText('최대 적재량')).not.toBeInTheDocument();
    });

    it('should handle specifications with special characters', () => {
      const specialSpecs: Robot['specifications'] = {
        height: '1.5m / 150cm',
        weight: '80kg ± 2kg',
        batteryLife: '8시간 (연속 사용)',
        speed: '최대 5km/h',
        payload: '10kg (안전 하중)',
      };
      
      render(<RobotSpecs specifications={specialSpecs} />);
      
      // Should display all special character values correctly
      expect(screen.getAllByText('1.5m / 150cm')).toHaveLength(2);
      expect(screen.getAllByText('80kg ± 2kg')).toHaveLength(2);
      expect(screen.getAllByText('8시간 (연속 사용)')).toHaveLength(2);
      expect(screen.getAllByText('최대 5km/h')).toHaveLength(2);
      expect(screen.getAllByText('10kg (안전 하중)')).toHaveLength(2);
    });

    it('should handle numeric string values', () => {
      const numericSpecs: Robot['specifications'] = {
        height: '150',
        weight: '80',
        batteryLife: '8',
        speed: '5',
        payload: '10',
      };
      
      render(<RobotSpecs specifications={numericSpecs} />);
      
      // Should display all numeric values as strings
      expect(screen.getAllByText('150')).toHaveLength(2);
      expect(screen.getAllByText('80')).toHaveLength(2);
      expect(screen.getAllByText('8')).toHaveLength(2);
      expect(screen.getAllByText('5')).toHaveLength(2);
      expect(screen.getAllByText('10')).toHaveLength(2);
    });

    it('should handle very long specification values', () => {
      const longSpecs: Robot['specifications'] = {
        height: '매우 긴 높이 설명이 포함된 사양으로 다양한 측정 방법과 조건이 명시되어 있습니다',
        weight: '복잡한 무게 정보',
        batteryLife: undefined,
        speed: undefined,
        payload: undefined,
      };
      
      render(<RobotSpecs specifications={longSpecs} />);
      
      const longHeightValue = screen.getAllByText('매우 긴 높이 설명이 포함된 사양으로 다양한 측정 방법과 조건이 명시되어 있습니다');
      expect(longHeightValue).toHaveLength(2);
      
      const longWeightValue = screen.getAllByText('복잡한 무게 정보');
      expect(longWeightValue).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      const mainHeading = screen.getByRole('heading', { level: 3, name: '기본 사양' });
      expect(mainHeading).toBeInTheDocument();
      
      const tableHeading = screen.getByRole('heading', { level: 4, name: '상세 사양' });
      expect(tableHeading).toBeInTheDocument();
    });

    it('should have proper semantic structure for cards', () => {
      render(<RobotSpecs specifications={{ height: '150cm', weight: '80kg' }} />);
      
      const cardHeading = screen.getByRole('heading', { level: 4, name: '높이' });
      expect(cardHeading).toBeInTheDocument();
      expect(cardHeading).toHaveClass('text-lg', 'font-medium', 'text-gray-900');
    });

    it('should have readable text contrast', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      // Check card values have proper styling
      const cardValues = screen.getAllByText('150cm').filter(el => 
        el.classList.contains('text-blue-600')
      );
      expect(cardValues).toHaveLength(1);
      expect(cardValues[0]).toHaveClass('text-2xl', 'font-bold', 'text-blue-600');
      
      // Check table values have proper styling
      const tableValues = screen.getAllByText('150cm').filter(el => 
        el.classList.contains('font-mono')
      );
      expect(tableValues).toHaveLength(1);
      expect(tableValues[0]).toHaveClass('text-gray-700', 'font-mono');
    });
  });

  describe('Layout', () => {
    it('should render cards in responsive grid layout', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      const gridContainer = screen.getByText('150cm').closest('div')?.parentElement;
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3'
      );
    });

    it('should render table with proper structure', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      // Check table container
      const tableContainer = screen.getByText('상세 사양').closest('div')?.parentElement;
      expect(tableContainer).toHaveClass(
        'bg-white',
        'border',
        'border-gray-200',
        'rounded-lg',
        'overflow-hidden'
      );
      
      // Check table header
      const tableHeader = screen.getByText('상세 사양').closest('div');
      expect(tableHeader).toHaveClass('bg-gray-50', 'px-6', 'py-3');
      
      // Check table body has dividers
      const tableBody = screen.getAllByText('📏')[1].closest('div')?.parentElement;
      expect(tableBody).toHaveClass('divide-y', 'divide-gray-200');
    });

    it('should maintain consistent spacing', () => {
      render(<RobotSpecs specifications={fullSpecifications} />);
      
      // Check main container spacing
      const mainContainer = screen.getByText('기본 사양').closest('div');
      expect(mainContainer).toHaveClass('space-y-6');
      
      // Check card content spacing
      const cardContent = screen.getByText('높이').closest('div')?.parentElement;
      expect(cardContent).toHaveClass('flex', 'items-center', 'mb-3');
    });
  });

  describe('Performance', () => {
    it('should handle specifications efficiently', () => {
      const { rerender } = render(<RobotSpecs specifications={fullSpecifications} />);
      
      // Should render all 5 specs
      expect(screen.getAllByText('📏')).toHaveLength(2);
      
      // Re-render with different specs
      rerender(<RobotSpecs specifications={partialSpecifications} />);
      
      // Should update to show only 3 specs
      expect(screen.getAllByText('📏')).toHaveLength(2);
      expect(screen.queryByText('배터리 수명')).not.toBeInTheDocument();
    });
  });
});