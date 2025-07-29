// 표준 컴포넌트 prop 인터페이스

// 공통 기본 props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

// 로딩 상태 props
export interface LoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

// 에러 상태 props
export interface ErrorProps {
  error?: string | null;
  onRetry?: () => void;
}

// 상태 관리 props
export interface StateProps extends LoadingProps, ErrorProps {
  isEmpty?: boolean;
  emptyText?: string;
  emptyIcon?: React.ReactNode;
}

// 페이지네이션 props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

// 필터링 props
export interface FilterProps<T = Record<string, unknown>> {
  filters: T;
  onFilterChange: (filters: T) => void;
  onClearFilters?: () => void;
}

// 정렬 props
export interface SortProps<T = string> {
  sortBy: T;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: T, sortOrder?: 'asc' | 'desc') => void;
}

// 검색 props
export interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

// 폼 컴포넌트 props
export interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

// 리스트 컴포넌트 props
export interface ListProps<T> extends BaseComponentProps, StateProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
}

// 모달/오버레이 props
export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

// 데이터 페칭 props
export interface DataProps<T> extends StateProps {
  data?: T;
  refetch?: () => Promise<void>;
  lastUpdated?: Date;
}

// 사용자 인터랙션 props
export interface InteractionProps {
  onClick?: () => void;
  onDoubleClick?: () => void;
  onHover?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// 접근성 props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}

// 반응형 props
export interface ResponsiveProps {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
}

// 테마/스타일 props
export interface ThemeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
}

// 데이터 테이블 컬럼 타입
export interface DataTableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

// 데이터 테이블 props
export interface DataTableProps<T> extends BaseComponentProps, StateProps, PaginationProps {
  data: T[];
  columns: DataTableColumn<T>[];
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  onRowClick?: (item: T, index: number) => void;
}

// 카드 컴포넌트 props
export interface CardProps extends BaseComponentProps, ThemeProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  onCardClick?: () => void;
}