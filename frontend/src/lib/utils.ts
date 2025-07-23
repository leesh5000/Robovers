// 유틸리티 함수들

import { clsx, type ClassValue } from 'clsx';

// 클래스 네임 유틸리티
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 날짜 포맷팅 유틸리티
export const dateUtils = {
  formatRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  },

  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return date.toLocaleDateString('ko-KR', options);
  },

  formatDateTime: (date: Date): string => {
    return date.toLocaleString('ko-KR');
  },

  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isThisWeek: (date: Date): boolean => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    return date >= weekStart;
  }
};

// 숫자 포맷팅 유틸리티
export const numberUtils = {
  formatCount: (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  },

  formatCurrency: (amount: number, currency: string = 'KRW'): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatPercent: (value: number, decimals: number = 2): string => {
    return `${value.toFixed(decimals)}%`;
  },

  formatFileSize: (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }
};

// 문자열 유틸리티
export const stringUtils = {
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + suffix;
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  },

  removeHtml: (html: string): string => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// 배열 유틸리티
export const arrayUtils = {
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  groupBy: <T, K extends string | number>(
    array: T[],
    keyFn: (item: T) => K
  ): Record<K, T[]> => {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },

  sortBy: <T>(array: T[], keyFn: (item: T) => any, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = keyFn(a);
      const bVal = keyFn(b);
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
};

// 객체 유틸리티
export const objectUtils = {
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  isEmpty: (obj: any): boolean => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
    return Object.keys(obj).length === 0;
  },

  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  isEqual: (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  }
};

// 디바운스 및 스로틀 유틸리티
export const performanceUtils = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let lastTime = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        func(...args);
      }
    };
  },

  sleep: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// 브라우저 유틸리티
export const browserUtils = {
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  downloadFile: (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  isOnline: (): boolean => {
    return navigator.onLine;
  },

  getPreferredColorScheme: (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
};

// URL 유틸리티
export const urlUtils = {
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },

  parseQueryString: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  buildUrl: (baseUrl: string, path: string, params?: Record<string, any>): string => {
    const url = new URL(path, baseUrl);
    if (params) {
      const queryString = urlUtils.buildQueryString(params);
      if (queryString) {
        url.search = queryString;
      }
    }
    return url.toString();
  }
};

// 로컬 스토리지 유틸리티
export const storageUtils = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};