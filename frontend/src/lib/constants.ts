// 애플리케이션 상수 정의

// UI 크기 관련 상수
export const UI_SIZES = {
  XS: 'xs',
  SM: 'sm', 
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
} as const;

export type UISize = typeof UI_SIZES[keyof typeof UI_SIZES];

// UI 변형 관련 상수
export const UI_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  GHOST: 'ghost',
  OUTLINE: 'outline',
  DANGER: 'danger'
} as const;

export type UIVariant = typeof UI_VARIANTS[keyof typeof UI_VARIANTS];

// 정렬 방향 상수
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export type SortDirection = typeof SORT_DIRECTIONS[keyof typeof SORT_DIRECTIONS];

// 로딩 상태 상수
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];

// API 관련 상수
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile'
  },
  POSTS: {
    BASE: '/posts',
    COMMENTS: '/posts/:id/comments',
    LIKE: '/posts/:id/like',
    BOOKMARK: '/posts/:id/bookmark'
  },
  COMPANIES: {
    BASE: '/companies',
    DETAIL: '/companies/:id',
    STOCK_HISTORY: '/companies/:id/stock-history'
  },
  ADMIN: {
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    COMMENTS: '/admin/comments',
    REPORTS: '/admin/reports'
  }
} as const;

// 페이지네이션 상수
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5
} as const;

// 폼 관련 상수
export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_COMMENT_LENGTH: 500,
  MAX_POST_TITLE_LENGTH: 100,
  MAX_POST_CONTENT_LENGTH: 5000
} as const;

// 파일 업로드 상수
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const;

// 시간 관련 상수
export const TIME_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 200,
  TIMEOUT_DURATION: 30000
} as const;

// 로컬 스토리지 키 상수
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;

// 캐시 관련 상수
export const CACHE_KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMPANIES: 'companies',
  COMMENTS: 'comments'
} as const;

// 에러 메시지 키 상수
export const ERROR_MESSAGE_KEYS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
} as const;

// 성공 메시지 키 상수
export const SUCCESS_MESSAGE_KEYS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  SAVE_SUCCESS: 'SAVE_SUCCESS'
} as const;

// 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/signup',
  PROFILE: '/profile',
  COMPANIES: '/companies',
  COMPANY_DETAIL: '/companies/:id',
  COMMUNITY: '/community',
  POST_DETAIL: '/community/:id',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_COMMENTS: '/admin/comments'
} as const;

// 권한 관련 상수
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// 게시물 상태 상수
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
} as const;

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

// 댓글 상태 상수
export const COMMENT_STATUS = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  REPORTED: 'reported',
  DELETED: 'deleted'
} as const;

export type CommentStatus = typeof COMMENT_STATUS[keyof typeof COMMENT_STATUS];