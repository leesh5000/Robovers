import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from '../DataTable';
import { DataTableColumn } from '@/lib/interfaces';

interface TestItem {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

describe('DataTable', () => {
  const mockData: TestItem[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', createdAt: '2024-01-02' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'active', createdAt: '2024-01-03' }
  ];

  const mockColumns: DataTableColumn<TestItem>[] = [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'name', title: '이름', sortable: true },
    { key: 'email', title: '이메일', sortable: true },
    { 
      key: 'status', 
      title: '상태', 
      render: (value) => (
        <span className={value === 'active' ? 'text-green-600' : 'text-red-600'}>
          {value === 'active' ? '활성' : '비활성'}
        </span>
      )
    },
    { key: 'createdAt', title: '생성일', align: 'center' }
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    currentPage: 1,
    totalPages: 3,
    pageSize: 10,
    totalItems: 25,
    onPageChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table with data', () => {
    render(<DataTable {...defaultProps} />);
    
    // Check headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('이메일')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
    expect(screen.getByText('생성일')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('활성')).toHaveLength(2); // John and Bob are active
  });

  it('should render empty state when no data', () => {
    render(<DataTable {...defaultProps} data={[]} isEmpty={true} />);
    
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should render custom empty text', () => {
    render(
      <DataTable 
        {...defaultProps} 
        data={[]} 
        isEmpty={true} 
        emptyText="사용자가 없습니다." 
      />
    );
    
    expect(screen.getByText('사용자가 없습니다.')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const errorMessage = '데이터를 불러오는데 실패했습니다.';
    render(
      <DataTable 
        {...defaultProps} 
        error={errorMessage}
        onRetry={jest.fn()}
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        {...defaultProps} 
        error="Error occurred"
        onRetry={onRetry}
      />
    );
    
    const retryButton = screen.getByText('다시 시도');
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render loading state', () => {
    render(<DataTable {...defaultProps} isLoading={true} />);
    
    // Should show loading skeleton rows
    const skeletonRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(skeletonRows).toHaveLength(defaultProps.pageSize);
    
    // Check for loading animation
    expect(skeletonRows[0]).toHaveClass('animate-pulse');
  });

  it('should handle sorting', async () => {
    const user = userEvent.setup();
    render(<DataTable {...defaultProps} />);
    
    const nameHeader = screen.getByText('이름');
    await user.click(nameHeader);
    
    // Should sort data by name in ascending order
    const rows = screen.getAllByRole('row').slice(1);
    const firstRowName = rows[0].querySelector('td:nth-child(2)')?.textContent;
    expect(firstRowName).toBe('Bob Wilson');
    
    // Click again for descending order
    await user.click(nameHeader);
    const firstRowNameDesc = screen.getAllByRole('row')[1].querySelector('td:nth-child(2)')?.textContent;
    expect(firstRowNameDesc).toBe('John Doe');
  });

  it('should not allow sorting on non-sortable columns', async () => {
    render(<DataTable {...defaultProps} />);
    
    const idHeader = screen.getByText('ID');
    expect(idHeader.closest('button')).toBeNull();
  });

  it('should handle row selection when selectable', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        {...defaultProps} 
        selectable={true}
        selectedItems={[]}
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Check select all checkbox
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(selectAllCheckbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith(mockData);
    
    // Check individual item selection
    const firstItemCheckbox = screen.getAllByRole('checkbox')[1];
    await user.click(firstItemCheckbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith([mockData[0]]);
  });

  it('should handle select all when all items are selected', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        {...defaultProps} 
        selectable={true}
        selectedItems={mockData}
        onSelectionChange={onSelectionChange}
      />
    );
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    expect(selectAllCheckbox).toBeChecked();
    
    await user.click(selectAllCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it('should handle row clicks', async () => {
    const onRowClick = jest.fn();
    const user = userEvent.setup();
    
    render(<DataTable {...defaultProps} onRowClick={onRowClick} />);
    
    const firstRow = screen.getAllByRole('row')[1];
    await user.click(firstRow);
    
    expect(onRowClick).toHaveBeenCalledWith(mockData[0], 0);
  });

  it('should prevent row click when checkbox is clicked', async () => {
    const onRowClick = jest.fn();
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        {...defaultProps} 
        selectable={true}
        selectedItems={[]}
        onSelectionChange={onSelectionChange}
        onRowClick={onRowClick}
      />
    );
    
    const firstItemCheckbox = screen.getAllByRole('checkbox')[1];
    await user.click(firstItemCheckbox);
    
    expect(onSelectionChange).toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('should apply column alignment', () => {
    render(<DataTable {...defaultProps} />);
    
    // Check center alignment for createdAt column
    const createdAtHeader = screen.getByText('생성일');
    expect(createdAtHeader).toHaveClass('text-center');
  });

  it('should apply custom render function', () => {
    render(<DataTable {...defaultProps} />);
    
    // Status column uses custom render function
    const activeElements = screen.getAllByText('활성');
    expect(activeElements[0]).toHaveClass('text-green-600');
    expect(screen.getByText('비활성')).toHaveClass('text-red-600');
  });

  it('should apply custom className', () => {
    render(<DataTable {...defaultProps} className="custom-table" />);
    
    expect(screen.getByRole('table').closest('.space-y-4')).toHaveClass('custom-table');
  });

  it('should render pagination when totalPages > 1', () => {
    render(<DataTable {...defaultProps} />);
    
    // Should render pagination component
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('이전 페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 페이지')).toBeInTheDocument();
  });

  it('should not render pagination when totalPages <= 1', () => {
    render(<DataTable {...defaultProps} totalPages={1} />);
    
    // Should not have pagination navigation
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should handle deselection of individual items', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <DataTable 
        {...defaultProps} 
        selectable={true}
        selectedItems={[mockData[0], mockData[1]]}
        onSelectionChange={onSelectionChange}
      />
    );
    
    const firstItemCheckbox = screen.getAllByRole('checkbox')[1];
    expect(firstItemCheckbox).toBeChecked();
    
    await user.click(firstItemCheckbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith([mockData[1]]);
  });

  it('should handle missing column render functions gracefully', () => {
    const columnsWithMissingRender: DataTableColumn<TestItem>[] = [
      { key: 'id', title: 'ID' },
      { key: 'name', title: '이름' },
      { key: 'undefinedField' as keyof TestItem, title: '없는 필드' }
    ];
    
    render(
      <DataTable 
        {...defaultProps} 
        columns={columnsWithMissingRender}
      />
    );
    
    // Should render empty string for undefined fields
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should maintain sort state across re-renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DataTable {...defaultProps} />);
    
    // Sort by name
    const nameHeader = screen.getByText('이름');
    await user.click(nameHeader);
    
    // Re-render with same props
    rerender(<DataTable {...defaultProps} />);
    
    // Should maintain sorted order
    const rows = screen.getAllByRole('row').slice(1);
    const firstRowName = rows[0].querySelector('td:nth-child(2)')?.textContent;
    expect(firstRowName).toBe('Bob Wilson');
  });
});