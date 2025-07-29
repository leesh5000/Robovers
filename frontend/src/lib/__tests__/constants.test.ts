import {
  UI_SIZES,
  UI_VARIANTS,
  SORT_DIRECTIONS,
  LOADING_STATES,
  API_ENDPOINTS,
  PAGINATION,
  FORM_VALIDATION,
  FILE_UPLOAD,
  TIME_CONSTANTS,
  STORAGE_KEYS,
  CACHE_KEYS,
  ERROR_MESSAGE_KEYS,
  SUCCESS_MESSAGE_KEYS,
  ROUTES,
  USER_ROLES,
  POST_STATUS,
  COMMENT_STATUS,
  UISize,
  UIVariant,
  SortDirection,
  LoadingState,
  UserRole,
  PostStatus,
  CommentStatus,
} from '../constants';

describe('constants', () => {
  describe('UI_SIZES', () => {
    it('should have correct UI size values', () => {
      expect(UI_SIZES.XS).toBe('xs');
      expect(UI_SIZES.SM).toBe('sm');
      expect(UI_SIZES.MD).toBe('md');
      expect(UI_SIZES.LG).toBe('lg');
      expect(UI_SIZES.XL).toBe('xl');
    });

    it('should have all required UI sizes', () => {
      const expectedSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      const actualSizes = Object.values(UI_SIZES);
      expect(actualSizes).toEqual(expectedSizes);
    });
  });

  describe('UI_VARIANTS', () => {
    it('should have correct UI variant values', () => {
      expect(UI_VARIANTS.PRIMARY).toBe('primary');
      expect(UI_VARIANTS.SECONDARY).toBe('secondary');
      expect(UI_VARIANTS.SUCCESS).toBe('success');
      expect(UI_VARIANTS.WARNING).toBe('warning');
      expect(UI_VARIANTS.ERROR).toBe('error');
      expect(UI_VARIANTS.INFO).toBe('info');
      expect(UI_VARIANTS.GHOST).toBe('ghost');
      expect(UI_VARIANTS.OUTLINE).toBe('outline');
      expect(UI_VARIANTS.DANGER).toBe('danger');
    });
  });

  describe('SORT_DIRECTIONS', () => {
    it('should have correct sort direction values', () => {
      expect(SORT_DIRECTIONS.ASC).toBe('asc');
      expect(SORT_DIRECTIONS.DESC).toBe('desc');
    });
  });

  describe('LOADING_STATES', () => {
    it('should have correct loading state values', () => {
      expect(LOADING_STATES.IDLE).toBe('idle');
      expect(LOADING_STATES.LOADING).toBe('loading');
      expect(LOADING_STATES.SUCCESS).toBe('success');
      expect(LOADING_STATES.ERROR).toBe('error');
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have correct auth endpoints', () => {
      expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/auth/login');
      expect(API_ENDPOINTS.AUTH.LOGOUT).toBe('/auth/logout');
      expect(API_ENDPOINTS.AUTH.REGISTER).toBe('/auth/register');
      expect(API_ENDPOINTS.AUTH.REFRESH).toBe('/auth/refresh');
      expect(API_ENDPOINTS.AUTH.VERIFY_EMAIL).toBe('/auth/verify-email');
    });

    it('should have correct user endpoints', () => {
      expect(API_ENDPOINTS.USERS.BASE).toBe('/users');
      expect(API_ENDPOINTS.USERS.PROFILE).toBe('/users/profile');
      expect(API_ENDPOINTS.USERS.UPDATE_PROFILE).toBe('/users/profile');
    });

    it('should have correct post endpoints', () => {
      expect(API_ENDPOINTS.POSTS.BASE).toBe('/posts');
      expect(API_ENDPOINTS.POSTS.COMMENTS).toBe('/posts/:id/comments');
      expect(API_ENDPOINTS.POSTS.LIKE).toBe('/posts/:id/like');
      expect(API_ENDPOINTS.POSTS.BOOKMARK).toBe('/posts/:id/bookmark');
    });

    it('should have correct company endpoints', () => {
      expect(API_ENDPOINTS.COMPANIES.BASE).toBe('/companies');
      expect(API_ENDPOINTS.COMPANIES.DETAIL).toBe('/companies/:id');
      expect(API_ENDPOINTS.COMPANIES.STOCK_HISTORY).toBe('/companies/:id/stock-history');
    });

    it('should have correct admin endpoints', () => {
      expect(API_ENDPOINTS.ADMIN.USERS).toBe('/admin/users');
      expect(API_ENDPOINTS.ADMIN.POSTS).toBe('/admin/posts');
      expect(API_ENDPOINTS.ADMIN.COMMENTS).toBe('/admin/comments');
      expect(API_ENDPOINTS.ADMIN.REPORTS).toBe('/admin/reports');
    });
  });

  describe('PAGINATION', () => {
    it('should have correct pagination values', () => {
      expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(10);
      expect(PAGINATION.MAX_VISIBLE_PAGES).toBe(5);
    });

    it('should have correct page size options', () => {
      expect(PAGINATION.PAGE_SIZE_OPTIONS).toEqual([10, 20, 50, 100]);
    });
  });

  describe('FORM_VALIDATION', () => {
    it('should have correct password validation values', () => {
      expect(FORM_VALIDATION.MIN_PASSWORD_LENGTH).toBe(8);
      expect(FORM_VALIDATION.MAX_PASSWORD_LENGTH).toBe(100);
    });

    it('should have correct username validation values', () => {
      expect(FORM_VALIDATION.MIN_USERNAME_LENGTH).toBe(3);
      expect(FORM_VALIDATION.MAX_USERNAME_LENGTH).toBe(20);
    });

    it('should have correct name validation values', () => {
      expect(FORM_VALIDATION.MIN_NAME_LENGTH).toBe(2);
      expect(FORM_VALIDATION.MAX_NAME_LENGTH).toBe(50);
    });

    it('should have correct content length limits', () => {
      expect(FORM_VALIDATION.MAX_COMMENT_LENGTH).toBe(500);
      expect(FORM_VALIDATION.MAX_POST_TITLE_LENGTH).toBe(100);
      expect(FORM_VALIDATION.MAX_POST_CONTENT_LENGTH).toBe(5000);
    });
  });

  describe('FILE_UPLOAD', () => {
    it('should have correct file size limit', () => {
      expect(FILE_UPLOAD.MAX_FILE_SIZE).toBe(5 * 1024 * 1024); // 5MB
    });

    it('should have correct allowed image types', () => {
      const expectedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      expect(FILE_UPLOAD.ALLOWED_IMAGE_TYPES).toEqual(expectedImageTypes);
    });

    it('should have correct allowed document types', () => {
      const expectedDocTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      expect(FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES).toEqual(expectedDocTypes);
    });
  });

  describe('TIME_CONSTANTS', () => {
    it('should have correct time values', () => {
      expect(TIME_CONSTANTS.DEBOUNCE_DELAY).toBe(300);
      expect(TIME_CONSTANTS.TOAST_DURATION).toBe(3000);
      expect(TIME_CONSTANTS.ANIMATION_DURATION).toBe(200);
      expect(TIME_CONSTANTS.TIMEOUT_DURATION).toBe(30000);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have correct storage key values', () => {
      expect(STORAGE_KEYS.ACCESS_TOKEN).toBe('accessToken');
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refreshToken');
      expect(STORAGE_KEYS.USER_PREFERENCES).toBe('userPreferences');
      expect(STORAGE_KEYS.THEME).toBe('theme');
      expect(STORAGE_KEYS.LANGUAGE).toBe('language');
    });
  });

  describe('CACHE_KEYS', () => {
    it('should have correct cache key values', () => {
      expect(CACHE_KEYS.USERS).toBe('users');
      expect(CACHE_KEYS.POSTS).toBe('posts');
      expect(CACHE_KEYS.COMPANIES).toBe('companies');
      expect(CACHE_KEYS.COMMENTS).toBe('comments');
    });
  });

  describe('ERROR_MESSAGE_KEYS', () => {
    it('should have correct error message key values', () => {
      expect(ERROR_MESSAGE_KEYS.NETWORK_ERROR).toBe('NETWORK_ERROR');
      expect(ERROR_MESSAGE_KEYS.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ERROR_MESSAGE_KEYS.FORBIDDEN).toBe('FORBIDDEN');
      expect(ERROR_MESSAGE_KEYS.NOT_FOUND).toBe('NOT_FOUND');
      expect(ERROR_MESSAGE_KEYS.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ERROR_MESSAGE_KEYS.SERVER_ERROR).toBe('SERVER_ERROR');
    });
  });

  describe('SUCCESS_MESSAGE_KEYS', () => {
    it('should have correct success message key values', () => {
      expect(SUCCESS_MESSAGE_KEYS.LOGIN_SUCCESS).toBe('LOGIN_SUCCESS');
      expect(SUCCESS_MESSAGE_KEYS.LOGOUT_SUCCESS).toBe('LOGOUT_SUCCESS');
      expect(SUCCESS_MESSAGE_KEYS.REGISTRATION_SUCCESS).toBe('REGISTRATION_SUCCESS');
      expect(SUCCESS_MESSAGE_KEYS.UPDATE_SUCCESS).toBe('UPDATE_SUCCESS');
      expect(SUCCESS_MESSAGE_KEYS.DELETE_SUCCESS).toBe('DELETE_SUCCESS');
      expect(SUCCESS_MESSAGE_KEYS.SAVE_SUCCESS).toBe('SAVE_SUCCESS');
    });
  });

  describe('ROUTES', () => {
    it('should have correct route values', () => {
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.REGISTER).toBe('/signup');
      expect(ROUTES.PROFILE).toBe('/profile');
      expect(ROUTES.COMPANIES).toBe('/companies');
      expect(ROUTES.COMPANY_DETAIL).toBe('/companies/:id');
      expect(ROUTES.COMMUNITY).toBe('/community');
      expect(ROUTES.POST_DETAIL).toBe('/community/:id');
      expect(ROUTES.ADMIN).toBe('/admin');
      expect(ROUTES.ADMIN_USERS).toBe('/admin/users');
      expect(ROUTES.ADMIN_POSTS).toBe('/admin/posts');
      expect(ROUTES.ADMIN_COMMENTS).toBe('/admin/comments');
    });
  });

  describe('USER_ROLES', () => {
    it('should have correct user role values', () => {
      expect(USER_ROLES.ADMIN).toBe('admin');
      expect(USER_ROLES.USER).toBe('user');
      expect(USER_ROLES.MODERATOR).toBe('moderator');
    });
  });

  describe('POST_STATUS', () => {
    it('should have correct post status values', () => {
      expect(POST_STATUS.DRAFT).toBe('draft');
      expect(POST_STATUS.PUBLISHED).toBe('published');
      expect(POST_STATUS.ARCHIVED).toBe('archived');
      expect(POST_STATUS.DELETED).toBe('deleted');
    });
  });

  describe('COMMENT_STATUS', () => {
    it('should have correct comment status values', () => {
      expect(COMMENT_STATUS.VISIBLE).toBe('visible');
      expect(COMMENT_STATUS.HIDDEN).toBe('hidden');
      expect(COMMENT_STATUS.REPORTED).toBe('reported');
      expect(COMMENT_STATUS.DELETED).toBe('deleted');
    });
  });

  describe('Type exports', () => {
    it('should export correct types', () => {
      // 이 테스트들은 TypeScript 컴파일 시점에 타입 체크됨
      const uiSize: UISize = 'md';
      const uiVariant: UIVariant = 'primary';
      const sortDirection: SortDirection = 'asc';
      const loadingState: LoadingState = 'loading';
      const userRole: UserRole = 'user';
      const postStatus: PostStatus = 'published';
      const commentStatus: CommentStatus = 'visible';

      expect(uiSize).toBe('md');
      expect(uiVariant).toBe('primary');
      expect(sortDirection).toBe('asc');
      expect(loadingState).toBe('loading');
      expect(userRole).toBe('user');
      expect(postStatus).toBe('published');
      expect(commentStatus).toBe('visible');
    });
  });
});