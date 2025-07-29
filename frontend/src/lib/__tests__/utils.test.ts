import {
  cn,
  dateUtils,
  numberUtils,
  stringUtils,
  arrayUtils,
  objectUtils,
  performanceUtils,
  urlUtils,
  storageUtils,
  browserUtils,
} from '../utils';

// Mock for tests
const mockCreateElement = jest.fn(() => ({
  innerHTML: '',
  textContent: 'Mock text content',
  innerText: 'Mock inner text',
  href: '',
  download: '',
  click: jest.fn(),
}));

const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

// Mock DOM methods
(global as any).document = {
  ...global.document,
  createElement: mockCreateElement,
  body: {
    ...global.document.body,
    appendChild: mockAppendChild,
    removeChild: mockRemoveChild,
  },
};

// Mock clipboard
(global as any).navigator = {
  ...global.navigator,
  clipboard: {
    writeText: jest.fn(),
  },
  onLine: true,
};

// Mock window properties
(global as any).window = {
  ...global.window,
  innerWidth: 1024,
  matchMedia: jest.fn(() => ({ matches: false })),
};

// Mock URL methods  
(global as any).URL = {
  ...global.URL,
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn(),
};

describe('cn', () => {
  it('should combine class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'active', false && 'inactive');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('inactive');
  });
});

describe('dateUtils', () => {
  describe('formatRelativeTime', () => {
    it('should return "방금 전" for times less than 1 hour ago', () => {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      expect(dateUtils.formatRelativeTime(thirtyMinutesAgo)).toBe('방금 전');
    });

    it('should return hours for times less than 24 hours ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(dateUtils.formatRelativeTime(twoHoursAgo)).toBe('2시간 전');
    });

    it('should return days for times less than 7 days ago', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(dateUtils.formatRelativeTime(threeDaysAgo)).toBe('3일 전');
    });

    it('should return localized date for times older than 7 days', () => {
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
      const result = dateUtils.formatRelativeTime(tenDaysAgo);
      expect(result).toMatch(/\d{4}\. \d{1,2}\. \d{1,2}\./);
    });
  });

  describe('formatDate', () => {
    it('should format date in Korean locale', () => {
      const date = new Date('2023-01-15T10:30:00');
      const result = dateUtils.formatDate(date);
      expect(result).toContain('2023');
    });

    it('should use custom options', () => {
      const date = new Date('2023-01-15T10:30:00');
      const result = dateUtils.formatDate(date, { year: 'numeric', month: 'long' });
      expect(typeof result).toBe('string');
      expect(result).toContain('2023');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time in Korean locale', () => {
      const date = new Date('2023-01-15T10:30:00');
      const result = dateUtils.formatDateTime(date);
      expect(result).toContain('2023');
      expect(typeof result).toBe('string');
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(dateUtils.isToday(today)).toBe(true);
    });

    it('should return false for yesterday\'s date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateUtils.isToday(yesterday)).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('should return true for dates in current week', () => {
      const today = new Date();
      expect(dateUtils.isThisWeek(today)).toBe(true);
    });
  });
});

describe('numberUtils', () => {
  describe('formatCount', () => {
    it('should format numbers under 1000 as-is', () => {
      expect(numberUtils.formatCount(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
      expect(numberUtils.formatCount(1500)).toBe('1.5K');
    });

    it('should format millions with M suffix', () => {
      expect(numberUtils.formatCount(2500000)).toBe('2.5M');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default KRW', () => {
      const result = numberUtils.formatCurrency(10000);
      expect(result).toContain('10,000');
      expect(result).toContain('₩');
    });

    it('should format currency with specified currency', () => {
      const result = numberUtils.formatCurrency(1000, 'USD');
      expect(result).toContain('1,000');
      expect(result).toContain('$');
    });

    it('should handle zero amount', () => {
      const result = numberUtils.formatCurrency(0);
      expect(result).toContain('0');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with default decimals', () => {
      expect(numberUtils.formatPercent(12.345)).toBe('12.35%');
    });

    it('should format percentage with custom decimals', () => {
      expect(numberUtils.formatPercent(12.345, 1)).toBe('12.3%');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(numberUtils.formatFileSize(0)).toBe('0 B');
      expect(numberUtils.formatFileSize(1024)).toBe('1.00 KB');
      expect(numberUtils.formatFileSize(1024 * 1024)).toBe('1.00 MB');
    });
  });
});

describe('stringUtils', () => {
  describe('truncate', () => {
    it('should truncate long strings', () => {
      const longString = 'This is a very long string';
      expect(stringUtils.truncate(longString, 10)).toBe('This is a ...');
    });

    it('should return original string if shorter than limit', () => {
      const shortString = 'Short';
      expect(stringUtils.truncate(shortString, 10)).toBe('Short');
    });

    it('should use custom suffix', () => {
      const longString = 'This is a very long string';
      expect(stringUtils.truncate(longString, 10, '---')).toBe('This is a ---');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(stringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(stringUtils.capitalize('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert string to slug', () => {
      expect(stringUtils.slugify('Hello World!')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(stringUtils.slugify('Test@#$%^&*()String')).toBe('teststring');
    });
  });

  describe('removeHtml', () => {
    it('should remove HTML tags and return text content', () => {
      const result = stringUtils.removeHtml('<p>Hello <strong>World</strong>!</p>');
      expect(result).toBe('Mock text content');
    });

    it('should handle empty HTML', () => {
      const result = stringUtils.removeHtml('');
      expect(result).toBe('Mock text content');
    });

    it('should handle plain text', () => {
      const result = stringUtils.removeHtml('Plain text');
      expect(result).toBe('Mock text content');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(stringUtils.isValidEmail('test@example.com')).toBe(true);
      expect(stringUtils.isValidEmail('user.name@domain.co.kr')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(stringUtils.isValidEmail('invalid-email')).toBe(false);
      expect(stringUtils.isValidEmail('test@')).toBe(false);
      expect(stringUtils.isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(stringUtils.isValidUrl('https://example.com')).toBe(true);
      expect(stringUtils.isValidUrl('http://test.co.kr')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(stringUtils.isValidUrl('not-a-url')).toBe(false);
      expect(stringUtils.isValidUrl('invalid-protocol://test')).toBe(false);
    });
  });
});

describe('arrayUtils', () => {
  describe('unique', () => {
    it('should remove duplicate values', () => {
      expect(arrayUtils.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      expect(arrayUtils.unique([])).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(arrayUtils.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty array', () => {
      expect(arrayUtils.chunk([], 2)).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('should return array with same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = arrayUtils.shuffle(original);
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled).toEqual(expect.arrayContaining(original));
    });
  });

  describe('groupBy', () => {
    it('should group items by key function', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' }
      ];
      
      const grouped = arrayUtils.groupBy(items, item => item.type);
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });
  });

  describe('sortBy', () => {
    it('should sort items by key function ascending', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = arrayUtils.sortBy(items, item => item.age);
      expect(sorted.map(item => item.age)).toEqual([20, 25, 30]);
    });

    it('should sort items by key function descending', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = arrayUtils.sortBy(items, item => item.age, 'desc');
      expect(sorted.map(item => item.age)).toEqual([30, 25, 20]);
    });
  });
});

describe('objectUtils', () => {
  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      expect(objectUtils.pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      expect(objectUtils.omit(obj, ['b', 'd'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(objectUtils.isEmpty(null)).toBe(true);
      expect(objectUtils.isEmpty(undefined)).toBe(true);
      expect(objectUtils.isEmpty([])).toBe(true);
      expect(objectUtils.isEmpty({})).toBe(true);
      expect(objectUtils.isEmpty('')).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(objectUtils.isEmpty([1])).toBe(false);
      expect(objectUtils.isEmpty({ a: 1 })).toBe(false);
      expect(objectUtils.isEmpty('hello')).toBe(false);
    });

    it('should handle Map objects', () => {
      expect(objectUtils.isEmpty(new Map())).toBe(true);
      expect(objectUtils.isEmpty(new Map([['key', 'value']]))).toBe(false);
    });

    it('should handle Set objects', () => {
      expect(objectUtils.isEmpty(new Set())).toBe(true);
      expect(objectUtils.isEmpty(new Set([1, 2, 3]))).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should create deep copy of object', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = objectUtils.deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should handle arrays', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = objectUtils.deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
    });

    it('should handle primitive values', () => {
      expect(objectUtils.deepClone('string')).toBe('string');
      expect(objectUtils.deepClone(42)).toBe(42);
      expect(objectUtils.deepClone(true)).toBe(true);
      expect(objectUtils.deepClone(null)).toBe(null);
    });
  });

  describe('isEqual', () => {
    it('should compare objects deeply', () => {
      expect(objectUtils.isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(objectUtils.isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });
  });
});

describe('performanceUtils', () => {
  describe('debounce', () => {
    jest.useFakeTimers();

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = performanceUtils.debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = performanceUtils.debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should limit function execution frequency', () => {
      const mockFn = jest.fn();
      const throttledFn = performanceUtils.throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('sleep', () => {
    jest.useFakeTimers();

    it('should return a promise that resolves after specified time', async () => {
      const promise = performanceUtils.sleep(1000);
      jest.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle zero delay', async () => {
      const promise = performanceUtils.sleep(0);
      jest.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});

describe('browserUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should copy text successfully', async () => {
      const writeTextMock = (global as any).navigator.clipboard.writeText as jest.Mock;
      writeTextMock.mockResolvedValue(undefined);
      
      const result = await browserUtils.copyToClipboard('test text');
      
      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('test text');
    });

    it('should handle clipboard failure', async () => {
      const writeTextMock = (global as any).navigator.clipboard.writeText as jest.Mock;
      writeTextMock.mockRejectedValue(new Error('Failed'));
      
      const result = await browserUtils.copyToClipboard('test text');
      
      expect(result).toBe(false);
    });
  });

  describe('downloadFile', () => {
    it('should create download link and trigger download', () => {
      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const mockAnchor = {
        innerHTML: '',
        textContent: '',
        innerText: '',
        href: '',
        download: '',
        click: jest.fn(),
      };
      
      mockCreateElement.mockReturnValue(mockAnchor);
      
      browserUtils.downloadFile(mockBlob, 'test.txt');
      
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.href).toBe('blob:mock-url');
      expect(mockAnchor.download).toBe('test.txt');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalledWith(mockAnchor);
      expect(mockRemoveChild).toHaveBeenCalledWith(mockAnchor);
      expect((global as any).URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('getDeviceType', () => {
    it('should return mobile for width < 768', () => {
      (global.window as any).innerWidth = 500;
      expect(browserUtils.getDeviceType()).toBe('mobile');
    });

    it('should return tablet for width < 1024', () => {
      (global.window as any).innerWidth = 800;
      expect(browserUtils.getDeviceType()).toBe('tablet');
    });

    it('should return desktop for width >= 1024', () => {
      (global.window as any).innerWidth = 1200;
      expect(browserUtils.getDeviceType()).toBe('desktop');
    });
  });

  describe('isOnline', () => {
    it('should return navigator.onLine value', () => {
      (global.navigator as any).onLine = true;
      expect(browserUtils.isOnline()).toBe(true);

      (global.navigator as any).onLine = false;
      expect(browserUtils.isOnline()).toBe(false);
    });
  });

  describe('getPreferredColorScheme', () => {
    it('should return dark for dark color scheme', () => {
      const matchMediaMock = (global as any).window.matchMedia as jest.Mock;
      matchMediaMock.mockReturnValue({ matches: true });
      expect(browserUtils.getPreferredColorScheme()).toBe('dark');
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should return light for light color scheme', () => {
      const matchMediaMock = (global as any).window.matchMedia as jest.Mock;
      matchMediaMock.mockReturnValue({ matches: false });
      expect(browserUtils.getPreferredColorScheme()).toBe('light');
    });
  });
});

describe('urlUtils', () => {
  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const params = { page: 1, size: 10, search: 'test' };
      const queryString = urlUtils.buildQueryString(params);
      expect(queryString).toBe('page=1&size=10&search=test');
    });

    it('should skip null and undefined values', () => {
      const params = { page: 1, size: null, search: undefined, filter: '' };
      const queryString = urlUtils.buildQueryString(params);
      expect(queryString).toBe('page=1');
    });
  });

  describe('parseQueryString', () => {
    it('should parse query string to object', () => {
      const result = urlUtils.parseQueryString('page=1&size=10&search=test');
      expect(result).toEqual({ page: '1', size: '10', search: 'test' });
    });

    it('should handle empty query string', () => {
      const result = urlUtils.parseQueryString('');
      expect(result).toEqual({});
    });
  });

  describe('buildUrl', () => {
    it('should build URL with path and params', () => {
      const result = urlUtils.buildUrl('https://example.com', '/api/users', { page: 1, limit: 10 });
      expect(result).toContain('https://example.com/api/users');
      expect(result).toContain('page=1');
      expect(result).toContain('limit=10');
    });

    it('should build URL without params', () => {
      const result = urlUtils.buildUrl('https://example.com', '/api/users');
      expect(result).toBe('https://example.com/api/users');
    });

    it('should handle relative paths', () => {
      const result = urlUtils.buildUrl('https://example.com', 'api/users');
      expect(result).toBe('https://example.com/api/users');
    });

    it('should handle empty params object', () => {
      const result = urlUtils.buildUrl('https://example.com', '/api/users', {});
      expect(result).toBe('https://example.com/api/users');
    });
  });
});

// Mock localStorage for storageUtils tests
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('storageUtils', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should retrieve and parse stored value', () => {
      mockLocalStorage.setItem('test', JSON.stringify({ value: 'hello' }));
      const result = storageUtils.get('test');
      expect(result).toEqual({ value: 'hello' });
    });

    it('should return default value if key not found', () => {
      const result = storageUtils.get('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('should return null for invalid JSON', () => {
      mockLocalStorage.setItem('invalid', 'invalid json');
      const result = storageUtils.get('invalid');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store value as JSON', () => {
      const success = storageUtils.set('test', { value: 'hello' });
      expect(success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test', '{"value":"hello"}');
    });

    it('should handle storage errors', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const success = storageUtils.set('test', 'value');
      expect(success).toBe(false);
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'test' };
      obj.self = obj; // Create circular reference
      
      const success = storageUtils.set('circular', obj);
      expect(success).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove stored value', () => {
      const success = storageUtils.remove('test');
      expect(success).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test');
    });

    it('should handle removal errors', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove failed');
      });
      
      const success = storageUtils.remove('test');
      expect(success).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all storage', () => {
      const success = storageUtils.clear();
      expect(success).toBe(true);
      expect(mockLocalStorage.clear).toHaveBeenCalled();
    });

    it('should handle clear errors', () => {
      mockLocalStorage.clear.mockImplementation(() => {
        throw new Error('Clear failed');
      });
      
      const success = storageUtils.clear();
      expect(success).toBe(false);
    });
  });
});